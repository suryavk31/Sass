import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosInstance';
import { useSelector } from 'react-redux';
import Chart from 'react-apexcharts';
import { 
    FolderSpecialRounded, 
    FormatListBulletedRounded, 
    AccessTimeRounded,
    FilterAltRounded
} from '@mui/icons-material';

const ProjectReportsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const { workspaces } = useSelector((state) => state.workspace);
    const activeWorkspaceId = localStorage.getItem('activeWorkspaceId') || (workspaces[0] && (workspaces[0].id || workspaces[0]._id));

    useEffect(() => {
        if (activeWorkspaceId) fetchStats();
    }, [activeWorkspaceId]);

    const token = localStorage.getItem('token');
    const { userInfo } = useSelector((state) => state.user || {});
    // authConfig is handled automatically by axiosInstance.

    const fetchStats = async () => {
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

    const getTaskChart = () => {
        const breakdown = stats?.taskStatusBreakdown || { todo: 0, "in-progress": 0, done: 0 };
        const series = [breakdown.todo, breakdown["in-progress"], breakdown.done];
        const displaySeries = series.reduce((a,b)=>a+b, 0) > 0 ? series : [15, 20, 45]; // Demo fallback

        return {
            series: displaySeries,
            options: {
                chart: { type: 'polarArea', fontFamily: 'Inter, sans-serif' },
                labels: ['To Do', 'In Progress', 'Done'],
                colors: ['#cbd5e1', '#f59e0b', '#10b981'],
                stroke: { colors: ['#fff'] },
                fill: { opacity: 0.8 },
                legend: { position: 'bottom' }
            }
        };
    };

    const getCompletionChart = () => {
        return {
            series: [{ name: 'Completion Ratio', data: [85, 92, 45, 100, 60] }],
            options: {
                chart: { type: 'bar', height: 350, toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
                colors: ['#7b68ee'],
                plotOptions: { bar: { borderRadius: 6, columnWidth: '40%' } },
                dataLabels: { enabled: false },
                xaxis: { categories: ['Project Alpha', 'CRM Redesign', 'Marketing Q3', 'Website Launch', 'HR Audit'] },
                grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
            }
        };
    };

    const taskChart = getTaskChart();
    const completionChart = getCompletionChart();

    return (
        <div className="flex-1 bg-[#fafafa] flex flex-col h-full overflow-y-auto no-scrollbar pb-12">
            <div className="bg-white border-b border-slate-200 px-8 py-6 mb-8 shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Project Management Intel</h1>
                        <p className="text-slate-500 font-medium text-sm mt-1">Cross-project task completion rates and timeline health.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                            <FilterAltRounded sx={{ fontSize: 18 }} /> Active Projects Only
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-8 max-w-7xl mx-auto w-full space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <FolderSpecialRounded sx={{ fontSize: 64, color: '#7b68ee' }} />
                        </div>
                        <p className="text-[13px] font-black tracking-widest uppercase text-slate-400 mb-1">Total Active Projects</p>
                        <h3 className="text-3xl font-black text-slate-900">{stats ? stats.totalProjects : 0}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <FormatListBulletedRounded sx={{ fontSize: 64, color: '#3b82f6' }} />
                        </div>
                        <p className="text-[13px] font-black tracking-widest uppercase text-slate-400 mb-1">Total Tasks Issued</p>
                        <h3 className="text-3xl font-black text-slate-900">
                            {stats ? (stats.taskStatusBreakdown?.todo + stats.taskStatusBreakdown?.["in-progress"] + stats.taskStatusBreakdown?.done) || 0 : 0}
                        </h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <AccessTimeRounded sx={{ fontSize: 64, color: '#ef4444' }} />
                        </div>
                        <p className="text-[13px] font-black tracking-widest uppercase text-slate-400 mb-1">Overdue Tasks</p>
                        <h3 className="text-3xl font-black text-slate-900">3</h3>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                        <div className="mb-4 text-center">
                            <h3 className="text-lg font-black text-slate-900">Global Task Status</h3>
                        </div>
                        {loading ? <div className="h-[300px] animate-pulse bg-slate-50 rounded-xl"></div> : (
                            <div className="flex justify-center mt-6">
                                <Chart options={taskChart.options} series={taskChart.series} type="polarArea" width="100%" height={300} />
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-black text-slate-900">Project Timeline Health</h3>
                            <p className="text-sm font-medium text-slate-500">Task completion percentage across active projects.</p>
                        </div>
                        {loading ? <div className="h-[300px] animate-pulse bg-slate-50 rounded-xl"></div> : (
                            <Chart options={completionChart.options} series={completionChart.series} type="bar" height={300} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectReportsPage;
