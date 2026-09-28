require('dotenv').config();

async function run() {
  const caApiUrl = process.env.CA_DETAILS_API || process.env.CA_DETAILS_API_URL;
  if (!caApiUrl) {
    console.log("No CA_DETAILS_API");
    return;
  }
  
  const headers = { Accept: 'application/json' };
  const response = await fetch(caApiUrl, { headers });
  const payload = await response.json();
  
  const rawList = Array.isArray(payload)
    ? payload
    : Array.isArray(payload.users)
      ? payload.users
      : Array.isArray(payload.data)
        ? payload.data
        : Array.isArray(payload.records)
          ? payload.records
          : Array.isArray(payload.cas)
            ? payload.cas
            : Array.isArray(payload.career_associates)
              ? payload.career_associates
              : [];

  const found = rawList.find(x => x.id === 'e33284fc-6ef3-47fb-9047-80cfddd2ff75' || x.ca_id === 'e33284fc-6ef3-47fb-9047-80cfddd2ff75');
  console.log("Found in external API:", found);

  const found2 = rawList.find(x => x.id === 'b91c88d5-e0c5-4f8c-a4a1-0c1057a1f1e0' || x.ca_id === 'b91c88d5-e0c5-4f8c-a4a1-0c1057a1f1e0');
  console.log("Found 2:", found2);
}

run().catch(console.error);
