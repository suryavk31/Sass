// src/components/calendar/KeyboardShortcuts.jsx — Premium Redesign
import React from 'react';
import { KeyboardRounded } from '@mui/icons-material';

const shortcuts = [
    { label: 'Previous month', key: '←' },
    { label: 'Next month', key: '→' },
    { label: 'Go to today', key: 'T' },
    { label: 'New event', key: 'N' },
];

const KeyboardShortcuts = () => (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-slate-50">
            <div className="flex items-center gap-2">
                <KeyboardRounded sx={{ fontSize: 18, color: '#94a3b8' }} />
                <h3 className="text-[13px] font-black text-slate-700 uppercase tracking-[0.12em]">Shortcuts</h3>
            </div>
        </div>
        <div className="p-4 space-y-2">
            {shortcuts.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 px-2">
                    <span className="text-[12px] font-medium text-slate-500">{s.label}</span>
                    <kbd className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[11px] font-black border border-slate-200 shadow-sm">
                        {s.key}
                    </kbd>
                </div>
            ))}
        </div>
    </div>
);

export default KeyboardShortcuts;
