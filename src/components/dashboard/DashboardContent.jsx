// src/components/dashboard/DashboardContent.jsx - ClickUp Aesthetic + Zoho CRM Features
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDashboardStats } from '../../actions/statsActions';
import { CircularProgress } from '@mui/material';
import {
  TrendingUpRounded,
  GroupRounded,
  TaskAltRounded,
  PlayCircleFilledRounded,
  PeopleAltRounded,
  CheckCircleRounded,
  SettingsInputComponentRounded,
  CloudUploadRounded,
  IntegrationInstructionsRounded,
  CloseRounded,
  ArrowForwardRounded
} from '@mui/icons-material';

const DashboardContent = () => {
  const dispatch = useDispatch();
  const { loading, stats } = useSelector((state) => state.stats);
  const { totalProjects, totalEmployees, taskStatusBreakdown } = stats || {};

  const [activeStep, setActiveStep] = useState(1);
  const [showSampleData, setShowSampleData] = useState(true);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  const setupSteps = [
    { id: 1, title: 'Invite your team', icon: PeopleAltRounded },
    { id: 2, title: 'Configure your deals pipeline', icon: SettingsInputComponentRounded },
    { id: 3, title: 'Connect to your email account', icon: CheckCircleRounded },
    { id: 4, title: 'Migrate your existing data', icon: CloudUploadRounded },
    { id: 5, title: 'Integration', icon: IntegrationInstructionsRounded },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#f8fafc]">
        <CircularProgress sx={{ color: '#7b68ee' }} />
      </div>
    );
  }

  return (
    <div className="p-8 pb-12 animate-fade-in bg-[#f8fafc] min-h-full font-sans text-slate-900 relative">

      {/* Welcome Banner (Zoho Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Left: Greeting */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-8 rounded-xl border border-indigo-100 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>

          <h1 className="text-2xl font-bold text-slate-800 tracking-tight z-10">
            Hello<br />surya kanagaraj 👋
          </h1>
          <p className="text-[13px] text-slate-600 mt-3 max-w-sm z-10 leading-relaxed">
            We're happy to bring you aboard the world's favorite CRM!
          </p>

          <div className="mt-8 z-10">
            <p className="text-[13px] font-bold text-slate-800 mb-2">Let's get started!</p>
            <div className="flex items-start gap-4 cursor-pointer group">
              <PlayCircleFilledRounded className="text-indigo-500 group-hover:text-indigo-600 transition-colors mt-0.5" sx={{ fontSize: 24 }} />
              <div>
                <p className="text-[13px] font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">Watch a one-minute video</p>
                <p className="text-[12px] text-slate-500">View the key features we offer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Setup Widget (Zoho CRM matched but ClickUp styling) */}
        <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-xl border border-purple-100 p-8 flex shadow-sm relative overflow-hidden">
          {/* Left side of widget - Stepper */}
          <div className="flex-1 pr-6 z-10 flex flex-col justify-center">
            <h2 className="text-[18px] font-bold text-slate-800 tracking-tight">Set up your CRM</h2>
            <p className="text-[12px] text-slate-500 mb-5">Make your CRM smarter and more interactive</p>

            <div className="space-y-2">
              {setupSteps.map((step) => (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`flex items-center justify-between p-3 rounded-md cursor-pointer border transition-all ${activeStep === step.id
                      ? 'bg-white border-pink-200 shadow-sm'
                      : 'bg-white/60 border-transparent hover:bg-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <step.icon sx={{ fontSize: 16, color: activeStep === step.id ? '#1e293b' : '#64748b' }} />
                    <span className={`text-[12px] ${activeStep === step.id ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>
                      {step.title}
                    </span>
                  </div>
                  {activeStep === step.id && (
                    <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                      <ArrowForwardRounded sx={{ fontSize: 12 }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right side of widget - Illustration & Action */}
          <div className="w-1/2 flex flex-col items-center justify-center text-center pl-6 border-l border-white/50 z-10">
            <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full scale-110 -z-10 blur-xl opacity-60"></div>
              <PeopleAltRounded sx={{ fontSize: 40, color: '#3b82f6' }} />
            </div>

            <h3 className="text-[13px] font-bold text-slate-800 mb-2">Invite your team</h3>
            <p className="text-[11px] text-slate-500 mb-6 leading-relaxed">
              Stay connected and collaborate with your team members to share sales updates from one platform.
            </p>

            <button className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-[12px] font-bold py-2 px-6 rounded-md shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:ring-offset-2">
              Invite users
            </button>
          </div>
        </div>
      </div>

      {/* CRM Summary Cards (ClickUp Style) */}
      <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-widest mb-4">Pipeline Overview</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { label: 'OPEN DEALS', value: totalProjects || 12, icon: TrendingUpRounded, color: 'text-blue-500' },
          { label: 'LEADS', value: totalEmployees || 45, icon: GroupRounded, color: 'text-purple-500' },
          { label: 'WON DEALS', value: taskStatusBreakdown?.done || 8, icon: TaskAltRounded, color: 'text-green-500' },
          { label: 'REVENUE', value: '$24,500', icon: TrendingUpRounded, color: 'text-emerald-500' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg border border-[#e9ebf0] shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider">{item.label}</span>
              <item.icon className={item.color} sx={{ fontSize: 16 }} />
            </div>
            <div>
              <p className="text-[22px] font-bold text-slate-800 leading-none">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mock Sample Data Popup (Zoho Style) */}
      {showSampleData && (
        <div className="fixed bottom-6 right-6 w-80 bg-[#1e2330] rounded-lg shadow-2xl border border-slate-700 overflow-hidden z-50 animate-slide-up">
          <div className="flex items-center justify-between px-4 py-2 bg-[#262c3d] border-b border-slate-700">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Sample Data Population</span>
            <button onClick={() => setShowSampleData(false)} className="text-slate-400 hover:text-white transition-colors">
              <CloseRounded sx={{ fontSize: 14 }} />
            </button>
          </div>
          <div className="p-5 flex flex-col items-center justify-center bg-white">
            <div className="flex items-center justify-center gap-4 w-full">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-indigo-100 bg-indigo-50 text-indigo-600 font-bold text-xs shadow-sm">
                CRM
              </div>
              <div className="flex-1 flex items-center">
                <div className="h-0.5 bg-green-100 flex-1 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white p-0.5 border-2 border-white shadow-sm">
                    <CheckRoundedIcon />
                  </div>
                </div>
                <ArrowForwardRounded className="text-green-300 -ml-2" sx={{ fontSize: 16 }} />
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-indigo-100 bg-indigo-50 text-indigo-600 font-bold text-xs shadow-sm">
                CRM
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-4 text-center font-medium">Sample data population is in progress...</p>
          </div>
        </div>
      )}

    </div>
  );
};

// Helper for the popup
const CheckRoundedIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default DashboardContent;
