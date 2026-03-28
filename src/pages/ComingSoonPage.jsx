import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ComingSoonPage = ({ title }) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
      <div className="glass-card p-10 rounded-3xl text-center max-w-md w-full border border-white/20 shadow-xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 transform object-hover">
            <i className="fas fa-rocket text-white text-3xl"></i>
          </div>
          
          <h2 className="text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">{title}</h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-8">
            We are working hard to bring you this feature. Stay tuned for the next major update!
          </p>

          <button 
            onClick={() => navigate(`/${userId}/dashboard`)}
            className="px-8 py-3 bg-[#7b68ee] text-white font-black text-[12px] rounded-2xl shadow-xl shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all tracking-widest uppercase"
          >
            Back to Mission Control
          </button>
          
          <div className="mt-12 pt-6 border-t border-slate-200/50 w-full flex justify-center space-x-2 [&>div]:w-2 [&>div]:h-2 [&>div]:bg-purple-400 [&>div]:rounded-full [&>div]:animate-bounce">
            <div style={{ animationDelay: '0s' }}></div>
            <div style={{ animationDelay: '0.15s' }}></div>
            <div style={{ animationDelay: '0.3s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
