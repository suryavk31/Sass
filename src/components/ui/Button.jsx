// src/components/ui/Button.jsx
function Button({ children, className = '', ...props }) {
    return (
      <button
        className={`flex justify-center py-2.5 px-4 rounded-md text-white bg-custom hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
  
  export default Button;