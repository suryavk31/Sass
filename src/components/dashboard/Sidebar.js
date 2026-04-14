import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listWorkspaces } from '../../actions/workspaceActions';
import { listProjects } from '../../actions/projectActions';
import { logout } from '../../actions/authActions';
import usePermissions from '../../hooks/usePermissions';
import {
  HomeRounded,
  FolderSpecialRounded,
  CalendarMonthRounded,
  PeopleAltRounded,
  AdminPanelSettingsRounded,
  KeyboardArrowDownRounded,
  AddRounded,
  DashboardRounded,
  TrendingUpRounded,
  EventAvailableRounded,
  AccountBalanceWalletRounded,
  ReceiptLongRounded,
  BeachAccessRounded,
  ContactPageRounded,
  BarChartRounded,
  NotificationsRounded,
  SettingsRounded,
  LogoutRounded,
  KeyboardDoubleArrowLeftRounded,
  KeyboardDoubleArrowRightRounded,
  AddBoxRounded,
  AutoFixHighRounded,
} from '@mui/icons-material';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userId = localStorage.getItem('userId');
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const { hasPermission } = usePermissions();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [wsDropdownOpen, setWsDropdownOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const workspaceState = useSelector((state) => state.workspace);
  const { workspaces } = workspaceState;

  const projectState = useSelector((state) => state.project);
  const { projects } = projectState;

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
            dispatch(listProjects(found._id || found.id));
        } else {
            setActiveWorkspace(workspaces[0]);
            localStorage.setItem('activeWorkspaceId', workspaces[0]._id || workspaces[0].id);
            dispatch(listProjects(workspaces[0]._id || workspaces[0].id));
        }
    }
  }, [workspaces, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setWsDropdownOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitchWorkspace = (ws) => {
    setActiveWorkspace(ws);
    localStorage.setItem('activeWorkspaceId', ws._id || ws.id);
    dispatch(listProjects(ws._id || ws.id));
    setWsDropdownOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const isActive = (routeSegment) => location.pathname.includes(routeSegment);

  const NavItem = ({ route, Icon, label, badge }) => {
    const active = isActive(route);
    return (
      <button
        onClick={() => navigate(`/${userId}/${route}`)}
        className={`group relative flex items-center w-full px-3 py-2 my-0.5 font-semibold rounded-lg transition-all duration-200 ${
            active
            ? 'bg-[#7b68ee]/10 text-[#7b68ee] shadow-[inset_0_0_0_1px_rgba(123,104,238,0.15)]'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
      >
        <Icon sx={{ fontSize: 20, opacity: active ? 1 : 0.7, mr: isCollapsed ? 0 : 1.5 }} />
        
        {!isCollapsed && (
            <span className="flex-1 text-left text-[13px] truncate">{label}</span>
        )}
        
        {!isCollapsed && badge && (
          <span className="ml-2 px-1.5 py-0.5 text-[10px] font-black bg-[#7b68ee] text-white rounded-md">
            {badge}
          </span>
        )}

        {/* Tooltip for Collapsed State */}
        {isCollapsed && (
            <div className="absolute left-14 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-all translate-x-[-4px] group-hover:translate-x-0 shadow-xl border border-white/10">
                {label}
            </div>
        )}
      </button>
    );
  };

  const SectionTitle = ({ children, onAdd }) => {
    if (isCollapsed) return <div className="h-4 border-b border-slate-100 mb-2 mt-4 mx-4"></div>;
    return (
      <div className="flex items-center justify-between px-3 mt-6 mb-2 group/section">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 select-none">
            {children}
        </p>
        {onAdd && (
          <button onClick={onAdd} className="opacity-0 group-hover/section:opacity-100 p-0.5 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-900 transition-all">
            <AddRounded sx={{ fontSize: 16 }} />
          </button>
        )}
      </div>
    );
  };

  return (
    <aside 
        className={`transition-[width] duration-300 ease-in-out ${isCollapsed ? 'w-[80px]' : 'w-[260px]'} bg-white border-r border-slate-200 flex flex-col h-screen shrink-0 z-30 relative shadow-sm`}
    >
        {/* Collapse Toggle */}
        <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-6 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-[#7b68ee] hover:border-[#7b68ee]/50 hover:shadow-md transition-all z-40"
        >
            {isCollapsed ? <KeyboardDoubleArrowRightRounded sx={{ fontSize: 14 }} /> : <KeyboardDoubleArrowLeftRounded sx={{ fontSize: 14 }} />}
        </button>

        {/* Workspace Dropdown Section */}
        <div className="p-4 border-b border-slate-100 shrink-0 relative" ref={dropdownRef}>
            <button 
                onClick={() => setWsDropdownOpen(!wsDropdownOpen)}
                className={`w-full flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200 ${isCollapsed ? 'justify-center' : 'justify-start'}`}
            >
                <div className="w-8 h-8 rounded-lg premium-gradient flex items-center justify-center text-white font-bold shadow-md shadow-purple-500/20 shrink-0">
                    {activeWorkspace ? activeWorkspace.name.charAt(0).toUpperCase() : (userInfo?.name?.charAt(0) || 'S')}
                </div>
                
                {!isCollapsed && (
                    <div className="flex-1 text-left overflow-hidden">
                        <h2 className="text-[14px] font-bold text-slate-900 truncate">
                            {activeWorkspace ? activeWorkspace.name : 'Workspace'}
                        </h2>
                        <p className="text-[11px] text-slate-400 font-medium">Free Plan</p>
                    </div>
                )}
                {!isCollapsed && <KeyboardArrowDownRounded sx={{ fontSize: 18, color: 'text.disabled' }} />}
            </button>

            {/* Dropdown Menu */}
            {wsDropdownOpen && (
                <div className="absolute top-[100%] left-4 w-[240px] bg-white border border-slate-200 rounded-2xl shadow-xl py-2 overflow-hidden transform origin-top-left transition-all z-[120] mt-1">
                    <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <p className="text-[10px] font-black tracking-widest uppercase text-slate-500">Switch Workspace</p>
                    </div>
                    <div className="max-h-60 overflow-y-auto no-scrollbar">
                        {workspaces && workspaces.map(ws => (
                            <button
                                key={ws._id || ws.id}
                                onClick={() => handleSwitchWorkspace(ws)}
                                className={`w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors ${
                                    activeWorkspace && (activeWorkspace._id || activeWorkspace.id) === (ws._id || ws.id) 
                                    ? 'bg-[#7b68ee]/5' 
                                    : ''
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${
                                        activeWorkspace && (activeWorkspace._id || activeWorkspace.id) === (ws._id || ws.id)  ? 'bg-[#7b68ee] text-white' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    {ws.name.charAt(0).toUpperCase()}
                                </div>
                                <span className={`text-[13px] ${activeWorkspace && (activeWorkspace._id || activeWorkspace.id) === (ws._id || ws.id) ? 'font-bold text-[#7b68ee]' : 'font-semibold text-slate-700'} truncate flex-1`}>{ws.name}</span>
                                {activeWorkspace && (activeWorkspace._id || activeWorkspace.id) === (ws._id || ws.id)  && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#7b68ee]"></span>
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="p-2 border-t border-slate-100 bg-slate-50">
                        <button 
                            onClick={() => { setWsDropdownOpen(false); navigate(`/${userId}/workspaces`); }}
                            className="w-full text-left px-3 py-2 text-[12px] font-bold text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all flex items-center justify-between"
                        >
                            <span><AddRounded sx={{ fontSize: 16, mr: 1 }} /> New Workspace</span>
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* Global Action Button */}
        <div className="p-3">
            <button
                onClick={() => navigate(`/${userId}/projects`)}
                className={`w-full flex items-center justify-center py-2.5 rounded-xl transition-all ${isCollapsed ? 'bg-[#7b68ee]/10 text-[#7b68ee] hover:bg-[#7b68ee]/20' : 'premium-gradient text-white shadow-md shadow-[#7b68ee]/30 hover:shadow-lg hover:-translate-y-0.5'}`}
            >
                <AddBoxRounded sx={{ fontSize: 20 }} />
                {!isCollapsed && <span className="ml-2 text-[13px] font-bold">New Project</span>}
            </button>
        </div>

        {/* Navigation Wrapper */}
        <nav className="flex-1 overflow-y-auto no-scrollbar px-3 pb-6">
            <NavItem route="dashboard" Icon={HomeRounded} label="Home" />
            <NavItem route="calendar" Icon={CalendarMonthRounded} label="Calendar" badge="New" />
            <NavItem route="notifications" Icon={NotificationsRounded} label="Inbox" />

            {/* Projects Array */}
            <SectionTitle onAdd={() => navigate(`/${userId}/projects`)}>Spaces & Projects</SectionTitle>
            
            {!isCollapsed && (
                <button
                onClick={() => setProjectsOpen(!projectsOpen)}
                className="group flex items-center w-full px-3 py-1.5 text-[13px] font-bold text-slate-700 rounded-md hover:bg-slate-100 transition-all mb-1"
                >
                    <FolderSpecialRounded sx={{ fontSize: 18, mr: 1.5, color: '#f59e0b' }} />
                    <span className="flex-1 text-left">Everything</span>
                    <div className={`${projectsOpen ? 'rotate-180' : ''} transition-transform`}>
                        <KeyboardArrowDownRounded sx={{ fontSize: 16 }} />
                    </div>
                </button>
            )}

            {!isCollapsed && projectsOpen && (
            <div className="mt-1 space-y-[2px] ml-[20px] border-l-2 border-slate-100 pl-3 py-1">
                {projects && projects.length > 0 ? (
                projects.map((project) => (
                    <button
                    key={project._id || project.id}
                    onClick={() => navigate(`/${userId}/projects/${project._id || project.id}`)}
                    className={`flex items-center w-full px-2 py-[6px] text-[12px] font-semibold rounded-lg transition-all group/item ${location.pathname.includes(project._id || project.id)
                        ? 'text-[#7b68ee] bg-[#7b68ee]/5'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                    >
                        <div className={`w-1.5 h-1.5 rounded-full mr-2.5 transition-transform group-hover/item:scale-125 ${location.pathname.includes(project._id || project.id) ? 'bg-[#7b68ee]' : 'bg-slate-300'}`}></div>
                        <span className="truncate">{project.name}</span>
                    </button>
                ))
                ) : (
                <p className="px-2 py-1.5 text-[11px] text-slate-400 italic">No spaces yet</p>
                )}
            </div>
            )}
            {isCollapsed && <NavItem route="projects" Icon={FolderSpecialRounded} label="Spaces" />}
            
            {(hasPermission('sales', 'view') || hasPermission('leads', 'view') || hasPermission('crm', 'view')) && (
                <>
                    <SectionTitle>Sales & CRM</SectionTitle>
                    <NavItem route="leads" Icon={ContactPageRounded} label="Leads" />
                    <NavItem route="crm" Icon={BarChartRounded} label="CRM" />
                    <NavItem route="pipeline" Icon={TrendingUpRounded} label="Deals Pipeline" />
                    <NavItem route="invoices" Icon={ReceiptLongRounded} label="Invoices" />
                </>
            )}

            <SectionTitle>Reports & Analytics</SectionTitle>
            
            {!isCollapsed && (
                <button
                onClick={() => setReportsOpen(!reportsOpen)}
                className="group flex items-center w-full px-3 py-1.5 text-[13px] font-bold text-slate-700 rounded-md hover:bg-slate-100 transition-all mb-1"
                >
                    <BarChartRounded sx={{ fontSize: 18, mr: 1.5, color: '#10b981' }} />
                    <span className="flex-1 text-left">Analytics</span>
                    <div className={`${reportsOpen ? 'rotate-180' : ''} transition-transform`}>
                        <KeyboardArrowDownRounded sx={{ fontSize: 16 }} />
                    </div>
                </button>
            )}

            {!isCollapsed && reportsOpen && (
            <div className="mt-1 space-y-[2px] ml-[20px] border-l-2 border-slate-100 pl-3 py-1">
                <button
                    onClick={() => navigate(`/${userId}/reports/sales`)}
                    className={`flex items-center w-full px-2 py-[6px] text-[12px] font-semibold rounded-lg transition-all 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'`}
                ><span className="truncate">Sales Reports</span></button>
                <button
                    onClick={() => navigate(`/${userId}/reports/employee`)}
                    className={`flex items-center w-full px-2 py-[6px] text-[12px] font-semibold rounded-lg transition-all 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'`}
                ><span className="truncate">Employee Reports</span></button>
                <button
                    onClick={() => navigate(`/${userId}/reports/leads`)}
                    className={`flex items-center w-full px-2 py-[6px] text-[12px] font-semibold rounded-lg transition-all 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'`}
                ><span className="truncate">Lead Reports</span></button>
                <button
                    onClick={() => navigate(`/${userId}/reports/project`)}
                    className={`flex items-center w-full px-2 py-[6px] text-[12px] font-semibold rounded-lg transition-all 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'`}
                ><span className="truncate">Project Reports</span></button>
            </div>
            )}
            {isCollapsed && <NavItem route="reports/sales" Icon={BarChartRounded} label="Reports" />}

            <NavItem route="automations" Icon={AutoFixHighRounded} label="Automations" />

            {(hasPermission('hr', 'view') || hasPermission('employees', 'view')) && (
                <>
                    <SectionTitle>Company HQ</SectionTitle>
                    <NavItem route="hr-dashboard" Icon={DashboardRounded} label="HR Intelligence" badge={userInfo?.role === 'Admin' ? "Admin" : "HR"} />
                    <NavItem route="employee" Icon={PeopleAltRounded} label="Team" />
                    <NavItem route="attendance" Icon={EventAvailableRounded} label="Attendance" />
                    <NavItem route="salary" Icon={AccountBalanceWalletRounded} label="Payroll" />
                    <NavItem route="leave-expenses" Icon={BeachAccessRounded} label="Expense Claims" />
                </>
            )}

            {hasPermission('workspace', 'view') && (
                <>
                    <SectionTitle>Administration</SectionTitle>
                    <NavItem route="roles" Icon={SettingsRounded} label="Settings" />
                    <NavItem route="audit-logs" Icon={AdminPanelSettingsRounded} label="Security" />
                </>
            )}
        </nav>

        {/* Footer User Widget */}
        <div className="border-t border-slate-100 p-3 shrink-0 bg-slate-50/50">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} hover:bg-white p-1.5 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-200 hover:shadow-sm group`}>
                <div 
                    className="flex items-center gap-3 overflow-hidden"
                    onClick={() => navigate(`/${userId}/developer-settings`)}
                >
                    <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center text-slate-600 font-bold shrink-0">
                        {userInfo?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 overflow-hidden pointer-events-none">
                            <p className="text-[13px] font-bold text-slate-900 truncate">{userInfo?.name || 'User'}</p>
                            <p className="text-[11px] text-slate-500 font-medium tracking-tight truncate capitalize">{userInfo?.role || 'Member'}</p>
                        </div>
                    )}
                </div>
                
                <button 
                    onClick={handleLogout}
                    className={`shrink-0 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ${isCollapsed ? 'hidden' : 'w-8 h-8'}`}
                    title="Sign out"
                >
                    <LogoutRounded sx={{ fontSize: 18 }} />
                </button>

                {isCollapsed && (
                    <div className="absolute left-14 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-all translate-x-[-4px] group-hover:translate-x-0 shadow-xl border border-red-500/20">Sign Out</div>
                )}
            </div>
        </div>
    </aside>
  );
};

export default Sidebar;
