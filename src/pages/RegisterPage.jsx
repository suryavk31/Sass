import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { register, googleLogin } from '../actions/authActions';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

const TRACKING_SOURCES = [
  "Podcasts / Radio",
  "Software Review Sites",
  "TV / Streaming (Hulu, NBC, etc.)",
  "Friend / Colleague",
  "Reddit",
  "AI Tools (ChatGPT, Perplexity, etc.)",
  "LinkedIn",
  "TikTok",
  "YouTube",
  "Search Engine (Google, Bing, etc.)",
  "Facebook / Instagram",
  "Other"
];

function RegisterPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        companyName: '',
        howDidYouHear: ''
    });

    const [googleAuthData, setGoogleAuthData] = useState(null);
    const [validationError, setValidationError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const redirect = queryParams.get('redirect');
    const emailParam = queryParams.get('email');

    const { loading, error } = useSelector((state) => state.user || {});

    useEffect(() => {
        if (emailParam) {
            setFormData(prev => ({ ...prev, email: emailParam }));
        }
    }, [emailParam]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const token = await result.user.getIdToken();
            
            setValidationError('');
            const data = await dispatch(googleLogin(token));
            navigate(redirect || `/${data._id || data.id}/dashboard`);
        } catch (err) {
             if (err.requiresDetails) {
                 setGoogleAuthData(await auth.currentUser.getIdToken());
                 setValidationError("Please complete your profile to continue.");
                 setStep(1); 
             } else {
                 setValidationError(err.message || 'Google Auth failed');
             }
        }
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        
        if (!googleAuthData) {
            if (formData.password !== formData.confirmPassword) {
                return setValidationError('Passwords do not match');
            }
            if (formData.password.length < 6) {
                return setValidationError('Password must be at least 6 characters');
            }
        }
        
        if (!/^\+91[0-9]{10}$/.test(formData.phone)) {
            return setValidationError('Phone must be an Indian number starting with +91 and 10 digits');
        }
        if (!formData.companyName) {
            return setValidationError('Company name is required');
        }

        setValidationError('');
        setStep(2);
    };

    const handleSubmit = async () => {
        setValidationError('');
        
        try {
            if (googleAuthData) {
                const data = await dispatch(googleLogin(googleAuthData, formData.phone, formData.companyName, formData.howDidYouHear));
                navigate(redirect || `/${data._id || data.id}/dashboard`);
            } else {
                const data = await dispatch(register(formData.name, formData.email, formData.password, formData.phone, formData.companyName, formData.howDidYouHear));
                navigate(redirect || `/${data._id || data.id}/dashboard`);
            }
        } catch (err) {
            setValidationError(err.message || 'Error creating account');
        }
    };

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
                                Build better <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7b68ee] to-fuchsia-400">experiences</span>
                            </h1>
                            <p className="text-lg text-slate-400 leading-relaxed font-medium">
                                Join our platform to manage your business effectively. Everything you need to scale, delivered in one premium workspace.
                            </p>
                        </div>
                    </div>
                    
                    {/* Bottom Features Testimonial */}
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex -space-x-3">
                                {[1,2,3,4].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1e252e] bg-slate-700 flex items-center justify-center overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-semibold text-slate-300">Join 10,000+ teams</p>
                        </div>
                        <p className="text-sm text-slate-400 italic">"This platform transformed how we handle operations. Beautiful UI, seamless functionality."</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative flex justify-center">
                <div className="w-full max-w-md 2xl:max-w-lg px-8 py-12 flex flex-col justify-center min-h-full m-auto">
                    
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
                        <div className="w-8 h-8 bg-[#7b68ee] rounded-lg flex items-center justify-center">
                            <span className="text-base font-black text-white">S</span>
                        </div>
                        <span className="text-xl font-black tracking-tight text-slate-900">SaaS App</span>
                    </div>

                    <div className="mb-8">
                        {step === 1 && (
                            <div className="animate-fade-in">
                                <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
                                    {emailParam ? "Complete your profile" : "Create an account"}
                                </h2>
                                <p className="text-slate-500 font-medium">
                                    {emailParam ? "Follow these steps to join your new workspace." : "Get started with your dedicated workspace today."}
                                </p>
                            </div>
                        )}
                        {step === 2 && (
                            <div className="animate-fade-in">
                                <button
                                    onClick={() => setStep(1)}
                                    className="mb-4 flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                                >
                                    <i className="fas fa-arrow-left mr-2"></i> Back
                                </button>
                                <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Just one more thing</h2>
                                <p className="text-slate-500 font-medium">How did you hear about us?</p>
                            </div>
                        )}
                    </div>

                    {(error || validationError) && (
                        <div className="mb-6 p-4 bg-red-50/80 border border-red-200 rounded-xl text-red-600 text-sm font-bold flex items-center gap-3 animate-fade-in shadow-sm">
                            <i className="fas fa-exclamation-circle text-lg"></i>
                            {validationError || error}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="animate-fade-in">
                            {!googleAuthData && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleGoogleLogin}
                                        className="w-full flex justify-center items-center py-3 px-4 border border-slate-200 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] bg-white text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7b68ee] transition-all mb-6"
                                    >
                                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-[18px] w-[18px] mr-3" />
                                        Continue with Google
                                    </button>
                                    
                                    <div className="flex items-center mb-6">
                                        <div className="flex-1 border-t border-slate-200"></div>
                                        <span className="px-4 text-slate-400 text-xs font-bold uppercase tracking-widest">or register with email</span>
                                        <div className="flex-1 border-t border-slate-200"></div>
                                    </div>
                                </>
                            )}

                            <form className="space-y-4" onSubmit={handleNextStep}>
                                {!googleAuthData && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input id="name" name="name" type="text" label="Full Name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                                        <Input id="email" name="email" type="email" label="Work Email" placeholder="john@company.com" value={formData.email} onChange={handleChange} required />
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input id="companyName" name="companyName" type="text" label="Company Name" placeholder="Acme Inc" value={formData.companyName} onChange={handleChange} required />
                                    <Input id="phone" name="phone" type="text" label="Mobile Number" placeholder="+919876543210" value={formData.phone} onChange={handleChange} required />
                                </div>

                                {!googleAuthData && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input id="password" name="password" type="password" label="Password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                                        <Input id="confirmPassword" name="confirmPassword" type="password" label="Confirm Password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
                                    </div>
                                )}

                                <div className="pt-4">
                                    <Button type="submit" className="w-full py-3.5 rounded-xl text-[15px] font-bold shadow-lg shadow-[#7b68ee]/20 hover:shadow-[#7b68ee]/40 transition-shadow">
                                        Continue
                                    </Button>
                                </div>
                            </form>
                            
                            {!googleAuthData && (
                                <p className="text-center text-slate-500 mt-8 font-medium text-sm">
                                    Already have an account?{' '}
                                    <Link to="/log-in" className="text-[#7b68ee] hover:text-[#6a5acd] font-bold transition-colors">
                                        Log in
                                    </Link>
                                </p>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fade-in flex flex-col h-full">
                            <div className="flex flex-wrap gap-2.5 mb-8">
                                {TRACKING_SOURCES.map((source) => (
                                    <button
                                        key={source}
                                        onClick={() => setFormData({...formData, howDidYouHear: source})}
                                        className={`px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                                            formData.howDidYouHear === source 
                                            ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        {source}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="mt-4 pt-6 border-t border-slate-100 flex justify-end">
                                <Button 
                                    onClick={handleSubmit} 
                                    disabled={loading || !formData.howDidYouHear} 
                                    className="w-full md:w-auto px-8 py-3.5 rounded-xl font-bold text-[15px] shadow-lg shadow-[#7b68ee]/20 hover:shadow-[#7b68ee]/40"
                                >
                                    {loading ? 'Creating Account...' : 'Finish Setup'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
