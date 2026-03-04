interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'amber' | 'navy' | 'outline';
  className?: string;
}

const variants = {
  default: 'bg-navy/10 text-navy/70',
  amber: 'bg-amber-100 text-amber-800',
  navy: 'bg-navy text-white',
  outline: 'bg-transparent border border-navy/30 text-navy/70',
};

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
