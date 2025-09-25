// src/components/calendar/CalendarHeader.jsx
import React from 'react';

const CalendarHeader = ({ currentMonth, onPrevious, onNext, onToday, view, onViewChange }) => {
  return (
    <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center mb-6">
      <div className="flex items-center space-x-4">
        <button onClick={onPrevious} className="p-2 hover:bg-gray-100 rounded-full">
          <i className="fas fa-chevron-left text-gray-600"></i>
        </button>
        <h2 className="text-xl font-semibold">{currentMonth}</h2>
        <button onClick={onNext} className="p-2 hover:bg-gray-100 rounded-full">
          <i className="fas fa-chevron-right text-gray-600"></i>
        </button>
      </div>
      <div className="flex items-center space-x-3 mt-4 md:mt-0">
        <button onClick={onToday} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm font-medium rounded">
          Today
        </button>
        <select
          value={view}
          onChange={(e) => onViewChange(e.target.value)}
          className="bg-white border border-gray-300 text-sm px-3 py-2 pr-8 rounded appearance-none focus:ring-custom focus:border-custom"
        >
          <option value="month">Month</option>
          <option value="week">Week</option>
          <option value="day">Day</option>
        </select>
      </div>
    </div>
  );
};

export default CalendarHeader;
