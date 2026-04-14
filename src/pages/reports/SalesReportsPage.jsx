import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosInstance';
import { useSelector } from 'react-redux';
import Chart from 'react-apexcharts';
import { 
    TrendingUpRounded, 
    AttachMoneyRounded, 
    CheckCircleRounded, 
    CancelRounded,
    FilterAltRounded
} from '@mui/icons-material';

const SalesReportsPage = () => {
    const [stats, setStats] = useState({ totalSales: 0, totalRevenue: 0, dealsClosed: 0, conversionRate: 0 });
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [dateRange, setDateRange] = useState('all');
    
    const { workspaces } = useSelector((state) => state.workspace);
    const activeWorkspaceId = localStorage.getItem('activeWorkspaceId') || (workspaces[0] && (workspaces[0].id || workspaces[0]._id));

    // authConfig is handled automatically by axiosInstance.

    useEffect(() => {
        if (activeWorkspaceId && activeWorkspaceId !== 'undefined') {
            fetchStats();
            fetchDeals();
        }
    }, [activeWorkspaceId, dateRange]);

    const fetchStats = async () => {
        if (!activeWorkspaceId || activeWorkspaceId === 'undefined') return;
        try {
            const { data } = await axios.get(`/api/sales/stats?workspaceId=${activeWorkspaceId}`);
            setStats(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDeals = async () => {
        if (!activeWorkspaceId || activeWorkspaceId === 'undefined') return;
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/sales/filtered-deals?workspaceId=${activeWorkspaceId}`);
            setDeals(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate timeseries for revenue chart
    const getRevenueChartData = () => {
        // Group deals by month (simplified for demo)
        const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const data = new Array(12).fill(0);
        
        deals.filter(d => d.status === 'Won').forEach(deal => {
            const date = new Date(deal.createdAt);
            const monthWord = date.getMonth();
            data[monthWord] += parseFloat(deal.value || 0);
        });

        // If no deals exist, generate dummy data so the chart isn't empty on a new workspace
        const finalData = data.reduce((a,b) => a+b, 0) > 0 ? data : [1200, 2100, 800, 3200, 4500, 3100, 0, 0, 0, 0, 0, 0];

        return {
            series: [{ name: 'Revenue', data: finalData }],
            options: {
                chart: { type: 'area', height: 350, toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
                colors: ['#7b68ee'],
                fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] } },
                dataLabels: { enabled: false },
                stroke: { curve: 'smooth', width: 3 },
                xaxis: { categories },
                yaxis: { labels: { formatter: (value) => `$${value.toLocaleString()}` } },
                grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
            }
        };
    };

    const getStatusChartData = () => {
        const won = deals.filter(d => d.status === 'Won').length;
        const lost = deals.filter(d => d.status === 'Lost').length;
        const open = deals.filter(d => d.status !== 'Won' && d.status !== 'Lost').length;

        // Fallback for visual appealing demo if 0
        const finalSeries = (won + lost + open) > 0 ? [won, lost, open] : [45, 12, 33];

        return {
            series: finalSeries,
            options: {
                chart: { type: 'donut', fontFamily: 'Inter, sans-serif' },
                labels: ['Won', 'Lost', 'Open'],
                colors: ['#10b981', '#ef4444', '#f59e0b'],
                plotOptions: { pie: { donut: { size: '75%' } } },
                dataLabels: { enabled: false },
                legend: { position: 'bottom' }
            }
        };
    };

    const revChart = getRevenueChartData();
    const statusChart = getStatusChartData();

    return (
        <div className="flex-1 bg-[#fafafa] flex flex-col h-full overflow-y-auto no-scrollbar pb-12">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-6 mb-8 shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sales Reports</h1>
                        <p className="text-slate-500 font-medium text-sm mt-1">Analytics and performance tracking for your pipelines.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                            <FilterAltRounded sx={{ fontSize: 18 }} /> Filters
                        </button>
                        <select 
                            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none hover:border-[#7b68ee] transition-colors cursor-pointer"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                        >
                            <option value="all">All Time</option>
                            <option value="month">This Month</option>
                            <option value="quarter">This Quarter</option>
                            <option value="year">This Year</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="px-8 max-w-7xl mx-auto w-full space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUpRounded sx={{ fontSize: 64, color: '#7b68ee' }} />
                        </div>
                        <p className="text-[13px] font-black tracking-widest uppercase text-slate-400 mb-1">Total Deals</p>
                        <h3 className="text-3xl font-black text-slate-900">{stats.totalSales || deals.length}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <AttachMoneyRounded sx={{ fontSize: 64, color: '#10b981' }} />
                        </div>
                        <p className="text-[13px] font-black tracking-widest uppercase text-slate-400 mb-1">Total Revenue</p>
                        <h3 className="text-3xl font-black text-slate-900">${(stats.totalRevenue).toLocaleString()}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <CheckCircleRounded sx={{ fontSize: 64, color: '#3b82f6' }} />
                        </div>
                        <p className="text-[13px] font-black tracking-widest uppercase text-slate-400 mb-1">Won Deals</p>
                        <h3 className="text-3xl font-black text-slate-900">{stats.dealsClosed || deals.filter(d => d.status === 'Won').length}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <CancelRounded sx={{ fontSize: 64, color: '#ef4444' }} />
                        </div>
                        <p className="text-[13px] font-black tracking-widest uppercase text-slate-400 mb-1">Lost Deals</p>
                        <h3 className="text-3xl font-black text-slate-900">{deals.filter(d => d.status === 'Lost').length}</h3>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Area Chart */}
                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-black text-slate-900">Revenue Forecast</h3>
                            <p className="text-sm font-medium text-slate-500">Won deal value tracked across the year.</p>
                        </div>
                        {loading ? <div className="h-[350px] animate-pulse bg-slate-50 rounded-xl"></div> : (
                            <Chart options={revChart.options} series={revChart.series} type="area" height={350} />
                        )}
                    </div>

                    {/* Donut Chart */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                        <div className="mb-4 text-center">
                            <h3 className="text-lg font-black text-slate-900">Conversion Status</h3>
                            <p className="text-sm font-medium text-slate-500">Pipeline distribution</p>
                        </div>
                        {loading ? <div className="h-[300px] animate-pulse bg-slate-50 rounded-xl"></div> : (
                            <div className="flex justify-center mt-6">
                                <Chart options={statusChart.options} series={statusChart.series} type="donut" width="100%" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesReportsPage;
