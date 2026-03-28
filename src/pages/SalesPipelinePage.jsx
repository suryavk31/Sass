import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { listWorkspaces } from '../actions/workspaceActions';
import { AddRounded, EditRounded, DeleteRounded, EuroRounded, MoreVertRounded, AssignmentIndRounded } from '@mui/icons-material';
import toast from 'react-hot-toast';
import socket from '../socket';

const SalesPipelinePage = () => {
    const dispatch = useDispatch();
    const [pipelines, setPipelines] = useState([]);
    const [selectedPipeline, setSelectedPipeline] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Add deal modal
    const [showDealModal, setShowDealModal] = useState(false);
    const [newDeal, setNewDeal] = useState({ title: '', value: 0, stageId: '', closingDate: '', salesType: '', notes: '' });

    // Add pipeline modal
    const [showPipelineModal, setShowPipelineModal] = useState(false);
    const [newPipelineName, setNewPipelineName] = useState('');
    const [newPipelineFields, setNewPipelineFields] = useState([]); // [{name: 'VIN', type: 'text'}]

    // Generate Invoice modal
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [invoiceData, setInvoiceData] = useState({ dealId: '', amount: 0, dueDate: '' });

    const workspaceList = useSelector((state) => state.workspace);
    const { workspaces } = workspaceList;
    
    const [currentWorkspaceId, setCurrentWorkspaceId] = useState('');

    const token = localStorage.getItem('token');
    const authConfig = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        dispatch(listWorkspaces());
    }, [dispatch]);

    useEffect(() => {
        let updateHandler;
        
        if (currentWorkspaceId) {
            fetchPipelines(currentWorkspaceId);
            
            socket.emit("join_workspace", currentWorkspaceId);
            
            updateHandler = () => {
                fetchPipelines(currentWorkspaceId);
            };
            socket.on("pipelineUpdated", updateHandler);
            
        } else if (workspaces && workspaces.length > 0) {
            setCurrentWorkspaceId(workspaces[0]._id);
            fetchPipelines(workspaces[0]._id);
        }
        
        return () => {
             if (updateHandler) socket.off("pipelineUpdated", updateHandler);
        };
    }, [workspaces, currentWorkspaceId]);

    const fetchPipelines = async (workspaceId) => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/sales/pipelines?workspaceId=${workspaceId}`, authConfig);
            setPipelines(data);
            if (data.length > 0 && !selectedPipeline) {
                setSelectedPipeline(data[0]);
            } else if (data.length > 0 && selectedPipeline) {
                const updated = data.find(p => p.id === selectedPipeline.id);
                if (updated) setSelectedPipeline(updated);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const handleCreatePipeline = async () => {
        if (!newPipelineName.trim()) return;
        try {
            const { data } = await axios.post('/api/sales/pipelines', { 
                name: newPipelineName, 
                workspaceId: currentWorkspaceId,
                customFields: newPipelineFields
            }, authConfig);
            const updatedPipelines = [...pipelines, data];
            setPipelines(updatedPipelines);
            setSelectedPipeline(data);
            setShowPipelineModal(false);
            setNewPipelineName('');
            setNewPipelineFields([]);
        } catch (error) {
            console.error(error);
            toast.error("Failed to create pipeline");
        }
    };

    const handleCreateDeal = async () => {
        if (!newDeal.title || !newDeal.stageId) return;
        
        // Extract custom data
        const customData = {};
        if (selectedPipeline && selectedPipeline.customFields) {
            selectedPipeline.customFields.forEach(field => {
                if (newDeal[field.name]) {
                    customData[field.name] = newDeal[field.name];
                }
            });
        }

        try {
            await axios.post('/api/sales/deals', {
                ...newDeal,
                customData,
                pipelineId: selectedPipeline.id,
                workspaceId: currentWorkspaceId
            }, authConfig);
            fetchPipelines(currentWorkspaceId);
            setShowDealModal(false);
            setNewDeal({ title: '', value: 0, stageId: '', closingDate: '', salesType: '', notes: '' });
        } catch (error) {
            console.error(error);
            toast.error("Failed to create deal");
        }
    };

    // Drag and Drop Logic
    const onDragStart = (e, dealId) => {
        e.dataTransfer.setData("dealId", dealId);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const onDrop = async (e, stageId) => {
        e.preventDefault();
        const dealId = e.dataTransfer.getData("dealId");
        if (!dealId) return;

        // Optimistic UI Update
        const updatedPipeline = { ...selectedPipeline };
        let draggedDeal = null;
        let sourceStage = null;

        updatedPipeline.stages.forEach(stage => {
            const dealIndex = stage.deals.findIndex(d => d.id === dealId);
            if (dealIndex > -1) {
                draggedDeal = stage.deals[dealIndex];
                sourceStage = stage;
                stage.deals.splice(dealIndex, 1);
            }
        });

        if (draggedDeal && draggedDeal.stageId !== stageId) {
            draggedDeal.stageId = stageId;
            const targetStage = updatedPipeline.stages.find(s => s.id === stageId);
            if (targetStage) {
                targetStage.deals.push(draggedDeal);
                setSelectedPipeline(updatedPipeline);
                
                try {
                    await axios.put(`/api/sales/deals/${dealId}`, { stageId }, authConfig);
                } catch (error) {
                    console.error("Failed to update deal stage", error);
                    toast.error("Failed to update deal stage");
                    fetchPipelines(currentWorkspaceId); // Revert
                }
            }
        } else if (draggedDeal && sourceStage) {
            // Revert optimistic if dropped in same stage
            sourceStage.deals.push(draggedDeal);
        }
    };

    const handleCreateInvoice = async () => {
        try {
            await axios.post('/api/invoices', {
                ...invoiceData,
                workspaceId: currentWorkspaceId
            }, authConfig);
            toast.success('Invoice Generated Successfully!');
            setShowInvoiceModal(false);
        } catch(error) {
            console.error(error);
            toast.error('Failed to generate invoice.');
        }
    };

    return (
        <div className="flex-1 bg-white flex flex-col min-w-0 h-full overflow-hidden">
            {/* Header */}
            <div className="px-8 pt-8 pb-4 shrink-0">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sales Pipeline</h1>
                        <p className="text-slate-500 text-sm font-medium">Manage custom deals and sales pipelines.</p>
                    </div>
                    
                    <div className="flex gap-3">
                        <select 
                            value={selectedPipeline?.id || ''}
                            onChange={(e) => {
                                const pip = pipelines.find(p => p.id === e.target.value);
                                if (pip) setSelectedPipeline(pip);
                            }}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-[#7b68ee] focus:ring-2 focus:ring-[#7b68ee]/20 outline-none"
                        >
                            {pipelines.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <button 
                            onClick={() => setShowPipelineModal(true)}
                            className="flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl text-sm font-bold shadow-sm"
                        >
                            <AddRounded sx={{ fontSize: 18 }} />
                            New Pipeline
                        </button>
                        <button 
                            onClick={() => {
                                if (selectedPipeline?.stages?.length > 0) {
                                    setNewDeal({ ...newDeal, stageId: selectedPipeline.stages[0].id });
                                    setShowDealModal(true);
                                } else {
                                    toast.error("Please create a pipeline with stages first.");
                                }
                            }}
                            className="flex items-center gap-2 bg-[#7b68ee] hover:bg-[#6c58e0] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-[#7b68ee]/20"
                        >
                            <AddRounded sx={{ fontSize: 18 }} />
                            Add Deal
                        </button>
                    </div>
                </div>
            </div>

            {/* Pipeline Board */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden px-8 pb-8 flex gap-6 min-h-[500px]">
                {loading && pipelines.length === 0 ? (
                    <div className="flex items-center justify-center w-full">
                        <div className="animate-spin text-[#7b68ee] font-bold text-xl">Loading...</div>
                    </div>
                ) : selectedPipeline && selectedPipeline.stages ? (
                    selectedPipeline.stages.map((stage) => (
                        <div 
                            key={stage.id} 
                            className="flex flex-col flex-shrink-0 w-[300px] bg-slate-50 rounded-2xl p-4 border border-slate-100 max-h-full"
                            onDragOver={onDragOver}
                            onDrop={(e) => onDrop(e, stage.id)}
                        >
                            <div className="flex items-center justify-between mb-4 px-2">
                                <h3 className="font-black text-slate-700 uppercase tracking-widest text-xs">
                                    {stage.name}
                                </h3>
                                <span className="text-xs font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-sm">
                                    {stage.deals.length}
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pb-2">
                                {stage.deals.map((deal) => (
                                    <div 
                                        key={deal.id}
                                        draggable
                                        onDragStart={(e) => onDragStart(e, deal.id)}
                                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all hover:border-[#7b68ee]/40 group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-800 text-sm leading-tight">{deal.title}</h4>
                                            <button className="text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreVertRounded sx={{ fontSize: 16 }} />
                                            </button>
                                        </div>
                                        <div className="text-[#6c58e0] font-black text-lg tracking-tight mb-3">
                                            ${parseFloat(deal.value).toLocaleString()}
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                                            <div className="flex items-center gap-1">
                                                <AssignmentIndRounded sx={{ fontSize: 14 }} />
                                                {deal.contact?.firstName ? `${deal.contact.firstName} ${deal.contact.lastName || ''}` : 'No Contact'}
                                            </div>
                                        </div>
                                        {deal.customData && Object.keys(deal.customData).length > 0 && (
                                            <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex flex-wrap gap-2">
                                                {Object.entries(deal.customData).map(([key, val]) => (
                                                    <span key={key} className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                                        <b>{key}:</b> {val}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setInvoiceData({ dealId: deal.id, amount: deal.value, dueDate: '' });
                                                    setShowInvoiceModal(true);
                                                }}
                                                className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded hover:bg-emerald-100 transition-colors"
                                            >
                                                Generate Invoice
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex w-full items-center justify-center text-slate-400 font-bold">
                        No pipelines found. Please create one to begin.
                    </div>
                )}
            </div>

            {/* Add Deal Modal */}
            {showDealModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[28px] w-full max-w-[480px] shadow-[0_32px_80px_-12px_rgba(123,104,238,0.3)] overflow-hidden animate-fade-in">
                        
                        {/* Premium Header */}
                        <div className="bg-gradient-to-br from-[#7b68ee] to-[#5b4fc4] px-8 pt-8 pb-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                            <div className="relative">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                                        <AddRounded sx={{ fontSize: 20, color: 'white' }} />
                                    </div>
                                    <h2 className="text-[22px] font-black text-white tracking-tight">New Deal</h2>
                                </div>
                                <p className="text-white/60 text-xs font-medium ml-12">Fill in the details to create this deal</p>
                            </div>
                        </div>

                        {/* Form Body */}
                        <div className="px-8 py-6 space-y-5 max-h-[60vh] overflow-y-auto thin-scrollbar">
                            
                            {/* Deal Title */}
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Deal Title</label>
                                <input
                                    type="text"
                                    value={newDeal.title}
                                    onChange={(e) => setNewDeal({...newDeal, title: e.target.value})}
                                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:border-[#7b68ee] focus:bg-white outline-none transition-all"
                                    placeholder="e.g. Acme Corp Software License"
                                    autoFocus
                                />
                            </div>

                            {/* Value + Stage Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Deal Value</label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm">$</span>
                                        <input
                                            type="number"
                                            value={newDeal.value}
                                            onChange={(e) => setNewDeal({...newDeal, value: e.target.value})}
                                            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl pl-8 pr-4 py-3 text-sm font-semibold text-slate-800 focus:border-[#7b68ee] focus:bg-white outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Initial Stage</label>
                                    <select
                                        value={newDeal.stageId}
                                        onChange={(e) => setNewDeal({...newDeal, stageId: e.target.value})}
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:border-[#7b68ee] focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        {selectedPipeline?.stages?.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Closing Date + Sales Type */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Closing Date</label>
                                    <input
                                        type="date"
                                        value={newDeal.closingDate}
                                        onChange={(e) => setNewDeal({...newDeal, closingDate: e.target.value})}
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 focus:border-[#7b68ee] focus:bg-white outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Sales Type</label>
                                    <input
                                        type="text"
                                        value={newDeal.salesType}
                                        onChange={(e) => setNewDeal({...newDeal, salesType: e.target.value})}
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:border-[#7b68ee] focus:bg-white outline-none transition-all"
                                        placeholder="Software, Car…"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Notes</label>
                                <textarea
                                    value={newDeal.notes}
                                    onChange={(e) => setNewDeal({...newDeal, notes: e.target.value})}
                                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:border-[#7b68ee] focus:bg-white outline-none transition-all resize-none"
                                    rows="3"
                                    placeholder="Add context, next steps, or anything relevant..."
                                />
                            </div>

                            {/* Dynamic Custom Fields */}
                            {selectedPipeline?.customFields?.length > 0 && (
                                <div className="pt-4 border-t-2 border-slate-50 space-y-4">
                                    <h3 className="text-[11px] font-black text-[#7b68ee] uppercase tracking-[0.15em] flex items-center gap-2">
                                        <span className="w-4 h-[2px] bg-[#7b68ee] rounded" /> Custom Fields
                                    </h3>
                                    {selectedPipeline.customFields.map((field, idx) => (
                                        <div key={idx}>
                                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">{field.name}</label>
                                            <input
                                                type={field.type === 'number' ? 'number' : 'text'}
                                                onChange={(e) => setNewDeal({...newDeal, [field.name]: e.target.value})}
                                                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:border-[#7b68ee] focus:bg-white outline-none transition-all"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="px-8 pb-7 pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
                            <button
                                onClick={() => setShowDealModal(false)}
                                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateDeal}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black text-white bg-gradient-to-r from-[#7b68ee] to-[#5b4fc4] shadow-lg shadow-[#7b68ee]/30 hover:shadow-[#7b68ee]/50 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                <AddRounded sx={{ fontSize: 18 }} />
                                Create Deal
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Add Pipeline Modal */}
            {showPipelineModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-3xl p-8 w-[400px] shadow-2xl">
                        <h2 className="text-xl font-black text-slate-900 mb-6">Create New Pipeline</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pipeline Name</label>
                                <input 
                                    type="text" 
                                    value={newPipelineName}
                                    onChange={(e) => setNewPipelineName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#7b68ee]/30 focus:border-[#7b68ee] outline-none"
                                    placeholder="e.g. Software Sales, Real Estate Leasing"
                                />
                            </div>
                            
                            <div className="pt-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Custom Fields (Optional)</label>
                                {newPipelineFields.map((field, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input 
                                            type="text" 
                                            value={field.name}
                                            onChange={(e) => {
                                                const updated = [...newPipelineFields];
                                                updated[index].name = e.target.value;
                                                setNewPipelineFields(updated);
                                            }}
                                            placeholder="Field Name"
                                            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold"
                                        />
                                        <select
                                            value={field.type}
                                            onChange={(e) => {
                                                const updated = [...newPipelineFields];
                                                updated[index].type = e.target.value;
                                                setNewPipelineFields(updated);
                                            }}
                                            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold"
                                        >
                                            <option value="text">Text</option>
                                            <option value="number">Number</option>
                                        </select>
                                    </div>
                                ))}
                                <button 
                                    onClick={() => setNewPipelineFields([...newPipelineFields, {name: '', type: 'text'}])}
                                    className="text-xs font-bold text-[#7b68ee] hover:underline"
                                >
                                    + Add Custom Field
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button 
                                onClick={() => setShowPipelineModal(false)}
                                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleCreatePipeline}
                                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#7b68ee] text-white hover:bg-[#6c58e0] shadow-md shadow-[#7b68ee]/20 transition-all"
                            >
                                Create Pipeline
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Generate Invoice Modal */}
            {showInvoiceModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-3xl p-8 w-[400px] shadow-2xl">
                        <h2 className="text-xl font-black text-slate-900 mb-6">Generate Invoice</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Amount ($)</label>
                                <input 
                                    type="number" 
                                    value={invoiceData.amount}
                                    onChange={(e) => setInvoiceData({...invoiceData, amount: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Due Date</label>
                                <input 
                                    type="date" 
                                    value={invoiceData.dueDate}
                                    onChange={(e) => setInvoiceData({...invoiceData, dueDate: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button 
                                onClick={() => setShowInvoiceModal(false)}
                                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleCreateInvoice}
                                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-all"
                            >
                                Generate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesPipelinePage;
