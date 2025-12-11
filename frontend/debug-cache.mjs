import { fetchAllCandidates } from './src/lib/api-service.js';

// Mock env
process.env.FEC_API_KEY = 'v76rEY34ojvfOUtJsXT4ZFQtAgzBfwHSweNnWPOt';

console.log("Starting Cache Test...");

async function run() {
    try {
        const start1 = Date.now();
        console.log("Fetch 1 (Fresh)...");
        // Note: In Node environment, axios might need specific config or the file might rely on browser globals if not careful.
        // But api-service imports 'axios' which works in Node.
        const res1 = await fetchAllCandidates(2026);
        const time1 = (Date.now() - start1) / 1000;
        console.log(`Fetch 1 complete: ${res1.length} records in ${time1}s`);

        const start2 = Date.now();
        console.log("Fetch 2 (Should be Cached)...");
        const res2 = await fetchAllCandidates(2026);
        const time2 = (Date.now() - start2) / 1000;
        console.log(`Fetch 2 complete: ${res2.length} records in ${time2}s`);

        if (time2 < 0.1) {
            console.log("PASS: Cache is working (instant response).");
        } else {
            console.log("FAIL: Cache not effective (took > 100ms).");
        }

    } catch (err) {
        console.error("Error:", err);
    }
}

run();
