// src/components/landing/LandingHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const LandingHeader = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Glass effect using opacity and backdrop blur */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg mt-4 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png"
              alt="TaskFlow"
              className="h-8"
            />
            <div className="hidden md:flex items-center ml-10 space-x-8">
              <a href="#features" className="hover-glass px-4 py-2 rounded-lg text-gray-700 text-lg">
                Features
              </a>
              <a href="#pricing" className="hover-glass px-4 py-2 rounded-lg text-gray-700 text-lg">
                Pricing
              </a>
              <a href="#testimonials" className="hover-glass px-4 py-2 rounded-lg text-gray-700 text-lg">
                Testimonials
              </a>
              <a href="#contact" className="hover-glass px-4 py-2 rounded-lg text-gray-700 text-lg">
                Contact
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="glass px-6 py-2 rounded-lg text-gray-700 hover:bg-purple-50 transition-colors">
              Login
            </button>
            <button className="bg-custom px-6 py-2 rounded-lg text-white hover:bg-purple-700 transition-colors">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LandingHeader;
