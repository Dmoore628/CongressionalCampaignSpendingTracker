const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config({ path: '.env' });

const API_KEY = process.env.FEC_API_KEY;
console.log("API KEY (Last 4):", API_KEY ? API_KEY.slice(-4) : "NONE");

async function testFetch() {
    try {
        const res = await axios.get('https://api.open.fec.gov/v1/candidates/totals/', {
            params: {
                api_key: API_KEY,
                cycle: 2026,
                page: 1,
                per_page: 5,
                sort: '-receipts',
                election_full: false
            }
        });
        console.log("Fetch Success:", res.status);
        console.log("First Result:", res.data.results[0].name);

        // Test FS
        const testPath = path.join(process.cwd(), 'src', 'data', 'test_write.txt');
        fs.writeFileSync(testPath, 'test');
        console.log("FS Write Success to:", testPath);
        fs.unlinkSync(testPath);

    } catch (e) {
        console.error("Test Failed:", e.message);
        if (e.response) console.error("API Response:", e.response.data);
    }
}

testFetch();
