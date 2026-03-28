import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { listWorkspaces } from '../actions/workspaceActions';
import toast from 'react-hot-toast';

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

    const token = localStorage.getItem('token');
    const authConfig = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        dispatch(listWorkspaces());
    }, [dispatch]);

    useEffect(() => {
        if (selectedWorkspace) {
            fetchRules(selectedWorkspace);
        } else if (workspaces && workspaces.length > 0) {
            setSelectedWorkspace(workspaces[0]._id);
            fetchRules(workspaces[0]._id);
        }
    }, [workspaces, selectedWorkspace]);

    const fetchRules = async (workspaceId) => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/automations?workspaceId=${workspaceId}`, authConfig);
            setRules(data);
        } catch (error) {
            console.error('Error fetching rules:', error);
        }
        setLoading(false);
    };

    const handleCreateRule = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                workspaceId: selectedWorkspace,
                name: ruleName,
                trigger,
                conditions: [{ field: conditionField, operator: conditionOperator, value: conditionValue }],
                actions: [{ type: actionType, payload: { [actionPayloadKey]: actionPayloadValue } }]
            };
            await axios.post('/api/automations', payload, authConfig);
            setIsBuilding(false);
            setRuleName('');
            fetchRules(selectedWorkspace);
        } catch (error) {
            console.error(error);
            toast.error('Failed to create rule');
        }
    };

    const handleDeleteRule = async (id) => {
        if (window.confirm('Delete this automation rule?')) {
            try {
                await axios.delete(`/api/automations/${id}`, authConfig);
                fetchRules(selectedWorkspace);
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="bg-gray-50 flex-1 overflow-y-auto w-full">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Workflow Automations</h1>
                        <p className="text-sm text-gray-500 mt-1">If This, Then That. Automate repetitive tasks securely.</p>
                    </div>
                    <div className="flex gap-4">
                        <select
                            value={selectedWorkspace}
                            onChange={(e) => setSelectedWorkspace(e.target.value)}
                            className="text-sm border-gray-300 rounded-md py-2 px-3 shadow-sm bg-white"
                        >
                            {workspaces && workspaces.map(ws => (
                                <option key={ws._id} value={ws._id}>{ws.name}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => setIsBuilding(!isBuilding)}
                            className="bg-violet-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors hover:bg-violet-700 shadow-sm"
                        >
                            {isBuilding ? 'Cancel' : '+ New Rule'}
                        </button>
                    </div>
                </div>

                {isBuilding && (
                    <div className="bg-white rounded-lg shadow-sm border border-violet-200 p-6 mb-8 mt-4 animate-fade-in-down">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Rule Builder</h2>
                        <form onSubmit={handleCreateRule}>

                            {/* Name */}
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Rule Name</label>
                                <input
                                    required type="text" value={ruleName} onChange={(e) => setRuleName(e.target.value)}
                                    placeholder="e.g., Auto-complete urgent tasks"
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-violet-500 text-sm py-2"
                                />
                            </div>

                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Trigger */}
                                <div className="flex-1 bg-gray-50 p-4 rounded border border-gray-200">
                                    <span className="inline-block bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest mb-2">WHEN (Trigger)</span>
                                    <select value={trigger} onChange={e => setTrigger(e.target.value)} className="w-full text-sm border-gray-300 rounded py-2">
                                        <option value="TASK_CREATED">Task is Created</option>
                                        <option value="TASK_UPDATED">Task is Updated</option>
                                    </select>
                                </div>

                                {/* Condition */}
                                <div className="flex-2 bg-gray-50 p-4 rounded border border-gray-200 flex flex-col justify-center">
                                    <span className="inline-block bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest mb-2">IF (Condition)</span>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input type="text" placeholder="Field (e.g., priority)" value={conditionField} onChange={e => setConditionField(e.target.value)} className="w-full text-sm border-gray-300 rounded py-2" />
                                        <select value={conditionOperator} onChange={e => setConditionOperator(e.target.value)} className="w-full text-sm border-gray-300 rounded py-2">
                                            <option value="EQUALS">Equals</option>
                                            <option value="NOT_EQUALS">Does Not Equal</option>
                                            <option value="CONTAINS">Contains</option>
                                        </select>
                                        <input type="text" placeholder="Value (e.g., High)" value={conditionValue} onChange={e => setConditionValue(e.target.value)} className="w-full text-sm border-gray-300 rounded py-2" />
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="flex-1 bg-violet-50 p-4 rounded border border-violet-200">
                                    <span className="inline-block bg-violet-200 text-violet-800 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest mb-2">THEN (Action)</span>
                                    <select value={actionType} onChange={e => setActionType(e.target.value)} className="w-full text-sm border-violet-300 rounded py-2 mb-2">
                                        <option value="UPDATE_TASK">Update Task Field</option>
                                        <option value="LOG_AUDIT">Force Audit Log</option>
                                    </select>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="Field" value={actionPayloadKey} onChange={e => setActionPayloadKey(e.target.value)} className="w-1/2 text-sm border-violet-300 rounded py-2" />
                                        <input type="text" placeholder="Value" value={actionPayloadValue} onChange={e => setActionPayloadValue(e.target.value)} className="w-1/2 text-sm border-violet-300 rounded py-2" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-md shadow hover:bg-black font-semibold text-sm">
                                    Save Automation
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Existing Rules Table */}
                <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Active Rules</h3>
                    </div>
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading automation scripts...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 table-compact">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 text-left font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-4 text-left font-semibold text-gray-500 uppercase tracking-wider">Trigger</th>
                                        <th className="px-4 text-left font-semibold text-gray-500 uppercase tracking-wider">Summary</th>
                                        <th className="px-4 text-right font-semibold text-gray-500 uppercase tracking-wider">State</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {rules.map((r) => (
                                        <tr key={r._id}>
                                            <td className="px-4 text-sm font-semibold text-gray-900">{r.name}</td>
                                            <td className="px-4">
                                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-sm border border-blue-200 tracking-wider">
                                                    {r.trigger}
                                                </span>
                                            </td>
                                            <td className="px-4 text-xs text-gray-500">
                                                IF {r.conditions[0]?.field} {r.conditions[0]?.operator} {r.conditions[0]?.value}
                                                <span className="font-bold text-violet-600 mx-1">THEN</span>
                                                {r.actions[0]?.type}
                                            </td>
                                            <td className="px-4 text-right">
                                                <button onClick={() => handleDeleteRule(r._id)} className="text-red-500 hover:text-red-700 text-xs font-semibold uppercase">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {rules.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-4 py-8 text-center text-gray-500 italic">No automations configured.</td>
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

export default AutomationsPage;
