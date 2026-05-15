// components/dashboard/HabitSummaryCard.tsx
'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface HabitSummaryCardProps {
    name: string;
    completedCount: number;
    totalDays: number;
}

export function HabitSummaryCard({ name, completedCount, totalDays }: HabitSummaryCardProps) {
    const percentage = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;

    return (
        <div className="p-6 rounded-lg border border-slate-300/50 bg-black shadow-lg flex flex-col items-center justify-center space-y-4">
            <h2 className="text-xl font-semibold text-black text-center truncate w-full">
                {name}
            </h2>

            <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-black font-bold">
                    {completedCount} <span className="text-xl text-slate-500 font-normal">/ {totalDays}</span>
                </span>
                <span className="text-sm text-slate-700 mt-1">days completed</span>
            </div>

            <div className="w-full bg-gray-50 rounded-full h-2.5 mt-2">
                <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}



