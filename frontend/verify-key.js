const fs = require('fs');
const path = require('path');

let API_KEY = process.env.FEC_API_KEY;

if (!API_KEY) {
    try {
        const envPath = path.join(process.cwd(), '../.env');
        console.log("Checking path:", envPath);
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const match = envContent.match(/FEC_API_KEY=(.*)/);
            if (match && match[1]) {
                API_KEY = match[1].trim();
                console.log("SUCCESS: Loaded API_KEY from parent .env file");
                console.log("Key ends in:", API_KEY.slice(-4));
            } else {
                console.log("FAILED: Pattern not matched in .env");
            }
        } else {
            console.log("FAILED: File not found at path.");
        }
    } catch (err) {
        console.log("ERROR:", err.message);
    }
}
