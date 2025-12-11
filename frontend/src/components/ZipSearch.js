'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ZipSearch({ onSearch, onOpenFilters, isLoading }) {
    const [term, setTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    // Typing placeholder effect
    const placeholderText = "Enter Zip Code, State, or Name...";
    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    useEffect(() => {
        if (term) return;
        const interval = setInterval(() => {
            setPlaceholderIndex(prev => (prev + 1) % (placeholderText.length + 50));
        }, 100);
        return () => clearInterval(interval);
    }, [term]);

    const displayPlaceholder = placeholderText.slice(0, Math.min(placeholderIndex, placeholderText.length));

    const handleChange = (e) => {
        const value = e.target.value;
        setTerm(value);
        onSearch(value);
    };

    return (
        <div className={`relative w-full max-w-lg mx-auto transition-all duration-300 ${isFocused ? 'scale-[1.02]' : 'scale-100'}`}>

            <div className={`
                relative flex items-center bg-white 
                rounded-2xl transition-all duration-300
                ${isFocused
                    ? 'shadow-lg ring-1 ring-grassroots-400 border-grassroots-400'
                    : 'shadow-md border border-surface-200 hover:border-surface-300'
                }
            `}>
                {/* Search Icon */}
                <div className="pl-4 shrink-0">
                    <Search className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-grassroots-600' : 'text-surface-400'}`} />
                </div>

                {/* Input Field */}
                <div className="relative flex-1 min-w-0">
                    <input
                        type="text"
                        value={term}
                        onChange={handleChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="w-full h-14 pl-3 pr-4 bg-transparent text-lg font-medium text-surface-900 placeholder-transparent focus:outline-none rounded-none"
                        placeholder=""
                    />

                    {/* Animated Placeholder */}
                    {!term && (
                        <div className="absolute inset-0 flex items-center pl-3 pointer-events-none">
                            <span className="text-lg text-surface-400 opacity-60 font-normal whitespace-nowrap overflow-hidden">
                                {displayPlaceholder}
                                <span className={`inline-block w-[2px] h-5 bg-grassroots-500 ml-0.5 align-middle ${isFocused ? 'animate-pulse' : 'opacity-0'}`} />
                            </span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="pr-2 flex items-center gap-1 shrink-0">
                    {term && (
                        <button
                            onClick={() => { setTerm(''); onSearch(''); }}
                            className="p-2 text-surface-400 hover:text-surface-700 hover:bg-surface-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}

                    <div className="w-px h-6 bg-surface-200 mx-1" />

                    <button
                        onClick={onOpenFilters}
                        className="p-2.5 text-surface-500 hover:text-grassroots-700 hover:bg-grassroots-50 rounded-xl transition-all active:scale-95"
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Loading Line */}
            {isLoading && (
                <div className="absolute -bottom-px left-4 right-4 h-[2px] bg-surface-100 overflow-hidden rounded-full z-10">
                    <div className="absolute inset-0 bg-grassroots-500 w-1/3 animate-[shimmer_1s_infinite]" />
                </div>
            )}
        </div>
    );
}
