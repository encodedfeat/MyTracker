'use client';

import React, { useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';

interface MonthDay {
    date: string;
    dayNum: number;
    completed: boolean;
    isToday: boolean;
    isFuture: boolean;
}

interface HabitSubtopic {
    id: string;
    name: string;
    monthDays: MonthDay[];
    completedToday: boolean;
    goalId: string;
}

interface Goal {
    id: string;
    name: string;
    icon: string;
}

interface HabitMonthlyReportViewProps {
    subtopics: HabitSubtopic[];
    goals: Goal[];
    onLogHabit: (subtopicId: string, dateString: string) => Promise<void>;
    isCompact?: boolean;
    isReadOnly?: boolean;
}

export function HabitMonthlyReportView({ subtopics, goals, onLogHabit, isCompact = false, isReadOnly = false }: HabitMonthlyReportViewProps) {
    const todayRef = useRef<HTMLTableCellElement>(null);

    useEffect(() => {
        if (todayRef.current && !isCompact) {
            todayRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [isCompact]);

    const habitSubtopics = subtopics.filter((s: any) => s.type === 'habit');

    if (habitSubtopics.length === 0) {
        if (isCompact) return null;

        return (
            <div className="w-full rounded-lg border border-slate-700/50 bg-black shadow-lg mb-8 p-12 text-center">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-indigo-500" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">No Habits Tracked Yet</h2>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                    Start building consistent routines by tracking your daily habits.
                    Create a new habit in the "Manage Subtopics" tab to get started.
                </p>
            </div>
        );
    }

    // Get the days from the first habit to build the header
    const daysHeader = habitSubtopics[0]?.monthDays;

    // If monthDays is not available yet, don't render
    if (!daysHeader || daysHeader.length === 0) {
        return null;
    }

    const getCategoryName = (goalId: string) => {
        const goal = goals.find(g => g.id === goalId);
        return goal ? goal.name : 'Unknown';
    };

    // Group habits by category
    const habitsByCategory = habitSubtopics.reduce((acc, habit) => {
        const categoryName = getCategoryName(habit.goalId);
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(habit);
        return acc;
    }, {} as Record<string, typeof habitSubtopics>);

    // Compact view for Dashboard (checkbox-based, grouped by category)
    if (isCompact) {
        return (
            <div className="w-full rounded-lg border border-slate-700/50 bg-black shadow-lg mb-8 overflow-hidden">
                <div className="p-4 border-b border-slate-700/50">
                    <h2 className="text-xl font-semibold text-white">Monthly Habit Report</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead className="bg-slate-900/50 text-slate-400">
                            <tr>
                                <th className="px-3 py-2 text-left font-medium sticky left-0 bg-slate-900/50 z-10 min-w-[120px] border-r border-slate-700">Your Habits</th>
                                {daysHeader.map((day) => (
                                    <th key={day.date} className="px-1 py-2 text-center font-normal min-w-[24px] border-r border-slate-700">
                                        {day.dayNum}
                                    </th>
                                ))}
                                <th className="px-3 py-2 text-center font-medium sticky right-0 bg-slate-900/50 z-10 min-w-[60px]">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(habitsByCategory).map(([categoryName, habits]) => (
                                <React.Fragment key={categoryName}>
                                    {/* Category Header Row */}
                                    <tr className="bg-slate-800/50 border-t-2 border-slate-700">
                                        <td className="px-3 py-2 font-bold text-white text-sm sticky left-0 bg-slate-800/90 z-20">
                                            {categoryName}
                                        </td>
                                        <td colSpan={daysHeader.length + 1} className="px-3 py-2"></td>
                                    </tr>
                                    {/* Habit Rows */}
                                    {habits.map((habit) => {
                                        const completedCount = habit.monthDays.filter(d => d.completed).length;
                                        const totalDays = habit.monthDays.length;

                                        return (
                                            <tr key={habit.id} className="border-b border-slate-800 hover:bg-slate-900/30">
                                                <td className="px-3 py-2 pl-6 sticky left-0 bg-black z-10 border-r border-slate-700">
                                                    <span className="text-xs font-medium text-slate-300 truncate">{habit.name}</span>
                                                </td>
                                                {habit.monthDays.map((day) => {
                                                    const isCompleted = day.completed;

                                                    return (
                                                        <td key={day.date} className="px-1 py-2 text-center border-r border-slate-700">
                                                            <div className="flex items-center justify-center">
                                                                {isCompleted ? (
                                                                    <div className="w-3.5 h-3.5 border border-slate-600 rounded-sm flex items-center justify-center">
                                                                        <Check size={10} strokeWidth={3} className="text-white" />
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-3.5 h-3.5 border border-slate-600 rounded-sm flex items-center justify-center">
                                                                        <div className="w-1 h-1 rounded-full bg-slate-600"></div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                                <td className="px-3 py-2 text-center font-bold text-white text-xs sticky right-0 bg-black z-10">
                                                    {completedCount}/{totalDays}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // Full view for Manage page (grouped by category)
    return (
        <div
            className="w-full relative overflow-hidden rounded-3xl border border-slate-700/50 shadow-2xl mb-8"
            style={{
                backgroundImage: "url('/assist/guide/divBackground.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />

            <div className="relative">
                <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Monthly Habit Report</h2>
                    {isReadOnly && (
                        <span className="bg-amber-500/20 text-amber-500 text-xs font-bold px-2 py-1 rounded border border-amber-500/50">
                            READ ONLY
                        </span>
                    )}
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-sm text-left text-slate-300">
                        <thead className="text-xs uppercase bg-slate-900/80 text-slate-400 backdrop-blur-sm">
                            <tr>
                                <th scope="col" className="px-4 py-3 font-medium sticky left-0 bg-slate-900/90 z-10 min-w-[200px]">
                                    Your Habits
                                </th>
                                {daysHeader.map((day) => (
                                    <th
                                        key={day.date}
                                        scope="col"
                                        className="px-2 py-3 text-center min-w-[40px]"
                                        ref={day.isToday ? todayRef : null}
                                    >
                                        {day.dayNum}
                                    </th>
                                ))}
                                <th scope="col" className="px-4 py-3 font-medium text-center min-w-[100px] sticky right-0 bg-slate-900/90 z-10">
                                    Analysis
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(habitsByCategory).map(([categoryName, habits]) => (
                                <React.Fragment key={categoryName}>
                                    {/* Category Header Row */}
                                    <tr className="bg-slate-800/50 border-t-2 border-slate-700">
                                        <td className="px-4 py-3 font-bold text-white sticky left-0 bg-slate-800/90 z-20">
                                            {categoryName}
                                        </td>
                                        <td colSpan={daysHeader.length + 1} className="px-4 py-3"></td>
                                    </tr>
                                    {/* Habit Rows */}
                                    {habits.map((habit) => {
                                        const completedCount = habit.monthDays.filter(d => d.completed).length;
                                        const totalDays = habit.monthDays.length;

                                        return (
                                            <tr key={habit.id} className="border-b border-slate-800 hover:bg-slate-900/50 transition-colors">
                                                <td className="px-4 py-3 pl-8 font-medium text-white sticky left-0 bg-slate-950/90 z-10">
                                                    <span className="text-sm">{habit.name}</span>
                                                </td>
                                                {habit.monthDays.map((day) => {
                                                    const isClickable = day.isToday && !isReadOnly;
                                                    const isCompleted = day.completed;
                                                    const isPast = !day.isToday && !day.isFuture;

                                                    return (
                                                        <td
                                                            key={day.date}
                                                            className={`px-2 py-3 text-center border-l border-slate-800`}
                                                        >
                                                            <div className="flex justify-center items-center h-full">
                                                                <div className="heart-checkbox-container" title={isCompleted ? "Completed" : "Mark as complete"}>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="checkbox"
                                                                        checked={isCompleted}
                                                                        onChange={() => isClickable && onLogHabit(habit.id, day.date)}
                                                                        disabled={!isClickable}
                                                                    />
                                                                    <div className="svg-container">
                                                                        <svg viewBox="0 0 24 24" className="svg-outline" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z">
                                                                            </path>
                                                                        </svg>
                                                                        <svg viewBox="0 0 24 24" className="svg-filled" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z">
                                                                            </path>
                                                                        </svg>
                                                                        <svg className="svg-celebrate" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                                                                            <polygon points="10,10 20,20"></polygon>
                                                                            <polygon points="10,50 20,50"></polygon>
                                                                            <polygon points="20,80 30,70"></polygon>
                                                                            <polygon points="90,10 80,20"></polygon>
                                                                            <polygon points="90,50 80,50"></polygon>
                                                                            <polygon points="80,80 70,70"></polygon>
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                                <td className="px-4 py-3 text-center font-bold text-white sticky right-0 bg-slate-950/90 z-10 border-l border-slate-800">
                                                    {completedCount}/{totalDays}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
