'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrutalistSelect } from '@/components/ui/BrutalistSelect';
import { getLocalDateString } from '@/lib/dateUtils';
import { HelpCircle } from 'lucide-react';

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
    const [value, setValue] = useState(1);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteLogNumber, setDeleteLogNumber] = useState('');
    const [deleteError, setDeleteError] = useState('');

    const selectedSubtopic = cumulativeSubtopics.find(st => st.id === subtopicId);
    const currentDate = getLocalDateString(new Date());

    // Filter logs for today for the specific delete-multiple feature
    const todayLogs = dailyLogs.filter(
        log => log.date === currentDate && log.subtopicId === subtopicId,
    );
    // Sum of all values logged today for this subtopic
    const todayTotal = todayLogs.reduce((sum, log) => sum + Number(log.value), 0);

    // Add a single log with the integer value entered
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subtopicId || isReadOnly || isFuture) return;
        const count = Math.floor(Number(value));
        if (isNaN(count) || count < 1) {
            alert('Please enter a positive integer to add.');
            return;
        }
        try {
            await onAddLog({ subtopicId, date: currentDate, value: count });
            setValue(1);
            alert(`Added a log with value ${count}.`);
        } catch (error) {
            console.error('Failed to add log:', error);
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

    // Delete entries — user picks how many entries to remove (newest first)
    const handleDeleteSubmit = async () => {
        const num = parseInt(deleteLogNumber, 10);
        if (isNaN(num) || num < 1 || num > todayLogs.length) {
            setDeleteError(
                `Enter a number between 1 and ${todayLogs.length} (you have ${todayLogs.length} ${todayLogs.length === 1 ? 'entry' : 'entries'} today).`,
            );
            return;
        }
        // Sort newest first so we delete the most recent entries
        const sorted = [...todayLogs].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
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
            <div
                className="relative overflow-hidden rounded-3xl border border-slate-300/50 shadow-2xl p-10 text-center animate-fadeIn"
                style={{
                    backgroundColor: '#ffffff',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0  pointer-events-none" />

                <div className="relative z-10">
                    <h2 className="text-2xl font-semibold mb-4 text-black">
                        No 'Cumulative' subtopics!
                    </h2>
                    <p className="text-slate-900 mb-6 font-medium">
                        You can log progress for 'cumulative' subtopics here. Habits are logged on the dashboard.
                    </p>
                    <button
                        onClick={() => router.push('/manage')}
                        className="button-89 text-lg"
                        style={{ '--color': '#000000', color: 'black', backgroundColor: 'white' } as React.CSSProperties}
                    >
                        Manage Goals &amp; Subtopics
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative overflow-hidden rounded-3xl border border-slate-300/50 shadow-2xl"
            style={{
                backgroundColor: '#ffffff',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="absolute inset-0  pointer-events-none" />

            <div className="relative p-8 md:p-12">
                <div className="flex flex-wrap items-center justify-center mb-10 relative gap-3 group cursor-help outline-none" tabIndex={0}>
                    <h2 className="text-3xl font-bold text-black tracking-tight">Log Your Cumulative</h2>
                    <HelpCircle size={24} className="text-slate-400 group-hover:text-black transition-colors" />
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 md:w-72 p-3 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none z-20 shadow-[4px_4px_0_0_#000] border-2 border-white font-medium text-center">
                        Add cumulative progress (e.g. reading pages, study hours) toward your monthly target.
                    </div>
                    {isReadOnly && (
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 bg-amber-500/20 text-amber-500 text-xs font-bold px-2 py-1 rounded border border-amber-500/50">
                            READ ONLY
                        </span>
                    )}
                </div>

                {isFuture ? (
                    <div className="text-center py-12">
                        <p className="text-xl text-slate-700 font-medium">Wait for that month</p>
                    </div>
                ) : isReadOnly ? (
                    <div className="text-center p-6 bg-white/50 rounded-lg">
                        <p className="text-slate-800">You cannot log progress for past months.</p>
                        <p className="text-slate-700 text-sm mt-2">
                            Switch to the current month to log your progress.
                        </p>
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto">
                        <div className="space-y-6">
                            <div
                                className="relative overflow-hidden p-6 rounded-lg border border-black backdrop-blur-sm"
                                style={{
                                    backgroundColor: '#fefefe',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                <div className="absolute inset-0  pointer-events-none" />
                                <div className="relative z-10">
                                    <h3 className="text-lg font-semibold text-black mb-4">Add New Log</h3>

                                    {/* Delete Dialog */}
                                    {showDeleteDialog && (
                                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                                            <div
                                                className="relative overflow-hidden rounded-lg max-w-md w-full mx-4 shadow-2xl border-2 border-slate-200"
                                                style={{
                                                    backgroundColor: '#fefefe',
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            >
                                                <div className="absolute inset-0 " />
                                                <div className="relative z-10 p-8 text-center">
                                                    <h3 className="text-2xl font-black text-black mb-4 uppercase tracking-wider">Delete Logs</h3>
                                                    <p className="text-slate-800 mb-2 text-lg">
                                                        Subtopic: <span className="font-bold text-black">{selectedSubtopic?.name}</span>
                                                    </p>
                                                    <p className="text-slate-700 mb-1 text-base">
                                                        Today's total: <span className="font-bold text-black">{todayTotal} {selectedSubtopic?.unit || 'units'}</span>
                                                    </p>
                                                    <p className="text-slate-600 text-sm mb-4">
                                                        ({todayLogs.length} {todayLogs.length === 1 ? 'entry' : 'entries'} logged today)
                                                    </p>
                                                    <p className="text-slate-700 text-sm mb-4">
                                                        How many entries to delete? (1–{todayLogs.length})
                                                    </p>
                                                    <input
                                                        type="number"
                                                        step="1"
                                                        min="1"
                                                        max={todayLogs.length}
                                                        value={deleteLogNumber}
                                                        onChange={e => {
                                                            const raw = e.target.value.replace(/[^0-9]/g, '');
                                                            setDeleteLogNumber(raw);
                                                            setDeleteError('');
                                                        }}
                                                        onKeyDown={e => {
                                                            if (['.', '-', '+', 'e', 'E'].includes(e.key)) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        placeholder={`1–${todayLogs.length}`}
                                                        className="w-full px-4 py-2 bg-white/50 border border-slate-500 text-black rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-white text-center text-lg font-bold"
                                                        autoFocus
                                                    />
                                                    {deleteError && (
                                                        <p className="text-red-400 text-sm mb-4 font-bold">{deleteError}</p>
                                                    )}
                                                    <div className="flex justify-center space-x-4 mt-4">
                                                        <button
                                                            onClick={() => {
                                                                setShowDeleteDialog(false);
                                                                setDeleteLogNumber('');
                                                                setDeleteError('');
                                                            }}
                                                            className="button-89 bg-slate-600 hover:bg-slate-200 text-black text-sm py-3 px-6"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={handleDeleteSubmit}
                                                            className="button-89 bg-red-600 hover:bg-red-700 text-black text-sm py-3 px-6"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-slate-700 ml-1">
                                                Select Subtopic
                                            </label>
                                            <BrutalistSelect
                                                value={subtopicId}
                                                onChange={(value) => setSubtopicId(value)}
                                                options={cumulativeSubtopics.map(st => {
                                                    const goal = goals.find(g => g.id === st.goalId);
                                                    return {
                                                        value: st.id,
                                                        label: st.name,
                                                        subLabel: goal?.name || 'Unknown'
                                                    };
                                                })}
                                                placeholder="-- Choose a subtopic --"
                                                disabled={isReadOnly}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-slate-700 ml-1">
                                                Value to Add (e.g. Pages, Minutes)
                                            </label>
                                            <div className="brutal-input-container">
                                                <input
                                                    type="number"
                                                    step="1"
                                                    min="1"
                                                    value={value || ''}
                                                    onChange={(e) => {
                                                        // Strip anything that's not a digit
                                                        const raw = e.target.value.replace(/[^0-9]/g, '');
                                                        setValue(raw ? parseInt(raw, 10) : 0);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        // Block decimal, minus, plus, and the letter 'e' (used in scientific notation)
                                                        if (['.', '-', '+', 'e', 'E'].includes(e.key)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    className="brutal-input"
                                                    placeholder="Enter whole number..."
                                                    disabled={isReadOnly}
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 flex gap-4">
                                            <button
                                                type="submit"
                                                disabled={!subtopicId || value <= 0 || isReadOnly}
                                                className="button-89 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Log Progress
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleDeleteClick}
                                                disabled={!subtopicId || todayLogs.length === 0}
                                                className="button-89 bg-red-600 hover:bg-red-700 text-black disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20"
                                            >
                                                Delete Recent
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {todayTotal > 0 && (
                                <p className="text-sm text-slate-700 text-center">
                                    Today's total for <span className="font-bold text-black">{selectedSubtopic?.name}</span>:{' '}
                                    <span className="font-bold text-black">{todayTotal}</span>{' '}
                                    {selectedSubtopic?.unit || 'units'} ({todayLogs.length} {todayLogs.length === 1 ? 'entry' : 'entries'})
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
