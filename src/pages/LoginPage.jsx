// src/pages/LoginPage.jsx
import LoginForm from '../components/Login/LoginForm';
import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <div className="h-screen w-full flex overflow-hidden bg-white text-slate-900 font-sans">
      
      {/* Left Side: Branding */}
      <div className="hidden lg:flex flex-col w-[45%] bg-[#1e252e] relative overflow-hidden shrink-0">
          {/* Visual Glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#7b68ee]/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#ff007f]/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col h-full p-12 lg:p-16 text-white justify-between">
              <div>
                  <div className="flex items-center gap-3 mb-16">
                      <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
                          <span className="text-xl font-black text-white">S</span>
                      </div>
                      <span className="text-2xl font-black tracking-tight">SaaS App</span>
                  </div>
                  
                  <div className="max-w-md">
                      <h1 className="text-4xl xl:text-5xl font-bold tracking-tight mb-6 leading-tight">
                          Manage your <br/>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7b68ee] to-purple-400">entire business</span>
                      </h1>
                      <p className="text-lg text-slate-400 leading-relaxed font-medium">
                          Log back into your premium workspace to pick up right where you left off.
                      </p>
                  </div>
              </div>
          </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative flex justify-center">
        <div className="w-full max-w-sm px-8 py-12 flex flex-col justify-center min-h-full m-auto">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10 justify-center">
              <div className="w-8 h-8 bg-[#7b68ee] rounded-lg flex items-center justify-center">
                  <span className="text-base font-black text-white">S</span>
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">SaaS App</span>
          </div>

          <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Welcome back</h2>
              <p className="text-slate-500 font-medium">Sign in to your account to continue.</p>
          </div>

          <LoginForm />
          
          <p className="text-center text-slate-500 mt-8 font-medium text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#7b68ee] hover:text-[#6a5acd] font-bold transition-colors">
                  Sign up
              </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;