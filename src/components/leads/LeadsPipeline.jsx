import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import PipelineColumn from './PipelineColumn';
import LeadCard from './LeadCard';

const LeadsPipeline = ({ leads, statuses, onStatusChange }) => {
  const [activeId, setActiveId] = useState(null);

  // Configure sensors for touch, mouse, and keyboard interaction
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requires minimum 5px movement to start drag (helps with clickable elements inside cards)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    // If dropped outside designated area
    if (!over) return;

    const leadId = active.id;
    // `over` can be the column directly or another card within a column
    // The data attribute contains the `status` string because we attached it in `useDroppable` for columns and `useSortable` for cards
    const newStatus = over.data.current?.status || over.id; 
    
    // Find the current lead to check if status actually changed
    const currentLead = leads.find((l) => l.id === leadId);
    
    if (currentLead && currentLead.status !== newStatus && statuses.includes(newStatus)) {
      onStatusChange(leadId, newStatus);
    }
  };

  const activeLead = activeId ? leads.find((l) => l.id === activeId) : null;

  return (
    <div className="flex gap-5 overflow-x-auto h-full pb-4 px-1 scroll-smooth no-scrollbar pt-1">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {statuses.map((status) => (
          <PipelineColumn
            key={status}
            status={status}
            leads={leads.filter((l) => l.status === status)}
          />
        ))}

        <DragOverlay dropAnimation={{
            duration: 250,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}>
          {activeLead ? <LeadCard lead={activeLead} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default LeadsPipeline;
