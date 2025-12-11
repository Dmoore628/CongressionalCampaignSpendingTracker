'use client';

import { X, ChevronDown, Check } from 'lucide-react';
import { useEffect, useState } from 'react';

export function FilterOverlay({ isOpen, onClose, filters, setFilters }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center transition-all duration-300 ease-in-out ${isOpen ? 'bg-surface-900/40 backdrop-blur-sm opacity-100' : 'bg-transparent pointer-events-none opacity-0'}`}
        >

            {/* Backdrop Click */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Panel */}
            <div
                className={`
                    relative w-full max-w-sm bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden
                    flex flex-col max-h-[90vh] sm:max-h-[80vh]
                    transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]
                    ${isOpen
                        ? 'translate-y-0 opacity-100 scale-100'
                        : 'translate-y-full opacity-0 sm:translate-y-8 sm:scale-95'
                    }
                `}
            >
                {/* Drag Handle (Mobile) */}
                <div className="w-12 h-1.5 bg-surface-200 rounded-full mx-auto mt-3 sm:hidden" />

                {/* Header */}
                <div className="flex justify-between items-center px-6 pt-5 pb-2">
                    <div>
                        <h2 className="text-xl font-display font-bold text-surface-900 tracking-tight">Filters</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-full transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">

                    {/* Office Filter */}
                    <div>
                        <label className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-3 block">Office</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['All', 'President', 'Senate', 'House'].map((opt) => (
                                <label
                                    key={opt}
                                    className={`
                                        flex items-center justify-center py-3 px-4 rounded-xl border cursor-pointer transition-all duration-200 select-none
                                        ${filters.office === opt
                                            ? 'border-grassroots-500 bg-grassroots-500 text-white font-bold shadow-sm'
                                            : 'border-surface-200 bg-white text-surface-600 font-medium hover:border-surface-300 hover:bg-surface-50'
                                        }
                                    `}
                                >
                                    <input
                                        type="radio"
                                        name="office"
                                        checked={filters.office === opt}
                                        onChange={() => setFilters({ ...filters, office: opt })}
                                        className="sr-only"
                                    />
                                    <span>{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* State Filter */}
                    <div>
                        <label className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-3 block">State</label>
                        <div className="relative group">
                            <select
                                className="w-full appearance-none bg-surface-50 border border-surface-200 text-surface-900 font-semibold py-3.5 pl-4 pr-12 rounded-xl focus:outline-none focus:ring-1 focus:ring-grassroots-500 focus:border-grassroots-500 transition-shadow cursor-pointer hover:bg-surface-100"
                                value={filters.state || ''}
                                onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                            >
                                <option value="">All States</option>
                                <option value="AL">Alabama</option>
                                <option value="AK">Alaska</option>
                                <option value="AZ">Arizona</option>
                                <option value="AR">Arkansas</option>
                                <option value="CA">California</option>
                                <option value="CO">Colorado</option>
                                <option value="CT">Connecticut</option>
                                <option value="DE">Delaware</option>
                                <option value="DC">District Of Columbia</option>
                                <option value="FL">Florida</option>
                                <option value="GA">Georgia</option>
                                <option value="HI">Hawaii</option>
                                <option value="ID">Idaho</option>
                                <option value="IL">Illinois</option>
                                <option value="IN">Indiana</option>
                                <option value="IA">Iowa</option>
                                <option value="KS">Kansas</option>
                                <option value="KY">Kentucky</option>
                                <option value="LA">Louisiana</option>
                                <option value="ME">Maine</option>
                                <option value="MD">Maryland</option>
                                <option value="MA">Massachusetts</option>
                                <option value="MI">Michigan</option>
                                <option value="MN">Minnesota</option>
                                <option value="MS">Mississippi</option>
                                <option value="MO">Missouri</option>
                                <option value="MT">Montana</option>
                                <option value="NE">Nebraska</option>
                                <option value="NV">Nevada</option>
                                <option value="NH">New Hampshire</option>
                                <option value="NJ">New Jersey</option>
                                <option value="NM">New Mexico</option>
                                <option value="NY">New York</option>
                                <option value="NC">North Carolina</option>
                                <option value="ND">North Dakota</option>
                                <option value="OH">Ohio</option>
                                <option value="OK">Oklahoma</option>
                                <option value="OR">Oregon</option>
                                <option value="PA">Pennsylvania</option>
                                <option value="RI">Rhode Island</option>
                                <option value="SC">South Carolina</option>
                                <option value="SD">South Dakota</option>
                                <option value="TN">Tennessee</option>
                                <option value="TX">Texas</option>
                                <option value="UT">Utah</option>
                                <option value="VT">Vermont</option>
                                <option value="VA">Virginia</option>
                                <option value="WA">Washington</option>
                                <option value="WV">West Virginia</option>
                                <option value="WI">Wisconsin</option>
                                <option value="WY">Wyoming</option>
                                <option value="AS">American Samoa</option>
                                <option value="GU">Guam</option>
                                <option value="MP">Northern Mariana Islands</option>
                                <option value="PR">Puerto Rico</option>
                                <option value="VI">Virgin Islands</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-surface-100 bg-surface-50 space-y-3">
                    <button
                        onClick={onClose}
                        className="w-full py-3.5 bg-grassroots-600 text-white text-lg font-display font-bold rounded-xl shadow-md shadow-grassroots-600/10 hover:bg-grassroots-700 active:scale-[0.98] transition-all duration-200"
                    >
                        View Results
                    </button>
                    <button
                        onClick={() => {
                            setFilters({ office: 'All', state: '' });
                        }}
                        className="w-full py-3 text-surface-500 font-bold text-sm tracking-wide hover:text-surface-800 transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}
