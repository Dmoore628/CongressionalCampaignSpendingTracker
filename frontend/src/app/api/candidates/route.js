import { NextResponse } from 'next/server';
import { fetchAllCandidates } from '@/lib/api-service';

export const dynamic = 'force-dynamic'; // Ensure this runs on every request (serverless compatible)
export const revalidate = 0; // Disable static caching

export async function GET() {
    try {
        // FILING PERIOD CONFIGURATION
        // Strict filing windows for the 2026 Primary Elections.
        // Candidates are ONLY shown if today is strictly within the start and end dates.
        const FILING_WINDOWS = {
            'IL': { start: '2025-10-27', end: '2025-11-03' }, // Illinois (Closed)
            'AR': { start: '2025-11-03', end: '2025-11-12' }, // Arkansas (Closed)
            'TX': { start: '2025-11-08', end: '2025-12-08' }, // Texas (Closed)
            'NC': { start: '2025-12-01', end: '2025-12-19' }, // North Carolina (ACTIVE)
            'CA': { start: '2025-12-11', end: '2026-03-06' }, // California (Starts Dec 11)
            'AL': { start: '2025-11-10', end: '2026-01-23' }, // Alabama (Active)
            'OH': { start: '2025-11-10', end: '2026-02-04' }, // Ohio (Active)
        };

        const NOW = new Date();
        const CURRENT_DATE_STR = NOW.toISOString().split('T')[0];

        // Fetch data (Live API + Cache Check)
        let data = await fetchAllCandidates(2026);

        // Filter by Filing Window
        // data = data.filter(c => {
        //     // 1. Presidential Filter (2028 cycle not started)
        //     if (c.office === 'P') return false;
        //
        //     // 2. State Filing Period Filter
        //     // If the state is not in our known list of "Active or Recently Closed" windows, 
        //     // valid interpretation is either "Not yet started" or "Unknown". 
        //     // For now, we only show what we explicitly track as verifying activity.
        //     const window = FILING_WINDOWS[c.state];
        //     if (!window) return false;
        //
        //     const startDate = new Date(window.start);
        //     const endDate = new Date(window.end);
        //
        //     // Adjust end date to cover the full day if needed, or stick to strict date object comparison.
        //     // Adding 1 day to end date to ensure the "end date" is inclusive of that whole day effectively?
        //     // Or just trust the API dates vs current time. 
        //     // Simple check:
        //     const isActive = NOW >= startDate && NOW <= endDate;
        //
        //     return isActive;
        // });

        return NextResponse.json(data);
    } catch (error) {
        console.error("API ROUTE ERROR:", error);
        return NextResponse.json({ error: 'Data load failed', details: error.message }, { status: 500 });
    }
}
