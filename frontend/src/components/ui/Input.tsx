import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-navy/80">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full rounded-lg border px-3 py-2 text-sm bg-white text-navy
            transition-colors duration-150
            placeholder:text-navy/40
            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
            ${error ? 'border-red-400' : 'border-navy/20 hover:border-navy/40'}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="text-xs text-navy/50">{hint}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
