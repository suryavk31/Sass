import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosInstance';
import { useSelector } from 'react-redux';
import Chart from 'react-apexcharts';
import { 
    PeopleAltRounded, 
    TaskAltRounded, 
    StarBorderRounded,
    FilterAltRounded
} from '@mui/icons-material';

const EmployeeReportsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('all');

    const { workspaces } = useSelector((state) => state.workspace);
    const activeWorkspaceId = localStorage.getItem('activeWorkspaceId') || (workspaces[0] && (workspaces[0].id || workspaces[0]._id));

    useEffect(() => {
        if (activeWorkspaceId) fetchStats();
    }, [activeWorkspaceId, dateRange]);

    const { userInfo } = useSelector((state) => state.user || {});
    // authConfig is handled automatically by axiosInstance.

    const fetchStats = async () => {
        if (!activeWorkspaceId || activeWorkspaceId === 'undefined') return;
        try {
            setLoading(true);
            const { data } = await axios.get('/api/stats');
            setStats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getTaskCompletionChart = () => {
        const breakdown = stats?.taskStatusBreakdown || { todo: 0, "in-progress": 0, done: 0 };
        const series = [breakdown.todo, breakdown["in-progress"], breakdown.done];
        const displaySeries = series.reduce((a,b)=>a+b, 0) > 0 ? series : [10, 5, 20]; // Demos fallback

        return {
            series: displaySeries,
            options: {
                chart: { type: 'pie', fontFamily: 'Inter, sans-serif' },
                labels: ['To Do', 'In Progress', 'Done'],
                colors: ['#cbd5e1', '#3b82f6', '#10b981'],
                dataLabels: { enabled: true },
                legend: { position: 'bottom' }
            }
        };
    };

    const getRoleDistributionChart = () => {
        const roles = stats?.roleDistribution || [];
        const series = [{
            name: 'Employees',
            data: roles.length > 0 ? roles.map(r => r.value) : [5, 2, 8, 1]
        }];
        
        return {
            series,
            options: {
                chart: { type: 'bar', height: 350, toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
                colors: ['#7b68ee'],
                plotOptions: { bar: { borderRadius: 4, horizontal: true } },
                dataLabels: { enabled: false },
                xaxis: { categories: roles.length > 0 ? roles.map(r => r.name) : ['Manager', 'HR', 'Sales Rep', 'Admin'] },
                grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
            }
        };
    };

    const taskChart = getTaskCompletionChart();
    const roleChart = getRoleDistributionChart();

    return (
        <div className="flex-1 bg-[#fafafa] flex flex-col h-full overflow-y-auto no-scrollbar pb-12">
            <div className="bg-white border-b border-slate-200 px-8 py-6 mb-8 shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Employee Reports</h1>
                        <p className="text-slate-500 font-medium text-sm mt-1">Track workforce productivity and task distributions.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                            <FilterAltRounded sx={{ fontSize: 18 }} /> Filters
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-8 max-w-7xl mx-auto w-full space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <PeopleAltRounded sx={{ fontSize: 64, color: '#7b68ee' }} />
                        </div>
                        <p className="text-[13px] font-black tracking-widest uppercase text-slate-400 mb-1">Total Employees</p>
                        <h3 className="text-3xl font-black text-slate-900">{stats ? stats.totalEmployees : 0}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TaskAltRounded sx={{ fontSize: 64, color: '#10b981' }} />
                        </div>
                        <p className="text-[13px] font-black tracking-widest uppercase text-slate-400 mb-1">Tasks Completed</p>
                        <h3 className="text-3xl font-black text-slate-900">{stats ? stats.taskStatusBreakdown?.done || 0 : 0}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <StarBorderRounded sx={{ fontSize: 64, color: '#f59e0b' }} />
                        </div>
                        <p className="text-[13px] font-black tracking-widest uppercase text-slate-400 mb-1">Performance Index</p>
                        <h3 className="text-3xl font-black text-slate-900">92%</h3>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-black text-slate-900">Task Completion Ratio</h3>
                            <p className="text-sm font-medium text-slate-500">Overall volume of assigned tasks.</p>
                        </div>
                        {loading ? <div className="h-[350px] animate-pulse bg-slate-50 rounded-xl"></div> : (
                            <div className="flex justify-center mt-4">
                                <Chart options={taskChart.options} series={taskChart.series} type="pie" width="100%" height={350} />
                            </div>
                        )}
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                         <div className="mb-4">
                            <h3 className="text-lg font-black text-slate-900">Role Demographics</h3>
                            <p className="text-sm font-medium text-slate-500">Headcount across company sectors.</p>
                        </div>
                        {loading ? <div className="h-[350px] animate-pulse bg-slate-50 rounded-xl"></div> : (
                            <Chart options={roleChart.options} series={roleChart.series} type="bar" height={350} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeReportsPage;
