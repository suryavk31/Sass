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
          className={`block w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-2.5 rounded-xl border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-900 placeholder:text-slate-400 transition-all duration-200 sm:text-sm ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}

export default Input;