// src/components/Login/LoginHeader.jsx
function LoginHeader() {
    return (
      <div>
        <img
          className="mx-auto h-12 w-auto"
          src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png"
          alt="Logo"
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-custom">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please sign in to your account
        </p>
      </div>
    );
  }
  
  export default LoginHeader;