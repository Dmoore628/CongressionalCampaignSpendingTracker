import axios from 'axios';
import { API_KEY } from '../config.js';

const BASE_URL = 'https://api.open.fec.gov/v1';

/**
 * Generic fetcher for FEC API
 * @param {string} endpoint - e.g., '/candidates/'
 * @param {object} params - Query parameters
 */
export async function fetchFecEndpoint(endpoint, params = {}) {
    try {
        const response = await axios.get(`${BASE_URL}${endpoint}`, {
            params: {
                api_key: API_KEY,
                ...params,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error.response?.data || error.message);
        throw error;
    }
}
