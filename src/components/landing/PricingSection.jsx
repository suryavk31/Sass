// src/components/landing/PricingSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleRounded, StarRounded } from '@mui/icons-material';

const pricingPlans = [
  {
    title: "Starter",
    price: 9,
    period: "month",
    description: "Perfect for lightweight teams and freelancers.",
    features: [
      "Up to 5 team members",
      "Essential task management",
      "List & Kanban Views",
      "Secure file storage",
    ],
  },
  {
    title: "Professional",
    price: 29,
    period: "month",
    description: "Engineered for high-output growth teams.",
    features: [
      "Up to 20 team members",
      "Advanced automations",
      "Real-Time Socket Syncing",
      "Professional Analytics",
      "Role-Based Access Control",
    ],
    popular: true,
  },
  {
    title: "Enterprise",
    price: 99,
    period: "month",
    description: "The ultimate power for global organizations.",
    features: [
      "Unlimited everything",
      "Workflow Automations (Native)",
      "Developer APIs & Webhooks",
      "SOC2 Immutable Audit Logs",
      "Dedicated 24/7 Account Manager",
    ],
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-32 bg-[#f8fafc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-brand-600 font-bold uppercase tracking-[0.2em] text-sm mb-4">Investment</h2>
          <h3 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">Simple, Transparent, Professional.</h3>
          <p className="text-slate-500 text-lg font-medium">Scale with confidence. No hidden fees, no complexity. Just results.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan, idx) => (
            <div
              key={idx}
              className={`glass-card p-10 rounded-[3rem] transition-all duration-300 flex flex-col hover-scale border ${plan.popular
                  ? "border-brand-500/50 shadow-2xl shadow-brand-500/10 scale-105 z-10 ring-4 ring-brand-500/5 bg-white/50"
                  : "border-white/50 bg-white/30"
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 premium-gradient text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                  <StarRounded sx={{ fontSize: 16 }} /> Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">{plan.title}</h3>
                <p className="text-slate-500 font-medium text-sm">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-slate-900">${plan.price}</span>
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-5 mb-10 flex-1">
                {plan.features.map((feat, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircleRounded className="text-emerald-500 shrink-0" sx={{ fontSize: 20 }} />
                    <span className="text-slate-600 font-semibold text-sm leading-tight">{feat}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate(`/register?plan=${plan.title.toLowerCase()}`)}
                className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${plan.popular
                    ? 'premium-gradient text-white shadow-xl shadow-brand-500/20 hover:scale-[1.02] active:scale-95'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm'
                  }`}
              >
                Assemble Team
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
