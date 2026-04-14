import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { useSelector } from 'react-redux';
import {
    PeopleAltRounded,
    BeachAccessRounded,
    AccountBalanceWalletRounded,
    ReceiptLongRounded,
    TrendingUpRounded,
    CheckCircleRounded,
    EventBusyRounded,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

const HRDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const workspaceList = useSelector((state) => state.workspace);
    const { workspaces } = workspaceList;
    const [currentWorkspaceId, setCurrentWorkspaceId] = useState('');

    useEffect(() => {
        const savedId = localStorage.getItem('activeWorkspaceId');
        if (savedId) {
            setCurrentWorkspaceId(savedId);
        } else if (workspaces && workspaces.length > 0) {
            setCurrentWorkspaceId(workspaces[0]._id || workspaces[0].id);
        }
    }, [workspaces]);

    useEffect(() => {
        if (currentWorkspaceId) {
            fetchStats();
        }
    }, [currentWorkspaceId]);

    const fetchStats = async () => {
        if (!currentWorkspaceId || currentWorkspaceId === 'undefined') return;
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/hr/dashboard-stats?workspaceId=${currentWorkspaceId}`);
            setStats(data);
        } catch (error) {
            toast.error("Failed to load HR metrics");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#7b68ee] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-bold animate-pulse">Computing Matrix...</p>
                </div>
            </div>
        );
    }

    const StatCard = ({ title, value, sub, Icon, color }) => (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform`}></div>
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}>
                    <Icon sx={{ fontSize: 28, color: color.split('-')[1] }} className={color.replace('bg-', 'text-')} />
                </div>
                {sub && <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{sub}</span>}
            </div>
            <h3 className="text-slate-500 text-xs font-black uppercase tracking-wider mb-1">{title}</h3>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
        </div>
    );

    return (
        <div className="flex-1 bg-[#f8fafc] flex flex-col h-full overflow-hidden p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">HR Intelligence</h1>
                    <p className="text-slate-500 text-sm font-medium">Real-time overview of your workforce and operations.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchStats} className="bg-white border border-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-2xl hover:bg-slate-50 text-sm shadow-sm transition-all focus:ring-2 ring-[#7b68ee]/20 outline-none">
                        Refresh Data
                    </button>
                    <button className="premium-gradient text-white font-bold px-6 py-2.5 rounded-2xl shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm">
                        Export Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Active Headcount" value={stats?.totalEmployees || 0} Icon={PeopleAltRounded} color="bg-blue-600" />
                <StatCard title="Total Leaves" sub="Pending" value={stats?.pendingLeaves || 0} Icon={BeachAccessRounded} color="bg-amber-600" />
                <StatCard title="Expense Claims" sub="Awaiting" value={stats?.pendingExpenses || 0} Icon={ReceiptLongRounded} color="bg-emerald-600" />
                <StatCard title="Current Payroll" sub="Paid" value={`₹${stats?.totalPayroll?.toLocaleString() || 0}`} Icon={AccountBalanceWalletRounded} color="bg-purple-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
                {/* Attendance Waterfall */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <TrendingUpRounded />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">7-Day Attendance Flow</h2>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Workspace Dynamics</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-auto no-scrollbar">
                        <div className="inline-block min-w-full align-middle">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="text-left text-[10px] font-black uppercase text-slate-400 py-4 px-2">Employee</th>
                                        <th className="text-left text-[10px] font-black uppercase text-slate-400 py-4 px-2">Role</th>
                                        <th className="text-right text-[10px] font-black uppercase text-slate-400 py-4 px-2">Weekly Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.recentAttendance && Object.entries(
                                        stats.recentAttendance.reduce((acc, curr) => {
                                            const name = curr.Employee?.name || 'Unknown';
                                            if (!acc[name]) acc[name] = [];
                                            acc[name].push(curr);
                                            return acc;
                                        }, {})
                                    ).map(([name, records]) => (
                                        <tr key={name} className="border-b border-slate-50 hover:bg-slate-50 group">
                                            <td className="py-4 px-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-black group-hover:bg-[#7b68ee] group-hover:text-white transition-colors uppercase">
                                                        {name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700">{name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-2">
                                                <span className="text-xs text-slate-400 font-medium">Software Engineer</span>
                                            </td>
                                            <td className="py-4 px-2 text-right">
                                                <div className="flex gap-1 justify-end">
                                                    {Array.from({ length: 7 }).map((_, i) => {
                                                        const d = new Date();
                                                        d.setDate(d.getDate() - (6 - i));
                                                        const dateStr = d.toISOString().split('T')[0];
                                                        const record = records.find(r => r.date === dateStr);
                                                        
                                                        let color = "bg-slate-100 shadow-inner";
                                                        if (record?.status === 'Present') color = "bg-emerald-500 shadow-lg shadow-emerald-500/20 scale-110";
                                                        if (record?.status === 'Half-day') color = "bg-amber-500 shadow-lg shadow-amber-500/20";
                                                        if (record?.status === 'Absent') color = "bg-rose-500 shadow-lg shadow-rose-500/20";

                                                        return (
                                                            <div key={i} title={`${dateStr}: ${record?.status || 'No Data'}`} className={`w-3 h-6 rounded-full ${color} transition-all duration-500 cursor-help`}></div>
                                                        );
                                                    })}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {( !stats?.recentAttendance || stats.recentAttendance.length === 0 ) && (
                                        <tr>
                                            <td colSpan="3" className="py-20 text-center flex flex-col items-center justify-center gap-4">
                                                <div className="w-16 h-16 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-300">
                                                    <EventBusyRounded sx={{ fontSize: 32 }} />
                                                </div>
                                                <p className="text-slate-400 font-bold text-sm">No activity records in the last 7 days.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Recent Actions / Feed */}
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col overflow-hidden">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight mb-6">Critical Actions</h2>
                    <div className="space-y-4">
                        {stats?.pendingLeaves > 0 && (
                            <div className="p-4 rounded-3xl bg-amber-50 border border-amber-100 flex items-center gap-4 group hover:bg-amber-100 transition-colors cursor-pointer">
                                <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white font-black shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                                    {stats.pendingLeaves}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black text-amber-900">Leave Approvals</p>
                                    <p className="text-[10px] font-bold text-amber-700/60 uppercase tracking-widest leading-none">Awaiting Signature</p>
                                </div>
                            </div>
                        )}
                        {stats?.pendingExpenses > 0 && (
                            <div className="p-4 rounded-3xl bg-[#7b68ee]/5 border border-[#7b68ee]/10 flex items-center gap-4 group hover:bg-[#7b68ee]/10 transition-colors cursor-pointer">
                                <div className="w-12 h-12 rounded-2xl bg-[#7b68ee] flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                                    {stats.pendingExpenses}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black text-indigo-900">Expense Claims</p>
                                    <p className="text-[10px] font-bold text-indigo-700/60 uppercase tracking-widest leading-none">Pending Reimbursement</p>
                                </div>
                            </div>
                        )}
                        <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100 flex items-center gap-4 hover:bg-slate-100 transition-colors cursor-pointer opacity-60">
                             <div className="w-12 h-12 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400 font-black">
                                0
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-black text-slate-900">Performance Reviews</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Cycle Scheduled</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-8 border-t border-slate-100">
                        <div className="bg-[#7b68ee] rounded-3xl p-6 relative overflow-hidden group">
                           <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                           <h4 className="text-white font-black text-lg mb-2 relative z-10">Employee Portal</h4>
                           <p className="text-white/70 text-xs mb-4 relative z-10 leading-relaxed font-medium">Standard employees see a restricted version of this view tailored to their own performance metrics.</p>
                           <button className="w-full py-2.5 bg-white text-[#7b68ee] font-black rounded-xl text-sm hover:bg-slate-50 transition-colors relative z-10 shadow-xl shadow-black/10">
                                Configure Access
                           </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HRDashboardPage;
