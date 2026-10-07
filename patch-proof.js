const fs = require('fs');
let content = fs.readFileSync('start-worker.js', 'utf8');

const targetStr = `
    const buffer = await applicationPage.screenshot({ type: 'png' });
    let screenshotUrl = null;

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

    // Save as completed FIRST so we don't lose the successful submission status
    await saveAppliedJob(chatId, url, jobName, 'completed');
    await sendMessage(chatId, \`✅ Application submitted successfully for:\\n\${jobName}\`);

    // Application Proof System: 2. Zoho Mail Verification
    let emailJson = { status: "not connected" };
    
    // Check if user is connected
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

        // Note: verifyJobApplicationEmail handles its own abortSignal checks internally 
        // to not block if the worker timeout hits.
        const mailResult = await verifyJobApplicationEmail(companyEmail, company, title, null /* no strict signal yet */);
        emailJson = mailResult;
      }
    } else {
      console.log(\`\${await getClientPrefix(chatId)} Skipping Zoho verification (not connected).\`);
    }

    // Patch the proof fields
    await patchJobProof(chatId, url, screenshotUrl, emailJson);

    return true;
`;

const replacementStr = `
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
    await sendMessage(chatId, \`✅ Application submitted successfully for:\\n\${jobName}\`);

    // Patch the proof fields
    await patchJobProof(chatId, url, screenshotUrl, emailJson);

    return true;
`;

if (content.includes(targetStr.trim())) {
  content = content.replace(targetStr.trim(), replacementStr.trim());
  fs.writeFileSync('start-worker.js', content);
  console.log("Patched successfully");
} else {
  console.log("Could not find target string");
}
