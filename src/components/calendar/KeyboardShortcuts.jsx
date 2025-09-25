// src/components/calendar/KeyboardShortcuts.jsx
import React from 'react';

const KeyboardShortcuts = () => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold">Keyboard Shortcuts</h3>
      </div>
      <div className="p-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Previous month</span>
          <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">←</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Next month</span>
          <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">→</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Today</span>
          <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">T</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">New event</span>
          <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">N</span>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
