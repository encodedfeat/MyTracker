'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLocalDateString } from '@/lib/dateUtils';

interface Subtopic {
  id: string;
  name: string;
  type: 'habit' | 'cumulative' | 'tasks';
  target?: number;
  unit?: string;
  goalId: string;
}

interface Log {
  id: string;
  subtopicId: string;
  date: string;
  value: number;
}

interface Goal {
  id: string;
  name: string;
}

interface LogProgressViewProps {
  subtopics: Subtopic[];
  goals: Goal[];
  onAddLog: (log: { subtopicId: string; date: string; value: number }) => Promise<void>;
  onDeleteLog: (logId: string) => Promise<void>;
  dailyLogs: Log[];
  isReadOnly?: boolean;
  isFuture?: boolean;
}

export function LogProgressView({
  subtopics,
  goals,
  onAddLog,
  onDeleteLog,
  dailyLogs = [],
  isReadOnly = false,
  isFuture = false
}: LogProgressViewProps) {
  const router = useRouter();
  const cumulativeSubtopics = subtopics.filter(st => st.type === 'cumulative');

  const [subtopicId, setSubtopicId] = useState('');
  const [value, setValue] = useState(1); // used as count of logs to add
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLogNumber, setDeleteLogNumber] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const selectedSubtopic = cumulativeSubtopics.find(st => st.id === subtopicId);
  const currentDate = getLocalDateString(new Date());

  // Filter logs for the current view (this month)
  // Note: dailyLogs passed from parent are already filtered for the selected month
  const sortedLogs = [...dailyLogs].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter logs for today for the specific delete-multiple feature
  const todayLogs = dailyLogs.filter(
    log => log.date === currentDate && log.subtopicId === subtopicId,
  );

  // Add "value" number of logs (each with value 1) when user submits
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subtopicId || isReadOnly || isFuture) return;
    const count = Number(value);
    if (isNaN(count) || count < 1) {
      alert('Please enter a positive number of logs to add.');
      return;
    }
    try {
      for (let i = 0; i < count; i++) {
        await onAddLog({ subtopicId, date: currentDate, value: 1 });
      }
      setValue(1);
      alert(`Added ${count} log${count > 1 ? 's' : ''}.`);
    } catch (error) {
      console.error('Failed to add logs:', error);
      alert('Failed to save your progress. Please try again.');
    }
  };

  const handleDeleteClick = () => {
    if (todayLogs.length === 0) {
      alert("No logs to delete for today's selected subtopic.");
      return;
    }
    setDeleteLogNumber('');
    setDeleteError('');
    setShowDeleteDialog(true);
  };

  // Delete up to the number entered by the user (e.g., 4 deletes the first 4 logs)
  const handleDeleteSubmit = async () => {
    const num = parseInt(deleteLogNumber);
    if (isNaN(num) || num < 1 || num > todayLogs.length) {
      setDeleteError(
        `Enter a number between 1 and ${todayLogs.length} to delete logs.`,
      );
      return;
    }
    const sorted = [...todayLogs].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const logsToDelete = sorted.slice(0, num);
    try {
      if (onDeleteLog) {
        for (const log of logsToDelete) {
          await onDeleteLog(log.id);
        }
      }
      setShowDeleteDialog(false);
      setDeleteLogNumber('');
    } catch (error) {
      console.error('Failed to delete logs:', error);
      alert('Failed to delete logs. Please try again.');
    }
  };

  if (cumulativeSubtopics.length === 0) {
    return (
      <div className="text-center p-10 rounded-lg animate-fadeIn">
        <h2 className="text-2xl font-semibold mb-4 text-white">
          No 'Cumulative' subtopics!
        </h2>
        <p className="text-slate-400 mb-6">
          You can log progress for 'cumulative' subtopics here. Habits are logged on the dashboard.
        </p>
        <button
          onClick={() => router.push('/manage')}
          className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all"
        >
          Manage Goals &amp; Subtopics
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg bg-black shadow-lg border border-slate-700/50">
      <div className="flex items-center justify-center mb-6 relative">
        <h2 className="text-3xl font-bold text-white">Log Your Cumulative</h2>
        {isReadOnly && (
          <span className="absolute right-0 top-1/2 -translate-y-1/2 bg-amber-500/20 text-amber-500 text-xs font-bold px-2 py-1 rounded border border-amber-500/50">
            READ ONLY
          </span>
        )}
      </div>

      {isFuture ? (
        <div className="text-center py-12">
          <p className="text-xl text-slate-400 font-medium">Wait for that month</p>
        </div>
      ) : isReadOnly ? (
        <div className="text-center p-6 bg-slate-900/50 rounded-lg">
          <p className="text-slate-300">You cannot log progress for past months.</p>
          <p className="text-slate-400 text-sm mt-2">
            Switch to the current month to log your progress.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Log Input Form */}
          <div className="space-y-6">
            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-4">Add New Log</h3>

              {/* Delete Dialog */}
              {showDeleteDialog && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                  <div className="bg-slate-800 p-6 rounded-lg max-w-md w-full mx-4 border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-4">Delete Logs</h3>
                    <p className="text-slate-300 mb-4">
                      You have {todayLogs.length} log{todayLogs.length > 1 ? 's' : ''} today for{' '}
                      {selectedSubtopic?.name}.
                    </p>
                    <p className="text-slate-400 text-sm mb-4">
                      Enter the number of logs to delete (1‑{todayLogs.length}):
                    </p>
                    <input
                      type="number"
                      value={deleteLogNumber}
                      onChange={e => {
                        setDeleteLogNumber(e.target.value);
                        setDeleteError('');
                      }}
                      min="1"
                      max={todayLogs.length}
                      placeholder={`1-${todayLogs.length}`}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      autoFocus
                    />
                    {deleteError && (
                      <p className="text-red-400 text-sm mb-4">{deleteError}</p>
                    )}
                    <div className="flex justify-end space-x-3 mt-4">
                      <button
                        onClick={() => {
                          setShowDeleteDialog(false);
                          setDeleteLogNumber('');
                          setDeleteError('');
                        }}
                        className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteSubmit}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Select Subtopic
                  </label>
                  <select
                    value={subtopicId}
                    onChange={(e) => setSubtopicId(e.target.value)}
                    className="w-full bg-black border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    disabled={isReadOnly}
                  >
                    <option value="">-- Choose a subtopic --</option>
                    {cumulativeSubtopics.map(st => {
                      const goal = goals.find(g => g.id === st.goalId);
                      return (
                        <option key={st.id} value={st.id}>
                          {st.name} . {goal?.name || 'Unknown'}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Value to Add (e.g. Pages, Minutes)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full bg-black border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Enter amount..."
                    disabled={isReadOnly}
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={!subtopicId || value <= 0 || isReadOnly}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Log Progress
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    disabled={!subtopicId || todayLogs.length === 0}
                    className="px-4 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Delete Recent
                  </button>
                </div>
              </form>
            </div>

            {todayLogs.length > 0 && (
              <p className="text-sm text-slate-400 text-center">
                You have logged <span className="font-bold text-indigo-400">{todayLogs.length}</span>{' '}
                log{todayLogs.length > 1 ? 's' : ''} today for {selectedSubtopic?.name}
              </p>
            )}
          </div>

          {/* Right Column: Recent Logs List */}
          <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800 flex flex-col h-full max-h-[500px]">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-between">
              <span>Recent Logs (This Month)</span>
              <span className="text-xs font-normal text-slate-500">
                {sortedLogs.length} entries
              </span>
            </h3>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {sortedLogs.length === 0 ? (
                <p className="text-slate-500 text-center py-8 italic">
                  No logs found for this month.
                </p>
              ) : (
                sortedLogs.map(log => {
                  const st = subtopics.find(s => s.id === log.subtopicId);
                  return (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 bg-black border border-slate-800 rounded hover:border-slate-700 transition-colors group"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">
                          {st?.name || 'Unknown Subtopic'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {log.date} • +{log.value} {st?.unit || 'units'}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}