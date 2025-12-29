
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  loading = false,
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2 overflow-hidden";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm border border-blue-700/50 dark:bg-red-600 dark:hover:bg-red-700 dark:border-red-700/50",
    secondary: "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:border-slate-700",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-800/80"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>{children}</span>
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string, error?: string, hint?: string }> = ({ 
  label, 
  error, 
  hint,
  className = '', 
  ...props 
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300 ml-0.5">{label}</label>}
      <input 
        className={`w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-red-500/20 focus:border-blue-500 dark:focus:border-red-500 transition-all outline-none text-sm ${error ? 'border-red-500 ring-red-500/10' : ''} ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-[11px] text-slate-500 ml-0.5">{hint}</p>}
      {error && <p className="text-[11px] text-red-500 ml-0.5 font-medium">{error}</p>}
    </div>
  );
};

export const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-none ${className}`}>
    {children}
  </div>
);

export const Badge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    FROZEN: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    LOCKED: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    PENDING: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    DEPOSIT: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    WITHDRAWAL: "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20"
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${colors[status] || 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400'}`}>
      {status}
    </span>
  );
};
