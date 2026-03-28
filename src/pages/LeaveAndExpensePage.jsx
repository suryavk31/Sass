import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { listWorkspaces } from '../actions/workspaceActions';
import toast from 'react-hot-toast';

const tabs = ['Leave Requests', 'Expense Claims'];

const statusColors = {
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-rose-100 text-rose-700',
  Paid: 'bg-blue-100 text-blue-700',
};

const LeaveAndExpensePage = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState(0);
    const [employees, setEmployees] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // Leave form
    const [leaveForm, setLeaveForm] = useState({ employeeId: '', startDate: '', endDate: '', reason: '' });
    // Expense form
    const [expenseForm, setExpenseForm] = useState({ employeeId: '', amount: '', description: '' });

    const workspaceList = useSelector((state) => state.workspace);
    const { workspaces } = workspaceList;
    const [currentWorkspaceId, setCurrentWorkspaceId] = useState('');

    const token = localStorage.getItem('token');
    const authConfig = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => { dispatch(listWorkspaces()); }, [dispatch]);

    useEffect(() => {
        if (currentWorkspaceId) {
            fetchEmployees();
            fetchLeaves();
            fetchExpenses();
        } else if (workspaces && workspaces.length > 0) {
            setCurrentWorkspaceId(workspaces[0]._id);
        }
    }, [workspaces, currentWorkspaceId]);

    const fetchEmployees = async () => {
        const { data } = await axios.get('/api/employees', authConfig);
        setEmployees(data);
    };
    const fetchLeaves = async () => {
        try {
            const { data } = await axios.get(`/api/hr/leave?workspaceId=${currentWorkspaceId}`, authConfig);
            setLeaves(data);
        } catch(e) { console.error(e); }
    };
    const fetchExpenses = async () => {
        try {
            const { data } = await axios.get(`/api/hr/expenses?workspaceId=${currentWorkspaceId}`, authConfig);
            setExpenses(data);
        } catch(e) { console.error(e); }
    };

    const handleSubmitLeave = async () => {
        try {
            await axios.post('/api/hr/leave', { ...leaveForm, workspaceId: currentWorkspaceId }, authConfig);
            setShowModal(false);
            setLeaveForm({ employeeId: '', startDate: '', endDate: '', reason: '' });
            fetchLeaves();
        } catch(e) { toast.error('Failed to submit leave'); }
    };

    const handleSubmitExpense = async () => {
        try {
            await axios.post('/api/hr/expenses', { ...expenseForm, workspaceId: currentWorkspaceId }, authConfig);
            setShowModal(false);
            setExpenseForm({ employeeId: '', amount: '', description: '' });
            fetchExpenses();
        } catch(e) { toast.error('Failed to submit expense'); }
    };

    const updateLeaveStatus = async (id, status) => {
        await axios.put(`/api/hr/leave/${id}`, { status }, authConfig);
        fetchLeaves();
    };
    const updateExpenseStatus = async (id, status) => {
        await axios.put(`/api/hr/expenses/${id}`, { status }, authConfig);
        fetchExpenses();
    };

    return (
        <div className="flex-1 bg-slate-50 flex flex-col p-8 min-w-0 h-full overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Leave & Expenses</h1>
                    <p className="text-slate-500 text-sm">Manage employee leave requests and expense reimbursements.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-[#7b68ee] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-[#7b68ee]/20 hover:bg-[#6c58e0] transition-all"
                >
                    + New Request
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-5 bg-white border border-slate-200 p-1 rounded-xl w-fit">
                {tabs.map((tab, idx) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(idx)}
                        className={`px-5 py-1.5 text-sm font-bold rounded-lg transition-all ${activeTab === idx ? 'bg-[#7b68ee] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-auto p-6">
                {activeTab === 0 && (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-xs font-black text-slate-400 uppercase tracking-wider">
                                <th className="pb-4">Employee</th>
                                <th className="pb-4">Dates</th>
                                <th className="pb-4">Reason</th>
                                <th className="pb-4">Status</th>
                                <th className="pb-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map(l => (
                                <tr key={l.id} className="border-b border-slate-50 hover:bg-slate-50">
                                    <td className="py-3 font-bold text-slate-800 text-sm">{l.Employee?.name || '—'}</td>
                                    <td className="py-3 text-sm text-slate-500">{l.startDate} → {l.endDate}</td>
                                    <td className="py-3 text-sm text-slate-500 max-w-[200px] truncate">{l.reason || '—'}</td>
                                    <td className="py-3">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${statusColors[l.status] || 'bg-slate-100 text-slate-500'}`}>{l.status}</span>
                                    </td>
                                    <td className="py-3 text-right">
                                        <select
                                            value={l.status}
                                            onChange={e => updateLeaveStatus(l.id, e.target.value)}
                                            className="bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg px-2 py-1 outline-none"
                                        >
                                            {['Pending','Approved','Rejected'].map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {leaves.length === 0 && <tr><td colSpan="5" className="text-center py-8 text-slate-400 font-bold">No leave requests.</td></tr>}
                        </tbody>
                    </table>
                )}

                {activeTab === 1 && (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-xs font-black text-slate-400 uppercase tracking-wider">
                                <th className="pb-4">Employee</th>
                                <th className="pb-4">Description</th>
                                <th className="pb-4">Amount</th>
                                <th className="pb-4">Status</th>
                                <th className="pb-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map(e => (
                                <tr key={e.id} className="border-b border-slate-50 hover:bg-slate-50">
                                    <td className="py-3 font-bold text-slate-800 text-sm">{e.Employee?.name || '—'}</td>
                                    <td className="py-3 text-sm text-slate-500">{e.description}</td>
                                    <td className="py-3 text-sm font-black text-[#7b68ee]">${parseFloat(e.amount).toFixed(2)}</td>
                                    <td className="py-3">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${statusColors[e.status] || 'bg-slate-100 text-slate-500'}`}>{e.status}</span>
                                    </td>
                                    <td className="py-3 text-right">
                                        <select
                                            value={e.status}
                                            onChange={ev => updateExpenseStatus(e.id, ev.target.value)}
                                            className="bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg px-2 py-1 outline-none"
                                        >
                                            {['Pending','Approved','Rejected','Paid'].map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {expenses.length === 0 && <tr><td colSpan="5" className="text-center py-8 text-slate-400 font-bold">No expense claims.</td></tr>}
                        </tbody>
                    </table>
                )}
            </div>

            {/* New Request Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-3xl p-8 w-[450px] shadow-2xl">
                        <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl">
                            {tabs.map((tab, idx) => (
                                <button key={tab} onClick={() => setActiveTab(idx)}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === idx ? 'bg-white text-[#7b68ee] shadow-sm' : 'text-slate-500'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {activeTab === 0 ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Employee</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none"
                                        value={leaveForm.employeeId} onChange={e => setLeaveForm({...leaveForm, employeeId: e.target.value})}>
                                        <option value="">Select Employee</option>
                                        {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                                    </select>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">From</label>
                                        <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none"
                                            value={leaveForm.startDate} onChange={e => setLeaveForm({...leaveForm, startDate: e.target.value})} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">To</label>
                                        <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none"
                                            value={leaveForm.endDate} onChange={e => setLeaveForm({...leaveForm, endDate: e.target.value})} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reason</label>
                                    <textarea rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
                                        value={leaveForm.reason} onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})} />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl">Cancel</button>
                                    <button onClick={handleSubmitLeave} className="px-5 py-2.5 text-sm font-bold bg-[#7b68ee] text-white rounded-xl shadow-md shadow-[#7b68ee]/20 hover:bg-[#6c58e0]">Submit</button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Employee</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none"
                                        value={expenseForm.employeeId} onChange={e => setExpenseForm({...expenseForm, employeeId: e.target.value})}>
                                        <option value="">Select Employee</option>
                                        {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Amount ($)</label>
                                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none"
                                        value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none"
                                        value={expenseForm.description} onChange={e => setExpenseForm({...expenseForm, description: e.target.value})} />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl">Cancel</button>
                                    <button onClick={handleSubmitExpense} className="px-5 py-2.5 text-sm font-bold bg-[#7b68ee] text-white rounded-xl shadow-md shadow-[#7b68ee]/20 hover:bg-[#6c58e0]">Submit</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveAndExpensePage;
