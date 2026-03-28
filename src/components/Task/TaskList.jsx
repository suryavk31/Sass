// src/components/Task/TaskList.jsx — ClickUp-Style Data Grid View with Global Centered Popups
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listTasks, createTask, updateTask, deleteTask } from '../../actions/taskActions';
import { 
  AddRounded, 
  CheckRounded, 
  MoreHorizRounded, 
  AssignmentRounded,
  DeleteRounded,
  EditRounded,
  CheckCircleRounded,
  RadioButtonUncheckedRounded,
  CalendarTodayRounded,
  FlagRounded,
  KeyboardArrowRightRounded,
  KeyboardArrowDownRounded,
  AccessTimeRounded,
  CloseRounded,
  PersonAddRounded,
  UpdateRounded,
  LayersRounded,
  HistoryRounded,
  PriorityHighRounded
} from '@mui/icons-material';
import MemberSelector from '../ui/MemberSelector';
import ConfirmModal from '../ui/ConfirmModal';

const STATUS_OPTIONS = [
  { value: 'done', label: 'COMPLETED', color: 'bg-[#00c875] text-white shadow-sm shadow-[#00c875]/20' }, 
  { value: 'in-progress', label: 'WORKING', color: 'bg-[#00d2ff] text-white shadow-sm shadow-[#00d2ff]/20' }, 
  { value: 'todo', label: 'BACKLOG', color: 'bg-[#ff5d5d] text-white shadow-sm shadow-[#ff5d5d]/20' }, 
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'text-blue-500', icon: <FlagRounded sx={{ fontSize: 14 }} className="text-blue-400" /> },
  { value: 'medium', label: 'Medium', color: 'text-amber-500', icon: <FlagRounded sx={{ fontSize: 14 }} className="text-amber-400" /> },
  { value: 'high', label: 'High', color: 'text-red-500', icon: <FlagRounded sx={{ fontSize: 14 }} className="text-red-400" /> },
];

// Helper for centered overlay to prevent clipping - Refined for compact premium feel
const CenteredOverlay = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/30 backdrop-blur-[2px] animate-in fade-in duration-300 px-4" onClick={onClose}>
            <div className="bg-white/95 backdrop-blur-md rounded-[24px] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.15)] p-5 min-w-[280px] max-w-[320px] w-full animate-in zoom-in-95 duration-200 border border-white" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                    <div className="flex flex-col">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-0.5">{title}</h3>
                        <div className="h-0.5 w-6 bg-[#7b68ee] rounded-full"></div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-100/50 flex items-center justify-center text-slate-300 hover:text-slate-600 transition-all">
                        <CloseRounded sx={{ fontSize: 18 }} />
                    </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Specialized Selection Menu - More compact
const SelectionMenu = ({ options, onSelect, selectedValue }) => (
    <div className="grid gap-1.5">
        {options.map((opt) => (
            <button
                key={opt.value}
                onClick={() => onSelect(opt.value)}
                className={`flex items-center justify-between p-3 rounded-xl transition-all group ${selectedValue === opt.value ? 'bg-[#7b68ee]/5 border border-[#7b68ee]/10' : 'hover:bg-slate-50/80 border border-transparent'}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${opt.color || 'bg-slate-100'} bg-opacity-10`}>
                        {React.cloneElement(opt.icon || <LayersRounded />, { sx: { fontSize: 16 } })}
                    </div>
                    <span className={`text-[13px] font-bold ${selectedValue === opt.value ? 'text-[#7b68ee]' : 'text-slate-600 group-hover:text-slate-900'}`}>{opt.label}</span>
                </div>
                {selectedValue === opt.value && <CheckRounded sx={{ fontSize: 16, color: '#7b68ee' }} />}
            </button>
        ))}
    </div>
);

