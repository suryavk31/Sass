// src/pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../actions/authActions';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [validationError, setValidationError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, userInfo } = useSelector((state) => state.user || {});

    useEffect(() => {
        if (userInfo) {
            navigate(`/${userInfo.user?.id || userInfo.id}/dashboard`);
        }
    }, [navigate, userInfo]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setValidationError('Passwords do not match');
        }
        setValidationError('');
        dispatch(register(formData.name, formData.email, formData.password));
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 premium-gradient relative overflow-hidden">
            {/* Animated background glows */}
            <div className="absolute top-[-15%] right-[-15%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-15%] left-[-15%] w-[50%] h-[50%] bg-violet-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }}></div>

            <div className="max-w-2xl w-full glass-card p-12 rounded-[2.5rem] shadow-2xl relative z-10 border border-white/30 backdrop-blur-2xl">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/10 mb-6 border border-white/20 shadow-lg">
                        <i className="fas fa-user-plus text-white text-3xl"></i>
                    </div>
                    <h2 className="text-4xl font-extrabold text-white tracking-tight">Join the Revolution</h2>
                    <p className="mt-3 text-white/60 font-medium text-lg">Scale your team with the world's most advanced SaaS OS.</p>
                </div>

                {(error || validationError) && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-100 text-sm font-bold animate-fade-in flex items-center gap-3">
                        <i className="fas fa-exclamation-circle text-lg"></i>
                        {error || validationError}
                    </div>
                )}

                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            label="Legal Full Name"
                            icon="fa-user"
                            placeholder="Alex Rivera"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                        />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            label="Business Email"
                            icon="fa-envelope"
                            placeholder="alex@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            label="Secure Password"
                            icon="fa-lock"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                        />
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            label="Verify Password"
                            icon="fa-shield-alt"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                        />
                    </div>

                    <div className="pt-2">
                        <Button type="submit" disabled={loading} className="w-full py-4 rounded-2xl text-lg font-extrabold shadow-2xl shadow-purple-900/40 transform active:scale-[0.98] transition-all">
                            {loading ? 'Processing...' : 'Initialize Onboarding'}
                        </Button>
                    </div>

                    <p className="text-center text-white/60 font-semibold mt-10">
                        Already part of the enterprise?{' '}
                        <Link to="/login" className="text-white hover:text-brand-300 underline decoration-brand-500/50 underline-offset-8 transition-colors">
                            Sign in here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
