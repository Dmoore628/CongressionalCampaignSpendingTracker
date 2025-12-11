import { fetchFecEndpoint } from '../utils/fec-api.js';

/**
 * Fetches candidate financial totals for a specific election cycle.
 * This endpoint (/candidates/totals/) gives us money AND metadata.
 * 
 * @param {number} cycle - The election cycle year (e.g., 2024).
 * @returns {Promise<Array>} - Array of candidate total objects.
 */
export async function fetchAllCandidates(cycle = 2026, apiKey = null) {
    let allCandidates = [];
    let page = 1;
    let hasMorePages = true;

    console.log(`Starting fetch (Totals) for cycle ${cycle}...`);

    const MAX_PAGES = 500; // Covers 50,000 candidates

    while (hasMorePages && page <= MAX_PAGES) {
        if (page % 5 === 0) console.log(`Fetching page ${page}...`);

        // endpoint: /candidates/totals/
        const params = {
            cycle: cycle,
            page: page,
            per_page: 100,
            sort: '-receipts', // Get biggest spenders first
        };
        if (apiKey) params.api_key = apiKey;

        try {
            const data = await fetchFecEndpoint('/candidates/totals/', params);

            if (data.results && data.results.length > 0) {
                allCandidates = allCandidates.concat(data.results);

                const pagination = data.pagination;
                if (pagination && pagination.pages > page) {
                    page++;
                } else {
                    hasMorePages = false;
                }
            } else {
                hasMorePages = false;
            }
        } catch (err) {
            console.warn(`Fetch error on page ${page}:`, err.response?.status || err.message);
            if (err.response?.status === 429) {
                console.warn("Rate limit hit. Stopping fetch and saving partial data.");
            }
            break; // Stop fetching but preserve data
        }

        // Rate limit kindness
        await new Promise(r => setTimeout(r, 500));
    }

    console.log(`Fetched ${allCandidates.length} total records.`);
    return allCandidates;
}
