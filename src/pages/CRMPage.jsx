import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { useSelector, useDispatch } from 'react-redux';
import { listWorkspaces } from '../actions/workspaceActions';
import { 
    BarChartRounded, 
    PeopleAltRounded, 
    CheckCircleRounded, 
    AssessmentRounded,
    TrendingUpRounded,
    PersonRounded,
    CurrencyRupeeRounded,
    SyncRounded
} from '@mui/icons-material';

const CRMPage = () => {
    const dispatch = useDispatch();
    const [crmStats, setCrmStats] = useState(null);
    const [performance, setPerformance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedWorkspace, setSelectedWorkspace] = useState('');

    const { userInfo } = useSelector((state) => state.user || {});
    const workspaceList = useSelector((state) => state.workspace);
    const { workspaces } = workspaceList;

    // authConfig is handled automatically by axiosInstance interceptors

    useEffect(() => {
        dispatch(listWorkspaces());
    }, [dispatch]);

    useEffect(() => {
        if (selectedWorkspace) {
            fetchData(selectedWorkspace);
        } else if (workspaces && workspaces.length > 0) {
            setSelectedWorkspace(workspaces[0]._id);
        }
    }, [workspaces, selectedWorkspace]);

    const fetchData = async (workspaceId) => {
        if (!workspaceId || workspaceId === 'undefined') return;
        setLoading(true);
        try {
            const [statsRes, perfRes] = await Promise.all([
                axios.get(`/api/crm/stats?workspaceId=${workspaceId}`),
                axios.get(`/api/crm/employee-performance?workspaceId=${workspaceId}`)
            ]);
            setCrmStats(statsRes.data);
            setPerformance(perfRes.data);
        } catch (error) {
            console.error("Error fetching CRM analytics:", error);
        }
        setLoading(false);
    };

    const formatCurrency = (val) => {
        if (val >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
        return `₹${val}`;
    };

    const statsConfig = [
        { label: 'Total Leads', value: crmStats?.totalLeads || 0, icon: PeopleAltRounded, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Qualified', value: crmStats?.qualifiedLeads || 0, icon: CheckCircleRounded, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Pipeline Val', value: formatCurrency(crmStats?.pipelineValue || 0), icon: CurrencyRupeeRounded, color: 'text-violet-600', bg: 'bg-violet-50' },
        { label: 'Conversion', value: `${crmStats?.conversionRate || 0}%`, icon: TrendingUpRounded, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <div className="flex-1 bg-white flex flex-col min-w-0 h-full overflow-hidden">
            <div className="px-8 pt-8 pb-4 shrink-0 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">CRM Intelligence</h1>
                    <p className="text-slate-500 text-sm font-medium">Customer relationship overview and growth metrics.</p>
                </div>

                <select 
                    value={selectedWorkspace}
                    onChange={(e) => setSelectedWorkspace(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#7b68ee]/20 focus:border-[#7b68ee] transition-all outline-none min-w-[200px]"
                >
                    {workspaces && workspaces.map(ws => (
                        <option key={ws._id} value={ws._id}>{ws.name}</option>
                    ))}
                </select>
            </div>

            <div className="flex-1 overflow-auto px-8 pb-8 no-scrollbar">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                        <SyncRounded className="animate-spin text-[#7b68ee]" sx={{ fontSize: 40 }} />
                        <p className="text-slate-400 font-bold text-sm animate-pulse">Calculating metrics...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                            {statsConfig.map((stat, i) => (
                                <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                                            <stat.icon sx={{ fontSize: 20 }} />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live</span>
                                    </div>
                                    <div className="text-2xl font-black text-slate-900 mb-1">{stat.value}</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Employee Performance Section */}
                        <div className="mt-10">
                            <div className="flex items-center gap-2 mb-6">
                                <PersonRounded className="text-slate-400" />
                                <h2 className="text-lg font-black text-slate-900 tracking-tight">Employee Performance</h2>
                            </div>
                            
                            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50 border-b border-slate-100">
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <th className="px-6 py-4">Employee</th>
                                            <th className="px-6 py-4 text-center">Total Leads</th>
                                            <th className="px-6 py-4 text-center">Qualified</th>
                                            <th className="px-6 py-4 text-center">Closed Deals</th>
                                            <th className="px-6 py-4 text-right">Pipeline (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {performance.length > 0 ? performance.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                                            {item.User?.name?.[0] || 'E'}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-900">{item.User?.name || 'Unknown'}</div>
                                                            <div className="text-[10px] text-slate-400 font-medium">{item.User?.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center font-bold text-sm text-slate-700">{item.totalLeads}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-md border border-emerald-100">
                                                        {item.qualifiedLeads}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="px-2 py-0.5 bg-violet-50 text-violet-600 text-[10px] font-black rounded-md border border-violet-100">
                                                        {item.closedLeads}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-black text-sm text-slate-900 font-mono">
                                                    {formatCurrency(item.totalValue || 0)}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-10 text-center text-slate-400 font-bold text-sm">
                                                    No employee activity recorded yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200 h-64 flex flex-col items-center justify-center text-center p-8">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
                                <BarChartRounded sx={{ color: '#7b68ee' }} />
                            </div>
                            <h3 className="text-slate-900 font-black">Revenue Analytics Coming Soon</h3>
                            <p className="text-slate-500 text-sm max-w-sm mt-2">We are currently integrating with your payment providers to surface deep financial insights.</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CRMPage;
