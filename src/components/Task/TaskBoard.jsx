// src/components/Task/TaskBoard.jsx — ClickUp-Style Kanban Board
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listTasks, createTask, updateTask, deleteTask } from '../../actions/taskActions';
import MemberSelector from '../ui/MemberSelector';
import { PersonOutlineRounded, CalendarTodayRounded, MoreHorizRounded, DeleteRounded, EditRounded, AddRounded } from '@mui/icons-material';
import Dropdown from '../ui/Dropdown';
import ConfirmModal from '../ui/ConfirmModal';



const COLUMNS = [
    { id: 'todo', title: 'TO DO', color: 'border-slate-300', headerBg: 'bg-slate-50', dot: 'bg-slate-400' },
    { id: 'in-progress', title: 'IN PROGRESS', color: 'border-[#1da1f2]', headerBg: 'bg-blue-50/50', dot: 'bg-[#1da1f2]' },
    { id: 'done', title: 'COMPLETE', color: 'border-[#20b032]', headerBg: 'bg-green-50/50', dot: 'bg-[#20b032]' },
];

const PRIORITY_THEMES = {
    low: { border: 'border-l-slate-300', text: 'text-slate-500', bg: 'bg-slate-100' },
    medium: { border: 'border-l-yellow-400', text: 'text-yellow-600', bg: 'bg-yellow-100' },
    high: { border: 'border-l-red-500', text: 'text-red-600', bg: 'bg-red-100' },
};

