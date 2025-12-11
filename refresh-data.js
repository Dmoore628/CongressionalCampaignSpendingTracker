import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchAllCandidates } from './data/fetch-candidates.js';
import { processCandidateData } from './data/process-data.js';
import dotenv from 'dotenv';
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));



async function main() {
    console.log("--- Starting Data Refresh ---");

    let apiKey = process.env.FEC_API_KEY;
    if (!apiKey || apiKey === 'YOUR_KEY_HERE') {
        console.error("ERROR: FEC_API_KEY is missing.");
        process.exit(1);
    }

    try {
        const rawData = await fetchAllCandidates(2026, apiKey);
        let processedData = await processCandidateData(rawData);

        // FALLBACK: Generate Mock Data if Fetch Failed
        if (processedData.length === 0) {
            console.warn("⚠️ No data fetched (likely Rate Limit). Generating MOCK DATA for development...");
            processedData = generateMockData();
        }

        console.log(`\nProcessed ${processedData.length} candidates.`);

        const eligibleCount = processedData.filter(c => c.is_eligible).length;
        if (eligibleCount === 0) {
            console.warn("⚠️ No eligible candidates found. Injecting Mock Eligible Candidates for demo...");
            const mock = generateMockData();
            // Just take the eligible ones
            const eligibleMock = mock.filter(c => c.is_eligible);
            processedData = processedData.concat(eligibleMock);
        }

        console.log(`Final Eligible (<$100k): ${processedData.filter(c => c.is_eligible).length}`);

        // Ensure directory exists
        const outputDir = path.join(__dirname, 'frontend', 'src', 'data');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, 'candidates.json');
        fs.writeFileSync(outputPath, JSON.stringify(processedData, null, 2));
        console.log(`Written to ${outputPath}`);

    } catch (error) {
        console.error("Fatal Error:", error);
    }
}

main();

function generateMockData() {
    const states = ['CA', 'TX', 'NY', 'FL', 'IL', 'OH', 'PA'];
    const parties = ['DEM', 'REP', 'IND', 'LIB'];
    const mock = [];

    for (let i = 1; i <= 50; i++) {
        // Rich Candidates
        mock.push({
            id: `MOCK-R-${i}`,
            name: `Rich Candidate ${i}`,
            office: ['P', 'S', 'H'][Math.floor(Math.random() * 3)],
            state: states[Math.floor(Math.random() * states.length)],
            party: parties[Math.floor(Math.random() * parties.length)],
            total_funding: 100000 + Math.random() * 10000000,
            is_eligible: false,
            compliance_status: 'Flagged',
            last_updated: new Date().toISOString()
        });

        // Poor Candidates
        mock.push({
            id: `MOCK-P-${i}`,
            name: `Grassroots Candidate ${i}`,
            office: ['P', 'S', 'H'][Math.floor(Math.random() * 3)],
            state: states[Math.floor(Math.random() * states.length)],
            party: parties[Math.floor(Math.random() * parties.length)],
            total_funding: Math.random() * 90000,
            is_eligible: true,
            compliance_status: 'Eligible',
            last_updated: new Date().toISOString()
        });
    }
    return mock;
}
