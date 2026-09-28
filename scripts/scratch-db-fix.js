require('dotenv').config();
const { createPool } = require('../lib/azure.js');

async function fixMissingCAs() {
  const pool = createPool();
  try {
    const res = await pool.query(`
      SELECT DISTINCT c.career_associate_id::text as missing_id, c.career_associate_manager_id::text as manager_id
      FROM clients_additional_info c
      LEFT JOIN dice_ca_accounts ca 
        ON (ca.id::text = c.career_associate_id::text OR lower(ca.email) = lower(c.career_associate_id::text))
      WHERE ca.id IS NULL AND c.career_associate_id IS NOT NULL
    `);

    const missingCAs = res.rows;
    console.log("Found missing CAs:", missingCAs);

    for (const ca of missingCAs) {
      const shortId = ca.missing_id.substring(0, 8);
      const fakeEmail = "unmapped_" + shortId + "@applywizz.com";
      const fakeName = "Unmapped CA (" + shortId + ")";

      console.log("Inserting missing CA: " + fakeName);
      await pool.query(`
        INSERT INTO dice_ca_accounts (id, email, name, role, manager_id, disabled)
        VALUES ($1, $2, $3, 'CA', $4, false)
        ON CONFLICT (id) DO NOTHING
      `, [ca.missing_id, fakeEmail, fakeName, ca.manager_id]);
    }

    console.log("Missing CAs inserted.");
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

fixMissingCAs();
