// src/components/calendar/UpcomingEvents.jsx — Premium Redesign
import React from 'react';
import { EventNoteRounded, AddRounded, AccessTimeRounded } from '@mui/icons-material';

const COLORS = ['#7b68ee', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

const UpcomingEvents = ({ events, onAddEvent }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = (events || [])
        .filter(e => new Date(e.start) >= today)
        .sort((a, b) => new Date(a.start) - new Date(b.start))
        .slice(0, 5);

    return (
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-5 pb-4 border-b border-slate-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <EventNoteRounded sx={{ fontSize: 18, color: '#7b68ee' }} />
                        <h3 className="text-[13px] font-black text-slate-700 uppercase tracking-[0.12em]">
                            Upcoming
                        </h3>
                    </div>
                    <span className="bg-[#7b68ee]/10 text-[#7b68ee] text-[10px] font-black px-2 py-0.5 rounded-full">
                        {upcoming.length}
                    </span>
                </div>
            </div>

            {/* Events list */}
            <div className="p-4 space-y-2">
                {upcoming.length > 0 ? upcoming.map((event, index) => {
                    const color = event.color || COLORS[index % COLORS.length];
                    const date = event.start ? new Date(event.start) : null;
                    return (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer">
                            <div
                                className="w-2 h-8 rounded-full flex-shrink-0"
                                style={{ backgroundColor: color }}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold text-slate-800 truncate">{event.title}</p>
                                {date && (
                                    <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mt-0.5">
                                        <AccessTimeRounded sx={{ fontSize: 11 }} />
                                        {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                }) : (
                    <div className="flex flex-col items-center py-6 text-center text-slate-400">
                        <EventNoteRounded sx={{ fontSize: 32, opacity: 0.3 }} />
                        <p className="text-xs font-bold mt-2 uppercase tracking-widest">No upcoming events</p>
                    </div>
                )}
            </div>

            {/* Footer CTA */}
            <div className="px-4 pb-4">
                <button
                    onClick={onAddEvent}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 text-slate-400 text-xs font-bold hover:border-[#7b68ee] hover:text-[#7b68ee] hover:bg-[#7b68ee]/5 transition-all"
                >
                    <AddRounded sx={{ fontSize: 16 }} /> Add Event
                </button>
            </div>
        </div>
    );
};

export default UpcomingEvents;
