import React from 'react';
import { CloseRounded, WarningAmberRounded } from '@mui/icons-material';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl border border-slate-100 p-8 animate-in zoom-in-95 duration-200">
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 transition-all"
                >
                    <CloseRounded sx={{ fontSize: 20 }} />
                </button>

                <div className="flex flex-col items-center text-center space-y-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                        <WarningAmberRounded sx={{ fontSize: 32 }} />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h3>
                        <p className="text-[13px] text-slate-400 font-medium leading-relaxed">{message}</p>
                    </div>

                    <div className="flex flex-col w-full gap-3 pt-4">
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`w-full py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all active:scale-[0.98] ${
                                type === 'danger' 
                                    ? 'bg-red-500 text-white shadow-xl shadow-red-500/20 hover:bg-red-600' 
                                    : 'bg-[#7b68ee] text-white shadow-xl shadow-purple-500/20 hover:bg-[#6c5ce7]'
                            }`}
                        >
                            {confirmText}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-4 rounded-2xl text-[12px] font-black text-slate-400 hover:text-slate-900 border border-transparent hover:bg-slate-50 uppercase tracking-widest transition-all"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
