import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { listWorkspaces } from '../actions/workspaceActions';
import toast from 'react-hot-toast';

const AttendancePage = () => {
    const dispatch = useDispatch();
    const [employees, setEmployees] = useState([]);
    const [attendanceList, setAttendanceList] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Default to today
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const workspaceList = useSelector((state) => state.workspace);
    const { workspaces } = workspaceList;
    const [currentWorkspaceId, setCurrentWorkspaceId] = useState('');

    const token = localStorage.getItem('token');
    const authConfig = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        dispatch(listWorkspaces());
    }, [dispatch]);

    useEffect(() => {
        if (currentWorkspaceId) {
            fetchEmployees();
            fetchAttendance();
        } else if (workspaces && workspaces.length > 0) {
            setCurrentWorkspaceId(workspaces[0]._id);
            // Will trigger next effect run
        }
    }, [workspaces, currentWorkspaceId, selectedDate]);

    const fetchEmployees = async () => {
        try {
            const { data } = await axios.get('/api/employees', authConfig);
            setEmployees(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                `/api/hr/attendance?workspaceId=${currentWorkspaceId}&startDate=${selectedDate}&endDate=${selectedDate}`, 
                authConfig
            );
            setAttendanceList(data);
        } catch(error) {
            console.error(error);
        }
        setLoading(false);
    };

    const handleMarkAttendance = async (employeeId, status) => {
        try {
            await axios.post('/api/hr/attendance', {
                employeeId,
                date: selectedDate,
                status,
                workspaceId: currentWorkspaceId
            }, authConfig);
            fetchAttendance();
        } catch (error) {
            console.error(error);
            toast.error("Failed to mark attendance");
        }
    };

    // Helper to find today's attendance for an employee
    const getAttendanceStatus = (employeeId) => {
        const record = attendanceList.find(a => a.employeeId === employeeId);
        return record ? record.status : 'Unmarked';
    };

    return (
        <div className="flex-1 bg-slate-50 flex flex-col min-w-0 h-full overflow-hidden p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Attendance Register</h1>
                    <p className="text-slate-500 text-sm">Mark daily attendance for employees.</p>
                </div>
                <div className="flex gap-4">
                    <input 
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-white border text-sm border-slate-200 rounded-xl px-4 py-2 text-slate-700 font-bold focus:ring-[#7b68ee]/20 focus:border-[#7b68ee] outline-none"
                    />
                </div>
            </div>

            <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-auto p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-full text-slate-400 font-bold">Loading...</div>
                    ) : (
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 text-left text-xs font-black text-slate-400 uppercase tracking-wider">
                                    <th className="pb-4">Employee</th>
                                    <th className="pb-4">Position</th>
                                    <th className="pb-4">Status</th>
                                    <th className="pb-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp) => {
                                    const status = getAttendanceStatus(emp.id);
                                    let statusColor = "bg-slate-100 text-slate-600";
                                    if (status === 'Present') statusColor = "bg-emerald-100 text-emerald-700";
                                    if (status === 'Absent') statusColor = "bg-rose-100 text-rose-700";
                                    if (status === 'Half-day') statusColor = "bg-amber-100 text-amber-700";
                                    if (status === 'Leave') statusColor = "bg-blue-100 text-blue-700";

                                    return (
                                        <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                            <td className="py-4 font-bold text-slate-800 text-sm">{emp.name}</td>
                                            <td className="py-4 text-slate-500 text-sm">{emp.position}</td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColor}`}>
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <div className="flex gap-2 justify-end">
                                                    {['Present', 'Absent', 'Half-day', 'Leave'].map(opt => (
                                                        <button
                                                            key={opt}
                                                            onClick={() => handleMarkAttendance(emp.id, opt)}
                                                            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${status === opt ? 'bg-[#7b68ee] text-white border-[#7b68ee]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {employees.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-8 text-slate-400 font-bold">No employees found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;
