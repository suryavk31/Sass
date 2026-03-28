import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { listProjects, createProject } from '../actions/projectActions';
import { listWorkspaces } from '../actions/workspaceActions';

const ProjectPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [hoveredId, setHoveredId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const projectList = useSelector((state) => state.project);
  const { loading, error, projects } = projectList;

  const workspaceList = useSelector((state) => state.workspace);
  const { workspaces } = workspaceList;

  useEffect(() => {
    dispatch(listWorkspaces());
  }, [dispatch]);

  useEffect(() => {
    if (selectedWorkspace) {
      dispatch(listProjects(selectedWorkspace));
    } else if (workspaces && workspaces.length > 0) {
      const wsId = workspaces[0]._id || workspaces[0].id;
      setSelectedWorkspace(wsId);
      dispatch(listProjects(wsId));
    }
  }, [dispatch, selectedWorkspace, workspaces]);

  const handleNewProjectSubmit = (e) => {
    e.preventDefault();
    if (projectName && selectedWorkspace) {
      dispatch(createProject(projectName, selectedWorkspace));
      setProjectName('');
      setModalOpen(false);
    }
  };

  const colors = ['#7b68ee', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const getColor = (index) => colors[index % colors.length];

  const filteredProjects = projects?.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasWorkspace = workspaces && workspaces.length > 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight leading-tight">Projects</h1>
          {hasWorkspace ? (
            <div className="flex items-center gap-2 mt-1.5">
              <i className="fas fa-layer-group text-[#7b68ee] text-xs"></i>
              <select
                value={selectedWorkspace}
                onChange={(e) => setSelectedWorkspace(e.target.value)}
                className="text-[13px] font-semibold text-[#7b68ee] bg-transparent border-none focus:outline-none cursor-pointer"
              >
                {workspaces.map(ws => (
                  <option key={ws._id || ws.id} value={ws._id || ws.id}>{ws.name}</option>
                ))}
              </select>
            </div>
          ) : (
            <p className="mt-1.5 text-sm text-amber-600 font-semibold flex items-center gap-1.5">
              <i className="fas fa-exclamation-triangle text-xs"></i>
              No workspace found.{' '}
              <a href={`/${userId}/workspaces`} className="underline hover:text-amber-800 transition-colors">
                Create one first →
              </a>
            </p>
          )}
        </div>
        <button
          onClick={() => setModalOpen(true)}
          disabled={!selectedWorkspace}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#7b68ee] hover:bg-[#6757e5] disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-bold rounded-xl shadow-lg shadow-[#7b68ee]/30 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <i className="fas fa-plus text-[11px]"></i>
          New Project
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 max-w-sm">
        <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[13px]"></i>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7b68ee]/30 focus:border-[#7b68ee] transition-all shadow-sm"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-[13px] font-semibold px-4 py-3 rounded-xl">
          <i className="fas fa-exclamation-circle text-red-400"></i>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-10 h-10 border-4 border-[#7b68ee]/30 border-t-[#7b68ee] rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Loading projects...</p>
        </div>
      ) : filteredProjects && filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProjects.map((project, i) => {
            const pid = project._id || project.id;
            const color = getColor(i);
            return (
              <div
                key={pid}
                onClick={() => navigate(`/${userId}/projects/${pid}`)}
                onMouseEnter={() => setHoveredId(pid)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative bg-white rounded-2xl border border-slate-200/80 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/80 hover:-translate-y-1"
              >
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: color }}></div>

                {/* Project avatar */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-extrabold text-lg mb-4 shadow-md"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)`, boxShadow: `0 4px 14px ${color}40` }}
                >
                  {project.name.charAt(0).toUpperCase()}
                </div>

                <h3 className="text-[14px] font-bold text-slate-800 truncate mb-1">{project.name}</h3>
                <p className="text-[11px] text-slate-400 font-medium mb-4">
                  {new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: `${color}18`, color }}>
                    <span className="w-1 h-1 rounded-full bg-current"></span>
                    Active
                  </span>
                  <span
                    className="text-[12px] font-bold flex items-center gap-1 transition-colors"
                    style={{ color: hoveredId === pid ? color : '#cbd5e1' }}
                  >
                    Open <i className="fas fa-arrow-right text-[10px]"></i>
                  </span>
                </div>
              </div>
            );
          })}

          {/* Create new card */}
          <button
            onClick={() => setModalOpen(true)}
            disabled={!selectedWorkspace}
            className="group relative bg-white rounded-2xl border-2 border-dashed border-slate-200 p-6 cursor-pointer transition-all duration-300 hover:border-[#7b68ee]/50 hover:bg-[#f5f3ff]/50 hover:-translate-y-1 flex flex-col items-center justify-center gap-3 min-h-[180px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-100 group-hover:bg-[#eeebff] flex items-center justify-center transition-colors">
              <i className="fas fa-plus text-slate-400 group-hover:text-[#7b68ee] text-lg transition-colors"></i>
            </div>
            <p className="text-[13px] font-semibold text-slate-400 group-hover:text-[#7b68ee] transition-colors">New Project</p>
          </button>
        </div>
      ) : (
        // Empty state
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div className="w-24 h-24 bg-[#eeebff] rounded-3xl flex items-center justify-center">
            <i className="fas fa-diagram-project text-4xl text-[#7b68ee]"></i>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-extrabold text-slate-800 mb-2">
              {searchQuery ? 'No matching projects' : 'No projects yet'}
            </h2>
            <p className="text-slate-500 text-sm font-medium max-w-xs">
              {searchQuery
                ? `No projects match "${searchQuery}". Try a different term.`
                : 'Create your first project to start organizing tasks and collaborating with your team.'}
            </p>
          </div>
          {!searchQuery && (
            <button
              onClick={() => setModalOpen(true)}
              disabled={!selectedWorkspace}
              className="flex items-center gap-2 px-6 py-3 bg-[#7b68ee] hover:bg-[#6757e5] disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-bold rounded-xl shadow-lg shadow-[#7b68ee]/30 transition-all hover:scale-105 active:scale-95"
            >
              <i className="fas fa-plus"></i>
              Create your first project
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <i className="fas fa-times text-sm"></i>
            </button>

            <div className="w-14 h-14 bg-[#eeebff] rounded-2xl flex items-center justify-center mb-5">
              <i className="fas fa-folder-plus text-2xl text-[#7b68ee]"></i>
            </div>

            <h2 className="text-[20px] font-extrabold text-slate-900 mb-1">Create a Project</h2>
            <p className="text-slate-500 text-sm mb-6">Name your project clearly so your team knows what it's about.</p>

            <form onSubmit={handleNewProjectSubmit}>
              <label className="block text-[12px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                Project Name
              </label>
              <input
                autoFocus
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Website Redesign, Mobile App v2..."
                className="w-full border border-slate-200 rounded-xl py-3 px-4 text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7b68ee]/40 focus:border-[#7b68ee] transition-all"
                required
              />

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#7b68ee] hover:bg-[#6757e5] text-white text-[13px] font-extrabold rounded-xl shadow-md shadow-[#7b68ee]/30 transition-all hover:scale-[1.02] active:scale-95"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
