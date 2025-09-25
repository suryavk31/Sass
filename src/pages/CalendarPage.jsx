// src/pages/CalendarPage.jsx
import React, { useState } from 'react';
import CalendarHeader from '../components/calendar/CalendarHeader';
import CalendarView from '../components/calendar/CalendarView';
import UpcomingEvents from '../components/calendar/UpcomingEvents';
import KeyboardShortcuts from '../components/calendar/KeyboardShortcuts';

const dummyCalendarEvents = [
  {
    title: 'Team Meeting',
    start: new Date(2024, 8, 16, 10, 0),
    end: new Date(2024, 8, 16, 11, 0),
    color: '#4F46E5',
  },
  {
    title: 'Project Review',
    start: new Date(2024, 8, 26, 14, 0),
    end: new Date(2024, 8, 26, 15, 0),
    color: '#10B981',
  },
  {
    title: 'Client Meeting',
    start: new Date(2024, 9, 2, 11, 30),
    end: new Date(2024, 9, 2, 12, 30),
    color: '#F59E0B',
  },
];

const upcomingEvents = [
  { title: 'Team Meeting', date: 'Sep 16, 10:00 AM', color: '#4F46E5' },
  { title: 'Project Review', date: 'Sep 26, 2:00 PM', color: '#10B981' },
  { title: 'Client Meeting', date: 'Oct 2, 11:30 AM', color: '#F59E0B' },
];

const CalendarPage = () => {
  const [view, setView] = useState('month');
  const currentMonth = 'September 2024'; // This can be dynamically computed later

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Main Content */}
      <main className="flex-1 max-w-8xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Left Column: Calendar */}
        <div className="flex-1">
          <CalendarHeader
            currentMonth={currentMonth}
            onPrevious={() => console.log('Previous month')}
            onNext={() => console.log('Next month')}
            onToday={() => console.log('Today')}
            view={view}
            onViewChange={setView}
          />
          <CalendarView events={dummyCalendarEvents} view={view} />
        </div>

        {/* Right Column: Upcoming Events & Keyboard Shortcuts */}
        <div className="w-full md:w-80 flex-shrink-0 space-y-6">
          <UpcomingEvents events={upcomingEvents} />
          <KeyboardShortcuts />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex justify-between items-center text-sm text-gray-500">
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-900">Contact</a>
              <a href="#" className="hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900">Terms of Service</a>
            </div>
            <div>
              <p>© 2024 Calendar App. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CalendarPage;
