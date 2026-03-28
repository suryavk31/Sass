// src/pages/LoginPage.jsx
import LoginForm from '../components/Login/LoginForm';

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 premium-gradient relative overflow-hidden">
      {/* Animated background glows */}
      <div className="absolute top-[-15%] left-[-15%] w-[50%] h-[50%] bg-violet-500/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-xl w-full glass-card p-12 rounded-[2.5rem] shadow-2xl relative z-10 border border-white/30 backdrop-blur-2xl">
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;