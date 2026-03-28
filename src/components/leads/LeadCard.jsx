import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MailOutlineRounded, PhoneRounded, BusinessRounded, AttachMoneyRounded } from '@mui/icons-material';

const LeadCard = ({ lead, isOverlay }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    data: {
      type: 'Lead',
      lead,
      status: lead.status
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const CardContent = () => (
    <div className="p-4 bg-white/50 backdrop-blur-sm h-full rounded-xl">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7b68ee]/10 to-[#7b68ee]/20 flex items-center justify-center text-[#7b68ee] font-black text-sm shrink-0 shadow-sm border border-[#7b68ee]/10">
                {lead.firstName[0]}
            </div>
            <div>
                <h4 className="text-[13px] font-bold text-slate-800 leading-tight">{lead.firstName} {lead.lastName}</h4>
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 mt-0.5 tracking-wider">
                    {lead.source || 'Direct'}
                </div>
            </div>
        </div>
      </div>
      
      <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
        {lead.company && (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <BusinessRounded sx={{ fontSize: 14, color: '#94a3b8' }} />
                <span className="truncate">{lead.company}</span>
            </div>
        )}
        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
            <MailOutlineRounded sx={{ fontSize: 12, color: '#cbd5e1' }} />
            <span className="truncate">{lead.email}</span>
        </div>
        {lead.phone && (
            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                <PhoneRounded sx={{ fontSize: 12, color: '#e2e8f0' }} />
                <span>{lead.phone}</span>
            </div>
        )}
        {Number(lead.estimatedValue) > 0 && (
             <div className="flex items-center gap-1 text-[10px] font-black tracking-wider text-emerald-600 mt-3 bg-emerald-50 w-fit px-2.5 py-1 rounded-lg border border-emerald-100">
                 <AttachMoneyRounded sx={{ fontSize: 14 }} />
                 <span>{Number(lead.estimatedValue).toLocaleString()}</span>
             </div>
        )}
      </div>
    </div>
  );

  if (isOverlay) {
    return (
        <div className="bg-white rounded-xl shadow-2xl border border-[#7b68ee] ring-4 ring-[#7b68ee]/20 cursor-grabbing rotate-3 scale-105 z-50">
            <CardContent />
        </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-xl border border-slate-200 shadow-sm cursor-grab hover:shadow-md hover:-translate-y-0.5 hover:border-[#7b68ee]/30 transition-all ${isDragging ? 'shadow-lg border-[#7b68ee] ring-2 ring-[#7b68ee]/20 z-40' : ''}`}
    >
      <CardContent />
    </div>
  );
};

export default LeadCard;
