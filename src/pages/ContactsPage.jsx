import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { useSelector, useDispatch } from 'react-redux';
import { listWorkspaces } from '../actions/workspaceActions';
import { AddRounded, EditRounded, DeleteRounded, PersonRounded, MoreVertRounded, GroupRounded } from '@mui/icons-material';

const ContactsPage = () => {
    const dispatch = useDispatch();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '', jobTitle: '', lifecycleStage: 'Lead' });

    const workspaceList = useSelector((state) => state.workspace);
    const { workspaces, userRole } = workspaceList;
    const isAdmin = userRole?.roleName === 'Admin';
    const permissions = userRole?.permissions || [];
    const canCreate = isAdmin || permissions.find(p => p.module === 'CRM')?.create;
    const canDelete = isAdmin || permissions.find(p => p.module === 'CRM')?.delete;
    const canEdit = isAdmin || permissions.find(p => p.module === 'CRM')?.edit;

    const [currentWorkspaceId, setCurrentWorkspaceId] = useState('');

    // authConfig is handled automatically by axiosInstance.

    useEffect(() => {
        dispatch(listWorkspaces());
    }, [dispatch]);

    useEffect(() => {
        if (currentWorkspaceId) {
            fetchContacts(currentWorkspaceId);
        } else if (workspaces && workspaces.length > 0) {
            setCurrentWorkspaceId(workspaces[0]._id);
            fetchContacts(workspaces[0]._id);
        }
    }, [workspaces, currentWorkspaceId]);

    const fetchContacts = async (workspaceId) => {
        if (!workspaceId || workspaceId === 'undefined') return;
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/contacts?workspaceId=${workspaceId}`);
            setContacts(data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const handleCreateContact = async () => {
        if (!formData.firstName || !formData.email) return;

        try {
            await axios.post('/api/contacts', {
                ...formData,
                workspaceId: currentWorkspaceId
            });
            fetchContacts(currentWorkspaceId);
            setShowModal(false);
            setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '', jobTitle: '', lifecycleStage: 'Lead' });
        } catch (error) {
            console.error(error);
            // Will replace with toast later
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this contact?')) {
            try {
                await axios.delete(`/api/contacts/${id}`);
                fetchContacts(currentWorkspaceId);
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="flex-1 bg-slate-50 flex flex-col min-w-0 h-full overflow-hidden p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Contacts Directory</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Manage network and leads.</p>
                </div>
                
                {canCreate && (
                    <button 
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-[#7b68ee] hover:bg-[#6c58e0] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#7b68ee]/30 transition-all"
                    >
                        <AddRounded sx={{ fontSize: 20 }} />
                        Add Contact
                    </button>
                )}
            </div>

            <div className="flex-1 bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Name</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Email & Phone</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Company</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Stage</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading && contacts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-bold">
                                        <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-[#7b68ee] rounded-full" role="status" aria-label="loading"></div>
                                        <p className="mt-2 text-sm">Loading contacts...</p>
                                    </td>
                                </tr>
                            ) : contacts.length > 0 ? (
                                contacts.map(contact => (
                                    <tr key={contact.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#7b68ee]/10 text-[#7b68ee] flex items-center justify-center font-bold">
                                                    {contact.firstName.charAt(0)}{contact.lastName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 text-sm">{contact.firstName} {contact.lastName}</div>
                                                    <div className="text-xs font-medium text-slate-500">{contact.jobTitle || 'No Title'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-slate-700">{contact.email}</div>
                                            <div className="text-xs tracking-wide text-slate-500">{contact.phone || 'No Phone'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                                {contact.company || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-blue-50 text-blue-600 border border-blue-100">
                                                {contact.lifecycleStage}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {canEdit && (
                                                    <button className="p-2 text-slate-400 hover:text-[#7b68ee] hover:bg-[#7b68ee]/10 rounded-lg transition-colors">
                                                        <EditRounded sx={{ fontSize: 18 }} />
                                                    </button>
                                                )}
                                                {canDelete && (
                                                    <button onClick={() => handleDelete(contact.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                                        <DeleteRounded sx={{ fontSize: 18 }} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-24 text-center">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                            <GroupRounded sx={{ fontSize: 40 }} />
                                        </div>
                                        <h3 className="text-lg font-black text-slate-800">No contacts yet</h3>
                                        <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto mt-2 mb-6">Start building your network by compiling an organized directory of all your contacts.</p>
                                        <button 
                                            onClick={() => setShowModal(true)}
                                            className="bg-white border border-slate-200 hover:border-[#7b68ee] hover:text-[#7b68ee] text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm"
                                        >
                                            Add First Contact
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Contact Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] p-8 w-[500px] shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-slate-900">Add New Contact</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">First Name</label>
                                    <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#7b68ee]/30 focus:border-[#7b68ee] outline-none transition-all placeholder:text-slate-400 placeholder:font-medium" placeholder="Jane" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Last Name</label>
                                    <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#7b68ee]/30 focus:border-[#7b68ee] outline-none transition-all placeholder:text-slate-400 placeholder:font-medium" placeholder="Smith" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#7b68ee]/30 focus:border-[#7b68ee] outline-none transition-all placeholder:text-slate-400 placeholder:font-medium" placeholder="jane.smith@example.com" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                                    <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#7b68ee]/30 focus:border-[#7b68ee] outline-none transition-all placeholder:text-slate-400 placeholder:font-medium" placeholder="+1 (555) 000-0000" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Lifecycle Stage</label>
                                    <select value={formData.lifecycleStage} onChange={(e) => setFormData({...formData, lifecycleStage: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#7b68ee]/30 focus:border-[#7b68ee] outline-none transition-all">
                                        <option value="Subscriber">Subscriber</option>
                                        <option value="Lead">Lead</option>
                                        <option value="MQL">MQL</option>
                                        <option value="SQL">SQL</option>
                                        <option value="Opportunity">Opportunity</option>
                                        <option value="Customer">Customer</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Company</label>
                                    <input type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#7b68ee]/30 focus:border-[#7b68ee] outline-none transition-all placeholder:text-slate-400 placeholder:font-medium" placeholder="Acme Corp" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Job Title</label>
                                    <input type="text" value={formData.jobTitle} onChange={(e) => setFormData({...formData, jobTitle: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#7b68ee]/30 focus:border-[#7b68ee] outline-none transition-all placeholder:text-slate-400 placeholder:font-medium" placeholder="CEO" />
                                </div>
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
                                onClick={handleCreateContact}
                                className="flex-1 px-5 py-3.5 rounded-xl text-sm font-bold bg-[#7b68ee] text-white hover:bg-[#6c58e0] shadow-xl shadow-[#7b68ee]/20 transition-all"
                            >
                                Create Contact
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactsPage;
