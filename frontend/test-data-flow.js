import { fetchAllCandidates } from './src/lib/api-service.js';

async function test() {
    console.log("Testing fetchAllCandidates...");
    try {
        const data = await fetchAllCandidates(2026);
        console.log(`Fetched ${data.length} candidates.`);

        if (data.length > 0) {
            console.log("Sample Candidate:", JSON.stringify(data[0], null, 2));

            // Test Filtering Logic
            const NOW = new Date();
            const FILING_WINDOWS = {
                'NC': { start: '2025-12-01', end: '2025-12-19' },
                'AL': { start: '2025-11-10', end: '2026-01-23' },
                'OH': { start: '2025-11-10', end: '2026-02-04' },
            };

            console.log("\nTesting Filter with Date:", NOW.toISOString());

            const filtered = data.filter(c => {
                if (c.office === 'P') return false;
                const window = FILING_WINDOWS[c.state];
                if (!window) return false;
                const start = new Date(window.start);
                const end = new Date(window.end);
                return NOW >= start && NOW <= end;
            });

            console.log(`Filtered count (Active States only): ${filtered.length}`);
            if (filtered.length > 0) {
                console.log("Sample Filtered:", JSON.stringify(filtered[0], null, 2));
            } else {
                console.log("Sample States in Raw Data:", data.slice(0, 10).map(c => c.state));
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

test();