const TaskBoard = ({ projectId, onTaskClick }) => {
    const dispatch = useDispatch();

    const { tasks, loading } = useSelector((state) => state.task);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [addingTo, setAddingTo] = useState(null);
    const [draggedTask, setDraggedTask] = useState(null);
    const [activeAssigneeId, setActiveAssigneeId] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);



    useEffect(() => {
        if (projectId) {
            dispatch(listTasks(projectId));
        }
    }, [dispatch, projectId]);

    const getTasksByStatus = (status) => {
        return tasks ? tasks.filter((t) => t.status === status) : [];
    };

    const handleAddTask = (status) => {
        if (newTaskTitle.trim()) {
            dispatch(createTask({ title: newTaskTitle, project: projectId, status }));
            setNewTaskTitle('');
            setAddingTo(null);
        }
    };

    const handleDragStart = (e, task) => {
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, newStatus) => {
        e.preventDefault();
        if (draggedTask) {
            const taskId = draggedTask._id || draggedTask.id;
            if (draggedTask.status !== newStatus) {
                dispatch(updateTask(taskId, { status: newStatus }));
            }
        }
        setDraggedTask(null);
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center flex-1 py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7b68ee]"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex gap-5 p-6 overflow-x-auto bg-slate-50/30">
            {COLUMNS.map((col) => {
                const columnTasks = getTasksByStatus(col.id);
                return (
                    <div
                        key={col.id}
                        className="flex-1 min-w-[300px] max-w-[360px] flex flex-col"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, col.id)}
                    >
                        {/* Column Header */}
                        <div className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg mb-3 ${col.headerBg} border border-[#e9ebf0] shadow-sm`}>
                            <div className="flex items-center gap-2.5">
                                <div className={`w-2 h-2 rounded-sm ${col.dot}`}></div>
                                <h3 className="text-[11px] font-bold text-slate-700 tracking-wider uppercase">{col.title}</h3>
                                <span className="text-[10px] font-bold text-slate-400 bg-white border border-[#e9ebf0] px-1.5 py-0.5 rounded shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                                    {columnTasks.length}
                                </span>
                            </div>
                            <button
                                onClick={() => setAddingTo(col.id)}
                                className="text-slate-400 hover:text-[#7b68ee] p-1 hover:bg-white rounded transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        {/* Cards Area */}
                        <div className="flex-1 space-y-3 min-h-[200px]">
                            {columnTasks.map((task) => {
                                const theme = PRIORITY_THEMES[task.priority] || PRIORITY_THEMES.medium;
                                return (
                                    <div
                                        key={task._id || task.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, task)}
                                        className={`bg-white rounded-[20px] p-5 border border-slate-100 border-l-[6px] ${theme.border} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative cursor-grab active:cursor-grabbing`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <p 
                                                onClick={() => onTaskClick?.(task)}
                                                className="text-[14px] text-slate-800 font-bold leading-snug flex-1 pr-8 group-hover:text-[#7b68ee] transition-colors cursor-pointer"
                                            >
                                                {task.title}
                                            </p>

                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Dropdown 
                                                    trigger={<button className="text-slate-300 hover:text-slate-600"><MoreHorizRounded sx={{ fontSize: 18 }} /></button>}
                                                    items={[
                                                        { label: 'Edit', icon: <EditRounded />, onClick: () => onTaskClick?.(task) },
                                                        { label: 'Delete', icon: <DeleteRounded />, danger: true, onClick: () => setDeleteConfirm(task) }
                                                    ]}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-6">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <div 
                                                        className="flex -space-x-2 overflow-hidden hover:space-x-1 transition-all duration-300 group/avatars cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveAssigneeId(activeAssigneeId === (task._id || task.id) ? null : (task._id || task.id));
                                                        }}
                                                    >
                                                        {task.assignedTo && task.assignedTo.length > 0 ? (
                                                            task.assignedTo.map((member, idx) => (
                                                                <div 
                                                                    key={member.id || idx} 
                                                                    className="w-7 h-7 rounded-full premium-gradient flex items-center justify-center text-[9px] font-black text-white ring-2 ring-white uppercase shadow-sm transform transition-transform group-hover/avatars:scale-110"
                                                                    title={member.name}
                                                                >
                                                                    {member.name?.charAt(0)}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="w-7 h-7 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 text-slate-300">
                                                                <PersonOutlineRounded sx={{ fontSize: 14 }} />
                                                            </div>
                                                        )}
                                                        <div className="w-7 h-7 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 opacity-0 group-hover/avatars:opacity-100 transition-all scale-75 group-hover/avatars:scale-100 ring-2 ring-white ml-1">
                                                            <AddRounded sx={{ fontSize: 12 }} />
                                                        </div>
                                                    </div>
                                                    {activeAssigneeId === (task._id || task.id) && (
                                                        <div className="absolute top-full left-0 z-[150] mt-1">
                                                            <MemberSelector 
                                                                selectedMembers={task.assignedTo || []}
                                                                onSelect={(member) => {
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
                                                                    
                                                                    dispatch(updateTask(task._id || task.id, { assignedTo: newAssigneeIds }));
                                                                }}
                                                                onClose={() => setActiveAssigneeId(null)}
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${theme.bg} ${theme.text}`}>
                                                    {task.priority || 'MEDIUM'}
                                                </span>
                                            </div>
                                            {task.dueDate && (
                                                <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-[#7b68ee] transition-colors">
                                                    <CalendarTodayRounded sx={{ fontSize: 12 }} />
                                                    <span className="text-[10px] font-bold">
                                                        {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                );
                            })}

                            {/* Inline Add Task */}
                            {addingTo === col.id ? (
                                <div className="bg-white rounded-xl p-3.5 border-2 border-dashed border-[#7b68ee]/30 shadow-sm animate-pulse">
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="Enter task title..."
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddTask(col.id)}
                                        className="w-full text-[13px] font-medium border-none bg-transparent focus:ring-0 placeholder-slate-400 text-slate-700"
                                    />
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={() => handleAddTask(col.id)}
                                            className="text-[10px] font-bold bg-[#7b68ee] text-white px-3 py-1.5 rounded-md hover:bg-[#6a51e6] shadow-sm transition-all"
                                        >
                                            SAVE TASK
                                        </button>
                                        <button
                                            onClick={() => { setAddingTo(null); setNewTaskTitle(''); }}
                                            className="text-[10px] font-bold text-slate-400 hover:text-slate-600 px-2 py-1.5 transition-all"
                                        >
                                            CANCEL
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setAddingTo(col.id)}
                                    className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-[11px] font-bold hover:border-[#7b68ee]/30 hover:text-[#7b68ee] transition-all flex items-center justify-center gap-2 group"
                                >
                                    <span className="text-lg group-hover:scale-110 transition-transform">+</span>
                                    ADD TASK
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
            {/* Global Modals */}
            <ConfirmModal 
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={() => dispatch(deleteTask(deleteConfirm._id || deleteConfirm.id))}
                title="Delete Objective"
                message={`Are you sure you want to permanently remove "${deleteConfirm?.title}"? This action cannot be undone.`}
                confirmText="Remove Task"
            />
        </div>
    );
};

export default TaskBoard;
