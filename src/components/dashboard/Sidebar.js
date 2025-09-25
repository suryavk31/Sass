// src/components/dashboard/Sidebar.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Assignment, CalendarToday, People, BarChart, SupervisorAccount } from '@mui/icons-material';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem('userId');

  // Helper to check if the current route is active
  const isActive = (routeSegment) => {
    return location.pathname.includes(routeSegment);
  };

  // Define a button component for reuse
  const NavButton = ({ route, Icon, label }) => {
    const active = isActive(route);
    return (
      <button
        onClick={() => navigate(`/${userId}/${route}`)}
        className={`flex items-center w-full px-4 py-2 text-sm font-bold rounded-md transition-colors ${
          active
            ? "bg-purple-200 text-purple-800"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        <Icon className="w-6 h-6 mr-3" />
        {label}
      </button>
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200">
        <img
          src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png"
          alt="Logo"
          className="h-8"
        />
      </div>
      <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Main Section */}
        <h3 className="text-lg font-bold text-purple-700 mb-2">Main</h3>
        <NavButton route="dashboard" Icon={Home} label="Dashboard" />
        <NavButton route="projects" Icon={Assignment} label="Projects" />

        {/* Management Section */}
        <h3 className="text-lg font-bold text-purple-700 mt-4 mb-2">Management</h3>
        <NavButton route="employee" Icon={Assignment} label="Employee" />

        {/* Role Management Section */}
        <h3 className="text-lg font-bold text-purple-700 mt-4 mb-2">Role Management</h3>
        <NavButton route="create-role" Icon={SupervisorAccount} label="Create Role" />
        <NavButton route="roles" Icon={SupervisorAccount} label="Roles" />

        {/* Calendar Section */}
        <h3 className="text-lg font-bold text-purple-700 mt-4 mb-2">Calendar</h3>
        <NavButton route="calendar" Icon={CalendarToday} label="Calendar" />

        {/* Team & Reports Section */}
        <h3 className="text-lg font-bold text-purple-700 mt-4 mb-2">Team & Reports</h3>
        <NavButton route="team" Icon={People} label="Team" />
        <NavButton route="reports" Icon={BarChart} label="Reports" />
        {/* Team & Reports Section */}
        <h3 className="text-lg font-bold text-purple-700 mt-4 mb-2">Team Space</h3>
        <NavButton route="workspaces" Icon={People} label="Workspaces" />
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <img
            src="https://creatie.ai/ai/api/search-image?query=A professional headshot of a young business person with a friendly smile, wearing a suit, against a plain light background&width=40&height=40&orientation=squarish&flag=2e8d8ffb-e233-4156-a44d-ba9b79692cad"
            className="rounded-full w-10 h-10"
            alt="Profile"
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">John Smith</p>
            <p className="text-xs text-gray-500">Project Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
