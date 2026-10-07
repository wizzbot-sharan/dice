const fs = require('fs');
let content = fs.readFileSync('start-worker.js', 'utf8');

const targetStr = `
    let screenshotUrl = null;
    let emailJson = { status: "not connected" };
    let proofErrorMsg = null;

    try {
      const buffer = await applicationPage.screenshot({ type: 'png' });
      if (hasAwsS3Config()) {
        const companyMatch = jobName.split(' - ');
        const company = companyMatch[0] || 'UnknownCompany';
        const title = companyMatch[1] || 'UnknownTitle';
        const applyProfileDetails = await pool.query('SELECT applywizz_id FROM clients_additional_info WHERE id = $1', [clientId]);
        const awlId = applyProfileDetails.rows[0]?.applywizz_id || 'UNKNOWN';

        screenshotUrl = await uploadScreenshot(buffer, awlId, company, title);
      } else {
        console.log(\`\${await getClientPrefix(chatId)} AWS S3 config missing. Skipping screenshot upload.\`);
      }

      // Application Proof System: 2. Zoho Mail Verification
      const connectionRes = await pool.query('SELECT zoho_connection, company_email FROM clients_additional_info WHERE id = $1', [clientId]);
      const isConnected = connectionRes.rows[0]?.zoho_connection === true;
      const companyEmail = connectionRes.rows[0]?.company_email;

      if (isConnected && companyEmail) {
        if (!process.env.ZOHO_MAIL_READER_URL || !process.env.ZOHO_ADMIN_USERNAME) {
          emailJson = { status: "reader not configured" };
        } else {
          console.log(\`\${await getClientPrefix(chatId)} Starting Zoho Mail verification for \${companyEmail}...\`);
          const companyMatch = jobName.split(' - ');
          const company = companyMatch[0] || '';
          const title = companyMatch[1] || jobName;

          const mailResult = await verifyJobApplicationEmail(companyEmail, company, title, null);
          emailJson = mailResult;
        }
      } else {
        console.log(\`\${await getClientPrefix(chatId)} Skipping Zoho verification (not connected).\`);
      }
    } catch (proofError) {
      console.warn(\`\${await getClientPrefix(chatId)} Proof generation failed: \${proofError.message}\`);
      proofErrorMsg = 'submitted but email proof or screenshot failed';
      emailJson = { status: "proof_failed", error: proofError.message };
    }

    // Save as completed. If proof failed, store the warning in the reason column!
    await saveAppliedJob(chatId, url, jobName, 'completed', proofErrorMsg);
`;

const replacementStr = `
    let screenshotUrl = null;
    let emailJson = { status: "not connected" };
    let proofErrors = [];

    // 1. Screenshot Proof
    try {
      const buffer = await applicationPage.screenshot({ type: 'png' });
      if (hasAwsS3Config()) {
        const companyMatch = jobName.split(' - ');
        const company = companyMatch[0] || 'UnknownCompany';
        const title = companyMatch[1] || 'UnknownTitle';
        const applyProfileDetails = await pool.query('SELECT applywizz_id FROM clients_additional_info WHERE id = $1', [clientId]);
        const awlId = applyProfileDetails.rows[0]?.applywizz_id || 'UNKNOWN';

        screenshotUrl = await uploadScreenshot(buffer, awlId, company, title);
      } else {
        console.log(\`\${await getClientPrefix(chatId)} AWS S3 config missing. Skipping screenshot upload.\`);
      }
    } catch (screenshotError) {
      console.warn(\`\${await getClientPrefix(chatId)} Screenshot failed: \${screenshotError.message}\`);
      proofErrors.push('screenshot failed');
    }

    // 2. Email Proof
    try {
      const connectionRes = await pool.query('SELECT zoho_connection, company_email FROM clients_additional_info WHERE id = $1', [clientId]);
      const isConnected = connectionRes.rows[0]?.zoho_connection === true;
      const companyEmail = connectionRes.rows[0]?.company_email;

      if (isConnected && companyEmail) {
        if (!process.env.ZOHO_MAIL_READER_URL || !process.env.ZOHO_ADMIN_USERNAME) {
          emailJson = { status: "reader not configured" };
        } else {
          console.log(\`\${await getClientPrefix(chatId)} Starting Zoho Mail verification for \${companyEmail}...\`);
          const companyMatch = jobName.split(' - ');
          const company = companyMatch[0] || '';
          const title = companyMatch[1] || jobName;

          const mailResult = await verifyJobApplicationEmail(companyEmail, company, title, null);
          emailJson = mailResult;
        }
      } else {
        console.log(\`\${await getClientPrefix(chatId)} Skipping Zoho verification (not connected).\`);
      }
    } catch (emailError) {
      console.warn(\`\${await getClientPrefix(chatId)} Email verification failed: \${emailError.message}\`);
      proofErrors.push('email proof failed');
      emailJson = { status: "proof_failed", error: emailError.message };
    }

    // Save as completed. If ANY proof failed, log it in the reason column
    const finalReason = proofErrors.length > 0 ? \`submitted but \${proofErrors.join(' and ')}\` : null;
    await saveAppliedJob(chatId, url, jobName, 'completed', finalReason);
`;

if (content.includes(targetStr.trim())) {
  content = content.replace(targetStr.trim(), replacementStr.trim());
  fs.writeFileSync('start-worker.js', content);
  console.log("Patched successfully");
} else {
  console.log("Could not find target string");
}
