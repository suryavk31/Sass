// src/pages/InvitePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    ArrowForwardRounded,
    ErrorOutlineRounded,
    VisibilityRounded,
    VisibilityOffRounded,
    BusinessRounded,
    CheckCircleRounded
} from '@mui/icons-material';
import axiosInstance from '../utils/axiosInstance';
import { registerAndAcceptInvite, login } from '../actions/authActions';
import toast from 'react-hot-toast';

const InvitePage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.user || {});

    // Invite State
    const [loading, setLoading] = useState(true);
    const [inviteData, setInviteData] = useState(null);
    const [error, setError] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAccepting, setIsAccepting] = useState(false);

    useEffect(() => {
        const fetchInvite = async () => {
            try {
                const { data } = await axiosInstance.get(`/api/invitations/${token}`);
                setInviteData(data);
                if (userInfo && userInfo.email === data.email) {
                    // Pre-auth state handle?
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Invalid or expired invitation link');
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchInvite();
    }, [token, userInfo]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const userData = await dispatch(registerAndAcceptInvite(formData.name, formData.password, token));
            toast.success('Welcome aboard!');
            navigate(`/${userData.id || userData._id}/dashboard`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to join workspace');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAcceptExisting = async () => {
        setIsAccepting(true);
        try {
            await axiosInstance.post('/api/invitations/accept', { token });
            toast.success('Successfully joined the workspace!');
            navigate(`/${userInfo.id || userInfo._id}/dashboard`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to accept invitation');
        } finally {
            setIsAccepting(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7b68ee]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#fafafa] p-6 relative">
                 <div className="absolute top-0 left-0 w-full h-full opacity-50 pointer-events-none">
                    <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-violet-400 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[10%] right-[10%] w-64 h-64 bg-orange-200 rounded-full blur-[120px]"></div>
                </div>
                <div className="max-w-md w-full bg-white rounded-[40px] shadow-[0_24px_50px_rgba(0,0,0,0.06)] p-12 text-center border border-slate-100 relative z-10">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
                        <ErrorOutlineRounded sx={{ fontSize: 40 }} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Invitation Error</h1>
                    <p className="text-slate-500 font-medium mb-10 leading-relaxed text-sm">{error}</p>
                    <Link to="/" className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white text-[13px] font-black rounded-3xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
                        RETURN HOME
                    </Link>
                </div>
            </div>
        );
    }

    const emailMismatch = userInfo && userInfo.email !== inviteData.email;

    return (
        <div className="min-h-screen w-full flex flex-col bg-white font-sans relative overflow-x-hidden">
            {/* Soft Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-gradient-to-br from-violet-200/40 to-transparent rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-gradient-to-tr from-orange-100/40 to-transparent rounded-full blur-[100px]"></div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-[480px]">
                    
                    {/* Header: Logo & Title */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-14 h-14 mb-8 relative">
                           {/* Custom Hexagon-style Logo Placeholder from image */}
                           <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-pink-500 to-orange-400 rounded-[18px] rotate-45 shadow-lg shadow-pink-500/20"></div>
                           <div className="absolute inset-[3px] bg-white rounded-[15px] rotate-45 flex items-center justify-center">
                                <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-br from-violet-600 to-pink-500 -rotate-45">S</span>
                           </div>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                            {userInfo ? 'Welcome back!' : 'Seconds to sign up!'}
                        </h1>
                        <p className="text-slate-500 font-medium text-sm">
                            {userInfo 
                                ? `Ready to join ${inviteData.workspaceName}?` 
                                : <span>Already have an account? <Link to="/log-in" className="text-violet-600 font-bold hover:underline">Sign in</Link></span>
                            }
                        </p>
                    </div>

                    <div className="bg-white rounded-[48px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-slate-50 relative overflow-hidden">
                        
                        <div className="p-10 lg:p-12">
                            {userInfo ? (
                                /* Logged-in View: Simple Acceptance */
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-violet-600 shadow-sm">
                                                <BusinessRounded />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">INVITING YOU TO</div>
                                                <div className="text-lg font-black text-slate-900 tracking-tight">{inviteData.workspaceName}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                                            <CheckCircleRounded sx={{ fontSize: 16, color: '#10b981' }} />
                                            <span>As <span className="font-bold text-slate-700">{inviteData.roleName}</span></span>
                                        </div>
                                    </div>

                                    {emailMismatch ? (
                                        <div className="bg-orange-50/80 rounded-3xl p-6 border border-orange-100">
                                            <p className="text-[13px] text-orange-800 leading-relaxed font-medium mb-5">
                                                This invitation was sent to <span className="font-bold underline">{inviteData.email}</span>, 
                                                but you're logged in as <span className="font-bold underline">{userInfo.email}</span>.
                                            </p>
                                            <button 
                                                onClick={() => navigate('/log-in')} 
                                                className="w-full py-4 bg-orange-600 text-white text-[13px] font-black rounded-2xl hover:bg-orange-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20"
                                            >
                                                SWITCH ACCOUNT
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleAcceptExisting}
                                            disabled={isAccepting}
                                            className="w-full py-5 bg-slate-900 text-white text-base font-black rounded-[24px] shadow-2xl shadow-slate-900/30 hover:scale-[1.02] hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                                        >
                                            {isAccepting ? 'JOINING...' : 'Join Workspace'}
                                            {!isAccepting && <ArrowForwardRounded />}
                                        </button>
                                    )}
                                </div>
                            ) : (
                                /* Guest View: Streaming Registration as per image */
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                    <button className="w-full flex justify-center items-center py-4 px-4 border border-slate-200 rounded-2xl shadow-sm bg-white text-slate-700 font-bold hover:bg-slate-50 transition-all group">
                                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-4" />
                                        Continue with Google
                                    </button>

                                    <div className="flex items-center gap-4 py-2">
                                        <div className="flex-1 h-px bg-slate-100"></div>
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">or</span>
                                        <div className="flex-1 h-px bg-slate-100"></div>
                                    </div>

                                    <form onSubmit={handleJoin} className="space-y-4">
                                        <div className="space-y-1.5">
                                            <div className="bg-slate-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-500/20 border border-slate-100 rounded-2xl px-5 py-4 transition-all">
                                                <input 
                                                    id="name"
                                                    name="name"
                                                    type="text" 
                                                    placeholder="Full name" 
                                                    required 
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full bg-transparent border-none p-0 outline-none text-slate-900 font-medium placeholder:text-slate-400"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="bg-slate-50 opacity-60 border border-slate-100 rounded-2xl px-5 py-4 cursor-not-allowed">
                                                <input 
                                                    type="email" 
                                                    value={inviteData.email} 
                                                    disabled 
                                                    className="w-full bg-transparent border-none p-0 outline-none text-slate-500 font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="bg-slate-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-500/20 border border-slate-100 rounded-2xl px-5 py-4 transition-all flex items-center">
                                                <input 
                                                    id="password"
                                                    name="password"
                                                    type={showPassword ? 'text' : 'password'} 
                                                    placeholder="Password" 
                                                    required 
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="flex-1 bg-transparent border-none p-0 outline-none text-slate-900 font-medium placeholder:text-slate-400"
                                                />
                                                <button 
                                                    type="button" 
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="text-slate-400 hover:text-slate-600 transition-colors ml-3"
                                                >
                                                    {showPassword ? <VisibilityOffRounded sx={{ fontSize: 18 }} /> : <VisibilityRounded sx={{ fontSize: 18 }} />}
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-5 bg-[#8b8df3] text-white text-base font-black rounded-[24px] shadow-xl shadow-indigo-500/20 hover:scale-[1.02] hover:bg-[#7b7df2] transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
                                        >
                                            {isSubmitting ? 'Joining...' : 'Join Workspace'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-12 text-center">
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-sm mx-auto">
                            By continuing, you agree to our <a href="#" className="font-bold underline">Terms of Service</a> and <a href="#" className="font-bold underline">Privacy Policy</a>. Need help?
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default InvitePage;
