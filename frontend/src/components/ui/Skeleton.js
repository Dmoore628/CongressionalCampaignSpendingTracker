function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

export function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn("animate-shimmer bg-surface-200/50 rounded-md", className)}
            style={{
                backgroundImage: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
                backgroundSize: '200% 100%'
            }}
            {...props}
        />
    );
}
