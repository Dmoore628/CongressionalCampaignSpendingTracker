import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function CandidateCard({ candidate }) {
    const isEligible = candidate.is_eligible;

    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: "compact",
        maximumFractionDigits: 1
    }).format(candidate.total_funding);

    return (
        <Link href={`/candidate/${candidate.id}`} className="block group">
            <div className={`
                relative bg-white rounded-xl transition-all duration-200
                border border-surface-200
                hover:border-grassroots-300 hover:shadow-md
                active:scale-[0.99]
                ${isEligible ? 'pl-3' : 'pl-3 opacity-75 grayscale hover:grayscale-0 hover:opacity-100'}
            `}>

                {/* Status Indicator Bar */}
                {isEligible && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-grassroots-500 rounded-l-xl" />
                )}

                <div className="py-4 pr-4 flex items-center justify-between gap-3">

                    {/* Left: Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-display font-bold text-surface-900 text-base leading-tight truncate">
                                {candidate.name}
                            </h3>
                            {candidate.incumbent && (
                                <span className="bg-surface-100 text-surface-600 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shrink-0 border border-surface-200">
                                    Inc
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-medium text-surface-500">
                            <span className={`
                                w-2 h-2 rounded-full shrink-0
                                ${candidate.party === 'DEM' ? 'bg-blue-500' :
                                    candidate.party === 'REP' ? 'bg-red-500' :
                                        'bg-yellow-500'}
                            `} />
                            <span className="truncate">
                                {candidate.party} • {candidate.state}-{candidate.district || 'AL'}
                            </span>
                        </div>
                    </div>

                    {/* Right: Funding */}
                    <div className="text-right shrink-0">
                        <div className={`font-mono font-bold text-base tracking-tight ${isEligible ? 'text-grassroots-700' : 'text-surface-500'}`}>
                            {formattedAmount}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-surface-400 tracking-wider">Raised</div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
