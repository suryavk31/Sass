import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { useSelector, useDispatch } from 'react-redux';
import { listWorkspaces } from '../actions/workspaceActions';
import toast from 'react-hot-toast';

const SalaryCalculationPage = () => {
    const dispatch = useDispatch();
    const [employees, setEmployees] = useState([]);
    
    // View modes: list, configure, calculate
    const [viewMode, setViewMode] = useState('list');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    
    // Config form
    const [baseSalary, setBaseSalary] = useState(0);
    const [allowances, setAllowances] = useState([]);
    const [deductions, setDeductions] = useState([]);
    
    // Calculation & History
    const [calcMonth, setCalcMonth] = useState(new Date().getMonth() + 1); // 1-12
    const [calcYear, setCalcYear] = useState(new Date().getFullYear());
    const [payrollResult, setPayrollResult] = useState(null);
    const [payrollHistory, setPayrollHistory] = useState([]);

    const workspaceList = useSelector((state) => state.workspace);
    const { workspaces } = workspaceList;
    const [currentWorkspaceId, setCurrentWorkspaceId] = useState('');

    // authConfig is handled automatically by axiosInstance.

    useEffect(() => {
        dispatch(listWorkspaces());
    }, [dispatch]);

    useEffect(() => {
        if (currentWorkspaceId) {
            fetchEmployees();
        } else if (workspaces && workspaces.length > 0) {
            setCurrentWorkspaceId(workspaces[0]._id);
        }
    }, [workspaces, currentWorkspaceId]);

    const fetchEmployees = async () => {
        if (!currentWorkspaceId || currentWorkspaceId === 'undefined') return;
        try {
            const { data } = await axios.get(`/api/employees?workspaceId=${currentWorkspaceId}`);
            setEmployees(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleConfigure = async (emp) => {
        setSelectedEmployee(emp);
        setViewMode('configure');
        try {
            const { data } = await axios.get(`/api/hr/salary-structure?employeeId=${emp.id}`);
            setBaseSalary(data.baseSalary || 0);
            setAllowances(data.allowances || []);
            setDeductions(data.deductions || []);
        } catch(error) {
            console.error("Failed to fetch structure", error);
        }
    };

    const handleSaveStructure = async () => {
        try {
            await axios.post('/api/hr/salary-structure', {
                employeeId: selectedEmployee.id,
                workspaceId: currentWorkspaceId,
                baseSalary,
                allowances,
                deductions
            });
            toast.success("Structure saved successfully!");
            setViewMode('list');
        } catch(error) {
            toast.error("Failed to save structure");
            console.error(error);
        }
    };

    const handleCalculate = (emp) => {
        setSelectedEmployee(emp);
        setPayrollResult(null);
        setViewMode('calculate');
    };

    const runPayroll = async () => {
        try {
            const { data } = await axios.post('/api/hr/calculate-payroll', {
                employeeId: selectedEmployee.id,
                month: calcMonth,
                year: calcYear,
                workspaceId: currentWorkspaceId
            });
            setPayrollResult(data);
        } catch(error) {
            console.error(error);
            toast.error("Calculation failed. Make sure employee has salary structure.");
        }
    };

    const handleHistory = async (emp) => {
        setSelectedEmployee(emp);
        setViewMode('history');
        try {
            const { data } = await axios.get(`/api/hr/payroll?workspaceId=${currentWorkspaceId}&employeeId=${emp.id}`);
            // filter for this employee
            const empHistory = data.filter(r => r.employeeId === emp.id);
            setPayrollHistory(empHistory);
        } catch(error) {
            console.error(error);
        }
    };

    const handleMasterHistory = async () => {
        setSelectedEmployee(null);
        setViewMode('master_history');
        try {
            const { data } = await axios.get(`/api/hr/payroll?workspaceId=${currentWorkspaceId}`);
            setPayrollHistory(data);
        } catch(error) {
            console.error(error);
        }
    };

    const handleBulkCalculate = async () => {
        if (!window.confirm(`Run bulk payroll for Month: ${calcMonth}, Year: ${calcYear}?`)) return;
        try {
            const { data } = await axios.post('/api/hr/payroll/bulk-calculate', {
                month: calcMonth,
                year: calcYear,
                workspaceId: currentWorkspaceId
            });
            toast.success(`Generated ${data.processedCount} draft records!`);
            handleMasterHistory();
        } catch (error) {
            toast.error("Bulk process failed");
        }
    };

    const updateRecordStatus = async (ids, status) => {
        try {
            await axios.put('/api/hr/payroll/status', { ids, status });
            toast.success(`Records marked as ${status}`);
            if (viewMode === 'master_history') {
                handleMasterHistory();
            } else {
                if (selectedEmployee) handleHistory(selectedEmployee);
            }
        } catch (err) {
            toast.error("Status update failed");
        }
    };

    const downloadPDF = async (recordId) => {
        try {
            const response = await axios.get(`/api/hr/payroll/${recordId}/download-pdf`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'payslip.pdf');
            document.body.appendChild(link);
            link.click();
        } catch(err) {
            toast.error("Failed to download PDF");
        }
    };

    return (
        <div className="flex-1 bg-slate-50 flex flex-col min-w-0 h-full overflow-hidden p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Payroll Calculation</h1>
                    <p className="text-slate-500 text-sm">Configure salary structures and calculate monthly payouts.</p>
                </div>
                <div className="flex gap-3">
                    {viewMode === 'list' && (
                        <>
                            <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                <input type="number" min="1" max="12" value={calcMonth} onChange={e=>setCalcMonth(e.target.value)} className="w-16 px-3 py-2 text-sm outline-none border-r border-slate-200" title="Month" />
                                <input type="number" min="2000" max="2100" value={calcYear} onChange={e=>setCalcYear(e.target.value)} className="w-20 px-3 py-2 text-sm outline-none" title="Year" />
                            </div>
                            <button onClick={handleBulkCalculate} className="bg-emerald-500 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-500/20">
                                Run Bulk Payroll
                            </button>
                            <button onClick={handleMasterHistory} className="bg-[#7b68ee] text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-[#6c58e0] transition-colors shadow-sm shadow-[#7b68ee]/20">
                                Master History
                            </button>
                        </>
                    )}
                    {viewMode !== 'list' && (
                        <button 
                            onClick={() => setViewMode('list')}
                            className="bg-white border text-sm border-slate-200 rounded-xl px-4 py-2 text-slate-700 font-bold hover:bg-slate-50"
                        >
                            Back to List
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                {viewMode === 'list' && (
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 text-xs text-slate-400 font-black uppercase tracking-wider">
                                    <th className="pb-4">Employee Name</th>
                                    <th className="pb-4">Position</th>
                                    <th className="pb-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp) => (
                                    <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                        <td className="py-4 font-bold text-slate-800 text-sm">{emp.name}</td>
                                        <td className="py-4 text-slate-500 text-sm">{emp.position}</td>
                                        <td className="py-4 text-right">
                                            <button 
                                                onClick={() => handleConfigure(emp)}
                                                className="mr-3 text-xs bg-[#7b68ee]/10 text-[#7b68ee] px-3 py-1.5 rounded-lg font-bold hover:bg-[#7b68ee]/20 transition-colors"
                                            >
                                                Configure Structure
                                            </button>
                                            <button 
                                                onClick={() => handleCalculate(emp)}
                                                className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-200 transition-colors mr-3"
                                            >
                                                Calculate Payroll
                                            </button>
                                            <button 
                                                onClick={() => handleHistory(emp)}
                                                className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-200 transition-colors"
                                            >
                                                History
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {viewMode === 'configure' && (
                    <div className="bg-white w-[500px] max-w-full mx-auto border border-slate-200 rounded-3xl p-8 shadow-sm">
                        <h2 className="text-xl font-black text-slate-900 mb-6">Structure for {selectedEmployee?.name}</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Base Salary (₹)</label>
                                <input 
                                    type="number" 
                                    value={baseSalary}
                                    onChange={(e) => setBaseSalary(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#7b68ee]/30 focus:border-[#7b68ee] outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between">
                                    <span>Allowances</span>
                                    <button onClick={() => setAllowances([...allowances, {name: '', amount: ''}])} className="text-[#7b68ee] hover:underline">+ Add</button>
                                </label>
                                {allowances.map((al, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2">
                                        <input type="text" placeholder="Name" value={al.name} onChange={(e) => {
                                            const newA = [...allowances]; newA[idx].name = e.target.value; setAllowances(newA);
                                        }} className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
                                        <input type="number" placeholder="Amount" value={al.amount} onChange={(e) => {
                                            const newA = [...allowances]; newA[idx].amount = e.target.value; setAllowances(newA);
                                        }} className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
                                        <button onClick={() => setAllowances(allowances.filter((_, i) => i !== idx))} className="text-rose-500 text-xl font-bold px-2">×</button>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between">
                                    <span>Deductions</span>
                                    <button onClick={() => setDeductions([...deductions, {name: '', amount: ''}])} className="text-[#7b68ee] hover:underline">+ Add</button>
                                </label>
                                {deductions.map((de, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2">
                                        <input type="text" placeholder="Name" value={de.name} onChange={(e) => {
                                            const newD = [...deductions]; newD[idx].name = e.target.value; setDeductions(newD);
                                        }} className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
                                        <input type="number" placeholder="Amount" value={de.amount} onChange={(e) => {
                                            const newD = [...deductions]; newD[idx].amount = e.target.value; setDeductions(newD);
                                        }} className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
                                        <button onClick={() => setDeductions(deductions.filter((_, i) => i !== idx))} className="text-rose-500 text-xl font-bold px-2">×</button>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={handleSaveStructure}
                                className="w-full bg-[#7b68ee] text-white px-4 py-3 rounded-xl font-bold shadow-md shadow-[#7b68ee]/20 hover:bg-[#6c58e0] transition-colors"
                            >
                                Save Structure
                            </button>
                        </div>
                    </div>
                )}

                {viewMode === 'calculate' && (
                    <div className="bg-white w-[500px] max-w-full mx-auto border border-slate-200 rounded-3xl p-8 shadow-sm">
                        <h2 className="text-xl font-black text-slate-900 mb-6">Run Payroll for {selectedEmployee?.name}</h2>
                        <div className="flex gap-4 mb-6">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Month (1-12)</label>
                                <input 
                                    type="number" min="1" max="12"
                                    value={calcMonth} onChange={e => setCalcMonth(e.target.value)}
                                    className="w-full bg-slate-50 border rounded-xl px-4 py-2 text-sm font-bold outline-none border-slate-200 focus:border-[#7b68ee]"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Year</label>
                                <input 
                                    type="number"
                                    value={calcYear} onChange={e => setCalcYear(e.target.value)}
                                    className="w-full bg-slate-50 border rounded-xl px-4 py-2 text-sm font-bold outline-none border-slate-200 focus:border-[#7b68ee]"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={runPayroll}
                            className="w-full bg-emerald-500 text-white px-4 py-3 rounded-xl font-bold shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition-colors mb-6"
                        >
                            Generate Calculation
                        </button>

                        {payrollResult && (
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm">
                                <h3 className="font-black text-slate-800 text-lg mb-4 text-center">Salary Slip Summary</h3>
                                <div className="space-y-2 font-medium text-slate-600 pb-4 border-b border-slate-200">
                                    <div className="flex justify-between"><span>Base Salary:</span> <span className="font-bold text-slate-900">₹{parseFloat(payrollResult.baseSalary).toFixed(2)}</span></div>
                                    <div className="flex justify-between"><span>Total Days:</span> <span className="font-bold text-slate-900">{payrollResult.totalDays}</span></div>
                                    <div className="flex justify-between"><span>Present Days:</span> <span className="font-bold text-slate-900">{payrollResult.presentDays}</span></div>
                                </div>
                                <div className="flex justify-between mt-4 text-lg">
                                    <span className="font-bold text-slate-500">Net Calculated:</span> 
                                    <span className="font-black text-[#7b68ee]">₹{parseFloat(payrollResult.calculatedSalary).toFixed(2)}</span>
                                </div>
                                {payrollResult.record && (
                                <button 
                                    onClick={() => downloadPDF(payrollResult.record.id || payrollResult.record._id)}
                                    className="w-full mt-4 bg-slate-800 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-900 transition-colors"
                                >
                                    Download Payslip PDF
                                </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {viewMode === 'history' && (
                    <div className="bg-white max-w-4xl mx-auto border border-slate-200 rounded-3xl p-8 shadow-sm">
                        <h2 className="text-xl font-black text-slate-900 mb-6">Payroll History for {selectedEmployee?.name}</h2>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 text-xs text-slate-400 font-black uppercase tracking-wider">
                                    <th className="pb-4">Period</th>
                                    <th className="pb-4">Present / Total</th>
                                    <th className="pb-4">Net Salary</th>
                                    <th className="pb-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payrollHistory.map((rec) => (
                                    <tr key={rec.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                        <td className="py-4 font-bold text-slate-800 text-sm">Month {rec.month}, {rec.year}</td>
                                        <td className="py-4 text-slate-500 text-sm">{rec.presentDays} / {rec.totalDays} Days</td>
                                        <td className="py-4 font-black text-[#7b68ee] text-sm">₹{parseFloat(rec.calculatedSalary).toFixed(2)}</td>
                                        <td className="py-4 text-right">
                                            <button 
                                                onClick={() => downloadPDF(rec.id)}
                                                className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 transition-colors"
                                            >
                                                Download PDF
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {payrollHistory.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-8 text-slate-400 font-bold">No payroll records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalaryCalculationPage;
