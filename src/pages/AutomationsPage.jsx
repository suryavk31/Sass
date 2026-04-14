import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { useSelector, useDispatch } from 'react-redux';
import { listWorkspaces } from '../actions/workspaceActions';
import toast from 'react-hot-toast';
import { 
    ElectricBoltRounded as Zap, 
    AddRounded as Plus, 
    DeleteOutlineRounded as Trash2, 
    PlayArrowRounded as Play, 
    CheckCircleRounded as CheckCircle, 
    ErrorOutlineRounded as AlertCircle, 
    SettingsRounded as Settings,
    MoreVertRounded as MoreVertical
} from '@mui/icons-material';

const AutomationsPage = () => {
    const dispatch = useDispatch();

    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedWorkspace, setSelectedWorkspace] = useState('');

    // Rule Builder State
    const [isBuilding, setIsBuilding] = useState(false);
    const [ruleName, setRuleName] = useState('');
    const [trigger, setTrigger] = useState('TASK_CREATED');
    const [conditionField, setConditionField] = useState('priority');
    const [conditionOperator, setConditionOperator] = useState('EQUALS');
    const [conditionValue, setConditionValue] = useState('High');
    const [actionType, setActionType] = useState('UPDATE_TASK');
    const [actionPayloadKey, setActionPayloadKey] = useState('status');
    const [actionPayloadValue, setActionPayloadValue] = useState('Done');

    const workspaceList = useSelector((state) => state.workspace);
    const { workspaces } = workspaceList;

    useEffect(() => {
        dispatch(listWorkspaces());
    }, [dispatch]);

    useEffect(() => {
        if (selectedWorkspace) {
            fetchRules(selectedWorkspace);
        } else if (workspaces && workspaces.length > 0) {
            setSelectedWorkspace(workspaces[0]._id || workspaces[0].id);
        }
    }, [workspaces, selectedWorkspace]);

    const fetchRules = async (workspaceId) => {
        if (!workspaceId || workspaceId === 'undefined') return;
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/automations?workspaceId=${workspaceId}`);
            setRules(data);
        } catch (error) {
            console.error('Error fetching rules:', error);
            toast.error('Failed to load automation rules');
        }
        setLoading(false);
    };

    const handleCreateRule = async (e) => {
        e.preventDefault();
        if (!selectedWorkspace) return;
        
        try {
            const payload = {
                workspaceId: selectedWorkspace,
                name: ruleName,
                trigger,
                conditions: [{ field: conditionField, operator: conditionOperator, value: conditionValue }],
                actions: [{ type: actionType, payload: { [actionPayloadKey]: actionPayloadValue } }]
            };
            await axios.post('/api/automations', payload);
            setIsBuilding(false);
            setRuleName('');
            fetchRules(selectedWorkspace);
            toast.success('Automation rule created!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to create rule');
        }
    };

    const handleDeleteRule = async (id) => {
        if (window.confirm('Are you sure you want to delete this automation rule?')) {
            try {
                await axios.delete(`/api/automations/${id}`);
                fetchRules(selectedWorkspace);
                toast.success('Rule deleted');
            } catch (error) {
                console.error(error);
                toast.error('Failed to delete rule');
            }
        }
    };

    return (
        <div className="bg-slate-50 flex-1 h-full overflow-y-auto w-full p-8 font-sans">
            <div className="max-w-6xl mx-auto w-full">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-10 transition-all">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-violet-600 rounded-xl shadow-lg shadow-violet-200">
                                <Zap className="text-white text-bold" sx={{ fontSize: 24 }} />
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Workflow Automations</h1>
                        </div>
                        <p className="text-sm text-slate-500 font-medium">Streamline your operations with intelligent, rule-based triggers.</p>
                    </div>
                    
                    <div className="flex gap-4 items-center">
                        <select
                            value={selectedWorkspace}
                            onChange={(e) => setSelectedWorkspace(e.target.value)}
                            className="bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-2xl px-5 py-3 shadow-sm hover:border-violet-300 outline-none transition-all focus:ring-4 focus:ring-violet-100"
                        >
                            <option value="">Select Workspace</option>
                            {workspaces && workspaces.map(ws => (
                                <option key={ws._id || ws.id} value={ws._id || ws.id}>{ws.name}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => setIsBuilding(!isBuilding)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg active:scale-95 ${isBuilding ? 'bg-slate-200 text-slate-600' : 'bg-slate-900 text-white hover:bg-black shadow-slate-200'}`}
                        >
                            {isBuilding ? 'Cancel' : (
                                <>
                                    <Plus sx={{ fontSize: 16 }} />
                                    <span>New Automation</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Rule Builder */}
                {isBuilding && (
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-50">
                            <div className="w-10 h-10 bg-violet-50 rounded-2xl flex items-center justify-center">
                                <Settings className="text-violet-600" sx={{ fontSize: 20 }} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Automation Blueprint</h2>
                        </div>
                        
                        <form onSubmit={handleCreateRule} className="space-y-10">
                            {/* Rule Name Input */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Rule Designation</label>
                                <input
                                    required
                                    type="text"
                                    value={ruleName}
                                    onChange={(e) => setRuleName(e.target.value)}
                                    placeholder="e.g., Auto-assign high priority tasks..."
                                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-slate-800 font-bold focus:bg-white focus:border-violet-500 transition-all outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Trigger Section */}
                                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100/50 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full translate-x-8 -translate-y-8"></div>
                                    <span className="inline-block text-[10px] font-black text-blue-600 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-widest mb-4">Phase 1: Trigger</span>
                                    <h4 className="text-sm font-black text-slate-900 mb-6">WHEN THIS HAPPENS:</h4>
                                    <select 
                                        value={trigger} 
                                        onChange={e => setTrigger(e.target.value)} 
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="TASK_CREATED">Task is Created</option>
                                        <option value="TASK_UPDATED">Task is Updated</option>
                                        <option value="DEAL_WON">Deal is Won</option>
                                        <option value="LEAD_CONVERTED">Lead is Converted</option>
                                    </select>
                                </div>

                                {/* Condition Section */}
                                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100/50 relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full translate-x-8 -translate-y-8"></div>
                                    <span className="inline-block text-[10px] font-black text-amber-600 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-widest mb-4">Phase 2: Logic</span>
                                    <h4 className="text-sm font-black text-slate-900 mb-6">IF THESE CONDITIONS ARE MET:</h4>
                                    <div className="flex flex-col gap-3">
                                        <input 
                                            type="text" 
                                            placeholder="Field (e.g., status)" 
                                            value={conditionField} 
                                            onChange={e => setConditionField(e.target.value)} 
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none" 
                                        />
                                        <select value={conditionOperator} onChange={e => setConditionOperator(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none">
                                            <option value="EQUALS">Is Exactly</option>
                                            <option value="NOT_EQUALS">Does Not Equal</option>
                                            <option value="CONTAINS">Contains</option>
                                        </select>
                                        <input 
                                            type="text" 
                                            placeholder="Value (e.g., High)" 
                                            value={conditionValue} 
                                            onChange={e => setConditionValue(e.target.value)} 
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none" 
                                        />
                                    </div>
                                </div>

                                {/* Action Section */}
                                <div className="p-8 bg-violet-50 rounded-[2rem] border border-violet-100 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full translate-x-8 -translate-y-8"></div>
                                    <span className="inline-block text-[10px] font-black text-violet-600 bg-violet-200 px-3 py-1 rounded-full uppercase tracking-widest mb-4">Phase 3: Execution</span>
                                    <h4 className="text-sm font-black text-slate-900 mb-6">THEN PERFORM THIS ACTION:</h4>
                                    <select 
                                        value={actionType} 
                                        onChange={e => setActionType(e.target.value)} 
                                        className="w-full bg-white border border-violet-200 rounded-xl px-4 py-3 text-sm font-bold text-violet-700 outline-none mb-4"
                                    >
                                        <option value="UPDATE_TASK">Update Record Property</option>
                                        <option value="LOG_AUDIT">Force Timeline Entry</option>
                                        <option value="SEND_NOTIFICATION">Notify Admin</option>
                                    </select>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="Key" value={actionPayloadKey} onChange={e => setActionPayloadKey(e.target.value)} className="w-1/2 bg-white border border-violet-100 rounded-xl px-4 py-3 text-xs font-bold text-violet-500 outline-none" />
                                        <input type="text" placeholder="Value" value={actionPayloadValue} onChange={e => setActionPayloadValue(e.target.value)} className="w-1/2 bg-white border border-violet-100 rounded-xl px-4 py-3 text-xs font-bold text-violet-800 outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end">
                                <button 
                                    type="submit" 
                                    className="bg-violet-600 text-white px-12 py-4 rounded-2xl shadow-xl shadow-violet-200 hover:bg-violet-700 font-bold transition-all transform hover:-translate-y-1 active:scale-95"
                                >
                                    Activate Intelligence
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Rules Repository */}
                <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                    <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-3">
                           <Play className="w-4 h-4 text-violet-600" />
                           <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">Active Automation Scripts</h3>
                        </div>
                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-400">TOTAL: {rules.length}</span>
                    </div>

                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center opacity-40">
                            <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-slate-500 font-bold">Synchronizing rules...</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {rules.map((rule) => (
                                <div key={rule.id || rule._id} className="p-8 hover:bg-slate-50/50 transition-colors group">
                                    <div className="flex items-center justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-violet-600 transition-colors uppercase decoration-violet-500/20 underline-offset-4 decoration-2">
                                                    {rule.name}
                                                </h4>
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg border border-blue-100 uppercase tracking-widest leading-none">
                                                    <Zap sx={{ fontSize: 10 }} /> {rule.trigger}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-400">
                                               <div className="flex items-center gap-1 text-[12px] font-bold">
                                                   <span className="text-slate-400">Logic:</span>
                                                   <span className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">IF {rule.conditions?.[0]?.field} {rule.conditions?.[0]?.operator === 'EQUALS' ? '==' : rule.conditions?.[0]?.operator} {rule.conditions?.[0]?.value}</span>
                                               </div>
                                               <span className="text-slate-300">/</span>
                                               <div className="flex items-center gap-1 text-[12px] font-bold">
                                                   <span className="text-slate-400">Action:</span>
                                                   <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-tighter">{rule.actions?.[0]?.type.replace('_', ' ')}</span>
                                               </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <button className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-100 rounded-2xl shadow-sm transition-all">
                                                <MoreVertical sx={{ fontSize: 16 }} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteRule(rule.id || rule._id)}
                                                className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-100 rounded-2xl shadow-sm transition-all"
                                            >
                                                <Trash2 sx={{ fontSize: 16 }} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {rules.length === 0 && (
                                <div className="p-24 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                        <Zap sx={{ fontSize: 32 }} />
                                    </div>
                                    <h4 className="text-lg font-black text-slate-800">No automation active</h4>
                                    <p className="text-slate-400 text-sm font-medium mt-1 mb-8">Ready to supercharge your workspace? Create your first blueprint above.</p>
                                    <button 
                                        onClick={() => setIsBuilding(true)}
                                        className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-2xl text-xs font-black shadow-lg shadow-blue-100 transition-all uppercase tracking-widest"
                                    >
                                        Deploy Initial Rule
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>

            {/* Premium Styling Overrides */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slide-in-from-top-4 { from { transform: translateY(-1rem); } to { transform: translateY(0); } }
                .animate-in { animation: fade-in 0.3s ease-out, slide-in-from-top-4 0.3s ease-out; }
                .tracking-tighter { letter-spacing: -0.05em; }
            `}} />
        </div>
    );
};

export default AutomationsPage;