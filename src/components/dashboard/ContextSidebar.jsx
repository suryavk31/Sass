// src/components/dashboard/ContextSidebar.jsx - ClickUp style Secondary Sidebar
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    KeyboardArrowDownRounded,
    FolderSpecialRounded,
    AddRounded,
    CheckCircleRounded,
    ShowChartRounded,
    AssignmentTurnedInRounded,
    PeopleAltRounded,
    AssessmentRounded,
    AdminPanelSettingsRounded,
    SettingsRounded,
    LayersRounded
} from '@mui/icons-material';

const ContextSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [projectsOpen, setProjectsOpen] = useState(true);

    const userId = localStorage.getItem('userId');
    const { projects, loading } = useSelector((state) => state.project);
    const { workspaces } = useSelector((state) => state.workspace);

    // Determine context based on URL
    const isCrmContext = location.pathname.includes('/crm') || 
                         location.pathname.includes('/dashboard') || 
                         location.pathname.includes('/activities') ||
                         location.pathname.includes('/leads');

    const activeWorkspace = workspaces?.[0] || { name: 'Team Space' };

    const SectionTitle = ({ children, onAdd }) => (
        <div className="flex items-center justify-between px-3 mt-6 mb-2 group/section">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 select-none">
                {children}
            </p>
            {onAdd && (
                <button onClick={onAdd} className="opacity-0 group-hover/section:opacity-100 p-0.5 hover:bg-slate-200/50 rounded-md transition-all text-slate-400 hover:text-[#7b68ee]">
                    <AddRounded sx={{ fontSize: 14 }} />
                </button>
            )}
        </div>
    );

    const NavItem = ({ route, Icon, label, badge, active }) => {
        const isMatched = active || location.pathname.endsWith(`/${route}`) || location.pathname.includes(`/${route}/`);
        return (
            <button
                onClick={() => navigate(`/${userId}/${route}`)}
                className={`group w-full flex items-center px-3 py-[6px] text-[12px] font-medium rounded-lg transition-all duration-200 ${isMatched
                        ? 'bg-[#7b68ee]/10 text-[#7b68ee] shadow-[inset_0_0_0_1px_rgba(123,104,238,0.1)]'
                        : 'text-slate-600 hover:bg-slate-200/40 hover:text-slate-900'
                    }`}
            >
                <span className="w-5 flex items-center justify-center mr-2.5">
                    <Icon sx={{ fontSize: 16, opacity: isMatched ? 1 : 0.6 }} />
                </span>
                <span className="flex-1 text-left truncate">{label}</span>
                {badge && (
                    <span className={`px-1.5 py-0.5 text-[9px] font-black rounded-md flex items-center justify-center leading-none transition-colors ${
                        isMatched ? 'bg-[#7b68ee] text-white' : 'bg-slate-200/70 text-slate-500'
                    }`}>
                        {badge}
                    </span>
                )}
            </button>
        );
    };

    return (
        <div className="w-[240px] bg-white/70 backdrop-blur-md flex flex-col h-full shrink-0 border-r border-slate-200/60 pt-6 z-30 overflow-hidden">

            {/* Context Header */}
            <div className="px-4 pb-4 mb-2 flex items-center gap-2 shrink-0">
                <div className="w-6 h-6 rounded-md bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                    <LayersRounded sx={{ fontSize: 14, color: '#7b68ee' }} />
                </div>
                <h2 className="text-[13px] font-black text-slate-800 tracking-tight uppercase">
                    {activeWorkspace.name}
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar px-3 space-y-0.5 pb-8">

                {isCrmContext ? (
                    // CRM NAVIGATION
                    <>
                        <SectionTitle>Analytics</SectionTitle>
                        <NavItem route="dashboard" Icon={ShowChartRounded} label="Overview" />
                        <NavItem route="activities" Icon={AssignmentTurnedInRounded} label="Activity Flow" />

                        <SectionTitle>Growth</SectionTitle>
                        <NavItem route="contacts" Icon={CheckCircleRounded} label="Verified Contacts" />
                        <NavItem route="pipeline" Icon={AssessmentRounded} label="Revenue Funnel" />
                    </>
                ) : (
                    // SPACES/PROJECT NAVIGATION
                    <>
                        <SectionTitle>Favorites</SectionTitle>
                        <button className="mx-3 my-2 px-3 py-2 border border-dashed border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-[#7b68ee]/30 hover:text-[#7b68ee] hover:bg-[#7b68ee]/5 transition-all text-left">
                           Pin important spaces
                        </button>

                        <SectionTitle onAdd={() => navigate(`/${userId}/projects`)}>Project Library</SectionTitle>

                        <button
                            onClick={() => setProjectsOpen(!projectsOpen)}
                            className="group flex items-center w-full px-2 py-1.5 text-[12px] font-bold text-slate-700 rounded-lg hover:bg-slate-100 transition-all mb-1"
                        >
                            <div className={`${projectsOpen ? 'rotate-90' : ''} transition-transform mr-1.5 text-slate-400 group-hover:text-slate-600`}>
                                <KeyboardArrowDownRounded sx={{ fontSize: 16 }} />
                            </div>
                            <FolderSpecialRounded sx={{ fontSize: 16, mr: 1.5, color: '#ffb300' }} />
                            <span className="flex-1 text-left">Everything</span>
                        </button>

                        {projectsOpen && (
                            <div className="mt-1 space-y-[4px] ml-[20px] border-l-2 border-slate-100 pl-3 py-1">
                                {loading ? (
                                    <div className="animate-pulse flex items-center gap-2 px-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                                        <div className="h-2 w-16 bg-slate-100 rounded"></div>
                                    </div>
                                ) : projects && projects.length > 0 ? (
                                    projects.map((project) => (
                                        <button
                                            key={project._id || project.id}
                                            onClick={() => navigate(`/${userId}/projects/${project._id || project.id}`)}
                                            className={`flex items-center w-full px-2 py-[5px] rounded-lg transition-all text-[12px] group/item ${location.pathname.includes(project._id || project.id)
                                                    ? 'text-[#7b68ee] font-bold bg-[#7b68ee]/5'
                                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full mr-2.5 shrink-0 transition-transform group-hover/item:scale-125 ${location.pathname.includes(project._id || project.id) ? 'bg-[#7b68ee] shadow-[0_0_8px_rgba(123,104,238,0.4)]' : 'bg-slate-300'}`}></div>
                                            <span className="truncate">{project.name}</span>
                                        </button>
                                    ))
                                ) : (
                                    <p className="px-2 py-1.5 text-[11px] text-slate-400 font-medium italic">Click + to add spaces</p>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* Universal Workspace Settings */}
                <SectionTitle>Workspace</SectionTitle>
                <NavItem route="roles" Icon={SettingsRounded} label="Permission Matrix" />
                <NavItem route="audit-logs" Icon={AdminPanelSettingsRounded} label="Audit Logs" />
            </div>
        </div>
    );
};

export default ContextSidebar;
