import React from 'react';
import { 
    DashboardRounded, 
    AddRounded,
    SearchRounded
} from '@mui/icons-material';

const DashboardsPage = () => {
    return (
        <div className="flex-1 bg-white flex flex-col min-w-0 h-full overflow-hidden">
            <div className="px-8 pt-8 pb-4 shrink-0 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Custom Dashboards</h1>
                    <p className="text-slate-500 text-sm font-medium">Build personalized views of your workspace data.</p>
                </div>
                <button className="flex items-center gap-2 bg-[#7b68ee] text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-[#7b68ee]/20 hover:scale-105 transition-all">
                    <AddRounded sx={{ fontSize: 20 }} />
                    Create Dashboard
                </button>
            </div>

            <div className="flex-1 overflow-auto px-8 pb-8 no-scrollbar flex flex-col items-center justify-center">
                <div className="max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <DashboardRounded sx={{ fontSize: 32, color: '#CBD5E1' }} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mb-2">No dashboards yet</h2>
                    <p className="text-slate-500 font-medium mb-8">Create your first dashboard to track KPIs across and project performance.</p>
                    
                    <div className="relative group max-w-sm mx-auto">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <SearchRounded sx={{ fontSize: 18, color: '#94A3B8' }} />
                        </div>
                        <input 
                            type="text" 
                            disabled
                            placeholder="Search dashboard templates..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium text-slate-400 cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardsPage;
