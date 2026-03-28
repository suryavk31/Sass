// src/components/ui/Button.jsx
function Button({ children, className = '', variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-premium shadow-brand-200',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
    outline: 'bg-transparent border-2 border-brand-500 text-brand-600 hover:bg-brand-50',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100'
  };

  return (
    <button
      className={`flex items-center justify-center py-2.5 px-5 rounded-xl font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;