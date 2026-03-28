// src/pages/RolesPage.jsx — Premium Role Management & Permission Matrix
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listRoles, updateRole } from '../actions/roleActions';
import toast from 'react-hot-toast';
import { 
    AdminPanelSettingsRounded, 
    SecurityRounded, 
    CheckCircleRounded,
    RadioButtonUncheckedRounded,
    SaveRounded,
    AddRounded,
    DeleteOutlineRounded
} from '@mui/icons-material';

const MODULES = [
    { id: 'tasks', label: 'Tasks & Objectives' },
    { id: 'projects', label: 'Project Portfolio' },
    { id: 'employees', label: 'Team & Members' },
    { id: 'roles', label: 'Security & RBAC' },
    { id: 'billing', label: 'Payments & Billing' },
    { id: 'Sales', label: 'Sales & Pipelines' },
    { id: 'CRM', label: 'CRM & Contacts' },
    { id: 'Leads', label: 'Lead Intelligence' },
    { id: 'Calendar', label: 'Event Calendar' },
    { id: 'HR', label: 'Human Resources' },
    { id: 'workspace', label: 'Developer Settings' }
];

const ACTIONS = [
    { id: 'view', label: 'View' },
    { id: 'create', label: 'Create' },
    { id: 'edit', label: 'Edit' },
    { id: 'delete', label: 'Delete' }
];

const RolesPage = () => {
    const dispatch = useDispatch();
    const { roles, loading } = useSelector((state) => state.role);
    const [selectedRole, setSelectedRole] = useState(null);
    const [localPermissions, setLocalPermissions] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        dispatch(listRoles());
    }, [dispatch]);

    useEffect(() => {
        if (roles?.length > 0 && !selectedRole) {
            setSelectedRole(roles[0]);
            setLocalPermissions(roles[0].permissions || []);
        }
    }, [roles, selectedRole]);

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setLocalPermissions(role.permissions || []);
    };

    const togglePermission = (moduleId, actionId) => {
        setLocalPermissions(prev => {
            const existingModule = prev.find(p => p.module === moduleId);
            if (existingModule) {
                return prev.map(p => p.module === moduleId 
                    ? { ...p, [actionId]: !p[actionId] } 
                    : p
                );
            } else {
                return [...prev, { module: moduleId, [actionId]: true }];
            }
        });
    };

    const handleSavePermissions = async () => {
        if (!selectedRole) return;
        setIsSaving(true);
        try {
            await dispatch(updateRole(selectedRole._id || selectedRole.id, { 
                permissions: localPermissions 
            }));
            toast.success('Permissions updated successfully!');
        } catch (err) {
            toast.error('Failed to update permissions');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex h-full bg-[#fafafa] overflow-hidden">
            {/* Roles Sidebar */}
            <div className="w-[300px] bg-white border-r border-slate-200/60 flex flex-col shrink-0">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-[18px] font-black text-slate-800 tracking-tight">Roles</h2>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Permission Sets</p>
                    </div>
                    <button className="w-8 h-8 rounded-lg bg-slate-50 text-[#7b68ee] flex items-center justify-center hover:bg-purple-50 transition-colors border border-slate-100 shadow-sm">
                        <AddRounded sx={{ fontSize: 20 }} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {roles?.map((role) => (
                        <div 
                            key={role._id || role.id}
                            onClick={() => handleRoleSelect(role)}
                            className={`p-4 rounded-2xl cursor-pointer transition-all border flex items-center gap-3 ${selectedRole?._id === role._id 
                                ? 'bg-[#7b68ee]/5 border-[#7b68ee]/20 text-[#7b68ee]' 
                                : 'bg-white border-transparent text-slate-600 hover:bg-slate-50'}`}
                        >
                            <AdminPanelSettingsRounded sx={{ fontSize: 20, opacity: selectedRole?._id === role._id ? 1 : 0.4 }} />
                            <div className="flex-1">
                                <div className="text-[13px] font-black tracking-tight">{role.name}</div>
                                <div className="text-[10px] font-bold opacity-60 uppercase tracking-wider">System Role</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Permission Matrix */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {selectedRole ? (
                    <>
                        <div className="px-10 pt-10 pb-8 border-b border-slate-100 bg-white flex justify-between items-end">
                            <div>
                                <div className="flex items-center gap-2 text-[#7b68ee] mb-2">
                                    <SecurityRounded sx={{ fontSize: 16 }} />
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">Matrix Editor</span>
                                </div>
                                <h1 className="text-[28px] font-black text-slate-900 tracking-tighter leading-none mb-2">
                                    {selectedRole.name} Permissions
                                </h1>
                                <p className="text-[13px] font-medium text-slate-400">Configure what this user role can see, edit, and manage across the system.</p>
                            </div>

                            <button 
                                onClick={handleSavePermissions}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-3 text-[12px] font-black text-white premium-gradient rounded-2xl shadow-lg shadow-purple-500/30 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50"
                            >
                                <SaveRounded sx={{ fontSize: 18 }} />
                                <span>{isSaving ? 'SAVING...' : 'SAVE CHANGES'}</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto bg-[#fafafa] p-10">
                            <div className="bg-white rounded-[32px] border border-slate-200/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] overflow-hidden">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Application Module</th>
                                            {ACTIONS.map(action => (
                                                <th key={action.id} className="px-4 py-6 text-center text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{action.label}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100/60">
                                        {MODULES.map(module => {
                                            const rolePerms = localPermissions.find(p => p.module === module.id) || {};
                                            return (
                                                <tr key={module.id} className="group hover:bg-slate-50/50 transition-all">
                                                    <td className="px-8 py-6 flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-purple-50 group-hover:text-[#7b68ee] transition-all border border-slate-100">
                                                            <RadioButtonUncheckedRounded sx={{ fontSize: 16 }} />
                                                        </div>
                                                        <span className="text-[14px] font-bold text-slate-700">{module.label}</span>
                                                    </td>
                                                    {ACTIONS.map(action => (
                                                        <td key={action.id} className="px-4 py-6 text-center">
                                                            <div 
                                                                onClick={() => togglePermission(module.id, action.id)}
                                                                className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center cursor-pointer transition-all border ${rolePerms[action.id] 
                                                                    ? 'bg-[#7b68ee] border-[#7b68ee] text-white shadow-lg shadow-[#7b68ee]/30 scale-110' 
                                                                    : 'bg-white border-slate-200 text-slate-200 hover:border-slate-300 hover:scale-105'
                                                                }`}
                                                            >
                                                                {rolePerms[action.id] ? (
                                                                    <CheckCircleRounded sx={{ fontSize: 16 }} />
                                                                ) : (
                                                                    <RadioButtonUncheckedRounded sx={{ fontSize: 16 }} />
                                                                )}
                                                            </div>
                                                        </td>
                                                    ))}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-8 px-4 flex justify-between items-center bg-red-50/40 p-6 rounded-2xl border border-red-100/50">
                                <div className="flex items-center gap-4 text-red-600">
                                    <DeleteOutlineRounded />
                                    <div>
                                        <div className="text-[13px] font-black uppercase tracking-tight">Danger Zone</div>
                                        <div className="text-[11px] font-medium opacity-70">Permanently delete this role and unassign members.</div>
                                    </div>
                                </div>
                                <button className="px-4 py-2 border border-red-200 rounded-xl text-[11px] font-black text-red-600 hover:bg-red-600 hover:text-white transition-all">
                                    DELETE ROLE
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-300 uppercase font-black tracking-[0.3em] overflow-hidden">
                        Select a role to begin editing
                    </div>
                )}
            </div>
        </div>
    );
};

export default RolesPage;
