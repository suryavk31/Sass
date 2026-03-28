// src/pages/ProjectDetailPage.jsx — ClickUp-Style Project View w/ List & Board tabs
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
    FormatListBulletedRounded, 
    DashboardRounded, 
    AddRounded,
    UpdateRounded,
    MoreHorizRounded
} from '@mui/icons-material';
import TaskList from '../components/Task/TaskList';
import TaskBoard from '../components/Task/TaskBoard';
import TaskDetailPanel from '../components/Task/TaskDetailPanel';

const ProjectDetailPage = () => {
    const { projectId } = useParams();
    const [activeView, setActiveView] = useState('list');
    const [selectedTask, setSelectedTask] = useState(null);


    const { projects } = useSelector((state) => state.project);
    const currentProject = projects?.find((p) => (p._id || p.id) === projectId);

    const views = [
        { id: 'list', label: 'List View', icon: <FormatListBulletedRounded sx={{ fontSize: 16 }} /> },
        { id: 'board', label: 'Kanban Board', icon: <DashboardRounded sx={{ fontSize: 16 }} /> },
    ];

    return (
        <div className="flex flex-col h-full bg-[#fafafa]">
            {/* Project Header */}
            <div className="px-8 pt-8 pb-0 bg-white border-b border-slate-200/60 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl premium-gradient flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                            <span className="text-sm font-black">
                                {currentProject?.name?.charAt(0).toUpperCase() || 'P'}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-[22px] font-black text-slate-900 tracking-tight leading-none mb-1.5 transition-all">
                                {currentProject?.name || 'Project Overview'}
                            </h1>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <UpdateRounded sx={{ fontSize: 14 }} />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">Active Status</span>
                                </div>
                                <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    Last edit: 2h ago
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                            <MoreHorizRounded sx={{ fontSize: 18 }} />
                        </button>
                        <button 
                            onClick={() => {
                                const listInput = document.querySelector('input[placeholder="Create objective..."]');
                                if (listInput) {
                                    listInput.focus();
                                    listInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                            }}
                            className="flex items-center gap-2 px-5 py-2 text-[12px] font-black text-white premium-gradient rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all active:scale-95"
                        >
                            <AddRounded sx={{ fontSize: 16 }} />
                            <span>NEW TASK</span>
                        </button>
                    </div>
                </div>

                {/* View Tabs */}
                <div className="flex gap-8">
                    {views.map((view) => (
                        <button
                            key={view.id}
                            onClick={() => setActiveView(view.id)}
                            className={`flex items-center gap-2 pb-3.5 text-[12px] font-bold tracking-tight border-b-2 transition-all group ${activeView === view.id
                                ? 'border-[#7b68ee] text-[#7b68ee]'
                                : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
                                }`}
                        >
                            <span className={`${activeView === view.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'} transition-opacity`}>
                                {view.icon}
                            </span>
                            <span className="uppercase tracking-widest">{view.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Task View */}
            <div className="flex-1 overflow-hidden flex flex-col p-8 bg-[#fafafa]">
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/50 h-full flex flex-col overflow-hidden relative">
                    {activeView === 'list' ? (
                        <TaskList projectId={projectId} onTaskClick={setSelectedTask} />
                    ) : (
                        <TaskBoard projectId={projectId} onTaskClick={setSelectedTask} />
                    )}
                </div>
            </div>

            {/* Task Intelligence Panel (Slide-over) */}
            {selectedTask && (
                <TaskDetailPanel 
                    task={selectedTask} 
                    onClose={() => setSelectedTask(null)} 
                    onUpdate={() => {
                        // Refresh logic if needed
                    }}
                />
            )}
        </div>

    );
};

export default ProjectDetailPage;

