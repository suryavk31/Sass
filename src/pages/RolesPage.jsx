// src/pages/RolesPage.jsx — Premium Role Management & Permission Matrix
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listRoles, updateRole, createRole, fetchRoleTemplates } from '../actions/roleActions';
import toast from 'react-hot-toast';
import { 
    AdminPanelSettingsRounded, 
    SecurityRounded, 
    CheckCircleRounded,
    RadioButtonUncheckedRounded,
    SaveRounded,
    AddRounded,
    DeleteOutlineRounded,
    CloseRounded,
    AutoAwesomeRounded,
    LockRounded
} from '@mui/icons-material';

const MODULES = [
    { id: 'tasks', label: 'Tasks & Objectives' },
    { id: 'projects', label: 'Project Portfolio' },
    { id: 'employees', label: 'Team & Members' },
    { id: 'roles', label: 'Security & RBAC' },
    { id: 'billing', label: 'Payments & Billing' },
    { id: 'sales', label: 'Sales & Pipelines' },
    { id: 'crm', label: 'CRM & Contacts' },
    { id: 'leads', label: 'Lead Intelligence' },
    { id: 'calendar', label: 'Event Calendar' },
    { id: 'hr', label: 'Human Resources' },
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
    
    // Create Role State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');
    const activeWorkspace = useSelector(state => state.workspace?.workspaces?.[0] || {});
    const workspaceId = activeWorkspace.id || activeWorkspace._id;

    const isAdminRole = selectedRole?.name === 'Admin';

    // Templates
    const [templates, setTemplates] = useState([]);
    const [activeTemplateId, setActiveTemplateId] = useState(null);

    useEffect(() => {
        dispatch(listRoles());
        // Fetch role templates on mount
        dispatch(fetchRoleTemplates()).then(data => {
            if (Array.isArray(data)) setTemplates(data);
        });
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
        setActiveTemplateId(null); // reset template highlight when switching roles
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
            await dispatch(updateRole(selectedRole.id || selectedRole._id, { 
                permissions: localPermissions 
            }));
            toast.success('Permissions updated successfully!');
        } catch (err) {
            toast.error('Failed to update permissions');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCreateRole = async (e) => {
        e.preventDefault();
        if (!newRoleName.trim()) return;
        try {
            await dispatch(createRole({ name: newRoleName, permissions: [], workspaceId }));
            toast.success('Role created successfully!');
            setShowCreateModal(false);
            setNewRoleName('');
            dispatch(listRoles());
        } catch (err) {
            toast.error('Failed to create role');
        }
    };

    const handleApplyTemplate = (template) => {
        setLocalPermissions(template.permissions);
        setActiveTemplateId(template.id);
        toast.success(`"${template.name}" template applied. You can still customize permissions.`, {
            icon: '✨',
            duration: 4000,
        });
    };

    const TEMPLATE_STYLES = {
        'HR Team':        { color: '#f59e0b', bg: 'bg-amber-50',   border: 'border-amber-200',   activeBg: 'bg-amber-500',   emoji: '👥' },
        'Sales Team':     { color: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-200', activeBg: 'bg-emerald-500', emoji: '💰' },
        'Marketing Team': { color: '#6366f1', bg: 'bg-indigo-50',  border: 'border-indigo-200',  activeBg: 'bg-indigo-500',  emoji: '📣' },
        'Employees':      { color: '#3b82f6', bg: 'bg-blue-50',    border: 'border-blue-200',    activeBg: 'bg-blue-500',    emoji: '🏢' },
        'Admin':          { color: '#7b68ee', bg: 'bg-purple-50',  border: 'border-purple-200',  activeBg: 'bg-[#7b68ee]',  emoji: '🛡️' },
        'Guest':          { color: '#94a3b8', bg: 'bg-slate-50',   border: 'border-slate-200',   activeBg: 'bg-slate-400',   emoji: '👤' },
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
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="w-8 h-8 rounded-lg bg-slate-50 text-[#7b68ee] flex items-center justify-center hover:bg-purple-50 transition-colors border border-slate-100 shadow-sm"
                    >
                        <AddRounded sx={{ fontSize: 20 }} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {roles?.map((role) => (
                        <div 
                            key={role.id || role._id}
                            onClick={() => handleRoleSelect(role)}
                            className={`p-4 rounded-2xl cursor-pointer transition-all border flex items-center gap-3 ${selectedRole?.id === role.id 
                                ? 'bg-[#7b68ee]/5 border-[#7b68ee]/20 text-[#7b68ee]' 
                                : 'bg-white border-transparent text-slate-600 hover:bg-slate-50'}`}
                        >
                            <AdminPanelSettingsRounded sx={{ fontSize: 20, opacity: selectedRole?.id === role.id ? 1 : 0.4 }} />
                            <div className="flex-1">
                                <div className="text-[13px] font-black tracking-tight">{role.name}</div>
                                <div className="text-[10px] font-bold opacity-60 uppercase tracking-wider">{role.name === 'Admin' ? 'System Role' : 'Custom Role'}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Permission Matrix */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {selectedRole ? (
                    <>
                        {/* Permission Matrix Header */}
                        <div className="px-10 pt-10 pb-6 border-b border-slate-100 bg-white flex justify-between items-end">
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
                                disabled={isSaving || isAdminRole}
                                className={`flex items-center gap-2 px-6 py-3 text-[12px] font-black text-white rounded-2xl shadow-lg transition-all active:scale-95 ${isAdminRole ? 'bg-slate-300 shadow-none cursor-not-allowed' : 'premium-gradient shadow-purple-500/30 hover:scale-[1.02] disabled:opacity-50'}`}
                            >
                                <SaveRounded sx={{ fontSize: 18 }} />
                                <span>{isAdminRole ? 'SYSTEM LOCKED' : isSaving ? 'SAVING...' : 'SAVE CHANGES'}</span>
                            </button>
                        </div>

                        {/* ── Role Template Selector ── */}
                        {!isAdminRole && (
                            <div className="px-10 py-5 bg-gradient-to-r from-slate-50 to-purple-50/30 border-b border-slate-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <AutoAwesomeRounded sx={{ fontSize: 15, color: '#7b68ee' }} />
                                    <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Select Role Template</span>
                                    <span className="text-[10px] font-bold text-slate-400 ml-1">— pre-fills permissions instantly</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {templates.map(template => {
                                        const style = TEMPLATE_STYLES[template.name] || { color: '#7b68ee', bg: 'bg-purple-50', border: 'border-purple-200', activeBg: 'bg-[#7b68ee]', emoji: '⚡' };
                                        const isActive = activeTemplateId === template.id;
                                        return (
                                            <button
                                                key={template.id}
                                                onClick={() => handleApplyTemplate(template)}
                                                title={template.description}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-black border transition-all hover:scale-[1.03] active:scale-95 ${
                                                    isActive
                                                        ? 'text-white shadow-lg border-transparent ' + style.activeBg
                                                        : style.bg + ' ' + style.border + ' hover:shadow-md'
                                                }`}
                                                style={isActive ? {} : { color: style.color }}
                                            >
                                                <span>{style.emoji}</span>
                                                {template.name}
                                                {isActive && <LockRounded sx={{ fontSize: 12 }} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

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
                                                    {ACTIONS.map(action => {
                                                        const permissionHasAction = isAdminRole ? true : rolePerms[action.id];
                                                        
                                                        return (
                                                        <td key={action.id} className="px-4 py-6 text-center">
                                                            <div 
                                                                onClick={() => { if (!isAdminRole) togglePermission(module.id, action.id) }}
                                                                className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center transition-all border ${permissionHasAction 
                                                                    ? `bg-[#7b68ee] border-[#7b68ee] text-white shadow-lg shadow-[#7b68ee]/30 ${isAdminRole ? '' : 'scale-110'}` 
                                                                    : 'bg-white border-slate-200 text-slate-200 hover:border-slate-300 hover:scale-105'
                                                                } ${isAdminRole ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                                                            >
                                                                {permissionHasAction ? (
                                                                    <CheckCircleRounded sx={{ fontSize: 16 }} />
                                                                ) : (
                                                                    <RadioButtonUncheckedRounded sx={{ fontSize: 16 }} />
                                                                )}
                                                            </div>
                                                        </td>
                                                    )})}
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

            {/* Create Role Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[28px] w-full max-w-[440px] shadow-[0_32px_80px_-12px_rgba(123,104,238,0.3)] overflow-hidden animate-fade-in">
                        <div className="bg-gradient-to-br from-[#7b68ee] to-[#5b4fc4] px-8 pt-8 pb-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="relative flex justify-between items-start">
                                <div>
                                    <h2 className="text-[22px] font-black text-white tracking-tight">Create Role</h2>
                                    <p className="text-white/60 text-xs font-medium">Add a new custom permission set</p>
                                </div>
                                <button onClick={() => setShowCreateModal(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex flex-col items-center justify-center text-white transition-colors">
                                    <CloseRounded sx={{ fontSize: 18 }} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleCreateRole} className="px-8 py-6 space-y-5">
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Role Name</label>
                                <input
                                    type="text"
                                    value={newRoleName}
                                    onChange={(e) => setNewRoleName(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:border-[#7b68ee] focus:bg-white outline-none transition-all"
                                    placeholder="e.g. Sales Manager"
                                    autoFocus
                                    required
                                />
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black text-white bg-gradient-to-r from-[#7b68ee] to-[#5b4fc4] shadow-lg shadow-[#7b68ee]/30 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    <AddRounded sx={{ fontSize: 18 }} />
                                    Create Role
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RolesPage;
