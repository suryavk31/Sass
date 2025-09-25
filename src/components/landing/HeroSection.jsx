// src/components/landing/HeroSection.jsx
import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 z-10">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-700">
              Transform Your Workflow
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Streamline your projects, boost team collaboration, and achieve more with our intuitive project management solution.
            </p>
            <button className="bg-custom px-8 py-4 rounded-lg text-white text-lg hover:bg-purple-700 transition-colors">
              Start Free Trial
            </button>
          </div>
          <div className="md:w-1/2 relative mt-10 md:mt-0">
            <img
              src="https://ik.imagekit.io/oiuyqhecp/Landing%20page/hero.jpg?updatedAt=1741796135122"
              alt="Dashboard Preview"
              className="w-full h-auto relative z-20"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
