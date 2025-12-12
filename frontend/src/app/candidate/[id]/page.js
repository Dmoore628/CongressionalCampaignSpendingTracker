'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Correct hook for App Router
import { Check, X, ArrowLeft, ExternalLink, Building2, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Loader2 } from 'lucide-react';
import { OFFICE_LABELS } from '@/lib/constants';

export default function CandidateDetail() {
    const params = useParams();
    const router = useRouter();
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, we'd fetch specific ID from API: /api/candidates/${params.id}
        // For this MVP, we fetch all and find the one.
        fetch('/api/candidates')
            .then(res => res.json())
            .then(data => {
                const found = data.find(c => c.id === params.id);
                setCandidate(found);
                setLoading(false);
            });
    }, [params.id]);

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-slate-400" /></div>;
    if (!candidate) return <div className="p-8 text-center">Candidate not found.</div>;

    const isEligible = candidate.is_eligible;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Navigation */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-30 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <span className="font-semibold text-slate-900 text-sm">Candidate Profile</span>
                <div className="w-8" /> {/* Spacer */}
            </div>

            {/* Hero / Status Banner */}
            <div className={`
        px-6 py-8 flex flex-col items-center text-center
        ${isEligible ? 'bg-grassroots-600 text-white' : 'bg-white border-b border-slate-200'}
      `}>
                <div className={`
          w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm
          ${isEligible ? 'bg-white text-grassroots-600' : 'bg-corporate-100 text-corporate-600'}
        `}>
                    {isEligible ? <Check className="w-8 h-8" strokeWidth={4} /> : <X className="w-8 h-8" strokeWidth={4} />}
                </div>

                <h1 className={`text-2xl font-bold mb-1 ${isEligible ? 'text-white' : 'text-slate-900'}`}>
                    {isEligible ? 'Pledge Compliant' : 'Flagged: High Funding'}
                </h1>
                <p className={`text-sm font-medium opacity-90 ${isEligible ? 'text-grassroots-100' : 'text-slate-500'}`}>
                    {isEligible ? 'This candidate runs a low-budget campaign.' : 'This candidate exceeds the $100k threshold.'}
                </p>
            </div>

            {/* Money Stat */}
            <div className="bg-white p-6 mx-4 -mt-6 rounded-2xl shadow-sm border border-slate-100 text-center relative z-10">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Raised</p>
                <div className={`text-4xl font-mono font-bold tracking-tighter ${isEligible ? 'text-grassroots-600' : 'text-slate-900'}`}>
                    ${new Intl.NumberFormat('en-US').format(candidate.total_funding)}
                </div>
                <p className="text-xs text-slate-400 mt-2">Threshold: $100,000</p>
            </div>

            {/* Details List */}
            <div className="px-4 mt-6 space-y-3">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <h2 className="text-sm font-semibold text-slate-900 mb-3 border-b border-slate-50 pb-2">Candidate Info</h2>

                    <div className="space-y-3">
                        <div className="flex items-start">
                            <div className="min-w-[24px]"><ExternalLink className="w-4 h-4 text-slate-400 mt-0.5" /></div>
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase">Name</p>
                                <p className="text-slate-900 font-medium">{candidate.name}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="min-w-[24px]"><Building2 className="w-4 h-4 text-slate-400 mt-0.5" /></div>
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase">Running For</p>
                                <p className="text-slate-900 font-medium">
                                    {OFFICE_LABELS[candidate.office] || candidate.office_full || candidate.office}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="min-w-[24px]"><MapPin className="w-4 h-4 text-slate-400 mt-0.5" /></div>
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase">District</p>
                                <p className="text-slate-900 font-medium">
                                    {candidate.state} {candidate.district ? `- District ${candidate.district}` : '(Statewide)'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Source Button */}
                <a
                    href={`https://www.fec.gov/data/candidate/${candidate.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center w-full p-4 bg-white border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                    View Official FEC Filing <ExternalLink className="w-4 h-4 ml-2 opacity-50" />
                </a>
            </div>
        </div>
    );
}
