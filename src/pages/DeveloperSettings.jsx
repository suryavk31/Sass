import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { listWorkspaces } from '../actions/workspaceActions';
import toast from 'react-hot-toast';

const DeveloperSettings = () => {
    const dispatch = useDispatch();

    const [keys, setKeys] = useState([]);
    const [webhookLogs, setWebhookLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [logsLoading, setLogsLoading] = useState(false);
    const [newKeyData, setNewKeyData] = useState(null);
    const [keyName, setKeyName] = useState('');
    const [selectedWorkspace, setSelectedWorkspace] = useState('');

    const workspaceList = useSelector((state) => state.workspace);
    const { workspaces, userRole } = workspaceList;
    const isAdmin = userRole?.roleName === 'Admin';
    const permissions = userRole?.permissions || [];
    const canEdit = isAdmin || permissions.find(p => p.module === 'workspace')?.edit;

    const token = localStorage.getItem('token');
    const authConfig = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        dispatch(listWorkspaces());
    }, [dispatch]);

    useEffect(() => {
        if (selectedWorkspace) {
            fetchKeys(selectedWorkspace);
            fetchWebhookLogs(selectedWorkspace);
        } else if (workspaces && workspaces.length > 0) {
            setSelectedWorkspace(workspaces[0]._id);
            fetchKeys(workspaces[0]._id);
            fetchWebhookLogs(workspaces[0]._id);
        }
    }, [workspaces, selectedWorkspace]);

    const fetchKeys = async (workspaceId) => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/api-keys?workspaceId=${workspaceId}`, authConfig);
            setKeys(data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const fetchWebhookLogs = async (workspaceId) => {
        setLogsLoading(true);
        try {
            const { data } = await axios.get(`/api/webhooks/logs?workspaceId=${workspaceId}`, authConfig);
            setWebhookLogs(data || []);
        } catch (error) {
            console.error("Failed to fetch webhook logs");
        }
        setLogsLoading(false);
    };

    const handleRetryWebhook = async (id) => {
        try {
            await axios.post(`/api/webhooks/logs/${id}/retry`, {}, authConfig);
            toast.success("Webhook retried successfully");
            fetchWebhookLogs(selectedWorkspace);
        } catch (error) {
            toast.error("Webhook retry failed");
            fetchWebhookLogs(selectedWorkspace);
        }
    };

    const handleGenerateKey = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/api-keys', { name: keyName, workspaceId: selectedWorkspace }, authConfig);
            setNewKeyData(data);
            setKeyName('');
            fetchKeys(selectedWorkspace);
        } catch (error) {
            console.error(error);
            toast.error('Failed to generate key. Ensure you have the right permissions.');
        }
    };

    const handleRevokeKey = async (id) => {
        if (window.confirm('Are you sure you want to revoke this API Key? Any integrations using it will immediately break.')) {
            try {
                await axios.delete(`/api/api-keys/${id}`, authConfig);
                fetchKeys(selectedWorkspace);
            } catch (error) {
                console.error(error);
                toast.error('Failed to revoke key.');
            }
        }
    };

    return (
        <div className="bg-gray-50 h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-xl font-bold text-gray-900 mb-1">Developer Settings</h1>
                <p className="text-sm text-gray-500 mb-6">Manage API Keys and Webhook integrations for your workspace.</p>

                {/* Workspace Selector */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Workspace</label>
                    <select
                        value={selectedWorkspace}
                        onChange={(e) => setSelectedWorkspace(e.target.value)}
                        className="w-full md:w-1/2 border-gray-300 rounded-md focus:ring-custom focus:border-custom py-2 shadow-sm text-sm"
                    >
                        {workspaces && workspaces.map(ws => (
                            <option key={ws._id} value={ws._id}>{ws.name}</option>
                        ))}
                    </select>
                </div>

                {/* Generate New Key */}
                {canEdit && (
                    <div className="bg-white rounded-md shadow-sm border border-gray-200 p-5 mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate New API Key</h2>
                        <form onSubmit={handleGenerateKey} className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Key Name</label>
                                <input
                                    type="text"
                                    required
                                    value={keyName}
                                    onChange={(e) => setKeyName(e.target.value)}
                                    placeholder="e.g., GitHub Integration, Jenkins Pipeline"
                                    className="w-full border-gray-300 rounded-md py-2 text-sm focus:ring-custom shadow-sm"
                                />
                            </div>
                            <button type="submit" className="bg-violet-600 text-white rounded-md px-4 py-2 hover:bg-violet-700 font-medium text-sm border-none">
                                Create Key
                            </button>
                        </form>

                        {newKeyData && (
                            <div className="mt-4 p-4 bg-violet-50 border border-violet-100 rounded-2xl shadow-sm">
                                <h3 className="text-[#4c1d95] font-black text-[11px] uppercase tracking-[0.15em] mb-1">New Credential Pair</h3>
                                <p className="text-slate-500 text-xs mb-4 font-medium italic">Make sure to copy these now. You won't be able to see the secret again.</p>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">X-API-Key (Public)</label>
                                        <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                            <code className="px-4 py-2 text-[13px] text-slate-900 font-bold flex-1 tracking-tight select-all truncate">{newKeyData.apiKey}</code>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(newKeyData.apiKey)}
                                                className="bg-slate-50 hover:bg-slate-100 px-4 py-2 text-[10px] font-black text-slate-600 border-l border-slate-200 transition-all uppercase tracking-widest"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">X-API-Secret (Private)</label>
                                        <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                            <code className="px-4 py-2 text-[13px] text-[#7b68ee] font-black flex-1 tracking-tight select-all truncate">{newKeyData.apiSecret}</code>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(newKeyData.apiSecret)}
                                                className="bg-slate-50 hover:bg-slate-100 px-4 py-2 text-[10px] font-black text-slate-600 border-l border-slate-200 transition-all uppercase tracking-widest"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Existing Keys Table */}
                <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Active API Keys</h3>
                    </div>
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading keys...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 table-compact">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 text-left font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-4 text-left font-semibold text-gray-500 uppercase tracking-wider">Key Pattern</th>
                                        <th className="px-4 text-left font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                                        <th className="px-4 text-left font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-4 text-right font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {keys.map((k) => (
                                        <tr key={k.id}>
                                            <td className="px-4 text-sm font-medium text-gray-900">{k.name}</td>
                                            <td className="px-4 text-sm text-gray-500 font-mono tracking-wider">{k.keyPattern}</td>
                                            <td className="px-4 text-xs text-gray-500">{new Date(k.createdAt).toLocaleDateString()}</td>
                                            <td className="px-4">
                                                <span className={`px-2 py-0.5 inline-flex text-[10px] leading-4 font-bold rounded-sm uppercase tracking-wide ${k.isActive ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                                                    {k.isActive ? 'Active' : 'Revoked'}
                                                </span>
                                            </td>
                                            <td className="px-4 text-right">
                                                {k.isActive && (
                                                    <button onClick={() => handleRevokeKey(k.id)} className="text-red-600 hover:text-red-900 text-xs font-semibold">
                                                        Revoke
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {keys.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-8 text-center text-gray-500 italic">No API keys found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Webhook Instructions */}
                {selectedWorkspace && (
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-5 border-l-4 border-l-blue-500 mb-8">
                        <h3 className="text-blue-800 font-bold mb-2 text-sm">Incoming Webhooks URL</h3>
                        <p className="text-sm text-blue-700 mb-3">Send POST requests to this endpoint for the currently selected workspace. Include your active API key in the <code>X-API-Key</code> header.</p>
                        <code className="block bg-white border border-blue-100 p-3 rounded-lg text-xs font-bold text-gray-800 break-all shadow-sm">
                            {window.location.origin}/api/webhooks/incoming/{selectedWorkspace}
                        </code>
                    </div>
                )}

                {/* Webhook Logs */}
                <div className="mt-8 bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Recent Webhook Deliveries</h3>
                    </div>
                    {logsLoading ? (
                        <div className="p-8 text-center text-gray-500">Loading logs...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 table-compact">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Event</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider text-[10px]">URL</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Status</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Date</th>
                                        <th className="px-4 py-3 text-right font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100 text-sm">
                                    {webhookLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 font-bold text-gray-900 text-xs">{log.event || 'Custom Event'}</td>
                                            <td className="px-4 py-3 text-gray-500 font-mono text-[10px] truncate max-w-[150px]" title={log.url}>{log.url}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 inline-flex text-[10px] leading-4 font-black rounded uppercase tracking-widest ${log.status === 'Success' ? 'bg-emerald-100 text-emerald-800' : log.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>
                                                    {log.status} {log.statusCode ? `(${log.statusCode})` : ''}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-400 font-medium text-[11px]">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {canEdit && log.status !== 'Success' && (
                                                    <button 
                                                        onClick={() => handleRetryWebhook(log.id)}
                                                        className="text-violet-600 hover:text-white hover:bg-violet-600 text-[11px] font-black tracking-wider uppercase border border-violet-200 bg-violet-50 px-3 py-1.5 rounded-lg transition-all"
                                                    >
                                                        Retry
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {webhookLogs.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-12 text-center">
                                                <div className="text-gray-400 font-medium text-sm">No webhook deliveries recorded yet.</div>
                                                <div className="text-gray-400 text-xs mt-1">Configure an automation rule to trigger webhooks.</div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default DeveloperSettings;
