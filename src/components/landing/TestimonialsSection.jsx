// src/components/landing/TestimonialsSection.jsx
import React from 'react';
import { FormatQuoteRounded, StarRounded } from '@mui/icons-material';

const testimonials = [
  {
    name: "Sarah Johnson",
    title: "Product Engineering at AlphaTech",
    image: "https://creatie.ai/ai/api/search-image?query=A%20professional%20headshot%20of%20a%20confident%20female%20business%20executive",
    testimonial:
      "TaskFlow has revolutionized how our team manages projects. The intuitive interface and real-time syncing have slashed our delivery times by 30%.",
  },
  {
    name: "Michael Chen",
    title: "Engineering Director at ScaleUp",
    image: "https://creatie.ai/ai/api/search-image?query=A%20professional%20headshot%20of%20a%20middle-aged%20male%20business%20professional",
    testimonial:
      "The immutable audit logs and SOC2 compliance features made TaskFlow the only choice for our enterprise-grade project management needs.",
  },
  {
    name: "Emma Wilson",
    title: "Senior Architect at DesignFlow",
    image: "https://creatie.ai/ai/api/search-image?query=A%20professional%20headshot%20of%20a%20young%20creative%20professional",
    testimonial:
      "The custom workflow automations are incredible. We've automated 70% of our manual project updates, letting us focus on what we do best.",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h2 className="text-brand-600 font-bold uppercase tracking-[0.2em] text-sm mb-4">Wall of Love</h2>
          <h3 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">Trusted by the world's most innovative teams.</h3>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {testimonials.map((t, idx) => (
            <div key={idx} className="glass-card p-10 rounded-[2.5rem] border border-slate-100 shadow-xl relative group hover-scale">
              <div className="absolute -top-6 left-10 w-12 h-12 premium-gradient rounded-2xl flex items-center justify-center shadow-lg transform -rotate-12 group-hover:rotate-0 transition-transform">
                <FormatQuoteRounded className="text-white" />
              </div>

              <div className="flex gap-1 mb-6 mt-4">
                {[...Array(5)].map((_, i) => (
                  <StarRounded key={i} className="text-amber-400" sx={{ fontSize: 18 }} />
                ))}
              </div>

              <p className="text-slate-600 font-bold text-xl leading-relaxed italic mb-10">
                "{t.testimonial}"
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-brand-100 p-0.5">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 leading-none mb-1">{t.name}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 pt-16 border-t border-slate-50 flex flex-wrap items-center justify-center gap-12 lg:gap-24 opacity-30 grayscale">
          <span className="text-2xl font-black text-slate-900 tracking-tighter">ALPHATECH</span>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">SCALEUP</span>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">DESIGNFLOW</span>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">SYSTEMIC</span>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
