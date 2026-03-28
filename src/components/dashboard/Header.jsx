import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import socket from '../../socket';
import {
  SearchRounded,
  NotificationsNoneRounded,
  HelpOutlineRounded,
  SettingsRounded,
  ChevronRightRounded,
  CheckCircleOutlineRounded
} from '@mui/icons-material';

const Header = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const { projectId } = useParams();
  const location = useLocation();
  const { workspaces } = useSelector((state) => state.workspace);
  const { projects } = useSelector((state) => state.project);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const activeWorkspace = workspaces?.[0]?.name || 'Team Space';
  const currentProject = projects?.find(p => (p._id || p.id) === projectId)?.name;
  
  // Determine page title based on route logic
  let pageTitle = 'Dashboard';
  if (location.pathname.includes('/projects/')) {
    pageTitle = location.pathname.includes('board') ? 'Kanban Board' : 'Task List';
  } else if (location.pathname.includes('/projects')) {
    pageTitle = 'Project Library';
  } else if (location.pathname.includes('/employee')) {
    pageTitle = 'Members';
  } else if (location.pathname.includes('/calendar')) {
    pageTitle = 'Inbox';
  } else if (location.pathname.includes('/roles')) {
    pageTitle = 'Settings';
  }

  const token = localStorage.getItem('token');
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch notifications
  useEffect(() => {
    if (!userInfo?.id) return;
    
    // Join socket room
    socket.emit("join", userInfo.id);

    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get('/api/notifications', authConfig);
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications");
      }
    };
    fetchNotifications();

    socket.on("notification", (newNotification) => {
      setNotifications(prev => [newNotification, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/mark-all-read', {}, authConfig);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`, {}, authConfig);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20">
      <div className="mx-auto px-6">
        <div className="flex items-center justify-between h-[56px]">
          {/* Breadcrumbs / Page Title */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 text-slate-400 group cursor-pointer hover:bg-slate-100 px-2 py-1 rounded-lg transition-all">
              <span className="text-[11px] font-black tracking-[0.05em] uppercase select-none">{activeWorkspace}</span>
              <ChevronRightRounded sx={{ fontSize: 14, opacity: 0.5 }} />
            </div>
            {currentProject && (
              <div className="flex items-center gap-1 text-slate-400 group cursor-pointer hover:bg-slate-100 px-2 py-1 rounded-lg transition-all">
                <span className="text-[11px] font-black tracking-[0.05em] uppercase select-none">{currentProject}</span>
                <ChevronRightRounded sx={{ fontSize: 14, opacity: 0.5 }} />
              </div>
            )}
            <h2 className="text-[13px] font-black text-slate-900 tracking-tight ml-1 px-2 py-1 bg-slate-100/50 rounded-lg">{pageTitle}</h2>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-6">
            <div className="relative group w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#7b68ee] transition-colors">
                <SearchRounded sx={{ fontSize: 18 }} />
              </div>
              <input
                type="search"
                placeholder="Search anything..."
                className="block w-full pl-10 pr-4 py-1.5 border border-slate-200/80 rounded-xl bg-slate-50/50 hover:bg-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#7b68ee]/5 focus:border-[#7b68ee] text-[12px] transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2 rounded-xl transition-all relative ${showNotifications ? 'text-[#7b68ee] bg-[#7b68ee]/10' : 'text-slate-500 hover:text-[#7b68ee] hover:bg-[#7b68ee]/10'}`}
                >
                  <NotificationsNoneRounded sx={{ fontSize: 20 }} />
                  {unreadCount > 0 && <span className="absolute top-2.5 right-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
                </button>

                {/* Dropdown Panel */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                      <h3 className="text-sm font-black text-slate-800 tracking-tight">Notifications</h3>
                      {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="text-[10px] font-black tracking-widest uppercase text-[#7b68ee] hover:text-[#6c58e0] transition-colors">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        <div className="divide-y divide-slate-50">
                          {notifications.map((notif, idx) => (
                            <div key={notif.id || idx} onClick={() => markAsRead(notif.id)} className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${!notif.isRead ? 'bg-[#7b68ee]/[0.02]' : ''}`}>
                              <div className="flex gap-3">
                                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${!notif.isRead ? 'bg-[#7b68ee]' : 'bg-transparent'}`}></div>
                                <div>
                                  <p className={`text-[13px] ${!notif.isRead ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>
                                    {notif.message}
                                  </p>
                                  <span className="text-[10px] font-bold text-slate-400 mt-1 block">
                                    {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : 'Just now'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center text-slate-400">
                          <CheckCircleOutlineRounded sx={{ fontSize: 32 }} className="mb-2 opacity-50" />
                          <p className="text-[13px] font-bold">You're all caught up!</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="w-px h-6 bg-slate-200 mx-1"></div>
              <div className="flex items-center gap-3 pl-1">
                 <div className="w-8 h-8 rounded-full premium-gradient flex items-center justify-center text-white text-[10px] font-black shadow-md shadow-purple-500/10">
                    {userInfo?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;