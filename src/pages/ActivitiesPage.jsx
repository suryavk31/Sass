import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { useSelector, useDispatch } from 'react-redux';
import { listWorkspaces } from '../actions/workspaceActions';
import { AddRounded, PhoneRounded, EmailRounded, SupportAgentRounded, DescriptionRounded, CheckCircleRounded, RadioButtonUncheckedRounded } from '@mui/icons-material';

const ActivitiesPage = () => {
    const dispatch = useDispatch();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ type: 'Call', title: '', description: '', dueDate: '', isCompleted: false });

    const workspaceList = useSelector((state) => state.workspace);
    const { workspaces } = workspaceList;
    const [currentWorkspaceId, setCurrentWorkspaceId] = useState('');

    // authConfig is handled automatically by axiosInstance.

    useEffect(() => {
        dispatch(listWorkspaces());
    }, [dispatch]);

    useEffect(() => {
        if (currentWorkspaceId) {
            fetchActivities(currentWorkspaceId);
        } else if (workspaces && workspaces.length > 0) {
            setCurrentWorkspaceId(workspaces[0]._id);
            fetchActivities(workspaces[0]._id);
        }
    }, [workspaces, currentWorkspaceId]);

    const fetchActivities = async (workspaceId) => {
        if (!workspaceId || workspaceId === 'undefined') return;
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/activities?workspaceId=${workspaceId}`);
            setActivities(data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const handleCreateActivity = async () => {
        if (!formData.title || !formData.type) return;

        try {
            await axios.post('/api/activities', {
                ...formData,
                workspaceId: currentWorkspaceId
            });
            fetchActivities(currentWorkspaceId);
            setShowModal(false);
            setFormData({ type: 'Call', title: '', description: '', dueDate: '', isCompleted: false });
        } catch (error) {
            console.error(error);
        }
    };

    const toggleCompletion = async (activity) => {
        try {
            await axios.put(`/api/activities/${activity.id}`, {
                isCompleted: !activity.isCompleted
            });
            fetchActivities(currentWorkspaceId);
        } catch (error) {
            console.error(error);
        }
    };

    const getTypeIcon = (type) => {
        switch(type) {
            case 'Call': return <PhoneRounded sx={{ fontSize: 18 }} className="text-blue-500" />;
            case 'Email': return <EmailRounded sx={{ fontSize: 18 }} className="text-emerald-500" />;
            case 'Meeting': return <SupportAgentRounded sx={{ fontSize: 18 }} className="text-purple-500" />;
            default: return <DescriptionRounded sx={{ fontSize: 18 }} className="text-amber-500" />;
        }
    };

    return (
        <div className="flex-1 bg-slate-50 flex flex-col min-w-0 h-full overflow-hidden p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Activities</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Track calls, meetings, notes, and emails.</p>
                </div>
                
                <button 
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-[#7b68ee] hover:bg-[#6c58e0] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#7b68ee]/30 transition-all"
                >
                    <AddRounded sx={{ fontSize: 20 }} />
                    Log Activity
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-4">
                {loading && activities.length === 0 ? (
                    <div className="flex justify-center p-12 text-[#7b68ee]">
                        <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent rounded-full" role="status"></div>
                    </div>
                ) : activities.length > 0 ? (
                    <div className="space-y-4">
                        {activities.map((activity, idx) => (
                            <div key={activity.id} className={`bg-white p-5 rounded-3xl border border-slate-200 flex gap-4 ${activity.isCompleted ? 'opacity-60' : ''} hover:border-[#7b68ee]/30 hover:shadow-md transition-all`}>
                                <button 
                                    onClick={() => toggleCompletion(activity)}
                                    className="mt-1 text-slate-300 hover:text-emerald-500 transition-colors"
                                >
                                    {activity.isCompleted ? <CheckCircleRounded className="text-emerald-500" /> : <RadioButtonUncheckedRounded />}
                                </button>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 border border-slate-100 shadow-sm">
                                            {getTypeIcon(activity.type)}
                                        </div>
                                        <h3 className={`text-lg font-black tracking-tight ${activity.isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                                            {activity.title}
                                        </h3>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded ml-auto">
                                            {new Date(activity.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {activity.description && (
                                        <p className="text-sm text-slate-500 font-medium pl-11 mb-2 line-clamp-2">
                                            {activity.description}
                                        </p>
                                    )}
                                    <div className="pl-11 flex items-center gap-3 mt-3">
                                        <div className="text-[11px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                                            Type: <span className="text-slate-800">{activity.type}</span>
                                        </div>
                                        {activity.dueDate && (
                                            <div className="text-[11px] font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
                                                Due: {new Date(activity.dueDate).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white border border-slate-200 rounded-3xl shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <DescriptionRounded sx={{ fontSize: 40 }} />
                        </div>
                        <h3 className="text-lg font-black text-slate-800">No activities recorded</h3>
                        <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto mt-2 mb-6">Keep track of your calls, meetings, and emails to close deals faster.</p>
                        <button 
                            onClick={() => setShowModal(true)}
                            className="bg-[#7b68ee] text-white hover:bg-[#6c58e0] px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-[#7b68ee]/20"
                        >
                            Log First Activity
                        </button>
                    </div>
                )}
            </div>

            {/* Create Activity Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] p-8 w-[500px] shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-slate-900">Log New Activity</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Activity Type</label>
                                <select 
                                    value={formData.type} 
                                    onChange={(e) => setFormData({...formData, type: e.target.value})} 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#7b68ee]/30 focus:border-[#7b68ee] outline-none transition-all"
                                >
                                    <option value="Call">Call</option>
                                    <option value="Meeting">Meeting</option>
                                    <option value="Email">Email</option>
                                    <option value="Note">Note</option>
                                    <option value="Task">Task</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Subject / Title</label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#7b68ee]/30 focus:border-[#7b68ee] outline-none transition-all placeholder:text-slate-400 placeholder:font-medium" placeholder="e.g., Discovery Call with John" />
                            </div>
                            
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Description / Notes</label>
                                <textarea rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#7b68ee]/30 focus:border-[#7b68ee] outline-none transition-all resize-none placeholder:text-slate-400 placeholder:font-medium" placeholder="Discussed pricing and timelines..." />
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Due Date (Optional)</label>
                                <input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#7b68ee]/30 focus:border-[#7b68ee] outline-none transition-all" />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-10">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-5 py-3.5 rounded-xl text-sm font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleCreateActivity}
                                className="flex-1 px-5 py-3.5 rounded-xl text-sm font-bold bg-[#7b68ee] text-white hover:bg-[#6c58e0] shadow-xl shadow-[#7b68ee]/20 transition-all"
                            >
                                Save Activity
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivitiesPage;
