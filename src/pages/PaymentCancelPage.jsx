import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorOutlineRounded } from '@mui/icons-material';

const PaymentCancelPage = () => {
    const navigate = useNavigate();

    const handleReturn = () => {
        const userStr = localStorage.getItem('userInfo');
        if (userStr) {
            const user = JSON.parse(userStr);
            navigate(`/${user.id}/invoices`);
        } else {
            navigate(`/log-in`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-10 rounded-[2rem] shadow-xl text-center max-w-md w-full border border-slate-100">
                <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
                    <ErrorOutlineRounded sx={{ fontSize: 48 }} />
                </div>
                <h1 className="text-2xl font-black text-slate-900 mb-2">Payment Cancelled</h1>
                <p className="text-slate-500 font-medium text-sm mb-8">
                    Your payment was not completed. No charges were made.
                </p>
                <button 
                    onClick={handleReturn}
                    className="w-full bg-[#7b68ee] text-white hover:bg-[#6c58e0] px-5 py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#7b68ee]/20"
                >
                    Return to Invoices
                </button>
            </div>
        </div>
    );
};

export default PaymentCancelPage;
