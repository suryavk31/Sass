// src/components/dashboard/Sidebar.js — Premium Glassmorphic Sidebar
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listWorkspaces } from '../../actions/workspaceActions';
import { listProjects } from '../../actions/projectActions';
import {
  HomeRounded,
  FolderSpecialRounded,
  CalendarMonthRounded,
  PeopleAltRounded,
  AssessmentRounded,
  AdminPanelSettingsRounded,
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
  AddRounded,
  WorkspacesRounded,
  GridViewRounded,
  HistoryRounded,
  CodeRounded,
  AutoFixHighRounded,
  ChevronRightRounded,
  SettingsRounded,
  LogoutRounded,
  TrendingUpRounded,
  EventAvailableRounded,
  AccountBalanceWalletRounded,
  ReceiptLongRounded,
  BeachAccessRounded,
  ContactPageRounded,
  BarChartRounded,
  DashboardRounded,
  NotificationsRounded,
} from '@mui/icons-material';
import { logout } from '../../actions/authActions';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userId = localStorage.getItem('userId');
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const [projectsOpen, setProjectsOpen] = useState(true);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState('');

  const workspaceState = useSelector((state) => state.workspace);
  const { workspaces } = workspaceState;

  const projectState = useSelector((state) => state.project);
  const { projects } = projectState;

  useEffect(() => {
    dispatch(listWorkspaces());
  }, [dispatch]);

  useEffect(() => {
    if (workspaces && workspaces.length > 0 && !selectedWorkspaceId) {
      setSelectedWorkspaceId(workspaces[0]._id || workspaces[0].id);
    }
  }, [workspaces, selectedWorkspaceId]);

  useEffect(() => {
    if (selectedWorkspaceId) {
      dispatch(listProjects(selectedWorkspaceId));
    }
  }, [dispatch, selectedWorkspaceId]);

  const isActive = (routeSegment) => location.pathname.includes(routeSegment);

  const NavItem = ({ route, Icon, label, onClick, badge }) => {
    const active = isActive(route);
    return (
      <button
        onClick={onClick || (() => navigate(`/${userId}/${route}`))}
        className={`group flex items-center w-full px-3 py-1.5 text-[13px] font-medium rounded-md transition-all duration-200 ${active
          ? 'bg-[#eeebff] text-[#7b68ee]'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
      >
        <Icon sx={{ fontSize: 18, mr: 1.5, opacity: active ? 1 : 0.7 }} />
        <span className="flex-1 text-left">{label}</span>
        {badge && (
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-500 rounded-sm">
            {badge}
          </span>
        )}
      </button>
    );
  };

  const SectionTitle = ({ children, icon: Icon, onAdd }) => (
    <div className="flex items-center justify-between px-3 mt-6 mb-1 group/section">
      <div className="flex items-center gap-2">
        {Icon && <Icon sx={{ fontSize: 14, color: 'text.disabled' }} />}
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {children}
        </p>
      </div>
      {onAdd && (
        <button onClick={onAdd} className="opacity-0 group-hover/section:opacity-100 p-0.5 hover:bg-slate-200 rounded transition-all">
          <AddRounded sx={{ fontSize: 14, color: 'text.secondary' }} />
        </button>
      )}
    </div>
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <aside className="w-[260px] glass-sidebar flex flex-col h-screen shrink-0 z-30 border-r border-[#e9ebf0]">
      {/* Workspace Header */}
      <div className="px-4 py-3 border-b border-[#e9ebf0]">
        <div className="flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-all">
          <div className="w-7 h-7 bg-[#7b68ee] rounded flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold">{workspaces?.[0]?.name?.charAt(0) || 'S'}</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <h1 className="text-slate-900 font-bold text-[13px] truncate">{workspaces?.[0]?.name || 'Team Space'}</h1>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              <p className="text-slate-400 text-[10px] font-medium uppercase tracking-tighter">Online</p>
            </div>
          </div>
          <KeyboardArrowDownRounded sx={{ fontSize: 18, color: 'text.disabled' }} />
        </div>
      </div>

      {/* Navigation Scrollable Area */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto no-scrollbar py-4">
        <NavItem route="dashboard" Icon={HomeRounded} label="Home" />
        <NavItem route="calendar" Icon={CalendarMonthRounded} label="Inbox" badge="3" />

        <SectionTitle>Favorites</SectionTitle>
        <p className="px-3 py-2 text-[11px] text-slate-400 italic">No favorites yet</p>

        <SectionTitle onAdd={() => navigate(`/${userId}/projects`)}>Spaces</SectionTitle>
        <button
          onClick={() => setProjectsOpen(!projectsOpen)}
          className="group flex items-center w-full px-3 py-1.5 text-[13px] font-medium text-slate-600 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-all"
        >
          <FolderSpecialRounded sx={{ fontSize: 18, mr: 1.5, opacity: 0.7 }} />
          <span className="flex-1 text-left">Everything</span>
          <div className={`${projectsOpen ? 'rotate-180' : ''} transition-transform`}>
            <KeyboardArrowDownRounded sx={{ fontSize: 16 }} />
          </div>
        </button>

        {projectsOpen && (
          <div className="mt-0.5 space-y-0.5 ml-3 pl-3 border-l-2 border-slate-100">
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <button
                  key={project._id || project.id}
                  onClick={() => navigate(`/${userId}/projects/${project._id || project.id}`)}
                  className={`flex items-center w-full px-3 py-1.5 text-[13px] rounded-md transition-all ${location.pathname.includes(project._id || project.id)
                    ? 'text-[#7b68ee] font-semibold bg-[#eeebff]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <div className="w-2 h-2 rounded-full bg-slate-300 mr-2.5"></div>
                  <span className="truncate">{project.name}</span>
                </button>
              ))
            ) : (
              <p className="px-3 py-1.5 text-[11px] text-slate-400 italic">No spaces</p>
            )}
          </div>
        )}

        <SectionTitle>Sales & CRM</SectionTitle>
        <NavItem route="leads" Icon={ContactPageRounded} label="Leads" />
        <NavItem route="crm" Icon={BarChartRounded} label="CRM" />
        <NavItem route="pipeline" Icon={TrendingUpRounded} label="Sales Pipeline" />
        <NavItem route="invoices" Icon={ReceiptLongRounded} label="Invoices (Billing)" />

        <SectionTitle>Dashboards & Tools</SectionTitle>
        <NavItem route="dashboards" Icon={DashboardRounded} label="Dashboards" />
        <NavItem route="automations" Icon={AutoFixHighRounded} label="Automations" />
        <NavItem route="notifications" Icon={NotificationsRounded} label="Notifications" />

        <SectionTitle>Admin & HR</SectionTitle>
        <NavItem route="employee" Icon={PeopleAltRounded} label="Members" />
        <NavItem route="attendance" Icon={EventAvailableRounded} label="Attendance" />
        <NavItem route="salary" Icon={AccountBalanceWalletRounded} label="Payroll" />
        <NavItem route="leave-expenses" Icon={BeachAccessRounded} label="Leave & Expenses" />
        <NavItem route="roles" Icon={SettingsRounded} label="Settings" />
        <NavItem route="audit-logs" Icon={AdminPanelSettingsRounded} label="Security" />
      </nav>

      {/* User Session Footer */}
      <div className="p-3 border-t border-[#e9ebf0] bg-slate-50/50">
        <div className="flex items-center gap-3 p-2 rounded-lg group transition-all">
          <div className="w-8 h-8 premium-gradient rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-sm shrink-0">
            {userInfo?.name?.split(' ').map(n => n[0]).join('') || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[12px] font-bold text-slate-900 truncate">{userInfo?.name || 'User'}</p>
            <p className="text-[10px] text-slate-500 font-medium tracking-tight truncate capitalize">{userInfo?.role || 'Member'}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-md transition-all duration-200"
            title="Logout"
          >
            <LogoutRounded sx={{ fontSize: 18 }} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
