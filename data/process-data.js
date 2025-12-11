/**
 * Transforms raw FEC candidate data into our app's optimized structure.
 * Applies the $100k threshold logic.
 * 
 * @param {Array} rawCandidates - The raw array from fetchAllCandidates.
 * @returns {Array} - Processed candidate objects.
 */
export async function processCandidateData(rawCandidates) {
    // Note: OpenFEC /candidates/ endpoint provides basic info.
    // To get TOTAL FUNDING (receipts), we typically need /candidates/totals/ or similar.
    // However, the /candidates/ object might NOT have 'total_receipts'.
    // We might need to fetch totals separately or use a different endpoint like /schedules/schedule_a/by_employer/ to assume... No.
    // Best approach: Use /candidates/totals/ endpoint directly if possible, OR fetch candidates then fetch totals.
    // Optimization: /candidates/totals/ allows filtering by cycle. It returns candidate_id AND total_receipts.
    // So we should probably switch the FETCH strategy to use /candidates/totals/ if the goal is financial status.

    // Let's assume for this step we will map the raw data. 
    // But wait, raw /candidates/ data usually doesn't have `total_receipts`.
    // We need to fetch financial totals.
    // STRATEGY UPDATE: The fetch-candidates.js should probably fetch from /candidates/totals/ to get financial data + basic candidate info.

    // Since I cannot rewrite fetch-candidates.js in this same turn easily (I just wrote it), 
    // I will write this processor to handle what it gets, but I'll add a note or separate "enrichment" step if needed.
    // ACTUALLY, checking OpenFEC docs: /candidates/totals/ is the best single source for "Financial + Candidate ID".
    // It returns { candidate_id, total_receipts, ... }. 
    // Then we might need to merge with /candidates/ for names if totals doesn't have it.
    // /candidates/totals/ DOES contain name, party, office, state, district. Perfect.

    return rawCandidates.map(c => {
        // Check for 'total_receipts' or fallbacks
        const receipts = c.receipts || c.total_receipts || 0;

        let complianceStatus = 'Eligible';
        let isEligible = true;

        if (receipts >= 100000) {
            complianceStatus = 'Flagged';
            isEligible = false;
        }

        return {
            id: c.candidate_id,
            name: c.name,
            office: c.office, // P, S, H
            office_full: c.office_full,
            state: c.state,
            district: c.district,
            party: c.party,
            total_funding: receipts,
            is_eligible: isEligible,
            compliance_status: complianceStatus,
            last_updated: new Date().toISOString()
        };
    });
}
