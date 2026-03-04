interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
};

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <div
      className={`inline-block rounded-full border-2 border-current border-t-transparent animate-spin text-amber-600 ${sizes[size]} ${className}`}
      role="status"
      aria-label="Cargando"
    />
  );
}
