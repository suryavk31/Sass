// src/components/landing/FeaturesSection.jsx
import React from 'react';
import {
  AutoFixHighRounded,
  CodeRounded,
  HistoryEduRounded,
  BoltRounded
} from '@mui/icons-material';

const features = [
  {
    title: "Workflow Automations",
    description: "Build 'If This, Then That' rules natively. Automatically update task statuses, alert team members, and log actions the moment conditions are met.",
    Icon: AutoFixHighRounded,
    color: "violet",
  },
  {
    title: "Developer APIs & Webhooks",
    description: "Generate secure API keys to connect your internal scripts, or configure Webhooks to sync task statuses directly from external systems.",
    Icon: CodeRounded,
    color: "blue",
  },
  {
    title: "Immutable Integrity Logs",
    description: "Ensure SOC2 compliance with an unalterable, searchable history of every action taken within your workspace across all models.",
    Icon: HistoryEduRounded,
    color: "emerald",
  },
  {
    title: "Real-Time Architecture",
    description: "Powered by Redis and BullMQ, our architecture ensures zero-delay socket syncing across unlimited connections without latency.",
    Icon: BoltRounded,
    color: "amber",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#f8fafc] to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-brand-600 font-bold uppercase tracking-[0.2em] text-sm mb-4">Core Infrastructure</h2>
          <h3 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">Built for scale, engineered for precision.</h3>
          <p className="text-slate-500 text-lg font-medium leading-relaxed">Unlike generic tools, Bivith provides the mission-critical systems your enterprise needs to ship faster and stay compliant.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="glass-card p-10 rounded-[2.5rem] border border-white/50 hover-scale cursor-default group"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-${feature.color}-50 text-${feature.color}-600 group-hover:scale-110 group-hover:shadow-lg transition-all shadow-sm`}>
                <feature.Icon sx={{ fontSize: 32 }} />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-4 group-hover:text-brand-600 transition-colors leading-tight">
                {feature.title}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed text-lg italic">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
