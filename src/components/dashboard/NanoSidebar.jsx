import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listWorkspaces, getWorkspaceUserRole } from '../../actions/workspaceActions';
import {
    HomeRounded,
    NotificationsRounded,
    FolderSpecialRounded,
    SearchRounded,
    AddBoxRounded,
    DashboardRounded,
    BarChartRounded,
    LogoutRounded,
    SettingsRounded,
    PeopleAltRounded,
    GroupRounded,
    ContactPageRounded,
    GroupsRounded,
    EventAvailableRounded,
    AccountBalanceWalletRounded,
    BeachAccessRounded,
    ReceiptLongRounded,
    TrendingUpRounded,
    AdminPanelSettingsRounded,
    AutoFixHighRounded,
    CalendarMonthRounded,
} from '@mui/icons-material';
import { logout } from '../../actions/authActions';

const NanoSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const userId = localStorage.getItem('userId');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    const [wsDropdownOpen, setWsDropdownOpen] = useState(false);
    const [quickAddOpen, setQuickAddOpen] = useState(false);
    const dropdownRef = useRef(null);
    const quickAddRef = useRef(null);
    const workspaceList = useSelector((state) => state.workspace);
    const { workspaces, userRole } = workspaceList || {};
    const [activeWorkspace, setActiveWorkspace] = useState(null);

    useEffect(() => {
        dispatch(listWorkspaces());
    }, [dispatch]);

    useEffect(() => {
        if (workspaces && workspaces.length > 0) {
            const savedId = localStorage.getItem('activeWorkspaceId');
            const found = workspaces.find(w => w.id === savedId || w._id === savedId);
            if (found) {
                setActiveWorkspace(found);
            } else {
                setActiveWorkspace(workspaces[0]);
                localStorage.setItem('activeWorkspaceId', workspaces[0]._id || workspaces[0].id);
            }
        }
    }, [workspaces]);

    // Fetch user role and permissions for the active workspace
    useEffect(() => {
        const workspaceId = localStorage.getItem('activeWorkspaceId');
        if (workspaceId) {
            dispatch(getWorkspaceUserRole(workspaceId));
        }
    }, [dispatch, activeWorkspace]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setWsDropdownOpen(false);
            }
            if (quickAddRef.current && !quickAddRef.current.contains(event.target)) {
                setQuickAddOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSwitchWorkspace = (ws) => {
        setActiveWorkspace(ws);
        localStorage.setItem('activeWorkspaceId', ws._id || ws.id);
        setWsDropdownOpen(false);
        // Refresh handled by useEffect or full reload
        window.location.reload(); 
    };

    const permissions = userRole?.permissions || [];
    const isAdmin = userRole?.roleName === 'Admin';

    const hasPermission = (moduleName, permission = 'view') => {
        if (isAdmin) return true;
        const mod = permissions.find(p => p.module.toLowerCase() === moduleName.toLowerCase());
        return mod && mod[permission];
    };

    const mainNavItems = [
        { route: `/${userId}/dashboard`, icon: HomeRounded, label: 'Home', visible: true },
        { route: `/${userId}/leads`, icon: ContactPageRounded, label: 'Leads', visible: hasPermission('Leads') },
        { route: `/${userId}/employee`, icon: GroupsRounded, label: 'Team', visible: hasPermission('Team') },
        { route: `/${userId}/projects`, icon: FolderSpecialRounded, label: 'Spaces', visible: hasPermission('projects') },
        { route: `/${userId}/calendar`, icon: CalendarMonthRounded, label: 'Calendar', visible: hasPermission('Calendar') },
        { route: `/${userId}/notifications`, icon: NotificationsRounded, label: 'Notifications', visible: true },
        { route: `/${userId}/sales-dashboard`, icon: DashboardRounded, label: 'Sales Dashboard', visible: hasPermission('Sales') },
        { route: `/${userId}/crm`, icon: BarChartRounded, label: 'CRM', visible: hasPermission('CRM') },
        { route: `/${userId}/pipeline`, icon: TrendingUpRounded, label: 'Sales Pipeline', visible: hasPermission('Sales') },
        { route: `/${userId}/invoices`, icon: ReceiptLongRounded, label: 'Invoices', visible: hasPermission('Invoices') },
        { route: `/${userId}/automations`, icon: AutoFixHighRounded, label: 'Automations', visible: hasPermission('Automations') },
    ];

    const hrNavItems = [
        { route: `/${userId}/attendance`, icon: EventAvailableRounded, label: 'Attendance', visible: hasPermission('HR') },
        { route: `/${userId}/salary`, icon: AccountBalanceWalletRounded, label: 'Payroll', visible: hasPermission('HR') },
        { route: `/${userId}/leave-expenses`, icon: BeachAccessRounded, label: 'Leave & Expenses', visible: hasPermission('HR') },
        { route: `/${userId}/roles`, icon: SettingsRounded, label: 'Settings / Roles', visible: isAdmin },
        { route: `/${userId}/audit-logs`, icon: AdminPanelSettingsRounded, label: 'Audit Logs', visible: isAdmin },
    ];

    const isActive = (routePattern) => {
        const path = location.pathname;
        const segment = routePattern.split('/').pop();
        if (segment === 'dashboard') return path.endsWith('/dashboard');
        return path.includes(segment);
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="w-[64px] bg-[#1e252e]/95 backdrop-blur-xl flex flex-col items-center py-6 shrink-0 z-[100] border-r border-white/5 shadow-2xl h-full overflow-y-auto thin-scrollbar overflow-x-visible relative">
            {/* Workspace Switcher */}
            <div className="relative w-full flex justify-center mb-8 z-[110]" ref={dropdownRef}>
                <button 
                    onClick={() => setWsDropdownOpen(!wsDropdownOpen)}
                    className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center text-white font-bold text-[15px] cursor-pointer shadow-lg shadow-purple-500/20 hover:scale-[1.05] active:scale-95 transition-all duration-300 ring-2 ring-white/10 relative group"
                >
                    {activeWorkspace ? activeWorkspace.name.charAt(0).toUpperCase() : (userInfo?.name?.charAt(0) || 'S')}
                    <div className="absolute -bottom-1 -right-1 bg-slate-800 border-2 border-[#1e252e] rounded-full w-4 h-4 flex items-center justify-center shadow-lg">
                        <i className={`fas fa-chevron-${wsDropdownOpen ? 'up' : 'down'} text-[8px] text-white`}></i>
                    </div>
                </button>

                {/* Dropdown Menu */}
                {wsDropdownOpen && (
                    <div className="absolute top-[110%] left-14 w-64 bg-slate-800 border border-white/10 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] py-2 overflow-hidden transform origin-top-left transition-all z-[120]">
                        <div className="px-4 py-2 border-b border-white/10">
                            <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">Switch Workspace</p>
                        </div>
                        <div className="max-h-60 overflow-y-auto thin-scrollbar">
                            {workspaces && workspaces.map(ws => (
                                <button
                                    key={ws._id || ws.id}
                                    onClick={() => handleSwitchWorkspace(ws)}
                                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors ${
                                        activeWorkspace && (activeWorkspace._id || activeWorkspace.id) === (ws._id || ws.id) 
                                        ? 'bg-[#7b68ee]/10 text-white' 
                                        : 'text-slate-300'
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                                         activeWorkspace && (activeWorkspace._id || activeWorkspace.id) === (ws._id || ws.id)  ? 'bg-[#7b68ee] text-white shadow-md' : 'bg-slate-700 text-slate-300'
                                    }`}>
                                        {ws.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-[13px] font-semibold truncate flex-1">{ws.name}</span>
                                    {activeWorkspace && (activeWorkspace._id || activeWorkspace.id) === (ws._id || ws.id)  && (
                                        <i className="fas fa-check-circle text-[#7b68ee] text-sm"></i>
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="border-t border-white/10 p-2">
                            <button 
                                onClick={() => { setWsDropdownOpen(false); navigate(`/${userId}/workspaces`); }}
                                className="w-full text-left px-3 py-2 text-[12px] font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors flex items-center gap-2"
                            >
                                <i className="fas fa-cog"></i> Workspace Settings
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-5 w-full items-center">
                {/* Search */}
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition-all group relative">
                    <SearchRounded sx={{ fontSize: 20 }} />
                    <div className="absolute left-14 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-all translate-x-[-4px] group-hover:translate-x-0 shadow-xl border border-white/10">Search (⌘K)</div>
                </button>

                {/* Global Add */}
                <div className="relative z-[110]" ref={quickAddRef}>
                    <button 
                        onClick={() => setQuickAddOpen(!quickAddOpen)}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all group relative mb-4 ${quickAddOpen ? 'bg-[#7b68ee] text-white shadow-lg shadow-purple-500/40 transform scale-110' : 'text-[#7b68ee] bg-[#7b68ee]/10 hover:bg-[#7b68ee]/20 hover:scale-105'}`}
                    >
                        <AddBoxRounded sx={{ fontSize: 22 }} />
                        {!quickAddOpen && <div className="absolute left-14 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-all translate-x-[-4px] group-hover:translate-x-0 shadow-xl border border-white/10 uppercase tracking-widest">Quick Create</div>}
                    </button>

                    {quickAddOpen && (
                        <div className="absolute top-0 left-14 w-56 bg-slate-800 border border-white/10 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] py-3 overflow-hidden transform origin-left transition-all z-[120] animate-in slide-in-from-left-2 fade-in duration-200">
                            <div className="px-4 pb-2 mb-2 border-b border-white/5">
                                <p className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-500">Global Add</p>
                            </div>
                            <div className="flex flex-col gap-1 px-2">
                                {[
                                    { label: 'New Lead', icon: ContactPageRounded, path: `/${userId}/leads`, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                                    { label: 'New Deal', icon: TrendingUpRounded, path: `/${userId}/pipeline`, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                                    { label: 'New Invoice', icon: ReceiptLongRounded, path: `/${userId}/invoices`, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                                    { label: 'New Space', icon: FolderSpecialRounded, path: `/${userId}/projects`, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                                    { label: 'New Team', icon: GroupsRounded, path: `/${userId}/employee`, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                                ].map((action, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setQuickAddOpen(false); navigate(action.path); }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all group/item text-left"
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.bg} ${action.color} group-hover/item:scale-110 transition-transform`}>
                                            <action.icon sx={{ fontSize: 18 }} />
                                        </div>
                                        <span className="text-[13px] font-bold text-slate-300 group-hover/item:text-white transition-colors tracking-tight">{action.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-8 h-[1px] bg-white/5 mb-2"></div>

                {/* Main Nav Items */}
                {mainNavItems.filter(item => item.visible).map((item, idx) => {
                    const active = isActive(item.route);
                    return (
                        <button
                            key={idx}
                            onClick={() => navigate(item.route)}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all group relative ${active 
                                ? 'bg-[#7b68ee] text-white shadow-lg shadow-purple-500/30 ring-1 ring-white/20' 
                                : 'text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <item.icon sx={{ fontSize: 20 }} />
                            {!active && <div className="absolute left-1 w-1 h-4 bg-[#7b68ee] rounded-full scale-y-0 group-hover:scale-y-100 transition-transform origin-center"></div>}
                            <div className="absolute left-14 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-all translate-x-[-4px] group-hover:translate-x-0 shadow-xl border border-white/10">{item.label}</div>
                        </button>
                    )
                })}

                {/* HR & Finance Divider */}
                {hrNavItems.some(item => item.visible) && (
                    <>
                        <div className="w-8 h-[1px] bg-white/10 my-1"></div>
                        <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-600 select-none">HR</p>
                    </>
                )}

                {hrNavItems.filter(item => item.visible).map((item, idx) => {
                    const active = isActive(item.route);
                    return (
                        <button
                            key={`hr-${idx}`}
                            onClick={() => navigate(item.route)}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all group relative ${active 
                                ? 'bg-[#7b68ee] text-white shadow-lg shadow-purple-500/30 ring-1 ring-white/20' 
                                : 'text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <item.icon sx={{ fontSize: 20 }} />
                            {!active && <div className="absolute left-1 w-1 h-4 bg-[#7b68ee] rounded-full scale-y-0 group-hover:scale-y-100 transition-transform origin-center"></div>}
                            <div className="absolute left-14 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-all translate-x-[-4px] group-hover:translate-x-0 shadow-xl border border-white/10">{item.label}</div>
                        </button>
                    )
                })}
            </div>


            <div className="mt-auto flex flex-col gap-4 w-full items-center">
                {/* Logout Button */}
                <button 
                    onClick={handleLogout}
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group relative"
                >
                    <LogoutRounded sx={{ fontSize: 20 }} />
                    <div className="absolute left-14 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-all translate-x-[-4px] group-hover:translate-x-0 shadow-xl">Logout</div>
                </button>

                {/* User Avatar / Settings */}
                <button 
                    onClick={() => navigate(`/${userId}/developer-settings`)}
                    className="w-9 h-9 rounded-xl overflow-hidden border-2 border-white/5 hover:border-[#7b68ee]/50 transition-all group relative p-0.5 bg-slate-800"
                >
                    <div className="w-full h-full rounded-lg bg-slate-700 flex items-center justify-center text-[10px] font-black text-[#7b68ee]">
                        {userInfo?.name?.split(' ').map(n => n[0]).join('') || 'ME'}
                    </div>
                    <div className="absolute left-14 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-all translate-x-[-4px] group-hover:translate-x-0 shadow-xl border border-white/10 uppercase tracking-widest">Settings</div>
                </button>
            </div>
        </div>
    );
};

export default NanoSidebar;

