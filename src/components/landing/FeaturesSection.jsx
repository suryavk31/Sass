// src/components/landing/FeaturesSection.jsx
import React from 'react';

const features = [
  {
    title: "Task Management",
    description: "Organize and track tasks with ease using our intuitive interface and powerful automation tools.",
    image: "https://creatie.ai/ai/api/search-image?query=A%203D%20vector%20illustration%20of%20a%20modern%20task%20management%20interface%20with%20floating%20cards,%20checkboxes,%20and%20progress%20bars, rendered in purple and white",
  },
  {
    title: "Team Collaboration",
    description: "Work together seamlessly with real-time updates, comments, and file sharing capabilities.",
    image: "https://creatie.ai/ai/api/search-image?query=A%203D%20vector%20illustration%20of%20people%20avatars%20connected%20by%20glowing%20purple%20lines, representing team collaboration",
  },
  {
    title: "Time Tracking",
    description: "Monitor project progress and team productivity with advanced time tracking features.",
    image: "https://creatie.ai/ai/api/search-image?query=A%203D%20vector%20illustration%20of%20a%20modern%20clock%20interface%20with%20circular%20progress%20bars, rendered in purple and white",
  },
  {
    title: "Analytics",
    description: "Make data-driven decisions with comprehensive project analytics and insights.",
    image: "https://creatie.ai/ai/api/search-image?query=A%203D%20vector%20illustration%20of%20floating%20analytics%20charts,%20graphs,%20and%20data%20visualization, with purple gradient accents",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16">Powerful Features</h2>
        <div className="grid md:grid-cols-2 gap-12">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="glass p-8 rounded-lg hover:shadow-lg transition-all"
            >
              <div className="flex items-start">
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-32 h-32 object-contain ml-6"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
