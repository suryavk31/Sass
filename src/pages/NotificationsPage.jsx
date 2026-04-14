import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { 
  NotificationsActiveRounded, 
  CheckCircleOutlineRounded,
  DeleteOutlineRounded
} from '@mui/icons-material';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // authConfig is handled automatically by axiosInstance.

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/notifications');
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`, {});
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/mark-all-read', {});
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <NotificationsActiveRounded className="text-[#7b68ee]" />
            Notifications Center
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage all your system alerts and tasks.</p>
        </div>
        
        {notifications.some(n => !n.isRead) && (
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all font-bold text-sm shadow-sm"
          >
            <CheckCircleOutlineRounded sx={{ fontSize: 18 }} />
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 font-medium">Loading notifications...</div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                onClick={() => markAsRead(notif.id)}
                className={`p-5 flex items-start gap-4 transition-colors cursor-pointer ${
                  !notif.isRead ? 'bg-[#7b68ee]/[0.03] hover:bg-[#7b68ee]/[0.05]' : 'hover:bg-slate-50'
                }`}
              >
                <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 shadow-sm ${!notif.isRead ? 'bg-[#7b68ee]' : 'bg-slate-200'}`}></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`text-[14px] ${!notif.isRead ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                      {notif.type || 'System'} Alert
                    </h3>
                    <span className="text-xs font-semibold text-slate-400">
                      {new Date(notif.createdAt).toLocaleString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-[13px] text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <CheckCircleOutlineRounded sx={{ fontSize: 32 }} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">You're all caught up!</h3>
            <p className="text-sm text-slate-500 mt-1">There are no new notifications to display.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
