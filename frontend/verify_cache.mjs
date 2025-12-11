
import fs from 'fs';
import path from 'path';

const cachePath = path.join(process.cwd(), 'src', 'data', 'candidates_cache.json');

try {
    if (!fs.existsSync(cachePath)) {
        console.error("Cache file not found!");
        process.exit(1);
    }

    const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    const data = cache.data;

    console.log(`Total Candidates: ${data.length}`);

    // buffer to store failures
    let failures = [];

    // 1. Verify Ossoff
    const ossoff = data.find(c => c.id === 'S8GA00180');
    if (ossoff) {
        if (ossoff.total_funding > 50000000) {
            console.log(`[PASS] Ossoff Funding: $${ossoff.total_funding.toLocaleString()} (Expected > $50M)`);
        } else {
            console.error(`[FAIL] Ossoff Funding: $${ossoff.total_funding.toLocaleString()} (Expected > $50M)`);
            failures.push("Ossoff funding low");
        }
    } else {
        console.error("[FAIL] Ossoff not found in cache");
        failures.push("Ossoff missing");
    }

    // 2. Verify Eligibility Logic
    let eligibleCount = 0;
    let eligibleFailures = 0;
    let ineligibleFailures = 0;

    data.forEach(c => {
        const isHighFunding = c.total_funding >= 100000;
        if (isHighFunding && !c.is_eligible) {
            if (eligibleFailures < 5) console.error(`[FAIL] Candidate ${c.name} ($${c.total_funding}) is NOT eligible`);
            eligibleFailures++;
        }
        if (!isHighFunding && c.is_eligible) {
            if (ineligibleFailures < 5) console.error(`[FAIL] Candidate ${c.name} ($${c.total_funding}) IS eligible`);
            ineligibleFailures++;
        }

        if (c.is_eligible) eligibleCount++;
    });

    if (eligibleFailures === 0 && ineligibleFailures === 0) {
        console.log(`[PASS] Eligibility logic correct. Eligible Candidates: ${eligibleCount}`);
    } else {
        console.error(`[FAIL] Eligibility logic errors. False Negatives: ${eligibleFailures}, False Positives: ${ineligibleFailures}`);
        failures.push("Eligibility logic mismatch");
    }

    if (failures.length === 0) {
        console.log("ALL CHECKS PASSED");
    } else {
        console.error("CHECKS FAILED");
    }

} catch (err) {
    console.error("Error reading cache:", err.message);
}
