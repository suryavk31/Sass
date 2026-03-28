import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { 
    TrendingUpRounded, 
    EmojiEventsRounded, 
    AttachMoneyRounded, 
    TrackChangesRounded, 
    FilterAltRounded 
} from '@mui/icons-material';

const SalesDashboard = () => {
    const [stats, setStats] = useState({});
    const [leaderboard, setLeaderboard] = useState([]);
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ startDate: '', endDate: '', salesType: '', status: '' });
    const [targetForm, setTargetForm] = useState({ revenueTarget: 0, dealCountTarget: 0, period: new Date().toISOString().substring(0,7) });

    const workspaceList = useSelector(state => state.workspace);
    const { workspaces, userRole } = workspaceList;
    const currentWorkspaceId = localStorage.getItem('activeWorkspaceId') || (workspaces?.length ? workspaces[0]._id : null);
    
    const isAdmin = userRole?.roleName === 'Admin';
    const permissions = userRole?.permissions || [];

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const authConfig = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        if (currentWorkspaceId) {
            fetchData();
        }
    }, [currentWorkspaceId, filters]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const period = new Date().toISOString().substring(0,7);
            const [statsRes, lbRes, dealsRes] = await Promise.all([
                axios.get(`/api/sales/stats?workspaceId=${currentWorkspaceId}&userId=${userId}&period=${period}`, authConfig),
                axios.get(`/api/sales/leaderboard?workspaceId=${currentWorkspaceId}`, authConfig),
                axios.get(`/api/sales/filtered-deals?workspaceId=${currentWorkspaceId}&startDate=${filters.startDate}&endDate=${filters.endDate}&status=${filters.status}&salesType=${filters.salesType}`, authConfig)
            ]);
            setStats(statsRes.data);
            setLeaderboard(lbRes.data);
            setDeals(dealsRes.data);
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        }
        setLoading(false);
    };

    const handleSetTarget = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/sales/targets', {
                workspaceId: currentWorkspaceId,
                userId,
                period: targetForm.period,
                revenueTarget: targetForm.revenueTarget,
                dealCountTarget: targetForm.dealCountTarget
            }, authConfig);
            alert("Target updated successfully!");
            fetchData();
        } catch (error) {
            console.error(error);
            alert("Failed to update target");
        }
    };

    return (
        <div className="flex-1 overflow-auto bg-[#fafafa] p-8 h-full">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-6">Sales Performance Dashboard</h1>
            
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <TrendingUpRounded sx={{fontSize: 18}} />
                        <span className="text-xs font-bold uppercase tracking-widest">Total Revenue</span>
                    </div>
                    <div className="text-3xl font-black text-[#7b68ee]">${stats.totalRevenue?.toLocaleString() || 0}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <AttachMoneyRounded sx={{fontSize: 18}} />
                        <span className="text-xs font-bold uppercase tracking-widest">Deals Closed</span>
                    </div>
                    <div className="text-3xl font-black text-emerald-500">{stats.dealsClosed || 0}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <TrackChangesRounded sx={{fontSize: 18}} />
                        <span className="text-xs font-bold uppercase tracking-widest">Win Rate</span>
                    </div>
                    <div className="text-3xl font-black text-amber-500">{stats.conversionRate?.toFixed(1) || 0}%</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <EmojiEventsRounded sx={{fontSize: 18}} />
                        <span className="text-xs font-bold uppercase tracking-widest">Target Achievement</span>
                    </div>
                    <div className="text-3xl font-black text-blue-500">{stats.targetAchievement?.toFixed(1) || 0}%</div>
                    {stats.target && <div className="text-xs font-bold text-slate-400 mt-1">Goal: ${stats.target.revenueTarget}</div>}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Leaderboard */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm lg:col-span-1 p-6">
                    <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                        <EmojiEventsRounded className="text-amber-500" /> Leaderboard
                    </h2>
                    <div className="space-y-4">
                        {leaderboard.map((entry, idx) => (
                            <div key={entry.user.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${idx === 0 ? 'bg-amber-100 text-amber-600' : idx === 1 ? 'bg-slate-200 text-slate-600' : idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                                        #{idx + 1}
                                    </div>
                                    <div className="text-sm font-bold text-slate-700">{entry.user.firstName} {entry.user.lastName}</div>
                                </div>
                                <div className="text-sm font-black text-[#7b68ee]">${entry.revenue.toLocaleString()}</div>
                            </div>
                        ))}
                        {leaderboard.length === 0 && <div className="text-sm text-slate-400 font-medium text-center py-4">No won deals yet.</div>}
                    </div>
                </div>

                {/* Filters & Set Target */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Target Setting */}
                        { (isAdmin || permissions.find(p => p.module === 'Sales')?.create) && (
                            <div className="flex-1">
                                <h2 className="text-lg font-black text-slate-800 mb-4">Set Monthly Target</h2>
                                <form onSubmit={handleSetTarget} className="space-y-3">
                                    <input type="month" value={targetForm.period} onChange={e => setTargetForm({...targetForm, period: e.target.value})} className="w-full text-sm font-bold text-slate-700 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-[#7b68ee]" />
                                    <input type="number" placeholder="Revenue Target ($)" value={targetForm.revenueTarget} onChange={e => setTargetForm({...targetForm, revenueTarget: e.target.value})} className="w-full text-sm font-bold text-slate-700 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-[#7b68ee]" />
                                    <button type="submit" className="w-full bg-[#7b68ee] text-white font-bold text-sm py-2 rounded-lg hover:bg-purple-600 transition-colors">Save Target</button>
                                </form>
                            </div>
                        )}
                        {/* Filters */}
                        <div className="flex-1">
                            <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                                <FilterAltRounded className="text-slate-400" /> Track Deals
                            </h2>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <input type="date" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} className="w-full text-xs font-bold text-slate-700 px-2 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none" />
                                    <input type="date" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} className="w-full text-xs font-bold text-slate-700 px-2 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none" />
                                </div>
                                <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="w-full text-sm font-bold text-slate-700 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none">
                                    <option value="">All Statuses</option>
                                    <option value="Open">Open</option>
                                    <option value="Won">Won</option>
                                    <option value="Lost">Lost</option>
                                </select>
                                <input type="text" placeholder="Sales Type (e.g. Car, Software)" value={filters.salesType} onChange={e => setFilters({...filters, salesType: e.target.value})} className="w-full text-sm font-bold text-slate-700 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtered Deals Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-black text-slate-700">Filtered Deals ({deals.length})</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
                                <th className="px-6 py-4">Deal Title</th>
                                <th className="px-6 py-4">Value</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Closing Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {deals.map(deal => (
                                <tr key={deal.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-slate-800">{deal.title}</td>
                                    <td className="px-6 py-4 text-sm font-black text-[#7b68ee]">${parseFloat(deal.value).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${deal.status === 'Won' ? 'bg-emerald-100 text-emerald-700' : deal.status === 'Lost' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                                            {deal.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-500">{deal.salesType || '-'}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-500">{deal.closingDate ? new Date(deal.closingDate).toLocaleDateString() : '-'}</td>
                                </tr>
                            ))}
                            {deals.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-sm font-medium text-slate-400">No deals matched the current filters.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SalesDashboard;
