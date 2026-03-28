// src/components/landing/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Twitter,
  LinkedIn,
  GitHub,
  RocketLaunchRounded
} from '@mui/icons-material';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 py-24 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-16 lg:gap-24 mb-20">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-8 group">
              <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <RocketLaunchRounded className="text-white text-xl" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">TaskFlow</span>
            </Link>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">
              The high-density workspace for teams who demand precision, speed, and absolute reliability.
            </p>
            <div className="flex gap-4">
              {[Twitter, LinkedIn, GitHub].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-600 transition-all border border-slate-800">
                  <Icon sx={{ fontSize: 20 }} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-extrabold mb-8 uppercase tracking-[0.2em] text-xs">Product</h4>
            <ul className="space-y-4">
              {['Platform', 'Solutions', 'Capabilities', 'Resources'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-500 hover:text-white font-semibold transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-extrabold mb-8 uppercase tracking-[0.2em] text-xs">Infrastructure</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/developer-guide" className="text-slate-500 hover:text-white font-semibold transition-colors">
                  Developer Guide
                </Link>
              </li>
              {['Real-Time Sync', 'Integrations', 'Security'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-500 hover:text-white font-semibold transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-white font-extrabold mb-8 uppercase tracking-[0.2em] text-xs">Stay in Sync</h4>
            <p className="text-slate-500 font-medium mb-6 text-sm">Join 50,000+ engineers receiving our weekly engineering updates.</p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your work email"
                className="w-full px-5 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all font-medium"
              />
              <button className="premium-gradient w-full py-4 rounded-2xl font-extrabold text-white shadow-xl shadow-brand-500/20 hover:scale-105 active:scale-95 transition-all">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-600 font-bold text-sm tracking-tight">
            &copy; {new Date().getFullYear()} TaskFlow Intelligence Systems. Built with precision.
          </p>
          <div className="flex gap-8">
            {['Privacy Policy', 'Terms of Service', 'Security'].map((item) => (
              <a key={item} href="#" className="text-slate-600 hover:text-slate-400 font-bold text-sm transition-colors uppercase tracking-widest">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
