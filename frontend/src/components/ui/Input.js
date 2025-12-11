export function Input({
    className = '',
    icon: Icon,
    ...props
}) {
    return (
        <div className="relative group w-full">
            {Icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 transition-colors group-focus-within:text-grassroots-600">
                    <Icon className="w-5 h-5" />
                </div>
            )}
            <input
                className={`
                    w-full bg-white border border-surface-200 text-surface-900 placeholder-surface-400
                    rounded-xl py-3.5 ${Icon ? 'pl-11' : 'pl-4'} pr-4
                    text-base font-medium shadow-sm transition-all duration-200
                    focus:outline-none focus:border-grassroots-500 focus:ring-2 focus:ring-grassroots-500/20
                    disabled:opacity-50 disabled:bg-surface-50
                    ${className}
                `}
                {...props}
            />
        </div>
    );
}
