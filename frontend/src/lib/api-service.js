import axios from 'axios';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Use the env var from NEXT_PUBLIC or server-side keys
let API_KEY = process.env.FEC_API_KEY;
const BASE_URL = 'https://api.open.fec.gov/v1';

const CACHE_FILE_PATH = path.join(os.tmpdir(), 'candidates_cache.json');
// Cache duration: 24 hours
const CACHE_DURATION = 1000 * 60 * 60 * 24;

export async function fetchAllCandidates(cycle = 2026) {
    // FALLBACK: Read from parent .env if not found (Local Dev Setup)
    if (!API_KEY) {
        try {
            const envPath = path.join(process.cwd(), '../.env');
            if (fs.existsSync(envPath)) {
                const envContent = fs.readFileSync(envPath, 'utf8');
                const match = envContent.match(/FEC_API_KEY=(.*)/);
                if (match && match[1]) {
                    API_KEY = match[1].trim();
                    console.log("DEBUG: Loaded API_KEY from parent .env file");
                }
            }
        } catch (err) {
            console.warn("DEBUG: Failed to read parent .env:", err.message);
        }
    }

    console.log("DEBUG: API_KEY present?", !!API_KEY);
    if (API_KEY) {
        console.log("DEBUG: Using Key ending in:", API_KEY.slice(-4));
    } else {
        console.error("CRITICAL: FEC_API_KEY is missing!");
    }

    if (!API_KEY) throw new Error("Missing FEC_API_KEY");

    // 1. CHECK FILE CACHE
    try {
        if (fs.existsSync(CACHE_FILE_PATH)) {
            const fileContent = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
            const cache = JSON.parse(fileContent);

            const now = Date.now();
            const age = now - cache.timestamp;

            if (cache.cycle === cycle && age < CACHE_DURATION) {
                console.log(`[CACHE] Serving data from file cache. Age: ${(age / 1000 / 60).toFixed(1)} mins.`);
                return cache.data;
            } else {
                console.log(`[CACHE] Cache expired or cycle mismatch. Age: ${(age / 1000 / 60 / 60).toFixed(1)} hours.`);
            }
        } else {
            console.log("[CACHE] No cache file found.");
        }
    } catch (err) {
        console.warn("[CACHE] Error reading cache file:", err.message);
    }

    // 2. FETCH FROM API
    let allCandidates = [];
    const MAX_PAGES = 100; // Limit to 100 pages (~10k candidates) to avoid Vercel timeouts
    const BATCH_SIZE = 10; // Increase concurrency

    console.log("Starting Live Fetch from FEC API...");
    const timeoutPromise = new Promise(resolve => setTimeout(() => resolve('TIMEOUT'), 8500)); // 8.5s Safety Margin

    try {
        for (let i = 1; i <= MAX_PAGES; i += BATCH_SIZE) {
            const batchStart = Date.now();

            // Check if we are running out of time
            if (Date.now() - batchStart > 8000) break;

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
                            election_full: true
                        },
                        timeout: 5000 // Individual request timeout
                    }).then(res => res.data.results || []).catch(err => {
                        console.error(`Failed page ${pageNum}`, err.message);
                        return [];
                    })
                );
            }

            // Race against global timeout
            const result = await Promise.race([Promise.all(batch), timeoutPromise]);

            if (result === 'TIMEOUT') {
                console.warn("[FETCH] Hit Vercel Execution Timeout limit. Returning partial data.");
                break;
            }

            let batchHasData = false;
            result.forEach(r => {
                if (r.length > 0) batchHasData = true;
                allCandidates = allCandidates.concat(r);
            });

            if (!batchHasData) {
                console.log(`[FETCH] No more data found at batch ending page ${i + BATCH_SIZE - 1}. Stopping.`);
                break;
            }
        }
    } catch (err) {
        console.error("Fetch loop error:", err);
    }

    // 3. PROCESS & DEDUPLICATE
    const seenIds = new Set();
    const processed = [];

    allCandidates.forEach(c => {
        // Dedup Check
        if (seenIds.has(c.candidate_id)) return;
        seenIds.add(c.candidate_id);

        let receipts = parseFloat(c.receipts);
        if (isNaN(receipts) || receipts <= 0) return; // SKIP candidates with no data

        processed.push({
            id: c.candidate_id,
            name: c.name,
            office: c.office, // P, S, H
            state: c.state,
            district: c.district,
            party: c.party,
            total_funding: receipts,
            is_eligible: receipts < 100000,
            last_updated: new Date().toISOString()
        });
    });

    console.log(`[FETCH] Fetched and processed ${processed.length} unique candidates.`);

    // 4. WRITE TO CACHE
    try {
        const cacheData = {
            timestamp: Date.now(),
            cycle,
            data: processed
        };
        // Ensure directory exists
        const dir = path.dirname(CACHE_FILE_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cacheData, null, 2));
        console.log("[CACHE] Updated cache file.");
    } catch (err) {
        console.error("[CACHE] Failed to write cache file:", err.message);
    }

    return processed;
}
