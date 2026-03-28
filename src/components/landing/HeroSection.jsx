// src/components/landing/HeroSection.jsx
import { Link } from 'react-router-dom';
import { ArrowForwardRounded, PlayCircleFilledRounded, TaskAltRounded } from '@mui/icons-material';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 bg-[#f8fafc]">
      {/* Animated Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20 lg:mb-32">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-sm font-bold mb-8 animate-fade-in shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            Enterprise v2.0 is now live
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
            The Operating System for <span className="text-transparent bg-clip-text premium-gradient">Modern Teams.</span>
          </h1>
          <p className="text-xl text-slate-600 font-medium leading-relaxed mb-12 px-4">
            A high-density workspace with Real-Time WebSockets, Workflow Automations, Developer APIs, and Immutable Audit Logs. Built for scale.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/register" className="premium-gradient px-10 py-5 rounded-2xl font-bold text-white hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-purple-500/30 flex items-center gap-2 text-lg">
              Start Building Free <ArrowForwardRounded />
            </Link>
            <button className="bg-white px-10 py-5 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 border border-slate-200 transition-all shadow-lg flex items-center gap-2 text-lg">
              <PlayCircleFilledRounded className="text-brand-600" /> Watch Demo
            </button>
          </div>
        </div>

        {/* Dashboard Preview Component */}
        <div className="relative mx-auto max-w-6xl animate-fade-in">
          <div className="relative glass-card p-2 rounded-[2rem] shadow-2xl shadow-indigo-500/10 border border-white/50 backdrop-blur-2xl">
            <div className="rounded-[1.5rem] overflow-hidden bg-slate-100">
              <img
                src="https://ik.imagekit.io/oiuyqhecp/Landing%20page/hero.jpg?updatedAt=1741796135122"
                alt="TaskFlow Dashboard"
                className="w-full h-auto"
              />
            </div>
          </div>
          {/* Decorative floating elements */}
          <div className="hidden lg:block absolute -left-12 top-1/2 glass-card p-4 rounded-2xl shadow-xl animate-bounce" style={{ animationDuration: '4s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TaskAltRounded />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 font-bold uppercase tracking-widest leading-none">Status</p>
                <p className="text-sm font-extrabold text-slate-900">Task Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
