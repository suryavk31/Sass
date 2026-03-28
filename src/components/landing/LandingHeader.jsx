// src/components/landing/LandingHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const LandingHeader = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3 flex items-center justify-between shadow-glass">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 premium-gradient rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <i className="fas fa-rocket text-white text-xs"></i>
              </div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">TaskFlow</span>
            </Link>
            <div className="hidden md:flex items-center space-x-1">
              {['Features', 'Pricing', 'Integrations'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-brand-600 hover:bg-brand-50/50 rounded-xl transition-all">
                  {item}
                </a>
              ))}
              <Link to="/developer-guide" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-brand-600 hover:bg-brand-50/50 rounded-xl transition-all">
                Developers
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-6 py-2.5 text-sm font-bold text-slate-700 hover:text-brand-600 transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="premium-gradient px-7 py-2.5 rounded-xl text-sm font-bold text-white shadow-xl shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all">
              Launch Free
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LandingHeader;
