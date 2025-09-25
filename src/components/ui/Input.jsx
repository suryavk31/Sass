// src/components/ui/Input.jsx
function Input({ id, label, icon, ...props }) {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className={`fas ${icon} text-gray-400`}></i>
          </div>
          <input
            id={id}
            className="block w-full pl-10 rounded-md border-gray-300 focus:ring-custom focus:border-custom sm:text-sm transition duration-150 ease-in-out"
            {...props}
          />
        </div>
      </div>
    );
  }
  
  export default Input;