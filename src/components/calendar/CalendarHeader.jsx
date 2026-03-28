// src/components/calendar/CalendarHeader.jsx — Premium Redesign
import React from 'react';
import {
    ChevronLeftRounded,
    ChevronRightRounded,
    TodayRounded,
    AddRounded,
    CalendarMonthRounded
} from '@mui/icons-material';

const VIEWS = ['month', 'week', 'day'];

const CalendarHeader = ({ currentMonth, onPrevious, onNext, onToday, view, onViewChange, onAddEvent }) => {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            {/* Left — Month + Nav */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#7b68ee]/10 flex items-center justify-center">
                    <CalendarMonthRounded sx={{ fontSize: 20, color: '#7b68ee' }} />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onPrevious}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:border-[#7b68ee] hover:text-[#7b68ee] transition-all shadow-sm"
                    >
                        <ChevronLeftRounded sx={{ fontSize: 18 }} />
                    </button>
                    <h2 className="text-[22px] font-black text-slate-800 tracking-tight min-w-[200px] text-center">
                        {currentMonth}
                    </h2>
                    <button
                        onClick={onNext}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:border-[#7b68ee] hover:text-[#7b68ee] transition-all shadow-sm"
                    >
                        <ChevronRightRounded sx={{ fontSize: 18 }} />
                    </button>
                </div>
            </div>

            {/* Right — Controls */}
            <div className="flex items-center gap-3">
                {/* Today */}
                <button
                    onClick={onToday}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:border-[#7b68ee] hover:text-[#7b68ee] transition-all shadow-sm"
                >
                    <TodayRounded sx={{ fontSize: 16 }} />
                    Today
                </button>

                {/* View Toggle */}
                <div className="flex bg-slate-100 rounded-xl p-1 gap-0.5">
                    {VIEWS.map(v => (
                        <button
                            key={v}
                            onClick={() => onViewChange(v)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                                view === v
                                    ? 'bg-white text-[#7b68ee] shadow-sm'
                                    : 'text-slate-400 hover:text-slate-700'
                            }`}
                        >
                            {v}
                        </button>
                    ))}
                </div>

                {/* Add Event */}
                <button
                    onClick={onAddEvent}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#7b68ee] to-[#5b4fc4] text-white text-sm font-black shadow-lg shadow-[#7b68ee]/30 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    <AddRounded sx={{ fontSize: 18 }} />
                    New Event
                </button>
            </div>
        </div>
    );
};

export default CalendarHeader;
