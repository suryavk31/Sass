// src/pages/LoginPage.jsx
import LoginForm from '../components/Login/LoginForm';

function LoginPage() {
  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-sm">
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;