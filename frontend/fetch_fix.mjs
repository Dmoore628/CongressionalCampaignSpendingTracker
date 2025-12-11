
import axios from 'axios';
import fs from 'fs';
import path from 'path';

// MANUAL SETUP for Standalone Run
const envPath = path.join(process.cwd(), '../.env');
let API_KEY = process.env.FEC_API_KEY;

if (!API_KEY && fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/FEC_API_KEY=(.*)/);
    if (match) API_KEY = match[1].trim();
}

if (!API_KEY) {
    console.error("No API Key found");
    process.exit(1);
}

const BASE_URL = 'https://api.open.fec.gov/v1';
const CACHE_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'candidates_cache.json');

async function fetchAll() {
    let allCandidates = [];
    const MAX_PAGES = 200;
    const BATCH_SIZE = 5;
    const cycle = 2026;

    console.log("Starting Manual Verification Fetch...");

    for (let i = 1; i <= MAX_PAGES; i += BATCH_SIZE) {
        const batch = [];
        for (let j = 0; j < BATCH_SIZE; j++) {
            const pageNum = i + j;
            if (pageNum > MAX_PAGES) break;

            batch.push(
                axios.get(`${BASE_URL}/candidates/totals/`, {
                    params: {
                        api_key: API_KEY,
                        cycle,
                        page: pageNum,
                        per_page: 100,
                        sort: '-receipts',
                        election_full: true // THE FIX
                    }
                }).then(res => res.data.results || []).catch(err => {
                    console.error(`Failed page ${pageNum}`, err.message);
                    return [];
                })
            );
        }

        const results = await Promise.all(batch);
        let batchHasData = false;
        results.forEach(r => {
            if (r.length > 0) batchHasData = true;
            allCandidates = allCandidates.concat(r);
        });

        process.stdout.write(`\rFetched ${allCandidates.length} candidates...`);

        if (!batchHasData) {
            console.log(`\nStopping at page ${i + BATCH_SIZE - 1}.`);
            break;
        }
    }

    console.log("\nProcessing...");
    const seenIds = new Set();
    const processed = [];

    allCandidates.forEach(c => {
        if (seenIds.has(c.candidate_id)) return;
        seenIds.add(c.candidate_id);

        let receipts = parseFloat(c.receipts);
        if (isNaN(receipts) || receipts <= 0) return; // SKIP candidates with no data

        processed.push({
            id: c.candidate_id,
            name: c.name,
            office: c.office,
            state: c.state,
            district: c.district,
            party: c.party,
            total_funding: receipts,
            is_eligible: receipts < 100000, // THE FIX: < 100k is Eligible (Grassroots)
            last_updated: new Date().toISOString()
        });
    });

    // Write Cache
    const cacheData = {
        timestamp: Date.now(),
        cycle,
        data: processed
    };

    // Create dir if needed
    const dir = path.dirname(CACHE_FILE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cacheData, null, 2));
    console.log("Cache written to:", CACHE_FILE_PATH);

    // Quick Verification
    const ossoff = processed.find(c => c.id === 'S8GA00180');
    console.log("Ossoff Funding:", ossoff ? ossoff.total_funding : "Not Found");
}

fetchAll();
