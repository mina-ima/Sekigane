
import React, { useState } from 'react';

interface SettingsFormProps {
  onStart: (config: { rows: number; cols: number; numStudents: number }) => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ onStart }) => {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(6);
  const [numStudents, setNumStudents] = useState(30);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numStudents > rows * cols) {
      setError(`生徒数は机の数（${rows * cols}）以下にしてください。`);
      return;
    }
    if (numStudents <= 0 || rows <= 0 || cols <= 0) {
      setError('すべての値は1以上である必要があります。');
      return;
    }
    setError('');
    onStart({ rows, cols, numStudents });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">席替え設定</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="rows" className="block text-sm font-medium text-gray-700">教室の縦の列数</label>
            <input
              type="number"
              id="rows"
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              min="1"
            />
          </div>
          <div>
            <label htmlFor="cols" className="block text-sm font-medium text-gray-700">教室の横の列数</label>
            <input
              type="number"
              id="cols"
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              min="1"
            />
          </div>
          <div>
            <label htmlFor="numStudents" className="block text-sm font-medium text-gray-700">生徒の人数</label>
            <input
              type="number"
              id="numStudents"
              value={numStudents}
              onChange={(e) => setNumStudents(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              min="1"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
          >
            席替え開始！
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsForm;
