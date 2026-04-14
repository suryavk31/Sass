// src/components/calendar/CalendarView.jsx — Premium Redesign with custom CSS overrides
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const CalendarView = ({ events, view, date, onNavigate, onView, onEventDrop }) => {
    return (
        <div className="premium-calendar flex-1 min-h-0" style={{ height: 'calc(100vh - 200px)' }}>
            <style>{`
                .premium-calendar .rbc-calendar {
                    font-family: inherit;
                    border: none;
                    background: transparent;
                    height: 100%;
                }
                .premium-calendar .rbc-month-view,
                .premium-calendar .rbc-time-view,
                .premium-calendar .rbc-agenda-view {
                    background: white;
                    border-radius: 24px;
                    border: 1px solid #f1f5f9;
                    overflow: hidden;
                    box-shadow: 0 4px 24px -8px rgba(0,0,0,0.06);
                    height: 100%;
                }
                .premium-calendar .rbc-time-view {
                    overflow-y: auto;
                }
                .premium-calendar .rbc-time-content {
                    overflow-y: auto;
                }
                .premium-calendar .rbc-header {
                    background: #f8f9ff;
                    border-bottom: 1px solid #f1f5f9;
                    padding: 12px 8px;
                    font-size: 11px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    color: #94a3b8;
                    border-left: none;
                }
                .premium-calendar .rbc-month-row {
                    border-top: 1px solid #f1f5f9;
                }
                .premium-calendar .rbc-day-bg + .rbc-day-bg {
                    border-left: 1px solid #f8fafc;
                }
                .premium-calendar .rbc-off-range-bg {
                    background: #fafbfc;
                }
                .premium-calendar .rbc-today {
                    background: #f5f3ff;
                }
                .premium-calendar .rbc-date-cell {
                    padding: 6px 10px 4px;
                    font-size: 13px;
                    font-weight: 700;
                    color: #64748b;
                    text-align: right;
                }
                .premium-calendar .rbc-date-cell.rbc-now {
                    color: #7b68ee;
                    font-weight: 900;
                }
                .premium-calendar .rbc-date-cell.rbc-now a {
                    background: #7b68ee;
                    color: white;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 900;
                }
                .premium-calendar .rbc-event {
                    background: #7b68ee;
                    border: none;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 700;
                    padding: 2px 8px;
                    box-shadow: 0 2px 8px -2px rgba(123,104,238,0.4);
                }
                .premium-calendar .rbc-event:hover {
                    background: #5b4fc4;
                }
                .premium-calendar .rbc-event.rbc-selected {
                    background: #5b4fc4;
                    box-shadow: 0 4px 12px -2px rgba(123,104,238,0.5);
                }
                .premium-calendar .rbc-show-more {
                    color: #7b68ee;
                    font-weight: 800;
                    font-size: 11px;
                }
                .premium-calendar .rbc-toolbar {
                    display: none;
                }
                /* Week / Day view */
                .premium-calendar .rbc-time-header-gutter,
                .premium-calendar .rbc-time-gutter {
                    background: #f8f9ff;
                    font-size: 10px;
                    font-weight: 800;
                    color: #94a3b8;
                    text-transform: uppercase;
                }
                .premium-calendar .rbc-timeslot-group {
                    border-bottom: 1px solid #f1f5f9;
                    min-height: 60px;
                }
                .premium-calendar .rbc-time-slot {
                    font-size: 10px;
                    font-weight: 700;
                    color: #94a3b8;
                }
                .premium-calendar .rbc-time-header {
                    border-bottom: 1px solid #f1f5f9;
                }
                .premium-calendar .rbc-day-slot .rbc-event {
                    border-radius: 10px;
                    border: none;
                    padding: 4px 8px;
                    font-size: 12px;
                }
                .premium-calendar .rbc-day-slot .rbc-event-content {
                    font-weight: 700;
                    white-space: normal;
                    overflow: hidden;
                }
                .premium-calendar .rbc-current-time-indicator {
                    background: #7b68ee;
                    height: 2px;
                }
                .premium-calendar .rbc-current-time-indicator::before {
                    background: #7b68ee;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    content: '';
                    display: block;
                    position: absolute;
                    left: -4px;
                    top: -3px;
                }
                .premium-calendar .rbc-allday-cell {
                    background: #fafbff;
                }
                /* Day view column header with date */
                .premium-calendar .rbc-header a {
                    color: #64748b;
                    text-decoration: none;
                    font-size: 11px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
            `}</style>
            <DnDCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                view={view}
                date={date}
                onNavigate={onNavigate}
                onView={onView}
                onEventDrop={onEventDrop}
                draggableAccessor="draggable"
                eventPropGetter={(event) => {
                    let backgroundColor = '#7b68ee'; // Default Meeting
                    if (event.sourceType === 'TASK') backgroundColor = '#f59e0b';
                    if (event.sourceType === 'DEAL') backgroundColor = '#10b981';
                    return { style: { backgroundColor } };
                }}
                style={{ height: '100%' }}
                step={30}
                timeslots={2}
                scrollToTime={new Date(new Date().setHours(8, 0, 0, 0))}
            />
        </div>
    );
};

export default CalendarView;
