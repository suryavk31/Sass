import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';
import { 
    CloseRounded,
    HistoryRounded,
    AddCircleOutlineRounded,
    AutorenewRounded,
    AssignmentIndRounded,
    DeleteOutlineRounded,
    ChatBubbleOutlineRounded
} from '@mui/icons-material';

const ActivityTimeline = ({ entityType, entityId, entityName, onClose, workspaceId }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // authConfig is handled automatically by axiosInstance.

    useEffect(() => {
        if (entityType && entityId && workspaceId) {
            fetchLogs();
        }
    }, [entityType, entityId, workspaceId]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/audit-logs?workspaceId=${workspaceId}&entityType=${entityType}&entityId=${entityId}`);
            setLogs(data.logs || []);
        } catch (error) {
            console.error("Failed to load timeline", error);
        } finally {
            setLoading(false);
        }
    };

    const getIconForAction = (action) => {
        if (action.includes('CREATE')) return <AddCircleOutlineRounded sx={{ fontSize: 16 }} className="text-emerald-500" />;
        if (action.includes('UPDATE')) return <AutorenewRounded sx={{ fontSize: 16 }} className="text-blue-500" />;
        if (action.includes('ASSIGN')) return <AssignmentIndRounded sx={{ fontSize: 16 }} className="text-purple-500" />;
        if (action.includes('DELETE')) return <DeleteOutlineRounded sx={{ fontSize: 16 }} className="text-red-500" />;
        return <ChatBubbleOutlineRounded sx={{ fontSize: 16 }} className="text-slate-400" />;
    };

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div 
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>
            
            <div className="relative w-full max-w-[400px] h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 animate-slide-in-right border-l border-slate-200">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 backdrop-blur-md shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <HistoryRounded sx={{ fontSize: 20, color: '#7b68ee' }} />
                            <h2 className="text-[16px] font-black tracking-tight text-slate-800">Activity Timeline</h2>
                        </div>
                        <p className="text-[12px] font-bold text-slate-400 tracking-wide">{entityType}: {entityName}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        <CloseRounded sx={{ fontSize: 18 }} />
                    </button>
                </div>

                {/* Body Timeline */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-6 bg-slate-50/30">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-4">
                            <div className="w-8 h-8 border-4 border-[#7b68ee]/20 border-t-[#7b68ee] rounded-full animate-spin"></div>
                            <p className="text-xs font-bold text-slate-400">Loading history...</p>
                        </div>
                    ) : logs.length > 0 ? (
                        <div className="relative border-l-2 border-slate-200/60 ml-4 space-y-8 pb-8">
                            {logs.map((log, idx) => (
                                <div key={log.id} className="relative pl-6">
                                    <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shadow-sm">
                                        {getIconForAction(log.action)}
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm group hover:border-[#7b68ee]/40 transition-colors">
                                        <div className="flex justify-between items-start mb-1.5">
                                            <h4 className="text-[13px] font-black text-slate-800 break-words leading-tight">
                                                {log.action.replace(/_/g, ' ')}
                                            </h4>
                                            <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                                                {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                        <p className="text-[12px] font-medium text-slate-500 leading-relaxed">
                                            <span className="font-bold text-slate-700">{log.User?.name || 'System'}</span> performed this action.
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center px-6">
                            <div className="w-16 h-16 bg-white border border-slate-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                <HistoryRounded sx={{ fontSize: 32, color: '#cbd5e1' }} />
                            </div>
                            <h3 className="text-sm font-bold text-slate-700 mb-1">No Activity Yet</h3>
                            <p className="text-[12px] font-medium text-slate-400">There are no recorded events for this record.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityTimeline;
