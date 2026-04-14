// src/components/landing/CTASection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowForwardRounded, AutoAwesomeRounded } from '@mui/icons-material';

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 premium-gradient opacity-95"></div>
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-card p-12 md:p-20 rounded-[3rem] border border-white/30 text-center shadow-2xl backdrop-blur-3xl overflow-hidden relative group">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-bold mb-8">
            <AutoAwesomeRounded className="text-brand-300" />
            Join 2,500+ high-growth companies
          </div>

          <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 tracking-tighter leading-tight italic">
            Ready to <span className="underline decoration-brand-400 decoration-8 underline-offset-8">accelerate?</span>
          </h2>

          <p className="text-xl text-brand-100 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
            Stop juggling tools and start shipping. Bivith gives you the unified visibility and control needed to scale without friction.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/register" className="bg-white px-12 py-5 rounded-2xl font-black text-slate-900 hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-2 text-lg">
              Start Your Free Trial <ArrowForwardRounded />
            </Link>
            <Link to="/contact" className="px-10 py-5 rounded-2xl font-bold text-white hover:bg-white/10 border border-white/20 transition-all flex items-center gap-2 text-lg">
              Talk to Engineering
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
