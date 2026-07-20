'use client';

import React, { useEffect, useRef } from 'react';
import { Check, X, HelpCircle } from 'lucide-react';

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
            <div
                className="w-full relative overflow-hidden bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-2xl mb-8"
                style={{
                    backgroundColor: 'transparent',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0  pointer-events-none" />

                <div className="relative">
                    <div className="p-4 border-b border-slate-300/50 flex items-center justify-center relative">
                        <h2 className="text-xl font-semibold text-black">Monthly Habit Report</h2>
                        {isReadOnly && (
                            <span className="absolute right-4 bg-amber-500/20 text-amber-500 text-xs font-bold px-2 py-1 rounded border border-amber-500/50">
                                READ ONLY
                            </span>
                        )}
                    </div>

                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={32} className="text-indigo-500" />
                        </div>
                        <h2 className="text-xl font-bold text-black mb-2">No Habits Tracked Yet</h2>
                        <p className="text-slate-700 mb-6 max-w-md mx-auto">
                            Start building consistent routines by tracking your daily habits.
                            Create a new habit in the "Manage Subtopics" tab to get started.
                        </p>
                    </div>
                </div>
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

    const truncateName = (name: string, limit: number) => {
        if (name.length <= limit) return name;
        return name.slice(0, limit) + '...';
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
            <div className="w-full relative overflow-hidden bg-white/40 backdrop-blur-md rounded-xl border border-white/60 shadow-lg mb-8">
                <div className="absolute inset-0  pointer-events-none" />
                <div className="relative z-10">
                    <div className="p-4 border-b border-slate-300/50">
                        <h2 className="text-xl font-semibold text-black">Monthly Habit Report</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead className="bg-white/50 text-slate-700">
                                <tr>
                                    <th className="px-3 py-2 text-left font-medium sticky left-0 bg-white/50 z-10 min-w-[120px] border-r border-slate-300">Your Habits</th>
                                    {daysHeader.map((day) => (
                                        <th key={day.date} className="px-1 py-2 text-center font-normal min-w-[24px] border-r border-slate-300">
                                            {day.dayNum}
                                        </th>
                                    ))}
                                    <th className="px-3 py-2 text-center font-medium sticky right-0 bg-white/50 z-10 min-w-[60px]">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(habitsByCategory).map(([categoryName, habits]) => (
                                    <React.Fragment key={categoryName}>
                                        {/* Category Header Row */}
                                        <tr className="bg-slate-50/50 border-t-2 border-slate-300">
                                            <td className="px-3 py-2 font-bold text-black text-sm sticky left-0 bg-slate-50/90 z-20">
                                                {categoryName}
                                            </td>
                                            <td colSpan={daysHeader.length + 1} className="px-3 py-2"></td>
                                        </tr>
                                        {/* Habit Rows */}
                                        {habits.map((habit) => {
                                            const completedCount = habit.monthDays.filter(d => d.completed).length;
                                            const totalDays = habit.monthDays.length;

                                            return (
                                                <tr key={habit.id} className="border-b border-black hover:bg-white/30">
                                                    <td className="px-3 py-2 pl-6 sticky left-0 bg-black z-10 border-r border-slate-300">
                                                        <span className="text-xs font-medium text-white md:hidden">{truncateName(habit.name, 5)}</span>
                                                        <span className="text-xs font-medium text-white hidden md:block">{truncateName(habit.name, 20)}</span>
                                                    </td>
                                                    {habit.monthDays.map((day) => {
                                                        const isCompleted = day.completed;

                                                        return (
                                                            <td key={day.date} className="px-1 py-2 text-center border-r border-slate-300">
                                                                <div className="flex items-center justify-center">
                                                                    {isCompleted ? (
                                                                        <div className="w-3.5 h-3.5 border border-slate-600 rounded-sm flex items-center justify-center">
                                                                            <Check size={10} strokeWidth={3} className="text-black" />
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
            </div>
        );
    }

    // Full view for Manage page (grouped by category)
    return (
        <div
            className="w-full relative overflow-hidden bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-2xl mb-8"
            style={{
                backgroundColor: 'transparent',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0  pointer-events-none" />

            <div className="relative">
                <div className="p-4 border-b border-slate-300/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-black">Monthly Habit Report</h2>
                        <div className="relative group cursor-help outline-none flex items-center" tabIndex={0}>
                            <HelpCircle size={20} className="text-slate-400 group-hover:text-black transition-colors" />
                            <div className="absolute left-0 top-full mt-2 w-64 md:w-72 p-3 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none z-20 shadow-[4px_4px_0_0_#000] border-2 border-white font-medium text-left">
                                Track your monthly consistency for each habit. Click the checkboxes to log your progress!
                            </div>
                        </div>
                    </div>
                    {isReadOnly && (
                        <span className="bg-amber-500/20 text-amber-500 text-xs font-bold px-2 py-1 rounded border border-amber-500/50">
                            READ ONLY
                        </span>
                    )}
                </div>

                <div
                    className="relative overflow-hidden border border-white/40 rounded-lg bg-white/20 backdrop-blur-sm"
                    style={{
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    <div className="absolute inset-0  pointer-events-none" />
                    <div className="relative z-10 p-0">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-sm text-left text-slate-800">
                                <thead className="text-xs uppercase bg-white/80 text-slate-700 backdrop-blur-sm">
                                    <tr>
                                        <th scope="col" className="px-3 md:px-4 py-3 font-medium sticky left-0 bg-white z-20 min-w-[100px] md:min-w-[200px]">
                                            Your Habits
                                        </th>
                                        {daysHeader.map((day) => (
                                            <th
                                                key={day.date}
                                                scope="col"
                                                className="px-1 md:px-2 py-3 text-center min-w-[32px] md:min-w-[40px]"
                                                ref={day.isToday ? todayRef : null}
                                            >
                                                {day.dayNum}
                                            </th>
                                        ))}
                                        <th scope="col" className="px-2 md:px-4 py-3 font-medium text-center min-w-[70px] md:min-w-[100px] sticky right-0 bg-white z-20">
                                            Analysis
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-slate-200">
                                    {Object.entries(habitsByCategory).map(([categoryName, habits]) => (
                                        <React.Fragment key={categoryName}>
                                            {/* Category Header Row */}
                                            <tr className="bg-slate-50/50 border-t-2 border-slate-300">
                                                <td className="px-3 md:px-4 py-3 font-bold text-black sticky left-0 bg-slate-50 z-20">
                                                    {categoryName}
                                                </td>
                                                <td colSpan={daysHeader.length + 1} className="px-4 py-3"></td>
                                            </tr>
                                            {/* Habit Rows */}
                                            {habits.map((habit) => {
                                                const completedCount = habit.monthDays.filter(d => d.completed).length;
                                                const totalDays = habit.monthDays.length;

                                                return (
                                                    <tr key={habit.id} className="border-b-2 border-slate-200 last:border-b-0">
                                                        <td className="px-3 md:px-4 py-3 pl-4 md:pl-8 font-medium text-black sticky left-0 bg-white z-20 border-r-2 border-slate-200">
                                                            <span className="text-sm md:hidden">{truncateName(habit.name, 10)}</span>
                                                            <span className="text-sm hidden md:block">{truncateName(habit.name, 20)}</span>
                                                        </td>
                                                        {habit.monthDays.map((day) => {
                                                            const isClickable = day.isToday && !isReadOnly;
                                                            const isCompleted = day.completed;
                                                            const isPast = !day.isToday && !day.isFuture;

                                                            return (
                                                                <td
                                                                    key={day.date}
                                                                    className={`px-1 md:px-2 py-2 md:py-3 text-center `}
                                                                >
                                                                    <div className="flex justify-center items-center h-full">
                                                                        <div
                                                                            className={`heart-checkbox-container ${!day.isToday ? 'opacity-40 hover:opacity-100 transition-opacity duration-300' : ''}`}
                                                                            title={isCompleted ? "Completed" : (isClickable ? "Mark as complete" : "")}
                                                                        >
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
                                                        <td className="px-2 md:px-4 py-3 text-center font-bold text-black sticky right-0 bg-white z-20 border-l-2 border-slate-200">
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
            </div>
        </div>
    );
}





