import React, { useState, useEffect, useRef } from 'react';
import type { Student } from '../types';

interface RouletteProps {
  onStart: () => void;
  onStop: () => void;
  isSpinning: boolean;
  result: number | null;
  canSpin: boolean;
}

const Roulette: React.FC<RouletteProps> = ({ onStart, onStop, isSpinning, result, canSpin }) => {
  const [displayNumber, setDisplayNumber] = useState<number | string>('?');
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isSpinning) {
      intervalRef.current = window.setInterval(() => {
        setDisplayNumber(Math.floor(Math.random() * 99) + 1);
      }, 50);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (result !== null) {
        setDisplayNumber(result);
      } else {
        setDisplayNumber('?');
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isSpinning, result]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-48 h-32 bg-gray-800 text-white rounded-lg flex items-center justify-center text-6xl font-mono shadow-inner">
        {displayNumber}
      </div>
      {!isSpinning ? (
        <button
          onClick={onStart}
          disabled={!canSpin}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg text-xl hover:bg-indigo-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
        >
          スタート
        </button>
      ) : (
        <button
          onClick={onStop}
          className="w-full bg-red-500 text-white font-bold py-3 px-6 rounded-lg text-xl hover:bg-red-600 transition-colors duration-300 shadow-md"
        >
          ストップ
        </button>
      )}
    </div>
  );
};


interface ControlPanelProps {
  availableSeatNumbers: number[];
  assignedStudents: Student[];
  onAssignStudent: (name: string, seat: number) => void;
  setHighlightedSeat: (seat: number | null) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ availableSeatNumbers, assignedStudents, onAssignStudent, setHighlightedSeat }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rouletteResult, setRouletteResult] = useState<number | null>(null);
  const [studentName, setStudentName] = useState('');
  const studentNameInputRef = useRef<HTMLInputElement>(null);

  const handleStartSpin = () => {
    if (availableSeatNumbers.length === 0) return;
    setIsSpinning(true);
    setRouletteResult(null);
    setHighlightedSeat(null);
    setStudentName('');
  };

  const handleStopSpin = () => {
    if (!isSpinning || availableSeatNumbers.length === 0) return;

    const randomIndex = Math.floor(Math.random() * availableSeatNumbers.length);
    const result = availableSeatNumbers[randomIndex];
    
    setIsSpinning(false);
    setRouletteResult(result);
    setHighlightedSeat(result);
    setTimeout(() => studentNameInputRef.current?.focus(), 100);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentName.trim() && rouletteResult !== null) {
      onAssignStudent(studentName.trim(), rouletteResult);
      setRouletteResult(null);
      setStudentName('');
      setHighlightedSeat(rouletteResult);
    }
  };

  const totalStudents = assignedStudents.length + availableSeatNumbers.length;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
       {assignedStudents.length === 0 && totalStudents > 0 && (
        <div className="p-3 bg-indigo-100 text-indigo-800 rounded-lg text-sm text-center shadow-sm">
          <p className="font-semibold">ヒント💡</p>
          <p>生徒を割り当てる前に、左の教室図の席をドラッグ＆ドロップで自由に配置できます。</p>
        </div>
      )}

      <div className="roulette-section">
        <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">席決めルーレット</h2>
        <Roulette
          onStart={handleStartSpin}
          onStop={handleStopSpin}
          isSpinning={isSpinning}
          result={rouletteResult}
          canSpin={availableSeatNumbers.length > 0 && rouletteResult === null}
        />
      </div>

      {rouletteResult !== null && (
        <form onSubmit={handleAssignSubmit} className="space-y-2">
          <label htmlFor="studentName" className="block text-center font-semibold text-gray-700">
            <span className="text-2xl text-indigo-600 font-bold">{rouletteResult}番</span> の席です
          </label>
          <input
            ref={studentNameInputRef}
            type="text"
            id="studentName"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="生徒の名前を入力"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300 shadow-md"
          >
            決定
          </button>
        </form>
      )}

      <div className="assigned-list">
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          決定済み ({assignedStudents.length}/{totalStudents})
        </h2>
        <div className="h-64 overflow-y-auto bg-gray-50 p-3 rounded-md border">
          {assignedStudents.length > 0 ? (
            <ul className="space-y-2">
              {assignedStudents.map(student => (
                <li key={student.seat} className="flex justify-between p-2 bg-white rounded shadow-sm items-center">
                  <span className="font-semibold text-gray-800">{student.seat}番:</span>
                  <span className="text-gray-600">{student.name}</span>
                </li>
              ))}
            </ul>
          ) : (
             <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-center">まだ誰も決まっていません。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;