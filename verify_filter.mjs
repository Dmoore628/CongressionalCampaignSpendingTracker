import axios from 'axios';

const API_URL = 'http://localhost:3000/api/candidates';

async function verify() {
    console.log("Verifying filtered candidates...");
    try {
        const response = await axios.get(API_URL);
        const candidates = response.data;
        console.log(`Fetched ${candidates.length} candidates.`);

        const ALLOWED_STATES = ['TX', 'AR', 'IL', 'NC'];

        const invalid = candidates.filter(c =>
            c.office !== 'P' && !ALLOWED_STATES.includes(c.state)
        );

        if (invalid.length > 0) {
            console.error("FAILED: Found candidates from invalid states:");
            const states = [...new Set(invalid.map(c => c.state))];
            console.log("Invalid States found:", states);
            console.log("Example:", invalid[0]);
        } else {
            console.log("SUCCESS: All candidates are from valid states (TX, AR, IL, NC) or are Presidential.");

            // Log counts
            const counts = {};
            candidates.forEach(c => {
                counts[c.state] = (counts[c.state] || 0) + 1;
            });
            console.log("Counts by state:", counts);
        }

    } catch (err) {
        console.error("Error connecting to API:", err.message);
    }
}

verify();
