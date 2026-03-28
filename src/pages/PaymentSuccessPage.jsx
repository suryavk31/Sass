import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircleRounded } from '@mui/icons-material';
import axios from 'axios';

const PaymentSuccessPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    useEffect(() => {
        // Option to verify session on backend, but webhook handles the source of truth
        const timer = setTimeout(() => {
            const userStr = localStorage.getItem('userInfo');
            if (userStr) {
                const user = JSON.parse(userStr);
                navigate(`/${user.id}/invoices`);
            } else {
                navigate(`/log-in`);
            }
        }, 4000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-10 rounded-[2rem] shadow-xl text-center max-w-md w-full border border-slate-100">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                    <CheckCircleRounded sx={{ fontSize: 48 }} />
                </div>
                <h1 className="text-2xl font-black text-slate-900 mb-2">Payment Successful!</h1>
                <p className="text-slate-500 font-medium text-sm mb-8">
                    Your invoice has been marked as paid. Thank you for your business.
                </p>
                <div className="flex justify-center">
                    <div className="animate-pulse flex gap-2 items-center text-xs font-bold text-slate-400">
                        <span>Redirecting to dashboard...</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
