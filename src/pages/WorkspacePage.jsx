import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { listWorkspaces, createWorkspace } from '../actions/workspaceActions';

const WorkspacePage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [hoveredId, setHoveredId] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const workspaceList = useSelector((state) => state.workspace);
    const { loading, error, workspaces } = workspaceList;
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        dispatch(listWorkspaces());
    }, [dispatch]);

    const handleCreateWorkspace = (e) => {
        e.preventDefault();
        if (name.trim()) {
            dispatch(createWorkspace(name));
            setName('');
            setModalOpen(false);
        }
    };

    const colors = ['#7b68ee', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const getColor = (index) => colors[index % colors.length];

    return (
        <div className="min-h-screen bg-[#f8fafc] px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight leading-tight">Your Workspaces</h1>
                    <p className="text-slate-500 text-[14px] mt-1 font-medium">Organize teams, projects, and collaborations</p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#7b68ee] hover:bg-[#6757e5] text-white text-[13px] font-bold rounded-xl shadow-lg shadow-[#7b68ee]/30 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                    <i className="fas fa-plus text-[11px]"></i>
                    New Workspace
                </button>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-[13px] font-semibold px-4 py-3 rounded-xl">
                    <i className="fas fa-exclamation-circle text-red-400"></i>
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-28 gap-4">
                    <div className="w-10 h-10 border-4 border-[#7b68ee]/30 border-t-[#7b68ee] rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-sm font-medium">Loading workspaces...</p>
                </div>
            ) : workspaces && workspaces.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {workspaces.map((ws, i) => {
                        const wsId = ws._id || ws.id;
                        const color = getColor(i);
                        return (
                            <div
                                key={wsId}
                                onClick={() => {
                                    localStorage.setItem('activeWorkspaceId', wsId);
                                    navigate(`/${userId}/projects`);
                                    window.dispatchEvent(new Event('storage'));
                                }}
                                onMouseEnter={() => setHoveredId(wsId)}
                                onMouseLeave={() => setHoveredId(null)}
                                className="group relative bg-white rounded-2xl border border-slate-200/80 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/80 hover:-translate-y-1"
                            >
                                {/* Top accent line */}
                                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: color }}></div>

                                {/* Workspace avatar */}
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-xl mb-4 shadow-md"
                                    style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, boxShadow: `0 6px 20px ${color}40` }}
                                >
                                    {ws.name.charAt(0).toUpperCase()}
                                </div>

                                <h3 className="text-[15px] font-bold text-slate-800 truncate mb-1">{ws.name}</h3>
                                <p className="text-[12px] text-slate-400 font-medium mb-4">
                                    Created {new Date(ws.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active</span>
                                    <div
                                        className="flex items-center gap-1 text-[12px] font-bold transition-colors"
                                        style={{ color: hoveredId === wsId ? color : '#94a3b8' }}
                                    >
                                        Open <i className="fas fa-arrow-right text-[10px]"></i>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Create new card */}
                    <button
                        onClick={() => setModalOpen(true)}
                        className="group relative bg-white rounded-2xl border-2 border-dashed border-slate-200 p-6 cursor-pointer transition-all duration-300 hover:border-[#7b68ee]/50 hover:bg-[#f5f3ff]/50 hover:-translate-y-1 flex flex-col items-center justify-center gap-3 min-h-[180px]"
                    >
                        <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-[#eeebff] flex items-center justify-center transition-colors">
                            <i className="fas fa-plus text-slate-400 group-hover:text-[#7b68ee] text-lg transition-colors"></i>
                        </div>
                        <p className="text-[13px] font-semibold text-slate-400 group-hover:text-[#7b68ee] transition-colors">Create Workspace</p>
                    </button>
                </div>
            ) : (
                // Empty state
                <div className="flex flex-col items-center justify-center py-24 gap-6">
                    <div className="w-24 h-24 bg-[#eeebff] rounded-3xl flex items-center justify-center">
                        <i className="fas fa-layer-group text-4xl text-[#7b68ee]"></i>
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-extrabold text-slate-800 mb-2">No workspaces yet</h2>
                        <p className="text-slate-500 text-sm font-medium max-w-xs">
                            Workspaces help you organize your teams and projects. Create your first one to get started.
                        </p>
                    </div>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#7b68ee] hover:bg-[#6757e5] text-white text-[13px] font-bold rounded-xl shadow-lg shadow-[#7b68ee]/30 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                        <i className="fas fa-plus"></i>
                        Create your first workspace
                    </button>
                </div>
            )}

            {/* Modal Overlay */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
                    <div
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                            <i className="fas fa-times text-sm"></i>
                        </button>

                        {/* Icon */}
                        <div className="w-14 h-14 bg-[#eeebff] rounded-2xl flex items-center justify-center mb-5">
                            <i className="fas fa-layer-group text-2xl text-[#7b68ee]"></i>
                        </div>

                        <h2 className="text-[20px] font-extrabold text-slate-900 mb-1">Create a Workspace</h2>
                        <p className="text-slate-500 text-sm mb-6">Give your workspace a clear, descriptive name.</p>

                        <form onSubmit={handleCreateWorkspace}>
                            <label className="block text-[12px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Workspace Name
                            </label>
                            <input
                                autoFocus
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Marketing Team, Q2 Sprint..."
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
                                    Create Workspace
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkspacePage;
