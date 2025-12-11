
import fs from 'fs';
import path from 'path';

// Read local data
const filePath = path.join(process.cwd(), 'frontend', 'src', 'data', 'candidates.json');
const raw = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(raw);

// Check Presidential candidates
const presidents = data.filter(c => c.office === 'P');
console.log(`Found ${presidents.length} Presidential candidates.`);
if (presidents.length > 0) {
    console.log("Sample P candidates:");
    console.log(JSON.stringify(presidents.slice(0, 3), null, 2));

    // Check their states
    const pStates = [...new Set(presidents.map(c => c.state))];
    console.log("Presidential candidates states:", pStates);
} else {
    console.log("No Presidential candidates found.");
}

// Check 'US' state candidates if any (might overlap)
const usCandidates = data.filter(c => c.state === 'US');
console.log(`Found ${usCandidates.length} candidates with state 'US'.`);
