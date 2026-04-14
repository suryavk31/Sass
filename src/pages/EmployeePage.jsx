// src/pages/EmployeePage.jsx — Premium Member Management & Invitations
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { listEmployees, deleteEmployee } from '../actions/employeeActions';
import { listRoles } from '../actions/roleActions';
import { 
    GroupRounded, 
    PersonAddRounded, 
    MoreHorizRounded, 
    MailRounded,
    AdminPanelSettingsRounded,
    BadgeRounded,
    CloseRounded,
    EditRounded,
    ContentCopyRounded,
    LinkRounded
} from '@mui/icons-material';
import axiosInstance from '../utils/axiosInstance'; 
import toast from 'react-hot-toast';

const EmployeePage = () => {
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const [inviteData, setInviteData] = useState({ email: '', roleId: '' });
    const [isInviting, setIsInviting] = useState(false);
    const [generatedInviteLink, setGeneratedInviteLink] = useState(null);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({ id: '', phone: '', gender: '', dob: '', joiningDate: '', status: 'Active', departmentId: '' });
    const [departments, setDepartments] = useState([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { employees, loading } = useSelector((state) => state.employee);
    const { roles } = useSelector((state) => state.role);
    const { workspaces, userRole } = useSelector((state) => state.workspace);
    const activeWorkspace = workspaces?.[0] || {}; 

    // RBAC Guard
    useEffect(() => {
        if (userRole) {
            const isAdmin = userRole.roleName === 'Admin';
            const hasTeamPerm = userRole.permissions?.find(p => p.module.toLowerCase() === 'team')?.view;
            
            if (!isAdmin && !hasTeamPerm) {
                toast.error("Access Forbidden: You don't have permission to view the Team page.");
                navigate('/');
            }
        }
    }, [userRole, navigate]);

    useEffect(() => {
        const workspaceId = activeWorkspace?.id || activeWorkspace?._id;
        
        if (workspaceId && workspaceId !== 'undefined') {
            dispatch(listEmployees(workspaceId));
            
            // Simplified: The backend now prefers the x-workspace-id header automatically
            // injected by our axiosInstance from userInfo.workspaceId.
            axiosInstance.get('/api/departments')
                .then(res => setDepartments(res.data))
                .catch(err => console.error("Could not fetch departments", err));
            
            dispatch(listRoles());
        }
    }, [dispatch, activeWorkspace]);

    const handleInviteSubmit = async (e) => {
        e.preventDefault();
        setIsInviting(true);
        try {
            const { data } = await axiosInstance.post('/api/invitations', {
                email: inviteData.email,
                roleId: inviteData.roleId,
                workspaceId: activeWorkspace.id || activeWorkspace._id
            });
            toast.success('Invitation created successfully!');
            // Show invite link in UI if returned (console/dev mode)
            if (data?.invitation?.inviteLink) {
                setGeneratedInviteLink(data.invitation.inviteLink);
            } else {
                setInviteModalOpen(false);
                setInviteData({ email: '', roleId: '' });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send invitation');
        } finally {
            setIsInviting(false);
        }
    };

    const handleCloseInviteModal = () => {
        setInviteModalOpen(false);
        setInviteData({ email: '', roleId: '' });
        setGeneratedInviteLink(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Remove this member from the workspace?')) {
            dispatch(deleteEmployee(id));
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`/api/employees/${editData.id}`, editData);
            toast.success('Profile updated successfully!');
            setEditModalOpen(false);
            dispatch(listEmployees(activeWorkspace.id || activeWorkspace._id));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        }
    };

    const openEditModal = (emp) => {
        setEditData({
            id: emp._id || emp.id,
            phone: emp.phone || '',
            gender: emp.gender || '',
            dob: emp.dob || '',
            joiningDate: emp.joiningDate || '',
            status: emp.status || 'Active',
            departmentId: emp.departmentId || ''
        });
        setEditModalOpen(true);
    };

    return (
        <div className="flex flex-col h-full bg-[#fafafa]">
            {/* Header */}
            <div className="px-8 pt-8 pb-6 bg-white border-b border-slate-200/60 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-[#7b68ee]">
                        <GroupRounded sx={{ fontSize: 24 }} />
                    </div>
                    <div>
                        <h1 className="text-[22px] font-black text-slate-900 tracking-tight leading-none mb-1.5">
                            Team Members
                        </h1>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            Manage access and workspace permissions
                        </p>
                    </div>
                </div>

                <button 
                    onClick={() => setInviteModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 text-[12px] font-black text-white premium-gradient rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all active:scale-95"
                >
                    <PersonAddRounded sx={{ fontSize: 18 }} />
                    <span>INVITE MEMBER</span>
                </button>
            </div>

            {/* Member Grid */}
            <div className="flex-1 overflow-auto p-8">
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/50 overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                                <th className="px-6 py-4 text-left">Member</th>
                                <th className="px-6 py-4 text-left">Role / Designation</th>
                                <th className="px-6 py-4 text-left">Access Level</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {employees?.map((emp) => (
                                <tr key={emp._id || emp.id} className="group hover:bg-slate-50/80 transition-all">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full premium-gradient flex items-center justify-center text-[11px] font-black text-white shadow-md">
                                                {emp.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-[13px] font-bold text-slate-800">{emp.name}</div>
                                                <div className="text-[11px] font-medium text-slate-400">{emp.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-[12px] font-bold text-slate-600">
                                            <BadgeRounded sx={{ fontSize: 16, opacity: 0.4 }} />
                                            {emp.position || 'Specialist'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider">
                                            <AdminPanelSettingsRounded sx={{ fontSize: 12 }} />
                                            {emp.Role?.name || 'Member'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block ring-4 ring-green-100"></span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => openEditModal(emp)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition-all mr-2"
                                        >
                                            <EditRounded sx={{ fontSize: 18 }} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(emp._id || emp.id)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                        >
                                            <MoreHorizRounded sx={{ fontSize: 18 }} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {loading && (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7b68ee] mx-auto"></div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invite Modal */}
            {inviteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseInviteModal}></div>
                    <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="px-8 pt-8 pb-6 bg-[#fafafa] border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Invite to Team</h3>
                            <button onClick={handleCloseInviteModal} className="text-slate-400 hover:text-slate-900 transition-colors">
                                <CloseRounded />
                            </button>
                        </div>

                        {generatedInviteLink ? (
                            /* ── Invite Link Display (Dev/Console Mode) ── */
                            <div className="p-8 space-y-5">
                                <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                                    <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                                        <LinkRounded sx={{ fontSize: 20, color: '#10b981' }} />
                                    </div>
                                    <div>
                                        <div className="text-[12px] font-black text-emerald-700 uppercase tracking-wider">Invite Created!</div>
                                        <div className="text-[11px] font-medium text-emerald-600 mt-0.5">Share this link with the invitee</div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1 block mb-2">Invite Link</label>
                                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                                        <span className="flex-1 text-[11px] font-mono text-slate-600 truncate">{generatedInviteLink}</span>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(generatedInviteLink);
                                                toast.success('Link copied!');
                                            }}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#7b68ee]/10 text-[#7b68ee] hover:bg-[#7b68ee]/20 transition-colors shrink-0"
                                        >
                                            <ContentCopyRounded sx={{ fontSize: 16 }} />
                                        </button>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 mt-2 pl-1">⚠️ Dev mode: link is also printed in your backend console</p>
                                </div>

                                <button
                                    onClick={handleCloseInviteModal}
                                    className="w-full py-3 text-[12px] font-black text-white premium-gradient rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all active:scale-95"
                                >
                                    DONE
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleInviteSubmit} className="p-8 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                                    <div className="relative">
                                        <MailRounded className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" sx={{ fontSize: 18 }} />
                                        <input 
                                            type="email" 
                                            required
                                            placeholder="colleague@company.com"
                                            value={inviteData.email}
                                            onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-[#7b68ee]/20 focus:border-[#7b68ee] transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Workspace Role</label>
                                    <select 
                                        required
                                        value={inviteData.roleId}
                                        onChange={(e) => setInviteData({...inviteData, roleId: e.target.value})}
                                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-[#7b68ee]/20 focus:border-[#7b68ee] transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Choose a role...</option>
                                        {roles?.map(role => (
                                            <option key={role._id || role.id} value={role._id || role.id}>{role.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isInviting}
                                    className="w-full py-4 text-[12px] font-black text-white premium-gradient rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 mt-4"
                                >
                                    {isInviting ? 'CREATING...' : 'SEND INVITATION'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Edit Profile Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditModalOpen(false)}></div>
                    <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="px-8 pt-8 pb-6 bg-[#fafafa] border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Edit Profile</h3>
                            <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                                <CloseRounded />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-8 space-y-4 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Department</label>
                                <select 
                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-[#7b68ee]/20 focus:border-[#7b68ee] transition-all"
                                    value={editData.departmentId} onChange={(e) => setEditData({...editData, departmentId: e.target.value})}
                                >
                                    <option value="">None</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Phone</label>
                                <input type="text" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-medium"
                                    value={editData.phone} onChange={(e) => setEditData({...editData, phone: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Joining Date</label>
                                <input type="date" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-medium"
                                    value={editData.joiningDate} onChange={(e) => setEditData({...editData, joiningDate: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Status</label>
                                <select className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-medium"
                                    value={editData.status} onChange={(e) => setEditData({...editData, status: e.target.value})}>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full py-4 text-[12px] font-black text-white premium-gradient rounded-2xl shadow-lg mt-4">
                                SAVE CHANGES
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeePage;
