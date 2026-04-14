function Input({ id, label, icon, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1.5 ml-0.5">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-600 text-slate-400">
            <i className={`fas ${icon}`}></i>
          </div>
        )}
        <input
          id={id}
          className={`block w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#7b68ee]/20 focus:border-[#7b68ee] text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-200 sm:text-sm ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}

export default Input;