// New Date Picker Modal content
const DateSelector = ({ value, onSave, onClose }) => {
    const [date, setDate] = useState(value ? value.split('T')[0] : '');
    const [time, setTime] = useState(value ? (value.split('T')[1] || '09:00').substring(0, 5) : '09:00');

    return (
        <div className="grid gap-4">
            <div className="grid gap-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Date</label>
                <input 
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-[13px] font-bold text-slate-700 focus:ring-2 focus:ring-[#7b68ee]/10"
                />
            </div>
            <div className="grid gap-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Time (Optional)</label>
                <div className="relative">
                    <AccessTimeRounded className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" sx={{ fontSize: 16 }} />
                    <input 
                        type="time" 
                        value={time} 
                        onChange={e => setTime(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-3 py-3 text-[13px] font-bold text-slate-700 focus:ring-2 focus:ring-[#7b68ee]/10"
                    />
                </div>
            </div>
            <button 
                onClick={() => {
                    const isoDate = date ? `${date}T${time}:00` : null;
                    onSave(isoDate);
                    onClose();
                }}
                className="premium-gradient w-full py-3.5 mt-2 rounded-[18px] text-white font-black text-[12px] shadow-lg shadow-[#7b68ee]/20 hover:shadow-[#7b68ee]/40 hover:scale-[1.02] transition-all active:scale-95"
            >
                Confirm Schedule
            </button>
        </div>
    );
};

const TaskRow = ({ 
    task, 
    depth = 0, 
    onTaskClick, 
    onStatusChange, 
    onTitleSave, 
    onCustomFieldChange, 
    onAssigneeChange, 
    onDeleteRequest, 
    onPriorityChange, 
    onDueDateChange, 
    editingId, 
    setEditingId, 
    editTitle, 
    setEditTitle, 
    allTasks,
    isSelected,
    onSelect
}) => {
    const tid = task._id || task.id;
    const isComplete = task.status === 'done';
    const children = allTasks?.filter(t => t.parentId === tid) || [];
    const [isExpanded, setIsExpanded] = useState(true);
    const [localSubtaskTitle, setLocalSubtaskTitle] = useState('');
    const [showSubtaskInput, setShowSubtaskInput] = useState(false);
    const dispatch = useDispatch();

    const priorityOpt = PRIORITY_OPTIONS.find(p => p.value === (task.priority || 'medium'));
    const statusOpt = STATUS_OPTIONS.find(s => s.value === task.status);

    const handleAddSubtask = (e) => {
        e.preventDefault();
        if (localSubtaskTitle.trim()) {
            dispatch(createTask({ 
                title: localSubtaskTitle, 
                project: task.projectId, 
                status: 'todo',
                parentId: tid 
            }));
            setLocalSubtaskTitle('');
            setShowSubtaskInput(false);
            setIsExpanded(true);
        }
    };

    return (
        <>
            <div
                className={`grid grid-cols-[40px_minmax(0,2fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_40px] gap-0 items-center transition-all group/row text-[13px] text-slate-700 h-11 border-b border-slate-50 ${isSelected ? 'bg-indigo-50/50' : 'bg-white hover:bg-slate-50/80'}`}
            >
                {/* Selection Checkbox */}
                <div className="h-full flex items-center justify-center border-r border-slate-100 group-hover/row:border-slate-200/60">
                    <button 
                        onClick={() => onSelect(tid)}
                        className={`w-4 h-4 rounded border-2 transition-all flex items-center justify-center ${isSelected ? 'bg-[#7b68ee] border-[#7b68ee]' : 'border-slate-200 group-hover/row:border-slate-300'}`}
                    >
                        {isSelected && <CheckRounded sx={{ fontSize: 12, color: 'white' }} />}
                    </button>
                </div>

                {/* Name/Objective Column */}
                <div 
                    className="px-5 h-full flex items-center gap-1 border-r border-slate-100 group-hover/row:border-slate-200/60 transition-colors overflow-hidden"
                    style={{ paddingLeft: `${20 + depth * 24}px` }}
                >
                    <div className="w-5 flex items-center justify-center shrink-0">
                        {children.length > 0 ? (
                            <button onClick={() => setIsExpanded(!isExpanded)} className="text-slate-300 hover:text-slate-600 transition-colors">
                                {isExpanded ? <KeyboardArrowDownRounded sx={{ fontSize: 18 }} /> : <KeyboardArrowRightRounded sx={{ fontSize: 18 }} />}
                            </button>
                        ) : (
                            <div className="w-4 h-4" />
                        )}
                    </div>


                    {editingId === tid ? (
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={() => onTitleSave(tid)}
                            onKeyDown={(e) => e.key === 'Enter' && onTitleSave(tid)}
                            autoFocus
                            className="flex-1 text-[13px] border-none bg-white shadow-[0_0_0_2px_#7b68ee] rounded-lg px-2 py-1 focus:outline-none h-7 font-medium ml-1"
                        />
                    ) : (
                        <span
                            onClick={() => onTaskClick?.(task)}
                            onDoubleClick={() => {
                                setEditingId(tid);
                                setEditTitle(task.title);
                            }}
                            className={`flex-1 truncate font-medium cursor-pointer hover:text-[#7b68ee] transition-all ml-1 ${isComplete ? 'line-through text-slate-300' : 'text-slate-700 group-hover/row:text-slate-900'}`}
                        >
                            {task.title}
                        </span>
                    )}

                    <button 
                        onClick={() => setShowSubtaskInput(true)}
                        className="opacity-0 group-hover/row:opacity-100 w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-[#7b68ee] hover:bg-purple-50 transition-all shrink-0"
                    >
                        <AddRounded sx={{ fontSize: 14 }} />
                    </button>
                </div>

                {/* Assignee Column - Centered Overlay */}
                <div className="px-5 h-full border-r border-slate-100 group-hover/row:border-slate-200/60 transition-colors flex items-center justify-center relative">
                    <div 
                        className="flex -space-x-2 overflow-hidden hover:space-x-1 transition-all duration-300 group/avatars cursor-pointer p-1"
                        onClick={(e) => { e.stopPropagation(); setEditingId(`assign-${tid}`); }}
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
                            <div className="w-7 h-7 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 text-[#cbd5e1] hover:border-[#7b68ee]/30 hover:bg-[#7b68ee]/5 transition-all">
                                <AddRounded sx={{ fontSize: 12 }} />
                            </div>
                        )}
                        {task.assignedTo?.length > 0 && (
                            <div className="w-7 h-7 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 opacity-0 group-hover/avatars:opacity-100 transition-all scale-75 group-hover/avatars:scale-100 ring-2 ring-white">
                                <AddRounded sx={{ fontSize: 12 }} />
                            </div>
                        )}
                    </div>
                    <CenteredOverlay isOpen={editingId === `assign-${tid}`} onClose={() => setEditingId(null)} title="Manage Assignees">
                        <MemberSelector selectedMembers={task.assignedTo || []} onSelect={(member) => onAssigneeChange(tid, member)} onClose={() => setEditingId(null)} />
                    </CenteredOverlay>
                </div>

                {/* Priority Column - Centered Overlay */}
                <div className="px-5 h-full border-r border-slate-100 group-hover/row:border-slate-200/60 transition-colors flex items-center justify-center relative">
                    <button 
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${priorityOpt.color} bg-slate-50/50 hover:bg-slate-100/80`}
                        onClick={(e) => { e.stopPropagation(); setEditingId(`priority-${tid}`); }}
                    >
                        {priorityOpt.icon}
                        <span>{priorityOpt.label}</span>
                    </button>
                    <CenteredOverlay isOpen={editingId === `priority-${tid}`} onClose={() => setEditingId(null)} title="Update Priority">
                        <SelectionMenu 
                            options={PRIORITY_OPTIONS} 
                            selectedValue={task.priority || 'medium'} 
                            onSelect={(val) => { onPriorityChange(tid, val); setEditingId(null); }} 
                        />
                    </CenteredOverlay>
                </div>

                {/* Due Date Column - Centered Overlay */}
                <div className="px-5 h-full border-r border-slate-100 group-hover/row:border-slate-200/60 transition-colors flex items-center justify-center">
                    <button 
                        className={`flex items-center gap-2 text-[11px] font-bold transition-all px-3 py-1 rounded-lg ${task.dueDate ? 'text-slate-700 bg-slate-50' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'}`}
                        onClick={(e) => { e.stopPropagation(); setEditingId(`date-${tid}`); }}
                    >
                        <CalendarTodayRounded sx={{ fontSize: 13 }} />
                        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Set Date'}</span>
                    </button>
                    <CenteredOverlay isOpen={editingId === `date-${tid}`} onClose={() => setEditingId(null)} title="Schedule Objective">
                        <DateSelector value={task.dueDate} onSave={(date) => onDueDateChange(tid, date)} onClose={() => setEditingId(null)} />
                    </CenteredOverlay>
                </div>

                {/* Phase/AI Column */}
                <div className="px-5 h-full border-r border-slate-100 group-hover/row:border-slate-200/60 transition-colors flex items-center overflow-hidden">
                    <input
                        type="text"
                        className="w-full text-center text-[11px] bg-transparent border-none focus:ring-0 p-0 text-slate-400 placeholder-slate-200 opacity-0 group-hover/row:opacity-100 focus:opacity-100 transition-all font-bold uppercase tracking-wider"
                        placeholder="Phase"
                        defaultValue={task.customFields?.phase || ''}
                        onBlur={(e) => onCustomFieldChange(tid, 'phase', e.target.value)}
                    />
                    {(!task.customFields?.phase) && <span className="absolute w-full left-0 text-slate-200 pointer-events-none group-hover/row:hidden text-center">-</span>}
                </div>

                {/* Actions Menu - Centered Overlay */}
                <div className="px-2 h-full flex items-center justify-center border-l border-transparent group-hover/row:border-slate-100 transition-all relative">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setEditingId(`actions-${tid}`); }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all opacity-0 group-hover/row:opacity-100"
                    >
                        <MoreHorizRounded sx={{ fontSize: 18 }} />
                    </button>
                    <CenteredOverlay isOpen={editingId === `actions-${tid}`} onClose={() => setEditingId(null)} title="Task Actions">
                        <div className="grid gap-1">
                             <button onClick={() => { onTaskClick?.(task); setEditingId(null); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#7b68ee] transition-colors"><EditRounded sx={{ fontSize: 16 }} /></div>
                                <span className="text-[13px] font-bold text-slate-600 group-hover:text-slate-900">Edit Details</span>
                             </button>
                             <button onClick={() => { setShowSubtaskInput(true); setEditingId(null); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#7b68ee] transition-colors"><AddRounded sx={{ fontSize: 16 }} /></div>
                                <span className="text-[13px] font-bold text-slate-600 group-hover:text-slate-900">Add Sub-task</span>
                             </button>
                             <button onClick={() => { onStatusChange(tid, 'done'); setEditingId(null); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50/50 transition-all group">
                                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-[#00c875]"><CheckCircleRounded sx={{ fontSize: 16 }} /></div>
                                <span className="text-[13px] font-bold text-slate-600 group-hover:text-[#00c875]">Mark Completed</span>
                             </button>
                             <div className="h-[1px] bg-slate-50 my-1.5 mx-2"></div>
                             <button onClick={() => { onDeleteRequest(task); setEditingId(null); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50/50 transition-all group text-red-500">
                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center"><DeleteRounded sx={{ fontSize: 16 }} /></div>
                                <span className="text-[13px] font-bold">Delete Permanent</span>
                             </button>
                        </div>
                    </CenteredOverlay>
                </div>
            </div>

            {showSubtaskInput && (
                <div className="bg-slate-50/30 border-b border-slate-50 flex items-center h-10 px-5" style={{ paddingLeft: `${20 + (depth + 1) * 24}px` }}>
                    <form onSubmit={handleAddSubtask} className="flex-1 flex items-center gap-3">
                        <span className="text-slate-300 text-lg">+</span>
                        <input autoFocus type="text" placeholder="Type sub-task name..." value={localSubtaskTitle} onChange={(e) => setLocalSubtaskTitle(e.target.value)} onBlur={() => !localSubtaskTitle && setShowSubtaskInput(false)} className="bg-transparent border-none focus:ring-0 text-[13px] font-medium text-slate-600 w-full" />
                    </form>
                </div>
            )}

            {isExpanded && children.length > 0 && (
                <div className="relative">
                    <div className="absolute left-[29px] top-0 bottom-0 w-[1px] bg-slate-100 ml-[-0.5px] z-0" style={{ left: `${30 + depth * 24}px` }} />
                    {children.map(child => (
                        <TaskRow key={child._id || child.id} task={child} depth={depth + 1} onTaskClick={onTaskClick} onStatusChange={onStatusChange} onTitleSave={onTitleSave} onCustomFieldChange={onCustomFieldChange} onAssigneeChange={onAssigneeChange} onPriorityChange={onPriorityChange} onDueDateChange={onDueDateChange} onDeleteRequest={onDeleteRequest} editingId={editingId} setEditingId={setEditingId} editTitle={editTitle} setEditTitle={setEditTitle} allTasks={allTasks} isSelected={isSelected} onSelect={onSelect} />
                    ))}
                </div>
            )}
        </>
    );
};

const StatusGroup = ({ status, tasks, allTasks, selectedIds, onSelectTask, editingId, setEditingId, ...props }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [localNewTaskTitle, setLocalNewTaskTitle] = useState('');
    const dispatch = useDispatch();
    
    const opt = STATUS_OPTIONS.find(o => o.value === status);
    const topLevelTasks = tasks.filter(t => !t.parentId);

    const handleAdd = (e) => {
        e.preventDefault();
        if (localNewTaskTitle.trim()) {
            dispatch(createTask({ title: localNewTaskTitle, project: props.projectId, status }));
            setLocalNewTaskTitle('');
        }
    };

    return (
      <div className="mb-10 last:mb-32">
        <div className="flex items-center group/header mb-2.5 ml-1">
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-all mr-2 text-slate-500">
            <div className={`transition-transform duration-300 ${isCollapsed ? '-rotate-90 opacity-40' : ''}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </button>
          
          <button 
            className={`flex items-center px-2.5 py-[3px] rounded-md ${opt.color} group/status relative`}
            onClick={() => setEditingId(`bulk-status-${status}`)}
          >
            <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
          </button>
          <span className="text-[12px] font-black text-slate-300 ml-3 tabular-nums">{tasks.length}</span>
        </div>

        {!isCollapsed && (
          <div className="border border-slate-200/60 rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-[40px_minmax(0,2fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_40px] gap-0 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10 select-none">
              <div className="border-r border-slate-100 flex items-center justify-center">
                <button 
                    onClick={() => props.onSelectGroup(tasks.map(t => t._id || t.id))}
                    className={`w-4 h-4 rounded border-2 transition-all flex items-center justify-center ${tasks.length > 0 && tasks.every(t => selectedIds.includes(t._id || t.id)) ? 'bg-[#7b68ee] border-[#7b68ee]' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                >
                    {tasks.length > 0 && tasks.every(t => selectedIds.includes(t._id || t.id)) && <CheckRounded sx={{ fontSize: 12, color: 'white' }} />}
                </button>
              </div>
              <div className="px-5 py-3 border-r border-slate-100">Name / Objective</div>
              <div className="px-5 py-3 border-r border-slate-100 text-center">Assignee</div>
              <div className="px-5 py-3 border-r border-slate-100 text-center">Priority</div>
              <div className="px-5 py-3 border-r border-slate-100 text-center">Due Date</div>
              <div className="px-5 py-3 border-r border-slate-100 text-center text-[9px]">Phase Analysis</div>
              <div className="px-2 py-3 flex items-center justify-center">
                <MoreHorizRounded sx={{ fontSize: 14, opacity: 0.3 }} />
              </div>
            </div>

            <div>
              {topLevelTasks.map(task => (
                <TaskRow key={task._id || task.id} task={task} allTasks={tasks} isSelected={selectedIds.includes(task._id || task.id)} onSelect={onSelectTask} editingId={editingId} setEditingId={setEditingId} {...props} />
              ))}

              <div className="flex items-center h-10 px-5 bg-white border-t border-slate-50 group hover:bg-slate-50/30">
                <form onSubmit={handleAdd} className="flex-1 flex items-center group/input ml-[40px]">
                    <span className="text-slate-200 group-hover:text-[#7b68ee] mr-3 text-lg transition-colors font-light">+</span>
                    <input type="text" placeholder="Add objective..." value={localNewTaskTitle} onChange={(e) => setLocalNewTaskTitle(e.target.value)} className="bg-transparent border-none focus:ring-0 p-0 text-[13px] font-medium text-slate-500 placeholder-slate-200 w-full" />
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

const TaskList = ({ projectId, onTaskClick }) => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.task);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => { if (projectId) dispatch(listTasks(projectId)); }, [dispatch, projectId]);

  const handleSelectTask = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const handleBulkUpdate = (updates) => { selectedIds.forEach(id => dispatch(updateTask(id, updates))); if (updates.status || updates.assignedTo) setSelectedIds([]); };
  const handleBulkDelete = () => { selectedIds.forEach(id => dispatch(deleteTask(id))); setSelectedIds([]); };

  const handleStatusChange = (taskId, newStatus) => dispatch(updateTask(taskId, { status: newStatus }));
  const handlePriorityChange = (taskId, priority) => dispatch(updateTask(taskId, { priority }));
  const handleDueDateChange = (taskId, dueDate) => dispatch(updateTask(taskId, { dueDate }));
  
  const handleCustomFieldChange = (taskId, fieldName, value) => {
    const task = tasks.find(t => (t._id === taskId || t.id === taskId));
    if (!task) return;
    dispatch(updateTask(taskId, { customFields: { ...task.customFields, [fieldName]: value } }));
  };

  const handleTitleSave = (taskId) => { if (editTitle.trim()) dispatch(updateTask(taskId, { title: editTitle })); setEditingId(null); };
  const handleAssigneeChange = (taskId, member) => {
    const task = tasks.find(t => (t._id === taskId || t.id === taskId));
    if (!task) return;
    
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

  const groupedTasks = useMemo(() => {
    return STATUS_OPTIONS.reduce((acc, status) => { acc[status.value] = tasks?.filter((t) => t.status === status.value) || []; return acc; }, {});
  }, [tasks]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white font-sans overflow-hidden relative">
      <div className="flex-1 overflow-y-auto pt-8 pb-32 px-8 no-scrollbar relative overflow-x-hidden">
        {loading && tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-50">
             <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-[#7b68ee]/10"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-[#7b68ee] animate-spin"></div>
             </div>
          </div>
        ) : tasks.length > 0 ? (
          STATUS_OPTIONS.map((statusObj) => (
            <StatusGroup 
                key={statusObj.value} 
                status={statusObj.value} 
                tasks={groupedTasks[statusObj.value]} 
                allTasks={tasks} 
                selectedIds={selectedIds} 
                onSelectTask={handleSelectTask} 
                onSelectGroup={(ids) => {
                    const allSelected = ids.every(id => selectedIds.includes(id));
                    if (allSelected) {
                        setSelectedIds(prev => prev.filter(id => !ids.includes(id)));
                    } else {
                        setSelectedIds(prev => [...new Set([...prev, ...ids])]);
                    }
                }}
                projectId={projectId} 
                onTaskClick={onTaskClick} 
                onStatusChange={handleStatusChange} 
                onTitleSave={handleTitleSave} 
                onCustomFieldChange={handleCustomFieldChange} 
                onAssigneeChange={handleAssigneeChange} 
                onPriorityChange={handlePriorityChange} 
                onDueDateChange={handleDueDateChange} 
                onDeleteRequest={setDeleteConfirm} 
                editingId={editingId} 
                setEditingId={setEditingId} 
                editTitle={editTitle} 
                setEditTitle={setEditTitle} 
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100"><AssignmentRounded sx={{ fontSize: 32, color: '#cbd5e1' }} /></div>
            <h3 className="text-lg font-black text-slate-800 uppercase">Empty Canvas</h3>
          </div>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900 text-white rounded-[32px] px-8 py-5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex items-center gap-8 animate-in slide-in-from-bottom-5 duration-300 border border-white/5">
            <div className="flex items-center gap-4 pr-8 border-r border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-[#7b68ee] flex items-center justify-center text-[12px] font-black shadow-lg shadow-[#7b68ee]/30">{selectedIds.length}</div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Tasks Selected</span>
                <button onClick={() => setSelectedIds([])} className="w-6 h-6 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-white transition-all"><CloseRounded sx={{ fontSize: 16 }} /></button>
            </div>
            <div className="flex items-center gap-6">
                <button onClick={() => setEditingId('bulk-status')} className="flex items-center gap-3 hover:bg-slate-800 px-4 py-2 rounded-2xl transition-all text-[11px] font-black uppercase tracking-wider text-slate-300 hover:text-white"><UpdateRounded sx={{ fontSize: 18 }} /> Status</button>
                <button onClick={() => setEditingId('bulk-assign')} className="flex items-center gap-3 hover:bg-slate-800 px-4 py-2 rounded-2xl transition-all text-[11px] font-black uppercase tracking-wider text-slate-300 hover:text-white"><PersonAddRounded sx={{ fontSize: 18 }} /> Assign</button>
                <button onClick={handleBulkDelete} className="flex items-center gap-3 hover:bg-red-500/10 px-4 py-2 rounded-2xl transition-all text-[11px] font-black uppercase tracking-wider text-red-400 hover:text-red-300"><DeleteRounded sx={{ fontSize: 18 }} /> Delete</button>
            </div>
        </div>
      )}

      {/* Global Overlays for Bulk Actions */}
      <CenteredOverlay isOpen={editingId === 'bulk-status'} onClose={() => setEditingId(null)} title="Update Selection Status">
          <SelectionMenu options={STATUS_OPTIONS} onSelect={(val) => { handleBulkUpdate({ status: val }); setEditingId(null); }} />
      </CenteredOverlay>
      <CenteredOverlay isOpen={editingId === 'bulk-assign'} onClose={() => setEditingId(null)} title="Mass Assign Members">
          <MemberSelector onSelect={(member) => handleBulkUpdate({ assignedTo: [member._id || member.id] })} onClose={() => setEditingId(null)} />
      </CenteredOverlay>

      <ConfirmModal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={() => { dispatch(deleteTask(deleteConfirm._id || deleteConfirm.id)); setDeleteConfirm(null); }} title="Delete Objective" message={`Are you sure you want to delete "${deleteConfirm?.title}"? This cannot be undone.`} />
    </div>
  );
};

export default TaskList;
