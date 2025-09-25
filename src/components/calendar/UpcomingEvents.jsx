// src/components/calendar/UpcomingEvents.jsx
import React from 'react';

const UpcomingEvents = ({ events }) => {
  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold">Upcoming Events</h3>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div
                className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                style={{ backgroundColor: event.color }}
              ></div>
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-gray-500">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 bg-custom text-white py-2 px-4 rounded hover:bg-custom/90">
          Add Event
        </button>
      </div>
    </div>
  );
};

export default UpcomingEvents;
