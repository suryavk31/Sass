// src/components/landing/TestimonialsSection.jsx
import React from 'react';

const testimonials = [
  {
    name: "Sarah Johnson",
    title: "Product Manager at Tech Co",
    image: "https://creatie.ai/ai/api/search-image?query=A%20professional%20headshot%20of%20a%20confident%20female%20business%20executive",
    testimonial:
      "TaskFlow has revolutionized how our team manages projects. The intuitive interface and powerful features have significantly improved our productivity.",
  },
  {
    name: "Michael Chen",
    title: "CEO at StartUp Inc",
    image: "https://creatie.ai/ai/api/search-image?query=A%20professional%20headshot%20of%20a%20middle-aged%20male%20business%20professional",
    testimonial:
      "The analytics features have given us valuable insights into our project performance. We've been able to optimize our workflows and deliver better results.",
  },
  {
    name: "Emma Wilson",
    title: "Creative Director at Design Studio",
    image: "https://creatie.ai/ai/api/search-image?query=A%20professional%20headshot%20of%20a%20young%20creative%20professional",
    testimonial:
      "The collaboration features are outstanding. Our team can work together seamlessly, no matter where they're located. TaskFlow has become essential to our success.",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="glass p-8 rounded-lg">
              <div className="flex items-center mb-6">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h4 className="font-semibold">{t.name}</h4>
                  <p className="text-sm text-gray-500">{t.title}</p>
                </div>
              </div>
              <p className="text-gray-600">"{t.testimonial}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
