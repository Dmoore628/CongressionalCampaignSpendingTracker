import { NextResponse } from 'next/server';
import os from 'os';
import axios from 'axios';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    const debug = {
        env: {
            has_key: !!process.env.FEC_API_KEY,
            key_preview: process.env.FEC_API_KEY ? `...${process.env.FEC_API_KEY.slice(-4)}` : 'MISSING',
            node_env: process.env.NODE_ENV
        },
        system: {
            tmp_dir: os.tmpdir(),
            platform: os.platform(),
        },
        connectivity: {
            status: 'pending',
            message: ''
        }
    };

    try {
        const API_KEY = process.env.FEC_API_KEY;
        if (!API_KEY) throw new Error("API Key Missing");

        const res = await axios.get('https://api.open.fec.gov/v1/candidates/totals/', {
            params: {
                api_key: API_KEY,
                cycle: 2026,
                page: 1,
                per_page: 5,
                sort: '-receipts',
                election_full: true
            },
            timeout: 5000
        });

        debug.connectivity.status = 'success';
        debug.connectivity.count = res.data.results.length;
        debug.connectivity.sample = res.data.results.length > 0 ? res.data.results[0].name : 'No results';

    } catch (error) {
        debug.connectivity.status = 'failed';
        debug.connectivity.message = error.message;
        debug.connectivity.details = error.response ? error.response.data : 'No response data';
    }

    return NextResponse.json(debug, { status: 200 });
}
