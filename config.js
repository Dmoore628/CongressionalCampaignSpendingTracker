import dotenv from 'dotenv';
dotenv.config();

export const API_KEY = process.env.FEC_API_KEY;

if (!API_KEY || API_KEY === 'YOUR_KEY_HERE') {
  console.warn("WARNING: FEC_API_KEY is not set in .env file.");
}
