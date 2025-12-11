'use client';

function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

export function SegmentedToggle({ value, onChange, counts }) {
    const options = [
        { id: 'eligible', label: 'Eligible' },
        { id: 'ineligible', label: 'Ineligible Candidates' }
    ];

    return (
        <div className="flex justify-center w-full">
            <div className="relative flex p-1 bg-surface-100 rounded-lg w-full max-w-sm border border-surface-200">
                {/* Sliding Indicator */}
                <div
                    className={cn(
                        "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-[6px] bg-white shadow-sm border border-surface-200 transition-all duration-300 ease-[cubic-bezier(0.2,0,0.2,1)]",
                        value === 'eligible' ? "left-1" : "left-[50%]"
                    )}
                />

                {options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onChange(option.id)}
                        className={cn(
                            "relative flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-md transition-colors duration-200 z-10",
                            value === option.id
                                ? "text-surface-900"
                                : "text-surface-500 hover:text-surface-700"
                        )}
                    >
                        <span>{option.label}</span>
                        {counts && counts[option.id] > 0 && (
                            <span className={cn(
                                "text-[10px] leading-none px-1.5 py-0.5 rounded-full font-mono font-medium transition-colors",
                                value === option.id ? "bg-surface-100 text-surface-700" : "bg-surface-200 text-surface-500"
                            )}>
                                {counts[option.id]}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
