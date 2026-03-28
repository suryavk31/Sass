import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { listAuditLogs } from '../actions/auditActions';
import { listWorkspaces } from '../actions/workspaceActions';
import toast from 'react-hot-toast';

const AuditLogsPage = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const [selectedWorkspace, setSelectedWorkspace] = useState('');

    const auditList = useSelector((state) => state.audit);
    const { loading, error, logs } = auditList;

    const workspaceStore = useSelector((state) => state.workspace);
    const { workspaces, userRole } = workspaceStore;

    // RBAC Guard: Only Admin can access Audit Logs
    useEffect(() => {
        if (userRole && userRole.roleName !== 'Admin') {
            toast.error("Access Forbidden: Admin access required.");
            navigate('/'); 
        }
    }, [userRole, navigate]);

    // Initialize workspaces
    useEffect(() => {
        dispatch(listWorkspaces());
    }, [dispatch]);

    // Set default workspace and fetch logs
    useEffect(() => {
        if (selectedWorkspace) {
            dispatch(listAuditLogs(selectedWorkspace));
        } else if (workspaces && workspaces.length > 0) {
            setSelectedWorkspace(workspaces[0]._id);
            dispatch(listAuditLogs(workspaces[0]._id));
        }
    }, [dispatch, workspaces, selectedWorkspace]);

    return (
        <div className="bg-gray-50 flex-1 overflow-y-auto">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Audit Logs (Compliance)</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            A comprehensive, unalterable record of all workspace activity.
                        </p>
                    </div>
                    <select
                        value={selectedWorkspace}
                        onChange={(e) => setSelectedWorkspace(e.target.value)}
                        className="text-sm border-gray-300 rounded-md focus:ring-custom focus:border-custom py-2 pl-3 pr-10 bg-white"
                    >
                        {workspaces &&
                            workspaces.map((ws) => (
                                <option key={ws._id} value={ws._id}>
                                    {ws.name}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="bg-white shadow-sm rounded-md border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center flex-col items-center py-20 text-violet-600">
                            <i className="fas fa-spinner fa-spin fa-2x mb-4"></i>
                            <p className="text-smfont-medium text-gray-500">Loading secure logs...</p>
                        </div>
                    ) : error ? (
                        <div className="p-6 text-red-500 text-center">{error}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 table-compact">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 text-left font-semibold text-gray-500 uppercase tracking-wider">Timestamp</th>
                                        <th className="px-4 text-left font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-4 text-left font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                        <th className="px-4 text-left font-semibold text-gray-500 uppercase tracking-wider">Entity</th>
                                        <th className="px-4 text-left font-semibold text-gray-500 uppercase tracking-wider">IP Address</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {logs && logs.length > 0 ? (
                                        logs.map((log) => (
                                            <tr key={log._id} className="hover:bg-gray-50 transition-colors cursor-default">
                                                <td className="px-4 whitespace-nowrap text-gray-500">
                                                    {new Date(log.createdAt).toLocaleString(undefined, {
                                                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-5 w-5 rounded-full bg-violet-100 flex items-center justify-center text-[10px] font-bold text-violet-700 mr-2">
                                                            {log.user?.name ? log.user.name.charAt(0).toUpperCase() : '?'}
                                                        </div>
                                                        <span className="font-medium text-gray-900">{log.user?.name || 'Unknown'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 whitespace-nowrap">
                                                    <span className={`px-2 py-0.5 inline-flex text-[10px] leading-4 font-bold rounded-sm tracking-widest ${log.action.includes('DELETE') || log.action.includes('REMOVE') ? 'bg-red-100 text-red-800' :
                                                            log.action.includes('CREATE') || log.action.includes('ADD') ? 'bg-green-100 text-green-800' :
                                                                'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-4 whitespace-nowrap">
                                                    <span className="text-gray-900 font-medium">{log.entityType}:</span>
                                                    <span className="text-gray-500 ml-1">{log.entityName || log.entityId}</span>
                                                </td>
                                                <td className="px-4 whitespace-nowrap text-gray-400 font-mono text-[10px]">
                                                    {log.ipAddress || '127.0.0.1'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-8 text-center text-gray-500 italic">
                                                No audit logs available for this workspace.
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

export default AuditLogsPage;
