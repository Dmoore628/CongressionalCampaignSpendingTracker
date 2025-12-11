import { cn } from '@/lib/utils';

export function Badge({ variant = 'default', className, children }) {
    const variants = {
        default: 'bg-surface-100 text-surface-700 border border-surface-200',
        grassroots: 'bg-grassroots-50 text-grassroots-700 border border-grassroots-200',
        corporate: 'bg-corporate-50 text-corporate-700 border border-corporate-200',
        outline: 'bg-transparent border border-surface-300 text-surface-600',
    };

    return (
        <span className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
}
