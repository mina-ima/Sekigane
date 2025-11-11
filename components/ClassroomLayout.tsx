import React, { useState } from 'react';
import type { Student } from '../types';

interface ClassroomLayoutProps {
  rows: number;
  cols: number;
  seats: (number | null)[];
  highlightedSeat: number | null;
  assignedStudents: Student[];
  onSeatMove: (fromIndex: number, toIndex: number) => void;
  isDraggable: boolean;
}

const ClassroomLayout: React.FC<ClassroomLayoutProps> = ({ rows, cols, seats, highlightedSeat, assignedStudents, onSeatMove, isDraggable }) => {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (!isDraggable) return;
    e.dataTransfer.setData('draggedIndex', index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (!isDraggable) return;
    e.preventDefault();
    setDragOverIndex(index);
  };
  
  const handleDragLeave = () => {
    setDragOverIndex(null);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, toIndex: number) => {
    if (!isDraggable) return;
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('draggedIndex'), 10);
    if (!isNaN(fromIndex)) {
      onSeatMove(fromIndex, toIndex);
    }
    setDragOverIndex(null);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <div className="bg-gray-700 text-white text-center py-2 rounded-md mb-6 shadow-sm font-bold">
        教 壇
      </div>
      <div
        className="grid gap-1 sm:gap-2"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
        onDragLeave={handleDragLeave}
      >
        {seats.map((seat, index) => {
          const isHighlighted = seat === highlightedSeat;
          const assignedStudent = assignedStudents.find(s => s.seat === seat);
          const isAssigned = !!assignedStudent;
          const isSeat = seat !== null;
          const isDragOver = index === dragOverIndex;

          let baseClasses = "border-2 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm md:text-base transition-all duration-300 aspect-square overflow-hidden px-1";
          let stateClasses = "";

          if (isHighlighted) {
            stateClasses = 'bg-yellow-400 text-black border-yellow-500 animate-pulse scale-110 shadow-lg z-10';
          } else if (isAssigned) {
            stateClasses = 'bg-green-200 text-green-800 border-green-400';
          } else if (isSeat) {
            stateClasses = 'bg-blue-100 text-blue-800 border-blue-300';
          } else {
            stateClasses = 'bg-gray-200 text-gray-400 border-gray-300';
          }
          
          if (isDraggable) {
              baseClasses += ' cursor-move';
          }
          
          if (isDragOver && isDraggable) {
              stateClasses += ' ring-4 ring-offset-2 ring-indigo-500';
          }
          
          return (
            <div
              key={index}
              className={`${baseClasses} ${stateClasses}`}
              draggable={isDraggable}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
            >
              {isSeat ? (assignedStudent ? assignedStudent.name : seat) : 'ー'}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClassroomLayout;