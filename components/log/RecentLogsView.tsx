'use client';

import React from 'react';
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

interface RecentLogsViewProps {
    subtopics: Subtopic[];
    dailyLogs: Log[];
}

export function RecentLogsView({ subtopics, dailyLogs = [] }: RecentLogsViewProps) {
    const sortedLogs = [...dailyLogs].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const taskLogs = sortedLogs.filter(log => subtopics.find(s => s.id === log.subtopicId)?.type === 'tasks');
    const habitLogs = sortedLogs.filter(log => subtopics.find(s => s.id === log.subtopicId)?.type === 'habit');
    const cumulativeLogs = sortedLogs.filter(log => {
        const type = subtopics.find(s => s.id === log.subtopicId)?.type;
        return type === 'cumulative' || !type; // Catch-all for unknown
    });

    const renderLogColumn = (title: string, logs: Log[]) => (
        <div className="flex flex-col h-full bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h4 className="text-lg font-bold text-black mb-4 flex justify-between items-center border-b border-slate-300 pb-2">
                {title}
                <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2 py-1 rounded-full">{logs.length}</span>
            </h4>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {logs.length === 0 ? (
                    <p className="text-slate-500 text-center py-8 italic text-sm">
                        No logs found for this month.
                    </p>
                ) : (
                    logs.map(log => {
                        const st = subtopics.find(s => s.id === log.subtopicId);
                        return (
                            <div
                                key={log.id}
                                className="flex flex-col p-3 border border-slate-300/50 rounded-lg hover:border-slate-500 transition-all duration-200 bg-white shadow-sm"
                            >
                                <p className="text-sm font-bold text-slate-900 truncate">
                                    {st?.name || 'Unknown Subtopic'}
                                </p>
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs text-slate-500 font-medium">
                                        {log.date}
                                    </p>
                                    <p className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                                        +{log.value} {st?.unit || ''}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );

    return (
        <div
            className="relative overflow-hidden p-6 rounded-lg border border-black flex flex-col h-[calc(100vh-250px)] min-h-[500px] bg-white"
        >
            <h3 className="text-2xl font-black uppercase tracking-tight text-black mb-6 flex items-center justify-between">
                <span className="flex items-center gap-2">
                    Recent Logs (This Month)
                    <div className="relative group cursor-help outline-none flex items-center" tabIndex={0}>
                        <HelpCircle size={20} className="text-slate-400 group-hover:text-black transition-colors" />
                        <div className="absolute left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 top-full mt-2 w-64 md:w-72 p-3 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none z-20 shadow-[4px_4px_0_0_#000] border-2 border-white font-medium normal-case text-center md:text-left">
                            A quick log of all your recorded tasks, habits, and progress for the current month.
                        </div>
                    </div>
                </span>
                <span className="text-sm font-bold text-slate-500">
                    Total: {sortedLogs.length}
                </span>
            </h3>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                {renderLogColumn('Tasks', taskLogs)}
                {renderLogColumn('Habits', habitLogs)}
                {renderLogColumn('Cumulative', cumulativeLogs)}
            </div>
        </div>
    );
}
