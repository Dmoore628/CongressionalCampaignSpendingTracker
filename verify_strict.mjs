import axios from 'axios';

const API_URL = 'http://localhost:3000/api/candidates';

async function verify() {
    console.log("Verifying filtered candidates (Strict Date Check)...");
    try {
        const response = await axios.get(API_URL);
        const candidates = response.data;
        console.log(`Fetched ${candidates.length} candidates.`);

        const ALLOWED_STATES = ['IL', 'AR', 'TX', 'NC'];
        // CA (Dec 19) is NOT allowed yet (Today is Dec 10).
        // AL (Jan 5) is NOT allowed.

        const invalid = candidates.filter(c => {
            if (c.office === 'P') return true; // Should be gone
            if (!ALLOWED_STATES.includes(c.state)) return true; // Should be gone
            return false;
        });

        if (invalid.length > 0) {
            console.error("FAILED: Found invalid candidates:");
            const invalidStates = [...new Set(invalid.map(c => c.state))];
            console.log("Invalid States:", invalidStates);
            if (invalid.some(c => c.office === 'P')) console.log("ERROR: Presidential candidates found!");

            // Check specific cases
            const ca = invalid.filter(c => c.state === 'CA');
            if (ca.length > 0) console.log(`found ${ca.length} CA candidates (Should be 0)`);
        } else {
            console.log("SUCCESS: Only valid states (IL, AR, TX, NC) found. No Presidential candidates.");

            // Log counts
            const counts = {};
            candidates.forEach(c => {
                counts[c.state] = counts[c.state] ? counts[c.state] + 1 : 1;
            });
            console.log("Counts:", counts);
        }

    } catch (err) {
        console.error("Error connecting to API:", err.message);
    }
}

verify();
