import { Loader2 } from 'lucide-react';

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    isLoading = false,
    disabled = false,
    ...props
}) {

    const baseStyles = "inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-surface-50 disabled:opacity-50 disabled:pointer-events-none touch-manipulation active:scale-[0.98]";

    const variants = {
        primary: "bg-grassroots-600 hover:bg-grassroots-700 text-white shadow-lg shadow-grassroots-500/30 focus:ring-grassroots-500",
        secondary: "bg-surface-100 hover:bg-surface-200 text-surface-700 border border-surface-200 focus:ring-surface-400",
        ghost: "bg-transparent hover:bg-surface-100 text-surface-500 hover:text-surface-900 focus:ring-surface-400",
        danger: "bg-corporate-500 hover:bg-corporate-600 text-white shadow-lg shadow-corporate-500/30 focus:ring-corporate-500"
    };

    const sizes = {
        sm: "text-xs px-3 py-1.5 h-8 gap-1.5",
        md: "text-sm px-5 py-2.5 h-11 gap-2",
        lg: "text-base px-6 py-3.5 h-14 gap-2.5"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
            {children}
        </button>
    );
}
