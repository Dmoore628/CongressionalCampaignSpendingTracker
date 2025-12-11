'use client';

import { useEffect, useState } from 'react';
import { ZipSearch } from '@/components/ZipSearch';
import { CandidateCard } from '@/components/CandidateCard';
import { Loader2 } from 'lucide-react';

export default function TheField() {
    const [candidates, setCandidates] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/candidates')
            .then(res => res.json())
            .then(data => {
                setCandidates(data);
                setFiltered(data);
                setLoading(false);
            });
    }, []);

    const handleSearch = (zip) => {
        if (!zip) {
            setFiltered(candidates);
            return;
        }
        const demoState = "CA";
        setFiltered(candidates.filter(c => c.state === demoState || c.office === 'P'));
    };

    return (
        <>
            <ZipSearch onSearch={handleSearch} />

            <div className="p-4 space-y-4">
                <header className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">The Field</h1>
                    <p className="text-slate-500">Every candidate running.</p>
                </header>

                {loading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-600" /></div>
                ) : (
                    filtered.map(c => <CandidateCard key={c.id} candidate={c} />)
                )}
            </div>
        </>
    );
}
