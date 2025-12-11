const axios = require('axios');
const API_KEY = 'v76rEY34ojvfOUtJsXT4ZFQtAgzBfwHSweNnWPOt';
const BASE_URL = 'https://api.open.fec.gov/v1';

async function testApi() {
    console.log("Testing FEC API with key ending in ...POt");
    try {
        let total = 0;
        const START_TIME = Date.now();

        // Loop to simulate heavy load
        for (let p = 1; p <= 20; p++) {
            console.log(`Fetching page ${p}...`);
            const url = `${BASE_URL}/candidates/totals/`;
            const res = await axios.get(url, {
                params: {
                    api_key: API_KEY,
                    cycle: 2026,
                    page: p,
                    per_page: 100,
                    sort: '-receipts',
                    election_full: false
                }
            });
            total += res.data.results.length;
        }

        const duration = (Date.now() - START_TIME) / 1000;
        console.log(`Fetched ${total} records in ${duration}s`);

    } catch (err) {
        console.error("API Failed!");
        if (err.response) {
            console.error("Status:", err.response.status);
            console.error("Error Data:", JSON.stringify(err.response.data, null, 2));
        } else {
            console.error("Error:", err.message);
        }
    }
}

testApi();
