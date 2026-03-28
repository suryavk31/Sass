import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listCalendarEvents as listEvents, createCalendarEvent } from '../actions/calendarActions';
import CalendarHeader from '../components/calendar/CalendarHeader';
import CalendarView from '../components/calendar/CalendarView';
import UpcomingEvents from '../components/calendar/UpcomingEvents';
import KeyboardShortcuts from '../components/calendar/KeyboardShortcuts';
import toast from 'react-hot-toast';
import { AddRounded, CloseRounded } from '@mui/icons-material';

const CalendarPage = () => {
    const [view, setView] = useState('month');
    const [date, setDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', description: '' });
    const [saving, setSaving] = useState(false);

    const dispatch = useDispatch();
    const calendarList = useSelector((state) => state.calendar);
    const { loading, error, events } = calendarList;

    const workspaceId = localStorage.getItem('activeWorkspaceId');
    const { userRole } = useSelector(state => state.workspace);
    const isAdmin = userRole?.roleName === 'Admin';
    const permissions = userRole?.permissions || [];
    const canCreate = isAdmin || permissions.find(p => p.module === 'Calendar')?.create;

    useEffect(() => {
        if (workspaceId) {
            dispatch(listEvents(workspaceId));
        }
    }, [dispatch, workspaceId]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKey = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key === 'ArrowLeft') setDate(d => { const nd = new Date(d); nd.setMonth(nd.getMonth() - 1); return nd; });
            if (e.key === 'ArrowRight') setDate(d => { const nd = new Date(d); nd.setMonth(nd.getMonth() + 1); return nd; });
            if (e.key === 't' || e.key === 'T') setDate(new Date());
            if ((e.key === 'n' || e.key === 'N') && canCreate) setShowModal(true);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    const currentMonth = date.toLocaleString('default', { month: 'long', year: 'numeric' });

    const handlePrevious = () => {
        const nd = new Date(date);
        if (view === 'month') nd.setMonth(nd.getMonth() - 1);
        else if (view === 'week') nd.setDate(nd.getDate() - 7);
        else nd.setDate(nd.getDate() - 1);
        setDate(nd);
    };

    const handleNext = () => {
        const nd = new Date(date);
        if (view === 'month') nd.setMonth(nd.getMonth() + 1);
        else if (view === 'week') nd.setDate(nd.getDate() + 7);
        else nd.setDate(nd.getDate() + 1);
        setDate(nd);
    };

    const handleSaveEvent = async (e) => {
        e.preventDefault();
        if (!newEvent.title || !newEvent.start) return;
        setSaving(true);
        try {
            await dispatch(createCalendarEvent({
                title: newEvent.title,
                description: newEvent.description,
                start: new Date(newEvent.start).toISOString(),
                end: newEvent.end ? new Date(newEvent.end).toISOString() : new Date(newEvent.start).toISOString(),
                workspaceId
            }));
            toast.success('Event created!');
            setShowModal(false);
            setNewEvent({ title: '', start: '', end: '', description: '' });
        } catch (err) {
            toast.error('Failed to create event');
        } finally {
            setSaving(false);
        }
    };

    const formattedEvents = (events || []).map(e => ({
        ...e,
        start: new Date(e.start),
        end: new Date(e.end || e.start),
    }));

    return (
        <div className="flex-1 flex flex-col bg-[#fafbff] h-full overflow-hidden">
            <div className="flex-1 flex gap-6 p-6 min-h-0 overflow-hidden">

                {/* Main Calendar */}
                <div className="flex-1 flex flex-col gap-4 min-h-0">
                    <CalendarHeader
                        currentMonth={currentMonth}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        onToday={() => setDate(new Date())}
                        view={view}
                        onViewChange={setView}
                        onAddEvent={() => canCreate ? setShowModal(true) : toast.error('Permission denied')}
                    />

                    {loading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-3 text-slate-400">
                                <div className="w-10 h-10 border-2 border-[#7b68ee] border-t-transparent rounded-full animate-spin" />
                                <p className="text-xs font-bold uppercase tracking-widest">Loading calendar…</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex-1 flex items-center justify-center text-red-400 text-sm font-bold">{error}</div>
                    ) : (
                        <CalendarView
                            events={formattedEvents}
                            view={view}
                            date={date}
                            onNavigate={setDate}
                            onView={setView}
                        />
                    )}
                </div>

                {/* Sidebar */}
                <div className="w-[280px] shrink-0 flex flex-col gap-4 overflow-y-auto thin-scrollbar">
                    <UpcomingEvents events={formattedEvents} onAddEvent={() => canCreate ? setShowModal(true) : toast.error('Permission denied')} />
                    <KeyboardShortcuts />
                </div>
            </div>

            {/* Add Event Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[28px] w-full max-w-[440px] shadow-[0_32px_80px_-12px_rgba(123,104,238,0.3)] overflow-hidden">
                        
                        {/* Header */}
                        <div className="bg-gradient-to-br from-[#7b68ee] to-[#5b4fc4] px-7 pt-7 pb-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                                        <AddRounded sx={{ fontSize: 20, color: 'white' }} />
                                    </div>
                                    <div>
                                        <h2 className="text-[20px] font-black text-white tracking-tight">New Event</h2>
                                        <p className="text-white/60 text-xs font-medium">Add to your calendar</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-all"
                                >
                                    <CloseRounded sx={{ fontSize: 18 }} />
                                </button>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSaveEvent} className="px-7 py-6 space-y-4">
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Event Title *</label>
                                <input
                                    type="text"
                                    value={newEvent.title}
                                    onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:border-[#7b68ee] focus:bg-white outline-none transition-all"
                                    placeholder="e.g. Team Sync Meeting"
                                    autoFocus
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Start *</label>
                                    <input
                                        type="datetime-local"
                                        value={newEvent.start}
                                        onChange={e => setNewEvent({...newEvent, start: e.target.value})}
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-3 py-3 text-xs font-semibold text-slate-700 focus:border-[#7b68ee] focus:bg-white outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">End</label>
                                    <input
                                        type="datetime-local"
                                        value={newEvent.end}
                                        onChange={e => setNewEvent({...newEvent, end: e.target.value})}
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-3 py-3 text-xs font-semibold text-slate-700 focus:border-[#7b68ee] focus:bg-white outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Description</label>
                                <textarea
                                    value={newEvent.description}
                                    onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:border-[#7b68ee] focus:bg-white outline-none transition-all resize-none"
                                    rows="2"
                                    placeholder="Optional notes…"
                                />
                            </div>

                            <div className="flex items-center justify-between gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black text-white bg-gradient-to-r from-[#7b68ee] to-[#5b4fc4] shadow-lg shadow-[#7b68ee]/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60"
                                >
                                    <AddRounded sx={{ fontSize: 18 }} />
                                    {saving ? 'Saving…' : 'Save Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarPage;
