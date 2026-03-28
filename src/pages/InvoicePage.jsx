import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { listWorkspaces } from '../actions/workspaceActions';
import toast from 'react-hot-toast';

const InvoicePage = () => {
    const dispatch = useDispatch();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);

    const workspaceList = useSelector((state) => state.workspace);
    const { workspaces } = workspaceList;
    const [currentWorkspaceId, setCurrentWorkspaceId] = useState('');

    const token = localStorage.getItem('token');
    const authConfig = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        dispatch(listWorkspaces());
    }, [dispatch]);

    useEffect(() => {
        if (currentWorkspaceId) {
            fetchInvoices();
        } else if (workspaces && workspaces.length > 0) {
            setCurrentWorkspaceId(workspaces[0]._id);
        }
    }, [workspaces, currentWorkspaceId]);

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/invoices?workspaceId=${currentWorkspaceId}`, authConfig);
            setInvoices(data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const handlePayNow = async (invoiceId) => {
        try {
            const { data } = await axios.post('/api/stripe/create-checkout-session', { invoiceId }, authConfig);
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to initiate payment");
        }
    };

    const handleUpdateStatus = async (invoiceId, newStatus) => {
        try {
            await axios.put(`/api/invoices/${invoiceId}`, { status: newStatus }, authConfig);
            fetchInvoices();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status");
        }
    };

    const getStatusColor = (status) => {
        if (status === 'Paid') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        if (status === 'Sent') return 'bg-blue-100 text-blue-700 border-blue-200';
        if (status === 'Cancelled') return 'bg-rose-100 text-rose-700 border-rose-200';
        return 'bg-slate-100 text-slate-700 border-slate-200'; // Draft
    };

    return (
        <div className="flex-1 bg-slate-50 flex flex-col min-w-0 h-full overflow-hidden p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Invoices</h1>
                    <p className="text-slate-500 text-sm">Manage billing and sent invoices.</p>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-auto p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-full text-slate-400 font-bold">Loading...</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 text-xs font-black text-slate-400 uppercase tracking-wider">
                                    <th className="pb-4 pl-4">Invoice ID</th>
                                    <th className="pb-4">Related Deal</th>
                                    <th className="pb-4">Amount</th>
                                    <th className="pb-4">Due Date</th>
                                    <th className="pb-4">Status</th>
                                    <th className="pb-4 text-right pr-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((inv) => (
                                    <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                        <td className="py-4 pl-4 text-xs font-medium text-slate-500">{inv.id.substring(0,8)}...</td>
                                        <td className="py-4 text-sm font-bold text-slate-800">{inv.Deal?.title || 'Unknown Deal'}</td>
                                        <td className="py-4 text-sm font-black text-[#7b68ee]">${parseFloat(inv.amount).toFixed(2)}</td>
                                        <td className="py-4 text-sm text-slate-500">{inv.dueDate || '-'}</td>
                                        <td className="py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(inv.status)}`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="py-4 pr-4 pl-4 flex justify-end items-center gap-3">
                                            {inv.status !== 'Paid' && (
                                                <button 
                                                    onClick={() => handlePayNow(inv.id)}
                                                    className="bg-[#7b68ee] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm shadow-[#7b68ee]/20 hover:bg-[#6c58e0] transition-colors"
                                                >
                                                    Pay Now
                                                </button>
                                            )}
                                            <select 
                                                className="bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg px-2 py-1.5 outline-none focus:border-[#7b68ee]"
                                                value={inv.status}
                                                onChange={(e) => handleUpdateStatus(inv.id, e.target.value)}
                                            >
                                                <option value="Draft">Draft</option>
                                                <option value="Sent">Sent</option>
                                                <option value="Paid">Paid</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                                {invoices.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8 text-slate-400 font-bold">No invoices generated yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoicePage;
