// src/components/Task/TaskDetailPanel.jsx — Premium Side-panel for Task Intelligence
import React, { useState, useEffect } from 'react';
import { 
    PersonOutlineRounded,
    MoreHorizRounded,
    DescriptionRounded,
    AssignmentRounded,
    CheckRounded,
    DeleteRounded,
    CloseRounded,
    CalendarTodayRounded,
    AddRounded
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask, listTasks, deleteTask, createTask } from '../../actions/taskActions';
import MemberSelector from '../ui/MemberSelector';
import Dropdown from '../ui/Dropdown';
import ConfirmModal from '../ui/ConfirmModal';




const TaskDetailPanel = ({ task, onClose, onUpdate }) => {
    const dispatch = useDispatch();
    const taskId = task._id || task.id;
    const { tasks } = useSelector((state) => state.task);
    
    // Local state for edits
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [newSubtask, setNewSubtask] = useState('');
    const [showMemberSelector, setShowMemberSelector] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);


    // Derived subtasks for this task
    const subtasks = tasks?.filter(t => (t.parentId === taskId)) || [];

    useEffect(() => {
        setTitle(task.title);
        setDescription(task.description || '');
        // Fetch subtasks explicitly if they aren't in the main list
        dispatch(listTasks(task.projectId));
    }, [task, dispatch]);

    const handleSave = () => {
        dispatch(updateTask(taskId, { title, description }));
        // Optionally show a toast
    };

    const handleAddSubtask = (e) => {
        if (e.key === 'Enter' && newSubtask.trim()) {
            dispatch(createTask({
                title: newSubtask,
                project: task.projectId,
                parentId: taskId,
                status: 'todo'
            }));
            setNewSubtask('');
        }
    };

    const handleAssigneeChange = (member) => {
        const memberId = member._id || member.id;
        if (!memberId) return;

        const currentAssignees = task.assignedTo || [];
        const isAlreadySelected = currentAssignees.some(m => (m._id || m.id) === memberId);
        
        let newAssigneeIds;
        if (isAlreadySelected) {
            newAssigneeIds = currentAssignees
                .filter(m => (m._id || m.id) !== memberId)
                .map(m => m._id || m.id);
        } else {
            newAssigneeIds = [...currentAssignees.map(m => m._id || m.id), memberId];
        }
        
        dispatch(updateTask(taskId, { assignedTo: newAssigneeIds }));
    };

    const toggleSubtask = (sub) => {
        const newStatus = sub.status === 'done' ? 'todo' : 'done';
        dispatch(updateTask(sub._id || sub.id, { status: newStatus }));
    };

    const handleDelete = () => {
        setDeleteConfirm(true);
    };

    const confirmDelete = () => {
        dispatch(deleteTask(taskId));
        onClose();
    };


    return (
        <div className="fixed inset-0 z-[110] flex justify-end">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative w-full max-w-[540px] bg-white h-full shadow-[0_0_100px_rgba(0,0,0,0.2)] flex flex-col animate-in slide-in-from-right duration-500 ease-out border-l border-slate-100">
                
                {/* Panel Header */}
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#7b68ee]/10 flex items-center justify-center text-[#7b68ee]">
                            <AssignmentRounded sx={{ fontSize: 22 }} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Task Intelligence</span>
                            <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider ${task.priority === 'high' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'}`}>
                                    {task.priority || 'Medium'} Progress
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Dropdown 
                            trigger={
                                <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all">
                                    <MoreHorizRounded sx={{ fontSize: 20 }} />
                                </button>
                            }
                            items={[
                                { label: 'Delete Task', icon: <DeleteRounded />, danger: true, onClick: handleDelete }
                            ]}
                        />
                        <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all">
                            <CloseRounded sx={{ fontSize: 20 }} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
                    {/* Title & Description */}
                    <div className="space-y-6">
                        <input 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleSave}
                            className="text-[28px] font-black text-slate-900 tracking-tight w-full focus:outline-none bg-transparent placeholder-slate-200"
                            placeholder="Untiltled Objective"
                        />
                        
                        <div className="space-y-3">
                             <div className="flex items-center gap-2.5 text-slate-400">
                                <DescriptionRounded sx={{ fontSize: 16 }} />
                                <span className="text-[11px] font-black uppercase tracking-widest">Description</span>
                             </div>
                             <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                onBlur={handleSave}
                                placeholder="Describe the mission details..."
                                className="w-full text-[15px] font-medium text-slate-600 focus:outline-none bg-slate-50/50 p-4 rounded-2xl border border-transparent focus:border-slate-100 focus:bg-white transition-all resize-none min-h-[140px] leading-relaxed"
                            />
                        </div>
                    </div>

                    {/* Meta Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-sm space-y-4 relative overflow-visible">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Owner / Lead</label>
                            <div className="relative">
                                <div className="flex -space-x-3 overflow-hidden hover:space-x-1 transition-all duration-300 group/avatars p-1">
                                    {task.assignedTo && task.assignedTo.length > 0 ? (
                                        task.assignedTo.map((member, idx) => (
                                            <div 
                                                key={member.id || idx} 
                                                className="w-10 h-10 rounded-full premium-gradient flex items-center justify-center text-[11px] font-black text-white ring-4 ring-white shadow-lg uppercase transform transition-transform group-hover/avatars:scale-110"
                                                title={member.name}
                                            >
                                                {member.name?.charAt(0)}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 text-slate-300">
                                            <PersonOutlineRounded sx={{ fontSize: 20 }} />
                                        </div>
                                    )}
                                    <button 
                                        onClick={() => setShowMemberSelector(!showMemberSelector)}
                                        className="w-10 h-10 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#7b68ee] hover:border-[#7b68ee]/30 transition-all ring-4 ring-white"
                                    >
                                        <AddRounded sx={{ fontSize: 20 }} />
                                    </button>
                                </div>
                                {showMemberSelector && (
                                    <MemberSelector 
                                        selectedMembers={task.assignedTo || []}
                                        onSelect={handleAssigneeChange}
                                        onClose={() => setShowMemberSelector(false)}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-sm space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Deployment Target</label>
                            <button className="flex items-center gap-3 w-full group text-left">
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#7b68ee] group-hover:bg-[#7b68ee]/5 transition-all">
                                    <CalendarTodayRounded sx={{ fontSize: 16 }} />
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-slate-700 group-hover:text-[#7b68ee]">
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Set Deadline'}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-medium">Click to adjust date</p>
                                </div>
                            </button>
                        </div>

                        <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-sm space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Phase / Milestone</label>
                            <input 
                                value={task.customFields?.phase || ''}
                                onChange={(e) => dispatch(updateTask(taskId, { customFields: { ...task.customFields, phase: e.target.value } }))}
                                placeholder="e.g. Phase 1"
                                className="w-full text-[13px] font-bold text-slate-700 focus:outline-none bg-transparent placeholder-slate-200"
                            />
                        </div>

                        <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-sm space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Internal Remark</label>
                            <input 
                                value={task.customFields?.remark || ''}
                                onChange={(e) => dispatch(updateTask(taskId, { customFields: { ...task.customFields, remark: e.target.value } }))}
                                placeholder="Add remark..."
                                className="w-full text-[13px] font-bold text-slate-700 focus:outline-none bg-transparent placeholder-slate-200"
                            />
                        </div>
                    </div>

                    {/* Checklists Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-2.5">
                                    <div className="w-1.5 h-6 bg-[#7b68ee] rounded-full mr-1"></div>
                                    Sub-tasks & Milestones
                                </h3>
                                <p className="text-[11px] font-medium text-slate-400">Break down this objective into executable steps.</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[12px] font-black text-[#7b68ee]">
                                    {Math.round(subtasks.length > 0 ? (subtasks.filter(s => s.status === 'done').length / subtasks.length) * 100 : 0)}%
                                </span>
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">Velocity</span>
                            </div>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="h-2 w-full bg-slate-100 rounded-full p-0.5 overflow-hidden">
                            <div 
                                className="h-full premium-gradient rounded-full transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                                style={{ width: `${subtasks.length > 0 ? (subtasks.filter(s => s.status === 'done').length / subtasks.length) * 100 : 0}%` }}
                            ></div>
                        </div>

                        <div className="space-y-1.5 mt-8">
                            {subtasks.map((sub) => (
                                <div key={sub._id || sub.id} className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50/80 hover:shadow-sm border border-transparent hover:border-slate-100 transition-all">
                                    <button 
                                        onClick={() => toggleSubtask(sub)} 
                                        className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${
                                            sub.status === 'done' ? 'bg-[#00c875] border-[#00c875] text-white shadow-lg shadow-[#00c875]/20' : 'border-slate-200 text-slate-200 group-hover:border-[#7b68ee] group-hover:text-[#7b68ee]'
                                        }`}
                                    >
                                        <CheckRounded sx={{ fontSize: 14, strokeWidth: 3 }} />
                                    </button>
                                    <span className={`flex-1 text-[13px] font-bold transition-all ${sub.status === 'done' ? 'text-slate-300 line-through' : 'text-slate-700'}`}>
                                        {sub.title}
                                    </span>
                                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                                        <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-slate-300 hover:text-red-500 transition-all shadow-sm">
                                            <CloseRounded sx={{ fontSize: 14 }} onClick={() => dispatch(deleteTask(sub._id || sub.id))} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            <div className="relative group mt-4">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 group-focus-within:border-[#7b68ee] group-focus-within:text-[#7b68ee] transition-all">
                                     <AddRounded sx={{ fontSize: 14 }} />
                                </div>
                                <input 
                                    value={newSubtask}
                                    onChange={(e) => setNewSubtask(e.target.value)}
                                    onKeyDown={handleAddSubtask}
                                    placeholder="Add sub-task..."
                                    className="w-full bg-slate-50/50 hover:bg-slate-50 rounded-2xl pl-12 pr-4 py-3.5 text-[13px] font-bold text-slate-600 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-100 transition-all placeholder-slate-300"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 tracking-widest opacity-0 group-focus-within:opacity-100 transition-opacity uppercase">Press [Enter]</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Modified By</span>
                        <p className="text-[11px] font-bold text-slate-600">You • Just now</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={onClose} className="px-6 py-3 text-[12px] font-black text-slate-400 hover:text-slate-900 tracking-widest transition-all">
                            CLOSE
                        </button>
                        <button 
                            onClick={handleSave}
                            className="px-8 py-3 text-[12px] font-black text-white premium-gradient rounded-2xl shadow-xl shadow-purple-500/30 active:scale-95 transition-all tracking-widest"
                        >
                            SAVE CHANGES
                        </button>
                    </div>
                </div>

                {/* Confirm Delete Modal */}
                <ConfirmModal 
                    isOpen={deleteConfirm}
                    onClose={() => setDeleteConfirm(false)}
                    onConfirm={confirmDelete}
                    title="Delete Task"
                    message={`Are you sure you want to delete "${task.title}"? This will also remove all its sub-tasks and records.`}
                />
            </div>
        </div>

    );
};


export default TaskDetailPanel;
