import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.FEC_API_KEY;
const BASE_URL = 'https://api.open.fec.gov/v1';

async function fetchOnePage() {
    console.log("Fetching one page from FEC API...");
    try {
        const response = await axios.get(`${BASE_URL}/candidates/totals/`, {
            params: {
                api_key: API_KEY,
                cycle: 2026,
                page: 1,
                per_page: 1, // Just one record
                sort: '-receipts',
                election_full: false
            }
        });

        console.log("Raw Candidate Data:");
        console.log(JSON.stringify(response.data.results[0], null, 2));

    } catch (err) {
        console.error("Error fetching data:", err.message);
        if (err.response) {
            console.error("Response data:", err.response.data);
        }
    }
}

fetchOnePage();
