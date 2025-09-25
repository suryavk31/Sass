// src/components/landing/CTASection.jsx
import React from 'react';

const CTASection = () => {
  return (
    <section className="py-20 bg-custom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-8">
          Ready to Transform Your Workflow?
        </h2>
        <p className="text-xl text-purple-100 mb-12">
          Join thousands of teams already using TaskFlow to improve their productivity
        </p>
        <button className="glass px-8 py-4 rounded-lg text-white text-lg hover:bg-white hover:text-custom transition-colors">
          Start Your Free Trial
        </button>
      </div>
    </section>
  );
};

export default CTASection;
