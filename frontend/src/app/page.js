'use client';

import { useEffect, useState, useMemo } from 'react';
import { ZipSearch } from '@/components/ZipSearch';
import { CandidateCard } from '@/components/CandidateCard';
import { SegmentedToggle } from '@/components/SegmentedToggle';
import { FilterOverlay } from '@/components/FilterOverlay';
import { Button } from '@/components/ui/Button';
import { RefreshCw, Check, MapPin, ExternalLink, Info } from 'lucide-react';

export default function Home() {
    const [candidates, setCandidates] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('eligible');
    const [searchTerm, setSearchTerm] = useState('');
    const [displayLimit, setDisplayLimit] = useState(50);
    const [lastUpdated, setLastUpdated] = useState('');

    // Advanced Filters
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({ office: 'All', state: '' });

    // Constants
    const { STATE_TO_ABBR } = require('@/lib/constants');

    // Filter Logic
    const [detectedZipState, setDetectedZipState] = useState(null);
    const [zipLoading, setZipLoading] = useState(false);
    const [zipError, setZipError] = useState(false);
    const [counts, setCounts] = useState({ eligible: 0, ineligible: 0 });

    useEffect(() => {
        const date = new Date();
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        setLastUpdated(date.toLocaleDateString('en-US', options));
    }, []);

    // Fetch Data
    useEffect(() => {
        setLoading(true);
        fetch('/api/candidates')
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                setCandidates(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setCandidates([]);
                setLoading(false);
            });
    }, []);

    // Zip Code Resolution
    useEffect(() => {
        if (/^\d{5}$/.test(searchTerm)) {
            setZipLoading(true);
            setZipError(false);
            fetch(`https://api.zippopotam.us/us/${searchTerm}`)
                .then(res => {
                    if (!res.ok) throw new Error('Zip not found');
                    return res.json();
                })
                .then(data => {
                    if (data?.places?.[0]?.['state abbreviation']) {
                        setDetectedZipState(data.places[0]['state abbreviation']);
                        setZipError(false);
                    }
                })
                .catch(() => {
                    setDetectedZipState(null);
                    setZipError(true);
                })
                .finally(() => setZipLoading(false));
        } else {
            setDetectedZipState(null);
            setZipError(false);
        }
    }, [searchTerm]);

    // Filtering Effect
    useEffect(() => {
        let matches = candidates;

        // 1. Search Filter
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            const stateAbbr = STATE_TO_ABBR[lower];

            matches = matches.filter(c => {
                if (detectedZipState && c.state === detectedZipState) return true;
                if (stateAbbr && c.state === stateAbbr) return true;
                return (
                    c.name.toLowerCase().includes(lower) ||
                    (c.state && c.state.toLowerCase().includes(lower)) ||
                    (c.district && `${c.state}-${c.district}`.toLowerCase().includes(lower))
                );
            });
        }

        // 2. Advanced Filters
        if (filters.office !== 'All') {
            const officeMap = { 'President': 'P', 'Senate': 'S', 'House': 'H' };
            const target = officeMap[filters.office] || filters.office;
            matches = matches.filter(c => c.office === target || c.office_full === filters.office);
        }
        if (filters.state) {
            matches = matches.filter(c => c.state === filters.state);
        }

        // 3. Update Counts
        const eligibleCount = matches.filter(c => c.is_eligible).length;
        const ineligibleCount = matches.filter(c => !c.is_eligible).length;
        setCounts({ eligible: eligibleCount, ineligible: ineligibleCount });

        // 4. View Mode
        if (viewMode === 'eligible') {
            matches = matches.filter(c => c.is_eligible);
        } else if (viewMode === 'ineligible') {
            matches = matches.filter(c => !c.is_eligible);
        }

        setFiltered(matches);
        setDisplayLimit(50);
    }, [candidates, viewMode, searchTerm, filters, detectedZipState, STATE_TO_ABBR]);

    // Grouping Logic
    const groupedCandidates = useMemo(() => {
        if (!filtered.length) return {};

        // 1. Sort: State (Asc) -> Office (P > S > H) -> Name (Asc)
        const officePriority = { P: 0, S: 1, H: 2 };

        const sorted = [...filtered].sort((a, b) => {
            // State First
            const stateA = a.state || 'ZZ'; // ZZ to put undefined last
            const stateB = b.state || 'ZZ';
            if (stateA !== stateB) return stateA.localeCompare(stateB);

            // Office Second
            const officeA = officePriority[a.office] ?? 99;
            const officeB = officePriority[b.office] ?? 99;
            if (officeA !== officeB) return officeA - officeB;

            // Name Third
            return a.name.localeCompare(b.name);
        });

        // 2. Slice for Pagination
        const sliced = sorted.slice(0, displayLimit);

        // 3. Group by State
        const groups = {};
        sliced.forEach(c => {
            const state = c.state || 'Other';
            if (!groups[state]) groups[state] = [];
            groups[state].push(c);
        });

        return groups;
    }, [filtered, displayLimit]);

    return (
        <div className="min-h-screen pb-32 w-full bg-surface-50">
            <FilterOverlay
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                filters={filters}
                setFilters={setFilters}
            />

            {/* Header Area */}
            <div className="pt-safe-top pb-6 bg-surface-25 border-b border-surface-200">
                <div className="container-mobile pt-6 text-center">

                    {/* Live Badge */}
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-4 rounded-full bg-grassroots-50 border border-grassroots-100 animate-in opacity-0" style={{ animationDelay: '0ms' }}>
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-grassroots-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-grassroots-500"></span>
                        </div>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-grassroots-800">
                            Live 2026 Cycle
                        </span>
                    </div>

                    <h1 className="text-3xl font-display font-bold tracking-tighter text-surface-950 mb-2 animate-in opacity-0" style={{ animationDelay: '50ms' }}>
                        Campaign<span className="text-grassroots-600">Tracker</span>
                    </h1>
                    <p className="text-surface-500 text-base font-medium mb-6 animate-in opacity-0" style={{ animationDelay: '100ms' }}>
                        Follow the money. Secure the future.
                    </p>

                    <div className="animate-in opacity-0" style={{ animationDelay: '150ms' }}>
                        <SegmentedToggle value={viewMode} onChange={setViewMode} counts={counts} />
                    </div>
                </div>
            </div>

            {/* Sticky Search */}
            <div className="sticky top-0 z-30 pt-4 pb-2 bg-surface-50/95 backdrop-blur-md border-b border-surface-200/50 shadow-sm">
                <div className="container-mobile">
                    <ZipSearch
                        onSearch={setSearchTerm}
                        onOpenFilters={() => setShowFilters(true)}
                        isLoading={zipLoading}
                    />
                </div>
            </div>

            {/* Action Links (Compact) */}
            <div className="container-mobile mt-6 mb-8 grid grid-cols-2 gap-3">
                <a
                    href="https://vote.gov/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-surface-200 shadow-sm active:scale-[0.98] transition-all hover:border-grassroots-200"
                >
                    <MapPin className="w-5 h-5 text-surface-400 mb-1.5" />
                    <span className="text-xs font-bold text-surface-700">Find Polling Place</span>
                </a>
                <a
                    href="https://www.runforoffice.org/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-surface-200 shadow-sm active:scale-[0.98] transition-all hover:border-corporate-200"
                >
                    <ExternalLink className="w-5 h-5 text-surface-400 mb-1.5" />
                    <span className="text-xs font-bold text-surface-700">Run for Office</span>
                </a>
            </div>

            {/* Content Area */}
            <div className="container-mobile">
                {loading ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="h-4 bg-surface-200 rounded w-1/4 mb-4"></div>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-24 bg-white rounded-2xl w-full border border-surface-100" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-8 pb-12">
                        {filtered.length > 0 ? (
                            <>
                                {Object.keys(groupedCandidates).map(stateAbbr => (
                                    <section key={stateAbbr} className="animate-in opacity-0" style={{ animationDelay: '200ms' }}>
                                        <div className="flex items-center gap-4 mb-4 mt-8 first:mt-0">
                                            <h2 className="text-xl font-display font-bold text-surface-900">
                                                {stateAbbr}
                                            </h2>
                                            <div className="h-px flex-1 bg-surface-200"></div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            {groupedCandidates[stateAbbr].map(c => (
                                                <CandidateCard key={c.id} candidate={c} />
                                            ))}
                                        </div>
                                    </section>
                                ))}

                                {filtered.length > displayLimit && (
                                    <div className="flex justify-center pt-8">
                                        <Button onClick={() => setDisplayLimit(prev => prev + 50)} variant="secondary">
                                            Load More Candidates
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-16 px-6">
                                {(searchTerm || filters.state || filters.office !== 'All') ? (
                                    <>
                                        <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Info className="w-8 h-8 text-surface-400" />
                                        </div>
                                        <h3 className="text-surface-900 font-bold text-lg mb-2">
                                            No data for {detectedZipState || (searchTerm && searchTerm.toUpperCase()) || "this selection"}
                                        </h3>
                                        <p className="text-surface-500 text-sm mb-6 max-w-md mx-auto">
                                            We couldn't find any active, funded candidates matching your search. This likely means the election filing period hasn't opened yet, or candidates haven't reported any funding.
                                        </p>
                                        <a
                                            href={`https://ballotpedia.org/Elections_in_${detectedZipState || (searchTerm && searchTerm.length === 2 ? searchTerm.toUpperCase() : "United_States")}_in_2026`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-grassroots-600 text-white rounded-lg font-bold text-sm hover:bg-grassroots-700 transition-colors"
                                        >
                                            Check Election Status on Ballotpedia &rarr;
                                        </a>
                                        <div className="mt-8">
                                            <Button
                                                variant="outline"
                                                onClick={() => { setSearchTerm(''); setFilters({ office: 'All', state: '' }); }}
                                            >
                                                Clear Filters
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="opacity-50">
                                        <p>No candidates available directly.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Footer Info */}
                        <div className="border-t border-surface-200 mt-12 pt-6 flex justify-between items-center opacity-60">
                            <div className="flex items-center gap-1.5">
                                <Check className="w-3 h-3 text-grassroots-600" />
                                <span className="text-[10px] font-bold text-surface-500 uppercase tracking-widest">FEC Verified</span>
                            </div>
                            <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest flex items-center gap-1.5">
                                <RefreshCw className="w-3 h-3" /> {lastUpdated}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
