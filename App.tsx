import React, { useState, useCallback } from 'react';
import type { Student } from './types';
import SettingsForm from './components/SettingsForm';
import ClassroomLayout from './components/ClassroomLayout';
import ControlPanel from './components/ControlPanel';

interface ClassroomConfig {
  rows: number;
  cols: number;
  numStudents: number;
}

const App: React.FC = () => {
  const [config, setConfig] = useState<ClassroomConfig | null>(null);
  const [seats, setSeats] = useState<(number | null)[]>([]);
  const [availableSeatNumbers, setAvailableSeatNumbers] = useState<number[]>([]);
  const [assignedStudents, setAssignedStudents] = useState<Student[]>([]);
  const [highlightedSeat, setHighlightedSeat] = useState<number | null>(null);

  const handleStart = useCallback((newConfig: ClassroomConfig) => {
    setConfig(newConfig);
    const { rows, cols, numStudents } = newConfig;

    const studentSeats = Array.from({ length: numStudents }, (_, i) => i + 1);
    const emptySeats = Array(rows * cols - numStudents).fill(null);
    
    let allSeats = [...studentSeats, ...emptySeats];
    for (let i = allSeats.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allSeats[i], allSeats[j]] = [allSeats[j], allSeats[i]];
    }

    setSeats(allSeats);
    setAvailableSeatNumbers(studentSeats.sort((a, b) => a - b));
    setAssignedStudents([]);
    setHighlightedSeat(null);
  }, []);

  const handleReset = useCallback(() => {
    setConfig(null);
    setSeats([]);
    setAvailableSeatNumbers([]);
    setAssignedStudents([]);
    setHighlightedSeat(null);
  }, []);

  const handleAssignStudent = useCallback((name: string, seat: number) => {
    setAssignedStudents(prev => [...prev, { name, seat }].sort((a, b) => a.seat - b.seat));
    setAvailableSeatNumbers(prev => prev.filter(s => s !== seat));
    setHighlightedSeat(seat);
  }, []);

  const handleSeatMove = useCallback((fromIndex: number, toIndex: number) => {
    if (assignedStudents.length > 0) {
      console.warn("Cannot move seats after assignment has started.");
      return;
    }
    if (fromIndex === toIndex) return;

    setSeats(prevSeats => {
      const newSeats = [...prevSeats];
      [newSeats[fromIndex], newSeats[toIndex]] = [newSeats[toIndex], newSeats[fromIndex]];
      return newSeats;
    });
  }, [assignedStudents.length]);

  if (!config) {
    return <SettingsForm onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen bg-yellow-50 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-700">席替えアプリ</h1>
          <button
            onClick={handleReset}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300 shadow-md"
          >
            リセット
          </button>
        </header>
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ClassroomLayout
              rows={config.rows}
              cols={config.cols}
              seats={seats}
              highlightedSeat={highlightedSeat}
              assignedStudents={assignedStudents}
              onSeatMove={handleSeatMove}
              isDraggable={assignedStudents.length === 0}
            />
          </div>
          <div className="lg:col-span-1">
            <ControlPanel
              availableSeatNumbers={availableSeatNumbers}
              assignedStudents={assignedStudents}
              onAssignStudent={handleAssignStudent}
              setHighlightedSeat={setHighlightedSeat}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;