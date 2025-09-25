// src/components/landing/PricingSection.jsx
import React from 'react';

const pricingPlans = [
  {
    title: "Starter",
    price: 9,
    period: "month",
    features: [
      "Up to 5 team members",
      "Basic task management",
      "File sharing",
    ],
  },
  {
    title: "Professional",
    price: 29,
    period: "month",
    features: [
      "Up to 20 team members",
      "Advanced task management",
      "Time tracking",
      "Basic analytics",
    ],
    popular: true,
  },
  {
    title: "Enterprise",
    price: 99,
    period: "month",
    features: [
      "Unlimited team members",
      "Custom workflows",
      "Advanced analytics",
      "Priority support",
    ],
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16">
          Simple, Transparent Pricing
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, idx) => (
            <div
              key={idx}
              className={`glass p-8 rounded-lg transition-all ${
                plan.popular ? "border-2 border-custom relative" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-custom text-white px-4 py-1 rounded-full text-sm">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-semibold mb-4">{plan.title}</h3>
              <p className="text-4xl font-bold mb-6">
                ${plan.price}
                <span className="text-lg font-normal text-gray-500">
                  /{plan.period}
                </span>
              </p>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feat, index) => (
                  <li key={index} className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    {feat}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-custom px-6 py-3 rounded-lg text-white hover:bg-purple-700 transition-colors">
                {plan.title === "Enterprise" ? "Contact Sales" : "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
