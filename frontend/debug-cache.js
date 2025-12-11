const { fetchAllCandidates } = require('./src/lib/api-service.js');

// Mock dependencies since we are running in node
global.fetch = require('node-fetch'); // Not used by axios, but good practice
process.env.FEC_API_KEY = 'v76rEY34ojvfOUtJsXT4ZFQtAgzBfwHSweNnWPOt';

console.log("Starting Cache Test...");

async function run() {
    try {
        const start1 = Date.now();
        console.log("Fetch 1 (Fresh)...");
        const res1 = await fetchAllCandidates(2026);
        const time1 = (Date.now() - start1) / 1000;
        console.log(`Fetch 1 complete: ${res1.length} records in ${time1}s`);

        const start2 = Date.now();
        console.log("Fetch 2 (Cached)...");
        const res2 = await fetchAllCandidates(2026);
        const time2 = (Date.now() - start2) / 1000;
        console.log(`Fetch 2 complete: ${res2.length} records in ${time2}s`);

        if (time2 < 1.0) {
            console.log("PASS: Cache is working (sub-second response).");
        } else {
            console.log("FAIL: Cache did not speed up response.");
        }

    } catch (err) {
        console.error("Error:", err);
    }
}
// We can't easily import the ESM module in this CJS context without package.json changes or babel.
// Instead, I will rely on the app verification or make a simplified test that mimics the logic if import fails.
// Actually, `api-service.js` uses `export async function`. In Node CJS, that needs `import()`.
// Let's rewrite this script as an ESM mjs file.
