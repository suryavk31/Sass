import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import LeadCard from './LeadCard';

const PipelineColumn = ({ status, leads }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: 'Column',
      status: status,
    },
  });

  const getStatusStyle = (status) => {
    switch (status) {
        case 'New': return { bg: 'bg-blue-50/40', border: 'border-blue-100', highlight: 'border-blue-400', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' };
        case 'Contacted': return { bg: 'bg-amber-50/40', border: 'border-amber-100', highlight: 'border-amber-400', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700' };
        case 'Qualified': return { bg: 'bg-emerald-50/40', border: 'border-emerald-100', highlight: 'border-emerald-400', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' };
        case 'Lost': return { bg: 'bg-slate-50/40', border: 'border-slate-100', highlight: 'border-slate-400', text: 'text-slate-700', badge: 'bg-slate-200 text-slate-700' };
        case 'Closed': return { bg: 'bg-violet-50/40', border: 'border-violet-100', highlight: 'border-violet-400', text: 'text-violet-700', badge: 'bg-violet-100 text-violet-700' };
        default: return { bg: 'bg-gray-50/50', border: 'border-gray-100', highlight: 'border-gray-400', text: 'text-gray-700', badge: 'bg-gray-200 text-gray-700' };
    }
  };

  const style = getStatusStyle(status);
  
  // Create a visually distinct border when hovering over it with a dragged item
  const columnBorderClass = isOver ? `border-2 border-dashed ${style.highlight} bg-white/80 scale-[1.01]` : `border ${style.border} ${style.bg}`;

  return (
    <div className={`flex flex-col w-[320px] min-w-[320px] shrink-0 rounded-2xl transition-all duration-200 ${columnBorderClass} overflow-hidden h-full flex`}>
      <div className="p-4 border-b border-white flex items-center justify-between pb-3">
        <h3 className={`font-black text-[11px] uppercase tracking-widest ${style.text}`}>{status}</h3>
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border border-white/50 shadow-sm ${style.badge}`}>{leads.length}</span>
      </div>
      
      <div
        ref={setNodeRef}
        className="flex-1 p-3 overflow-y-auto no-scrollbar flex flex-col gap-3"
      >
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>
        
        {/* Empty state styling if no leads in column - helps make it clickable/droppable */}
        {leads.length === 0 && (
            <div className={`h-24 rounded-xl border-2 border-dashed border-white/60 flex items-center justify-center text-[10px] font-bold tracking-widest uppercase opacity-50 ${style.text}`}>
                Drop Here
            </div>
        )}
      </div>
    </div>
  );
};

export default PipelineColumn;
