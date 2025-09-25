// src/pages/ProjectPage.jsx
import React, { useState } from 'react';

const dummyProjects = [
  {
    id: 1,
    title: 'Website Redesign',
    status: 'In Progress',
    description: 'Complete overhaul of company website with modern design and improved UX',
    dateRange: 'Oct 1 - Dec 31',
    priority: 'High',
    progress: 75,
    teamImages: [
      'https://creatie.ai/ai/api/search-image?query=Professional%20headshot%20of%20a%20woman',
      'https://creatie.ai/ai/api/search-image?query=Professional%20headshot%20of%20a%20man',
      'https://creatie.ai/ai/api/search-image?query=Professional%20headshot%20of%20a%20person',
    ],
    additionalTeamCount: 2,
  },
  {
    id: 2,
    title: 'Mobile App Development',
    status: 'Completed',
    description: 'Develop a new mobile application for customer engagement and sales',
    dateRange: 'Jul 15 - Sep 30',
    priority: 'Medium',
    progress: 100,
    teamImages: [
      'https://creatie.ai/ai/api/search-image?query=Professional%20headshot%20of%20a%20woman',
      'https://creatie.ai/ai/api/search-image?query=Professional%20headshot%20of%20a%20man',
    ],
    additionalTeamCount: 1,
  },
  {
    id: 3,
    title: 'Marketing Campaign',
    status: 'On Hold',
    description: 'Q4 digital marketing campaign for product launch',
    dateRange: 'Nov 1 - Dec 31',
    priority: 'Low',
    progress: 30,
    teamImages: [
      'https://creatie.ai/ai/api/search-image?query=Professional%20headshot%20of%20a%20woman',
      'https://creatie.ai/ai/api/search-image?query=Professional%20headshot%20of%20a%20man',
    ],
    additionalTeamCount: 0,
  },
];

const ProjectPage = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleNewProjectSubmit = (e) => {
    e.preventDefault();
    // Implement project creation logic here
    setModalOpen(false);
  };

  return (
    <div className="">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="rounded-button bg-custom hover:bg-violet-600 text-white px-4 py-2 flex items-center gap-2"
          >
            <i className="fas fa-plus"></i>
            New Project
          </button>
        </div>
        {/* Search & Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-custom focus:border-custom"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <div className="flex gap-4">
              <select className="border border-gray-300 rounded-md focus:ring-custom focus:border-custom py-2 pl-3 pr-8">
                <option>All Status</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>On Hold</option>
              </select>
              <select className="border border-gray-300 rounded-md focus:ring-custom focus:border-custom py-2 pl-3 pr-8">
                <option>Priority</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <select className="border border-gray-300 rounded-md focus:ring-custom focus:border-custom py-2 pl-3 pr-8">
                <option>Sort by</option>
                <option>Date</option>
                <option>Name</option>
                <option>Priority</option>
              </select>
            </div>
          </div>
        </div>
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {project.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      project.status === 'In Progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : project.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <i className="far fa-calendar text-gray-400"></i>
                    <span className="text-sm text-gray-600">
                      {project.dateRange}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i
                      className="fas fa-flag"
                      style={{
                        color:
                          project.priority === 'High'
                            ? '#EF4444'
                            : project.priority === 'Medium'
                            ? '#F59E0B'
                            : '#10B981',
                      }}
                    ></i>
                    <span className="text-sm text-gray-600">
                      {project.priority} Priority
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex -space-x-2">
                    {project.teamImages.map((src, index) => (
                      <img
                        key={index}
                        className="w-8 h-8 rounded-full border-2 border-white"
                        src={src}
                        alt="Team Member"
                      />
                    ))}
                  </div>
                  {project.additionalTeamCount > 0 && (
                    <span className="text-sm text-gray-600">
                      +{project.additionalTeamCount} more
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-custom rounded-full h-2"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-custom rounded-full hover:bg-violet-50">
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-custom rounded-full hover:bg-violet-50">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-2">
            <button className="rounded-button px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              Previous
            </button>
            <button className="rounded-button px-3 py-2 bg-custom text-white rounded-md">
              1
            </button>
            <button className="rounded-button px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              2
            </button>
            <button className="rounded-button px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              3
            </button>
            <button className="rounded-button px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              Next
            </button>
          </div>
          <select className="border border-gray-300 rounded-md focus:ring-custom focus:border-custom py-2 pl-3 pr-8">
            <option>10 per page</option>
            <option>20 per page</option>
            <option>50 per page</option>
          </select>
        </div>
      </div>

      {/* New Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Create New Project
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleNewProjectSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md focus:ring-custom focus:border-custom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows="3"
                      className="w-full border border-gray-300 rounded-md focus:ring-custom focus:border-custom"
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-md focus:ring-custom focus:border-custom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-md focus:ring-custom focus:border-custom"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select className="w-full border border-gray-300 rounded-md focus:ring-custom focus:border-custom">
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select className="w-full border border-gray-300 rounded-md focus:ring-custom focus:border-custom">
                        <option>Not Started</option>
                        <option>In Progress</option>
                        <option>On Hold</option>
                        <option>Completed</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Team Members
                    </label>
                    <select
                      multiple
                      className="w-full border border-gray-300 rounded-md focus:ring-custom focus:border-custom"
                    >
                      <option>John Doe</option>
                      <option>Jane Smith</option>
                      <option>Mike Johnson</option>
                      <option>Sarah Williams</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-button px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-button px-4 py-2 bg-custom text-white rounded-md hover:bg-violet-600"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
