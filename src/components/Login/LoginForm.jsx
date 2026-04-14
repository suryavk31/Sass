// src/components/Login/LoginForm.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { login, googleLogin } from '../../actions/authActions';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.user || {});

  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get('redirect');

  const handleGoogleLogin = async () => {
    try {
        setLocalError('');
        const result = await signInWithPopup(auth, googleProvider);
        const token = await result.user.getIdToken();
        const data = await dispatch(googleLogin(token));
        
        localStorage.setItem('userId', data._id || data.id);
        navigate(redirect || `/${data._id || data.id}/dashboard`);
    } catch (err) {
        if (err.requiresDetails) {
             setLocalError("Your Google account is not registered yet. Please sign up to continue.");
        } else {
             setLocalError(err.message || 'Google Auth failed');
        }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    dispatch(login(formData.email, formData.password))
      .then((data) => {
        localStorage.setItem('userId', data._id || data.id);
        navigate(redirect || `/${data._id || data.id}/dashboard`);
      })
      .catch((err) => {
        console.error('Login failed:', err);
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      {(error || localError) && (
        <div className="mb-6 p-4 bg-red-50/80 border border-red-200 rounded-xl text-red-600 text-sm font-bold flex items-center gap-3 animate-fade-in shadow-sm">
            <i className="fas fa-exclamation-circle text-lg"></i>
            {localError || error}
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex justify-center items-center py-3.5 px-4 border border-slate-200 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] bg-white text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7b68ee] transition-all mb-6"
      >
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-[18px] w-[18px] mr-3" />
        Continue with Google
      </button>

      <div className="w-full flex items-center mb-6">
         <div className="flex-1 border-t border-slate-200"></div>
         <span className="px-4 text-slate-400 text-xs font-bold uppercase tracking-widest">or sign in with email</span>
         <div className="flex-1 border-t border-slate-200"></div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          id="email"
          name="email"
          type="email"
          label="Work Email"
          icon="fa-envelope"
          placeholder="name@company.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <div className="relative">
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            icon="fa-lock"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <a href="#" className="absolute -top-1 right-1 text-xs font-semibold text-[#7b68ee] hover:text-[#6a5acd] transition-colors">
            Forgot?
          </a>
        </div>
        
        <div className="pt-2">
            <Button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl text-[15px] font-bold shadow-lg shadow-[#7b68ee]/20 hover:shadow-[#7b68ee]/40 transition-shadow">
              {loading ? 'Authenticating...' : 'Sign in'}
            </Button>
        </div>
      </form>
    </>
  );
}

export default LoginForm;
