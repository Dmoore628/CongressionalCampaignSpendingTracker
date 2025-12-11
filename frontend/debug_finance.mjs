
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const envPath = path.join(process.cwd(), '../.env');
let API_KEY = process.env.FEC_API_KEY;

if (!API_KEY && fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/FEC_API_KEY=(.*)/);
    if (match) API_KEY = match[1].trim();
}

console.log("API Key loaded:", !!API_KEY);

const candidateId = 'S8GA00180'; // Ossoff

async function fetchWithFull(isFull) {
    const url = `https://api.open.fec.gov/v1/candidates/totals/?api_key=${API_KEY}&cycle=2026&candidate_id=${candidateId}&election_full=${isFull}`;
    try {
        const res = await axios.get(url);
        if (res.data.results.length > 0) {
            console.log(`election_full=${isFull}: Receipts=$${res.data.results[0].receipts}, Cash=$${res.data.results[0].cash_on_hand_end_period}`);
        } else {
            console.log(`election_full=${isFull}: No results`);
        }
    } catch (err) {
        console.error("Error:", err.message);
    }
}

// Compare
console.log(`Checking data for Ossoff (${candidateId})...`);
await fetchWithFull(false);
await fetchWithFull(true);
