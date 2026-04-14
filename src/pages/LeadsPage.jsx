import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { useSelector, useDispatch } from 'react-redux';
import { listWorkspaces } from '../actions/workspaceActions';
import {
    FilterListRounded,
    SearchRounded,
    MoreVertRounded,
    FileDownloadRounded,
    MailOutlineRounded,
    PhoneRounded,
    BusinessRounded,
    SyncRounded,
    CheckCircleRounded,
    RadioButtonUncheckedRounded,
    HistoryRounded,
    CancelRounded,
    CheckCircleOutlineRounded,
    ViewKanbanRounded,
    TableRowsRounded
} from '@mui/icons-material';
import LeadsPipeline from '../components/leads/LeadsPipeline';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import toast from 'react-hot-toast';

const LeadsPage = () => {
    const dispatch = useDispatch();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [selectedWorkspace, setSelectedWorkspace] = useState('');
    const [viewMode, setViewMode] = useState('pipeline');
    
    // Timeline state
    const [timelineLead, setTimelineLead] = useState(null);

    const { userInfo } = useSelector((state) => state.user || {});
    const workspaceList = useSelector((state) => state.workspace);
    const { workspaces, userRole } = workspaceList;
    const isAdmin = userRole?.roleName === 'Admin';
    const permissions = userRole?.permissions || [];
    const canEdit = isAdmin || permissions.find(p => p.module === 'Leads')?.edit;

    // authConfig is now automatically handled by axiosInstance interceptors.

    useEffect(() => {
        dispatch(listWorkspaces());
    }, [dispatch]);

    useEffect(() => {
        if (selectedWorkspace) {
            fetchLeads(selectedWorkspace);
        } else if (workspaces && workspaces.length > 0) {
            setSelectedWorkspace(workspaces[0]._id);
            fetchLeads(workspaces[0]._id);
        }
    }, [workspaces, selectedWorkspace]);

    const fetchLeads = async (workspaceId) => {
        if (!workspaceId || workspaceId === 'undefined') return;
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/leads?workspaceId=${workspaceId}`);
            setLeads(data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(`/api/leads/${id}/status`, { status: newStatus });
            fetchLeads(selectedWorkspace);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update lead status');
        }
    };

    const filteredLeads = leads.filter(lead => {
        const matchesFilter = filter === 'All' || lead.status === filter;
        const searchStr = `${lead.firstName} ${lead.lastName} ${lead.email} ${lead.company}`.toLowerCase();
        const matchesSearch = searchStr.includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'Contacted': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'Qualified': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Lost': return 'bg-slate-50 text-slate-700 border-slate-100';
            case 'Closed': return 'bg-violet-50 text-violet-700 border-violet-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const exportToCSV = () => {
        const headers = ["First Name", "Last Name", "Email", "Phone", "Company", "Status", "Source", "Date"];
        const rows = filteredLeads.map(l => [
            l.firstName,
            l.lastName || '',
            l.email,
            l.phone || '',
            l.company || '',
            l.status,
            l.source,
            new Date(l.createdAt).toLocaleDateString()
        ]);

        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex-1 bg-white flex flex-col min-w-0 h-full overflow-hidden">
            {/* Header Area */}
            <div className="px-8 pt-8 pb-4 shrink-0">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Lead Intelligence</h1>
                        <p className="text-slate-500 text-sm font-medium">Manage and track your prospecting pipeline across workspaces.</p>
                    </div>
                    
                    <div className="flex gap-3">
                        <select 
                            value={selectedWorkspace}
                            onChange={(e) => setSelectedWorkspace(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#7b68ee]/20 focus:border-[#7b68ee] transition-all outline-none min-w-[200px]"
                        >
                            {workspaces && workspaces.map(ws => (
                                <option key={ws._id} value={ws._id}>{ws.name}</option>
                            ))}
                        </select>
                        
                        <button 
                            onClick={exportToCSV}
                            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
                        >
                            <FileDownloadRounded sx={{ fontSize: 18 }} />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-wrap items-center gap-4 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
                    <div className="relative flex-1 min-w-[300px]">
                        <SearchRounded className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" sx={{ fontSize: 20 }} />
                        <input 
                            type="text" 
                            placeholder="Search leads by name, email, or company..."
                            className="w-full bg-white border-none rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium shadow-sm focus:ring-2 focus:ring-[#7b68ee]/20 outline-none placeholder:text-slate-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-black tracking-wide uppercase transition-all ${
                                viewMode === 'table' 
                                ? 'bg-slate-100 text-slate-900 shadow-sm' 
                                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
                            }`}
                        >
                            <TableRowsRounded sx={{ fontSize: 16 }} />
                            Table
                        </button>
                        <button
                            onClick={() => setViewMode('pipeline')}
                            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-black tracking-wide uppercase transition-all ${
                                viewMode === 'pipeline' 
                                ? 'bg-[#7b68ee] text-white shadow-md shadow-[#7b68ee]/20' 
                                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
                            }`}
                        >
                            <ViewKanbanRounded sx={{ fontSize: 16 }} />
                            Pipeline
                        </button>
                    </div>

                    <div className="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
                        {['All', 'New', 'Contacted', 'Qualified', 'Lost', 'Closed'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-black tracking-wide uppercase transition-all ${
                                    filter === s 
                                    ? 'bg-[#7b68ee] text-white shadow-md shadow-[#7b68ee]/20' 
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Data Grid */}
            <div className="flex-1 overflow-auto px-8 pb-8 no-scrollbar">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                        <SyncRounded className="animate-spin text-[#7b68ee]" sx={{ fontSize: 40 }} />
                        <p className="text-slate-400 font-bold text-sm animate-pulse">Synchronizing leads...</p>
                    </div>
                ) : filteredLeads.length > 0 ? (
                    viewMode === 'pipeline' ? (
                        <LeadsPipeline 
                            leads={filteredLeads} 
                            statuses={['New', 'Contacted', 'Qualified', 'Closed', 'Lost']}
                            onStatusChange={handleStatusUpdate}
                        />
                    ) : (
                    <table className="w-full border-separate border-spacing-y-3">
                        <thead>
                            <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-left">
                                <th className="px-4 py-2">Lead Information</th>
                                <th className="px-4 py-2">Company</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Source</th>
                                <th className="px-4 py-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeads.map((lead) => (
                                <tr key={lead.id} className="group hover:translate-x-1 transition-transform">
                                    <td className="bg-white border-y border-l border-slate-100 rounded-l-2xl px-4 py-4 shadow-sm group-hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7b68ee]/10 to-[#7b68ee]/20 flex items-center justify-center text-[#7b68ee] font-black text-lg">
                                                {lead.firstName[0]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">{lead.firstName} {lead.lastName}</div>
                                                <div className="flex items-center gap-3 mt-0.5">
                                                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium tracking-tight">
                                                        <MailOutlineRounded sx={{ fontSize: 12 }} />
                                                        {lead.email}
                                                    </div>
                                                    {lead.phone && (
                                                        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium tracking-tight">
                                                            <PhoneRounded sx={{ fontSize: 12 }} />
                                                            {lead.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="bg-white border-y border-slate-100 px-4 py-4 shadow-sm group-hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                            <BusinessRounded sx={{ fontSize: 16, color: '#94a3b8' }} />
                                            {lead.company || 'Personal'}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                            Added {new Date(lead.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="bg-white border-y border-slate-100 px-4 py-4 shadow-sm group-hover:shadow-md transition-shadow">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-colors ${getStatusStyle(lead.status)}`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="bg-white border-y border-slate-100 px-4 py-4 shadow-sm group-hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                            <HistoryRounded sx={{ fontSize: 14 }} />
                                            {lead.source}
                                        </div>
                                    </td>
                                    <td className="bg-white border-y border-r border-slate-100 rounded-r-2xl px-4 py-4 shadow-sm group-hover:shadow-md transition-shadow text-right">
                                        <div className={`flex items-center justify-end gap-1 transition-opacity ${canEdit ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}>
                                            {canEdit && (
                                                <>
                                                    <button 
                                                        onClick={() => handleStatusUpdate(lead.id, 'Contacted')}
                                                        title="Mark Contacted"
                                                        className="p-2 hover:bg-amber-50 rounded-lg text-amber-600 transition-colors"
                                                    >
                                                        <PhoneRounded sx={{ fontSize: 18 }} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleStatusUpdate(lead.id, 'Qualified')}
                                                        title="Mark Qualified"
                                                        className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors"
                                                    >
                                                        <CheckCircleRounded sx={{ fontSize: 18 }} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleStatusUpdate(lead.id, 'Lost')}
                                                        title="Close as Lost"
                                                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                                                    >
                                                        <CancelRounded sx={{ fontSize: 18 }} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleStatusUpdate(lead.id, 'Closed')}
                                                        title="Close as Won"
                                                        className="p-2 hover:bg-violet-50 rounded-lg text-violet-600 transition-colors"
                                                    >
                                                        <CheckCircleOutlineRounded sx={{ fontSize: 18 }} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        <button 
                                            onClick={() => setTimelineLead(lead)}
                                            title="View Timeline"
                                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 group-hover:text-[#7b68ee] transition-all"
                                        >
                                            <MoreVertRounded sx={{ fontSize: 20 }} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center h-80 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 mt-4">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 text-slate-300">
                            <RadioButtonUncheckedRounded sx={{ fontSize: 32 }} />
                        </div>
                        <h3 className="text-slate-900 font-black text-lg">No leads discovered yet</h3>
                        <p className="text-slate-500 text-sm font-medium mt-1 max-w-xs text-center">Your pipeline is currently empty. Use the Developer Guide to start capturing leads from your website.</p>
                        <button 
                            onClick={() => window.location.href='/developer-guide'}
                            className="mt-6 bg-[#7b68ee] text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#7b68ee]/30 hover:scale-105 transition-transform"
                        >
                            View Guide
                        </button>
                    </div>
                )}
            </div>

            {/* Global Timeline Overlay */}
            {timelineLead && (
                <ActivityTimeline 
                    entityType="Lead" 
                    entityId={timelineLead.id} 
                    entityName={`${timelineLead.firstName} ${timelineLead.lastName}`} 
                    workspaceId={selectedWorkspace}
                    onClose={() => setTimelineLead(null)} 
                />
            )}
        </div>
    );
};

export default LeadsPage;