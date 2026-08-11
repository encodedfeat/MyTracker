'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useGoalTracker } from '@/context/GoalContext';
import { getLocalDateString } from '@/lib/dateUtils';
import { GoalIcon } from '@/components/ui/GoalIcon';
import {
    Timer, Play, Pause, RotateCcw, Save, ChevronDown, ChevronLeft, ChevronRight, Filter, Clock, Trash2,
    Target, BookOpen, CheckSquare, Zap, X, Lock, CalendarClock
} from 'lucide-react';

interface TimeSessionRecord {
    id: string;
    goalId: string;
    subtopicId: string;
    taskId: string | null;
    goalName?: string;
    subtopicName?: string;
    taskName?: string;
    goalIcon?: string;
    subtopicType?: string;
    isAdHoc?: boolean;
    adHocTitle?: string;
    durationSeconds: number;
    durationDisplay: string;
    date: string;
    createdAt: string;
}

export default function LockInPage() {
    const { goals, subtopics, tasks, selectedDate, isReadOnly, isFuture } = useGoalTracker();

    // --- Selection State ---
    const [selectedGoalId, setSelectedGoalId] = useState<string>('');
    const [selectedSubtopicId, setSelectedSubtopicId] = useState<string>('');
    const [selectedTaskId, setSelectedTaskId] = useState<string>('');
    const [adHocTitle, setAdHocTitle] = useState<string>('');

    // --- Timer State ---
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [timerMode, setTimerMode] = useState<'stopwatch' | 'countdown'>('stopwatch');
    const [countdownTarget, setCountdownTarget] = useState(3600); // Default 1 hour
    const [isSaving, setIsSaving] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // --- Custom Dropdown State ---
    const [isGoalDropdownOpen, setIsGoalDropdownOpen] = useState(false);
    const [isSubtopicDropdownOpen, setIsSubtopicDropdownOpen] = useState(false);
    const [isTaskDropdownOpen, setIsTaskDropdownOpen] = useState(false);
    const [isHistoryDropdownOpen, setIsHistoryDropdownOpen] = useState(false);

    // --- Filter Dropdown State ---
    const [isFilterGoalDropdownOpen, setIsFilterGoalDropdownOpen] = useState(false);
    const [isFilterSubtopicDropdownOpen, setIsFilterSubtopicDropdownOpen] = useState(false);
    const [isFilterTypeDropdownOpen, setIsFilterTypeDropdownOpen] = useState(false);

    const goalDropdownRef = useRef<HTMLDivElement>(null);
    const subtopicDropdownRef = useRef<HTMLDivElement>(null);
    const taskDropdownRef = useRef<HTMLDivElement>(null);
    const historyDropdownRef = useRef<HTMLDivElement>(null);
    const filterGoalDropdownRef = useRef<HTMLDivElement>(null);
    const filterSubtopicDropdownRef = useRef<HTMLDivElement>(null);
    const filterTypeDropdownRef = useRef<HTMLDivElement>(null);

    // --- History State ---
    const [timeSessions, setTimeSessions] = useState<TimeSessionRecord[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [progressDate, setProgressDate] = useState<Date>(new Date());

    // --- Filter State ---
    const [filterGoalId, setFilterGoalId] = useState<string>('');
    const [filterSubtopicId, setFilterSubtopicId] = useState<string>('');
    const [filterType, setFilterType] = useState<string>('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // --- Derived Data ---
    const filteredSubtopics = useMemo(() => {
        if (!selectedGoalId) return [];
        return subtopics.filter(s => s.goalId === selectedGoalId);
    }, [selectedGoalId, subtopics]);

    const filteredTasks = useMemo(() => {
        if (!selectedSubtopicId) return [];
        return tasks.filter(t => t.subtopicId === selectedSubtopicId);
    }, [selectedSubtopicId, tasks]);

    const selectedSubtopic = useMemo(() => {
        return subtopics.find(s => s.id === selectedSubtopicId);
    }, [selectedSubtopicId, subtopics]);

    // Filter subtopics for the history filter dropdown
    const filterSubtopicOptions = useMemo(() => {
        if (!filterGoalId) return subtopics;
        return subtopics.filter(s => s.goalId === filterGoalId);
    }, [filterGoalId, subtopics]);

    // --- Load History ---
    const fetchHistory = useCallback(async () => {
        setIsLoadingHistory(true);
        try {
            const m = selectedDate.getMonth() + 1;
            const y = selectedDate.getFullYear();
            const res = await fetch(`/api/time-sessions?month=${m}&year=${y}`);
            if (res.ok) {
                const data = await res.json();
                setTimeSessions(data);
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setIsLoadingHistory(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (goalDropdownRef.current && !goalDropdownRef.current.contains(e.target as Node)) {
                setIsGoalDropdownOpen(false);
            }
            if (subtopicDropdownRef.current && !subtopicDropdownRef.current.contains(e.target as Node)) {
                setIsSubtopicDropdownOpen(false);
            }
            if (taskDropdownRef.current && !taskDropdownRef.current.contains(e.target as Node)) {
                setIsTaskDropdownOpen(false);
            }

            if (filterGoalDropdownRef.current && !filterGoalDropdownRef.current.contains(e.target as Node)) {
                setIsFilterGoalDropdownOpen(false);
            }
            if (filterSubtopicDropdownRef.current && !filterSubtopicDropdownRef.current.contains(e.target as Node)) {
                setIsFilterSubtopicDropdownOpen(false);
            }
            if (filterTypeDropdownRef.current && !filterTypeDropdownRef.current.contains(e.target as Node)) {
                setIsFilterTypeDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- Timer Logic ---
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setElapsedSeconds(prev => {
                    const next = prev + 1;
                    if (timerMode === 'countdown' && next >= countdownTarget) {
                        setIsRunning(false);
                        return countdownTarget;
                    }
                    return next;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return {
            hours: String(hours).padStart(2, '0'),
            minutes: String(minutes).padStart(2, '0'),
            seconds: String(seconds).padStart(2, '0'),
        };
    };

    const formatDurationDisplay = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        if (hours > 0 && minutes > 0 && seconds > 0) return `${hours}h ${minutes}m ${seconds}s`;
        if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
        if (hours > 0 && seconds > 0) return `${hours}h ${seconds}s`;
        if (hours > 0) return `${hours}h`;
        if (minutes > 0 && seconds > 0) return `${minutes}m ${seconds}s`;
        if (minutes > 0) return `${minutes}m`;
        return `${seconds}s`;
    };

    const canStart = (selectedGoalId && selectedSubtopicId) || adHocTitle.trim().length > 0;

    const handleStartPause = () => {
        if (!canStart) return;
        setIsRunning(prev => !prev);
    };

    const handleReset = () => {
        setIsRunning(false);
        setElapsedSeconds(0);
    };

    const handleSave = async () => {
        if (elapsedSeconds === 0 || !canStart) return;

        setIsSaving(true);
        try {
            const isAdHoc = adHocTitle.trim().length > 0;
            
            const payload = {
                goalId: isAdHoc ? null : selectedGoalId,
                subtopicId: isAdHoc ? null : selectedSubtopicId,
                taskId: isAdHoc ? null : (selectedTaskId || null),
                isAdHoc: isAdHoc,
                adHocTitle: isAdHoc ? adHocTitle.trim() : '',
                goalName: isAdHoc ? 'Quick Focus' : getGoalName(selectedGoalId),
                subtopicName: isAdHoc ? adHocTitle.trim() : getSubtopicName(selectedSubtopicId),
                taskName: isAdHoc ? '' : (selectedTaskId ? getTaskName(selectedTaskId) : ''),
                goalIcon: isAdHoc ? '⚡' : getGoalIcon(selectedGoalId),
                subtopicType: isAdHoc ? '' : (selectedSubtopic?.type || ''),
                durationSeconds: elapsedSeconds,
                durationDisplay: formatDurationDisplay(elapsedSeconds),
                mode: timerMode,
                countdownTarget: timerMode === 'countdown' ? countdownTarget : undefined,
                date: getLocalDateString(new Date()),
            };
            const res = await fetch('/api/time-sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const newSession = await res.json();
                setTimeSessions(prev => [newSession, ...prev]);
                handleReset();
                setSelectedGoalId('');
                setSelectedSubtopicId('');
                setSelectedTaskId('');
                setAdHocTitle('');
                setCountdownTarget(3600);
            }
        } catch (error) {
            console.error('Error saving time session:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteSession = async (sessionId: string) => {
        try {
            const res = await fetch(`/api/time-sessions/${sessionId}`, { method: 'DELETE' });
            if (res.ok) {
                setTimeSessions(prev => prev.filter(s => s.id !== sessionId));
            }
        } catch (error) {
            console.error('Error deleting time session:', error);
        }
    };

    // Determine if current month
    const isCurrentMonth = useMemo(() => {
        const now = new Date();
        return selectedDate.getMonth() === now.getMonth() && selectedDate.getFullYear() === now.getFullYear();
    }, [selectedDate]);

    // Reset selections and stop timer when month changes
    useEffect(() => {
        setSelectedGoalId('');
        setSelectedSubtopicId('');
        setSelectedTaskId('');
        setAdHocTitle('');
        setIsRunning(false);
        setElapsedSeconds(0);
    }, [selectedDate]);

    // Reset dependent selections when parent changes
    useEffect(() => {
        setSelectedSubtopicId('');
        setSelectedTaskId('');
        if (selectedGoalId) setAdHocTitle('');
    }, [selectedGoalId]);

    useEffect(() => {
        setSelectedTaskId('');
    }, [selectedSubtopicId]);

    useEffect(() => {
        if (adHocTitle.length > 0) {
            setSelectedGoalId('');
        }
    }, [adHocTitle]);

    // --- Progress Date helpers ---
    const progressDateString = useMemo(() => getLocalDateString(progressDate), [progressDate]);
    const isProgressToday = useMemo(() => getLocalDateString(progressDate) === getLocalDateString(new Date()), [progressDate]);
    const isProgressFuture = useMemo(() => {
        const todayStr = getLocalDateString(new Date());
        return progressDateString > todayStr;
    }, [progressDateString]);

    const progressDateLabel = useMemo(() => {
        if (isProgressToday) return "Today's Progress";
        return progressDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + "'s Progress";
    }, [progressDate, isProgressToday]);

    const goProgressPrevDay = () => {
        setProgressDate(prev => {
            const d = new Date(prev);
            d.setDate(d.getDate() - 1);
            // Don't go before the start of the selected month
            if (d.getMonth() !== selectedDate.getMonth() || d.getFullYear() !== selectedDate.getFullYear()) return prev;
            return d;
        });
    };

    const goProgressNextDay = () => {
        setProgressDate(prev => {
            const d = new Date(prev);
            d.setDate(d.getDate() + 1);
            // Don't go past end of month
            const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
            if (d.getDate() > lastDay || d.getMonth() !== selectedDate.getMonth() || d.getFullYear() !== selectedDate.getFullYear()) return prev;
            return d;
        });
    };

    // --- Filtered History ---
    const filteredHistory = useMemo(() => {
        return timeSessions.filter(session => {
            // Filter by progressDate (day-level)
            const sessionDateStr = getLocalDateString(new Date(session.createdAt));
            if (sessionDateStr !== progressDateString) return false;

            if (filterGoalId && session.goalId !== filterGoalId) return false;
            if (filterSubtopicId && session.subtopicId !== filterSubtopicId) return false;
            if (filterType) {
                const sub = subtopics.find(s => s.id === session.subtopicId);
                const type = session.subtopicType || sub?.type;
                if (!type || type !== filterType) return false;
            }
            return true;
        });
    }, [timeSessions, progressDateString, filterGoalId, filterSubtopicId, filterType, subtopics]);

    // --- Total Time ---
    const totalFilteredSeconds = useMemo(() => {
        return filteredHistory.reduce((sum, s) => sum + s.durationSeconds, 0);
    }, [filteredHistory]);

    const displaySeconds = timerMode === 'countdown' ? Math.max(0, countdownTarget - elapsedSeconds) : elapsedSeconds;
    const time = formatTime(displaySeconds);

    // Helper to get names
    const getGoalName = (goalId: string) => goals.find(g => g.id === goalId)?.name || 'Unknown';
    const getGoalIcon = (goalId: string) => goals.find(g => g.id === goalId)?.icon || '🎯';
    const getSubtopicName = (subId: string) => subtopics.find(s => s.id === subId)?.name || 'Unknown';
    const getSubtopicType = (subId: string) => subtopics.find(s => s.id === subId)?.type || '';
    const getTaskName = (taskId: string | null) => {
        if (!taskId) return null;
        return tasks.find(t => t.id === taskId)?.name || 'Unknown';
    };

    const typeIcon = (type: string) => {
        if (type === 'habit') return <Zap size={14} className="text-amber-500" />;
        if (type === 'cumulative') return <Target size={14} className="text-blue-500" />;
        if (type === 'tasks') return <CheckSquare size={14} className="text-emerald-500" />;
        return null;
    };

    return (
        <div className="w-full bg-transparent text-slate-800 font-['Courier_New'] pb-32 relative overflow-auto z-10">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">

                {/* Page Title */}
                <div className="mb-10 md:mb-14">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                            <Timer size={20} className="text-white" />
                        </div>
                        <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Focus Timer</p>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight">Lock In.</h1>
                    <p className="text-slate-500 mt-2 text-sm md:text-base font-light">Select a category, start the timer, and track your focused work.</p>
                </div>

                {/* Main Timer Card */}
                <div className="relative bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 overflow-hidden mb-10">

                    {/* Selection Dropdowns */}
                    <div className="p-6 md:p-8 border-b border-slate-100">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{isCurrentMonth ? 'What are you working on?' : isFuture ? 'Timer available when this month arrives' : 'Viewing past month sessions'}</h3>

                            {/* History Dropdown Trigger */}
                            <div className="relative" ref={historyDropdownRef}>
                                <button
                                    onClick={() => {
                                        if (!isHistoryDropdownOpen) setProgressDate(new Date());
                                        setIsHistoryDropdownOpen(!isHistoryDropdownOpen);
                                    }}
                                    className={`p-2 rounded-xl transition-all border-2 flex items-center gap-2 ${isHistoryDropdownOpen ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200 hover:text-slate-600 hover:border-slate-300'}`}
                                    title="View Today's Progress"
                                >
                                    <Clock size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline-block">Progress</span>
                                    {filteredHistory.length > 0 && (
                                        <span className="flex items-center justify-center min-w-[20px] h-[20px] px-1 rounded-full bg-amber-400 text-[10px] font-bold text-slate-900 leading-none">
                                            {filteredHistory.length}
                                        </span>
                                    )}
                                </button>

                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Goal Selector - Custom Dropdown */}
                            <div className="relative" ref={goalDropdownRef}>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                                <button
                                    type="button"
                                    onClick={() => !isRunning && isCurrentMonth && setIsGoalDropdownOpen(!isGoalDropdownOpen)}
                                    disabled={isRunning || !isCurrentMonth}
                                    className={`w-full flex items-center gap-3 bg-white border-2 rounded-xl px-4 py-3 text-sm font-medium text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isGoalDropdownOpen ? 'border-slate-900' : 'border-slate-200'}`}
                                >
                                    {selectedGoalId ? (
                                        <>
                                            <GoalIcon iconName={getGoalIcon(selectedGoalId)} className="w-5 h-5 text-slate-700" />
                                            <span className="text-slate-800">{getGoalName(selectedGoalId)}</span>
                                        </>
                                    ) : (
                                        <span className="text-slate-400">Select a category...</span>
                                    )}
                                    <ChevronDown size={16} className={`ml-auto text-slate-400 transition-transform flex-shrink-0 ${isGoalDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isGoalDropdownOpen && (
                                    <div className="absolute z-50 mt-1 w-full bg-white border-2 border-slate-200 rounded-xl shadow-lg overflow-hidden">
                                        <div
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:bg-slate-50 cursor-pointer transition-colors"
                                            onClick={() => { setSelectedGoalId(''); setIsGoalDropdownOpen(false); }}
                                        >
                                            Select a category...
                                        </div>
                                        {goals.map(goal => (
                                            <div
                                                key={goal.id}
                                                className={`flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition-colors ${selectedGoalId === goal.id ? 'bg-slate-900 text-white' : 'text-slate-800 hover:bg-slate-50'}`}
                                                onClick={() => { setSelectedGoalId(goal.id); setIsGoalDropdownOpen(false); }}
                                            >
                                                <GoalIcon iconName={goal.icon} className={`w-5 h-5 ${selectedGoalId === goal.id ? 'text-white' : 'text-slate-600'}`} />
                                                <span className="font-medium">{goal.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Subtopic Selector - Custom Dropdown */}
                            <div className="relative" ref={subtopicDropdownRef}>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subtopic</label>
                                <button
                                    type="button"
                                    onClick={() => !isRunning && isCurrentMonth && selectedGoalId && setIsSubtopicDropdownOpen(!isSubtopicDropdownOpen)}
                                    disabled={isRunning || !selectedGoalId || !isCurrentMonth}
                                    className={`w-full flex items-center gap-3 bg-white border-2 rounded-xl px-4 py-3 text-sm font-medium text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isSubtopicDropdownOpen ? 'border-slate-900' : 'border-slate-200'}`}
                                >
                                    {selectedSubtopicId ? (
                                        <span className="text-slate-800 truncate">{getSubtopicName(selectedSubtopicId)} ({selectedSubtopic?.type})</span>
                                    ) : (
                                        <span className="text-slate-400">Select a subtopic...</span>
                                    )}
                                    <ChevronDown size={16} className={`ml-auto text-slate-400 transition-transform flex-shrink-0 ${isSubtopicDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isSubtopicDropdownOpen && (
                                    <div className="absolute z-50 mt-1 w-full bg-white border-2 border-slate-200 rounded-xl shadow-lg overflow-hidden">
                                        <div className="max-h-60 overflow-y-auto">
                                            <div
                                                className="px-4 py-3 text-sm text-slate-400 hover:bg-slate-50 cursor-pointer transition-colors"
                                                onClick={() => { setSelectedSubtopicId(''); setIsSubtopicDropdownOpen(false); }}
                                            >
                                                Select a subtopic...
                                            </div>
                                            {filteredSubtopics.map(sub => (
                                                <div
                                                    key={sub.id}
                                                    className={`flex items-center gap-2 px-4 py-3 text-sm cursor-pointer transition-colors ${selectedSubtopicId === sub.id ? 'bg-slate-900 text-white' : 'text-slate-800 hover:bg-slate-50'}`}
                                                    onClick={() => { setSelectedSubtopicId(sub.id); setIsSubtopicDropdownOpen(false); }}
                                                >
                                                    {typeIcon(sub.type)}
                                                    <span className="font-medium truncate">{sub.name}</span>
                                                    <span className={`text-xs ml-auto flex-shrink-0 ${selectedSubtopicId === sub.id ? 'text-slate-300' : 'text-slate-400'}`}>({sub.type})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Task Selector - Custom Dropdown */}
                            <div className="relative" ref={taskDropdownRef}>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    Task <span className="text-slate-300 font-normal normal-case">(optional)</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => !isRunning && isCurrentMonth && selectedSubtopicId && filteredTasks.length > 0 && setIsTaskDropdownOpen(!isTaskDropdownOpen)}
                                    disabled={isRunning || !selectedSubtopicId || filteredTasks.length === 0 || !isCurrentMonth}
                                    className={`w-full flex items-center gap-3 bg-white border-2 rounded-xl px-4 py-3 text-sm font-medium text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isTaskDropdownOpen ? 'border-slate-900' : 'border-slate-200'}`}
                                >
                                    {selectedTaskId ? (
                                        <span className="text-slate-800 truncate">{getTaskName(selectedTaskId)}</span>
                                    ) : (
                                        <span className="text-slate-400">{filteredTasks.length === 0 ? 'No tasks available' : 'Select a task...'}</span>
                                    )}
                                    <ChevronDown size={16} className={`ml-auto text-slate-400 transition-transform flex-shrink-0 ${isTaskDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isTaskDropdownOpen && (
                                    <div className="absolute z-50 mt-1 w-full bg-white border-2 border-slate-200 rounded-xl shadow-lg overflow-hidden">
                                        <div className="max-h-60 overflow-y-auto">
                                            <div
                                                className="px-4 py-3 text-sm text-slate-400 hover:bg-slate-50 cursor-pointer transition-colors"
                                                onClick={() => { setSelectedTaskId(''); setIsTaskDropdownOpen(false); }}
                                            >
                                                Select a task...
                                            </div>
                                            {filteredTasks.map(task => (
                                                <div
                                                    key={task.id}
                                                    className={`flex items-center gap-2 px-4 py-3 text-sm cursor-pointer transition-colors ${selectedTaskId === task.id ? 'bg-slate-900 text-white' : 'text-slate-800 hover:bg-slate-50'}`}
                                                    onClick={() => { setSelectedTaskId(task.id); setIsTaskDropdownOpen(false); }}
                                                >
                                                    <CheckSquare size={14} className={`flex-shrink-0 ${selectedTaskId === task.id ? 'text-white' : 'text-slate-400'}`} />
                                                    <span className="font-medium truncate">{task.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Current Selection Chip */}
                        {selectedGoalId && selectedSubtopicId && (
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <span className="text-xs text-slate-400">Tracking:</span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-medium">
                                    <GoalIcon iconName={getGoalIcon(selectedGoalId)} className="w-3.5 h-3.5" />
                                    {getGoalName(selectedGoalId)}
                                </span>
                                <span className="text-slate-300">→</span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#8fb2c4]/20 text-slate-700 text-xs font-medium">
                                    {typeIcon(selectedSubtopic?.type || '')}
                                    {getSubtopicName(selectedSubtopicId)}
                                </span>
                                {selectedTaskId && (
                                    <>
                                        <span className="text-slate-300">→</span>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                                            <CheckSquare size={12} />
                                            {getTaskName(selectedTaskId)}
                                        </span>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Ad-hoc Quick Focus */}
                        <div className="mt-6 border-t border-slate-100 pt-6">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Or Quick Focus <span className="text-slate-300 font-normal normal-case">(Type a task name to start immediately)</span>
                            </label>
                            <input
                                type="text"
                                placeholder="What do you want to focus on?"
                                value={adHocTitle}
                                onChange={(e) => !isRunning && isCurrentMonth && setAdHocTitle(e.target.value)}
                                disabled={isRunning || !isCurrentMonth}
                                className="w-full bg-slate-50 focus:bg-white border-2 border-slate-200 focus:border-slate-900 rounded-xl px-4 py-3 text-sm font-medium transition-colors outline-none disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Timer Display */}
                    <div className="p-8 md:p-12 flex flex-col items-center">
                        {isCurrentMonth && (
                            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl mb-8">
                                <button
                                    onClick={() => !isRunning && setTimerMode('stopwatch')}
                                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${timerMode === 'stopwatch' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Stopwatch
                                </button>
                                <button
                                    onClick={() => !isRunning && setTimerMode('countdown')}
                                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${timerMode === 'countdown' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Countdown
                                </button>
                            </div>
                        )}
                        {/* Animated ring */}
                        <div className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center mb-8 transition-all duration-700 ${isCurrentMonth && isRunning
                            ? 'bg-gradient-to-br from-slate-50 to-[#8fb2c4]/10 shadow-[0_0_60px_rgba(143,178,196,0.3)]'
                            : !isCurrentMonth ? 'bg-slate-100/50' : 'bg-slate-50/50'
                            }`}>
                            {/* Outer ring */}
                            <div className={`absolute inset-0 rounded-full border-[3px] transition-all duration-700 ${isCurrentMonth && isRunning
                                ? 'border-[#8fb2c4] animate-pulse'
                                : !isCurrentMonth ? 'border-slate-200/60' : 'border-slate-200'
                                }`} />
                            {/* Inner ring */}
                            <div className={`absolute inset-3 rounded-full border-2 transition-all duration-700 ${isCurrentMonth && isRunning
                                ? 'border-[#8fb2c4]/40'
                                : 'border-transparent'
                                }`} />

                            {/* Time display */}
                            <div className="text-center z-10">
                                {isCurrentMonth ? (
                                    <>
                                        <div className="flex items-baseline gap-1 md:gap-2">
                                            <span className="text-5xl md:text-7xl font-serif text-slate-900 tracking-tighter tabular-nums">
                                                {time.hours}
                                            </span>
                                            <span className="text-2xl md:text-3xl text-slate-300 font-light">:</span>
                                            <span className="text-5xl md:text-7xl font-serif text-slate-900 tracking-tighter tabular-nums">
                                                {time.minutes}
                                            </span>
                                            <span className="text-2xl md:text-3xl text-slate-300 font-light">:</span>
                                            <span className="text-5xl md:text-7xl font-serif text-slate-900 tracking-tighter tabular-nums">
                                                {time.seconds}
                                            </span>
                                        </div>
                                        <p className={`text-xs uppercase tracking-[0.3em] mt-3 transition-colors ${isRunning ? 'text-[#8fb2c4] font-semibold' : 'text-slate-400'
                                            }`}>
                                            {isRunning ? '● Recording' : elapsedSeconds > 0 ? 'Paused' : 'Ready'}
                                        </p>
                                    </>
                                ) : isFuture ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <CalendarClock size={36} className="text-slate-300" />
                                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Coming Soon</p>
                                        <p className="text-xs text-slate-400 max-w-[180px] text-center">Switch back to the current month to start tracking</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3">
                                        <Lock size={36} className="text-slate-300" />
                                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Read Only</p>
                                        <p className="text-xs text-slate-400 max-w-[180px] text-center">View your past sessions in Progress</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Control Buttons - Only show for current month */}
                        {isCurrentMonth && (
                            <div className="flex flex-col items-center gap-6">
                                {/* Countdown Adjustments */}
                                {timerMode === 'countdown' && !isRunning && elapsedSeconds === 0 && (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <input
                                                type="number"
                                                min="0"
                                                value={Math.floor(countdownTarget / 3600)}
                                                onChange={(e) => {
                                                    const h = Math.max(0, parseInt(e.target.value) || 0);
                                                    const m = Math.floor((countdownTarget % 3600) / 60);
                                                    const s = countdownTarget % 60;
                                                    setCountdownTarget(h * 3600 + m * 60 + s);
                                                }}
                                                className="w-14 h-10 md:w-16 md:h-12 bg-slate-900 text-white rounded-xl text-center text-base md:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 transition-shadow"
                                                title="Hours"
                                            />
                                            <input
                                                type="number"
                                                min="0"
                                                max="59"
                                                value={Math.floor((countdownTarget % 3600) / 60)}
                                                onChange={(e) => {
                                                    const h = Math.floor(countdownTarget / 3600);
                                                    const m = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
                                                    const s = countdownTarget % 60;
                                                    setCountdownTarget(h * 3600 + m * 60 + s);
                                                }}
                                                className="w-14 h-10 md:w-16 md:h-12 bg-slate-900 text-white rounded-xl text-center text-base md:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 transition-shadow"
                                                title="Minutes"
                                            />
                                            <input
                                                type="number"
                                                min="0"
                                                max="59"
                                                value={countdownTarget % 60}
                                                onChange={(e) => {
                                                    const h = Math.floor(countdownTarget / 3600);
                                                    const m = Math.floor((countdownTarget % 3600) / 60);
                                                    const s = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
                                                    setCountdownTarget(h * 3600 + m * 60 + s);
                                                }}
                                                className="w-14 h-10 md:w-16 md:h-12 bg-slate-900 text-white rounded-xl text-center text-base md:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 transition-shadow"
                                                title="Seconds"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setCountdownTarget(prev => Math.max(300, prev - 300))} className="px-3 md:px-4 py-1.5 md:py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-full transition-colors">-5m</button>
                                            <button onClick={() => setCountdownTarget(prev => prev + 300)} className="px-3 md:px-4 py-1.5 md:py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-full transition-colors">+5m</button>
                                            <button onClick={() => setCountdownTarget(prev => prev + 900)} className="px-3 md:px-4 py-1.5 md:py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-full transition-colors">+15m</button>
                                            <button onClick={() => setCountdownTarget(prev => prev + 3600)} className="px-3 md:px-4 py-1.5 md:py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-full transition-colors">+1h</button>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-4">
                                {/* Reset */}
                                <button
                                    onClick={handleReset}
                                    disabled={elapsedSeconds === 0}
                                    className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all shadow-lg shadow-red-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Reset"
                                >
                                    <RotateCcw size={18} />
                                </button>

                                {/* Start / Pause */}
                                <button
                                    onClick={handleStartPause}
                                    disabled={!canStart}
                                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed ${isRunning
                                        ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30'
                                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/30'
                                        }`}
                                    title={isRunning ? 'Pause' : 'Start'}
                                >
                                    {isRunning ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                                </button>

                                {/* Save */}
                                <button
                                    onClick={handleSave}
                                    disabled={elapsedSeconds === 0 || isRunning || isSaving}
                                    className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Save & Complete"
                                >
                                    {isSaving ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Save size={18} />
                                    )}
                                </button>
                                </div>
                            </div>
                        )}

                        {isCurrentMonth && !canStart && (
                            <p className="mt-4 text-xs text-slate-400 text-center">
                                Select a category or enter a Quick Focus to start timer
                            </p>
                        )}
                    </div>
                    {/* History Dropdown Content */}
                    {isHistoryDropdownOpen && (
                        <>
                            {/* Backdrop */}
                            <div
                                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity rounded-[2rem]"
                                onClick={() => setIsHistoryDropdownOpen(false)}
                            />
                            {/* Drawer */}
                            <div className="absolute top-0 right-0 bottom-0 left-0 w-full flex flex-col bg-white shadow-2xl z-50 transform transition-transform translate-x-0 rounded-[2rem]">
                                <div className="px-5 py-3 border-b border-slate-100 shrink-0 bg-slate-50/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setIsHistoryDropdownOpen(false)}
                                                className="p-1.5 -ml-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                                                title="Back to Timer"
                                            >
                                                <ChevronLeft size={18} />
                                            </button>
                                            <h3 className="text-base font-semibold text-slate-900">{progressDateLabel}</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* Inline Date Picker */}
                                            <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg px-1 py-0.5">
                                                <button
                                                    onClick={goProgressPrevDay}
                                                    className="p-1 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                                                >
                                                    <ChevronLeft size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setProgressDate(new Date())}
                                                    className={`px-2 py-1 rounded-md text-[11px] font-bold transition-colors ${
                                                        isProgressToday
                                                            ? 'bg-slate-900 text-white'
                                                            : 'bg-white text-slate-600 hover:bg-slate-200 shadow-sm'
                                                    }`}
                                                >
                                                    {isProgressToday ? 'Today' : progressDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </button>
                                                <button
                                                    onClick={goProgressNextDay}
                                                    disabled={isProgressToday || isProgressFuture}
                                                    className="p-1 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <ChevronRight size={14} />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#8fb2c4]/10 text-xs font-bold text-slate-700 tabular-nums">
                                                <Timer size={12} className="text-[#8fb2c4]" />
                                                {formatDurationDisplay(totalFilteredSeconds)}
                                            </div>
                                            <button
                                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                                className={`p-1.5 rounded-lg transition-colors ${isFilterOpen || filterGoalId || filterSubtopicId || filterType ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:bg-slate-100'}`}
                                                title="Filters"
                                            >
                                                <Filter size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Filter Panel (Inside Dropdown) */}
                                {isFilterOpen && (
                                    <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 shrink-0 relative z-20">
                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="relative" ref={filterGoalDropdownRef}>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsFilterGoalDropdownOpen(!isFilterGoalDropdownOpen)}
                                                    className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-900"
                                                >
                                                    {filterGoalId ? (
                                                        <div className="flex items-center gap-2 truncate">
                                                            <GoalIcon iconName={getGoalIcon(filterGoalId)} className="w-3.5 h-3.5 text-slate-700" />
                                                            <span className="truncate">{getGoalName(filterGoalId)}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-500">All Categories</span>
                                                    )}
                                                    <ChevronDown size={14} className={`ml-2 text-slate-400 transition-transform flex-shrink-0 ${isFilterGoalDropdownOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                {isFilterGoalDropdownOpen && (
                                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto py-1">
                                                        <button
                                                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 transition-colors text-left"
                                                            onClick={() => {
                                                                setFilterGoalId('');
                                                                setFilterSubtopicId('');
                                                                setIsFilterGoalDropdownOpen(false);
                                                            }}
                                                        >
                                                            <span className="text-xs text-slate-500 font-medium">All Categories</span>
                                                        </button>
                                                        {goals.map(g => (
                                                            <button
                                                                key={g.id}
                                                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 transition-colors text-left"
                                                                onClick={() => {
                                                                    setFilterGoalId(g.id);
                                                                    setFilterSubtopicId('');
                                                                    setIsFilterGoalDropdownOpen(false);
                                                                }}
                                                            >
                                                                <GoalIcon iconName={g.icon} className="w-3.5 h-3.5 text-slate-700" />
                                                                <span className="text-xs text-slate-900 font-medium truncate">{g.name}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="relative" ref={filterSubtopicDropdownRef}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsFilterSubtopicDropdownOpen(!isFilterSubtopicDropdownOpen)}
                                                        className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-900"
                                                    >
                                                        <span className="truncate">{filterSubtopicId ? getSubtopicName(filterSubtopicId) : 'All Subtopics'}</span>
                                                        <ChevronDown size={14} className={`ml-2 text-slate-400 transition-transform flex-shrink-0 ${isFilterSubtopicDropdownOpen ? 'rotate-180' : ''}`} />
                                                    </button>
                                                    {isFilterSubtopicDropdownOpen && (
                                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto py-1">
                                                            <button
                                                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 transition-colors text-left"
                                                                onClick={() => {
                                                                    setFilterSubtopicId('');
                                                                    setIsFilterSubtopicDropdownOpen(false);
                                                                }}
                                                            >
                                                                <span className="text-xs text-slate-500 font-medium">All Subtopics</span>
                                                            </button>
                                                            {filterSubtopicOptions.map(s => (
                                                                <button
                                                                    key={s.id}
                                                                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 transition-colors text-left"
                                                                    onClick={() => {
                                                                        setFilterSubtopicId(s.id);
                                                                        setIsFilterSubtopicDropdownOpen(false);
                                                                    }}
                                                                >
                                                                    <span className="text-xs text-slate-900 font-medium truncate">{s.name}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="relative" ref={filterTypeDropdownRef}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsFilterTypeDropdownOpen(!isFilterTypeDropdownOpen)}
                                                        className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-900"
                                                    >
                                                        <span className="truncate">
                                                            {filterType === 'habit' ? 'Habit' : filterType === 'cumulative' ? 'Cumulative' : filterType === 'tasks' ? 'Tasks' : 'All Types'}
                                                        </span>
                                                        <ChevronDown size={14} className={`ml-2 text-slate-400 transition-transform flex-shrink-0 ${isFilterTypeDropdownOpen ? 'rotate-180' : ''}`} />
                                                    </button>
                                                    {isFilterTypeDropdownOpen && (
                                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-y-auto py-1">
                                                            {[
                                                                { value: '', label: 'All Types' },
                                                                { value: 'habit', label: 'Habit' },
                                                                { value: 'cumulative', label: 'Cumulative' },
                                                                { value: 'tasks', label: 'Tasks' },
                                                            ].map(t => (
                                                                <button
                                                                    key={t.value}
                                                                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 transition-colors text-left"
                                                                    onClick={() => {
                                                                        setFilterType(t.value);
                                                                        setIsFilterTypeDropdownOpen(false);
                                                                    }}
                                                                >
                                                                    <span className={`text-xs font-medium truncate ${t.value === '' ? 'text-slate-500' : 'text-slate-900'}`}>{t.label}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {(filterGoalId || filterSubtopicId || filterType) && (
                                                <button
                                                    onClick={() => {
                                                        setFilterGoalId('');
                                                        setFilterSubtopicId('');
                                                        setFilterType('');
                                                    }}
                                                    className="text-[10px] uppercase font-bold text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 transition-colors mt-1"
                                                >
                                                    <X size={10} /> Clear Filters
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* History List (Inside Dropdown) */}
                                <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
                                    {isProgressFuture ? (
                                        <div className="p-8 text-center">
                                            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                                                <CalendarClock size={24} className="text-slate-300" />
                                            </div>
                                            <p className="text-sm font-semibold text-slate-500">We're not a time machine 🚀</p>
                                            <p className="text-xs text-slate-400 mt-1">Come back on this day to see your progress</p>
                                        </div>
                                    ) : isLoadingHistory ? (
                                        <div className="p-8 text-center">
                                            <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-2" />
                                            <p className="text-xs text-slate-400">Loading...</p>
                                        </div>
                                    ) : filteredHistory.length === 0 ? (
                                        <div className="p-8 text-center">
                                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                                                <Timer size={20} className="text-slate-300" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-500">No sessions found</p>
                                        </div>
                                    ) : (
                                        filteredHistory.map((session) => {
                                            const sessionDate = new Date(session.createdAt);
                                            const timeStr = sessionDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                                            const dateStr = sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                                            return (
                                                <div key={session.id} className="px-5 py-3 hover:bg-slate-50/80 transition-colors group">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex items-start gap-3 min-w-0 flex-1">
                                                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center mt-0.5">
                                                                <GoalIcon iconName={session.goalIcon || getGoalIcon(session.goalId)} className="w-4 h-4 text-slate-700" />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                                    <span className="text-sm font-bold text-slate-900 truncate">{session.goalName || getGoalName(session.goalId)}</span>
                                                                    <span className="text-slate-300">·</span>
                                                                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                                                                        {typeIcon(session.subtopicType || getSubtopicType(session.subtopicId))}
                                                                        {session.subtopicName || getSubtopicName(session.subtopicId)}
                                                                    </span>
                                                                    {session.taskId && (
                                                                        <>
                                                                            <span className="text-slate-300">·</span>
                                                                            <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wide flex items-center gap-1">
                                                                                <CheckSquare size={10} />
                                                                                <span className="truncate max-w-[100px]">{session.taskName || getTaskName(session.taskId)}</span>
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">{dateStr} at {timeStr}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                                            <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md tabular-nums">
                                                                {session.durationDisplay}
                                                            </span>
                                                            <button
                                                                onClick={() => setDeleteConfirm(session.id)}
                                                                className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-red-500 md:text-slate-300 hover:text-red-500 transition-all"
                                                                title="Delete session"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>



            </div>




            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
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
                            <h3 className="text-2xl font-black text-black mb-4 uppercase tracking-wider">Delete Session?</h3>
                            <p className="text-slate-800 mb-8 text-lg">
                                Are you sure you want to delete this session? <br />
                                <span className="text-red-400 font-bold block mt-2">This action cannot be undone.</span>
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="button-89 bg-slate-600 hover:bg-slate-200 text-black text-sm py-3 px-6"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        if (!deleteConfirm) return;
                                        await handleDeleteSession(deleteConfirm);
                                        setDeleteConfirm(null);
                                    }}
                                    className="button-89 bg-red-600 hover:bg-red-700 text-black text-sm py-3 px-6"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
