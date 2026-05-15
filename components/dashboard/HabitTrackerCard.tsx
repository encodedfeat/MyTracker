// components/dashboard/HabitTrackerCard.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';

// Define the type for a single day in monthDays
interface MonthDay {
  date: string;
  dayNum: number;
  completed: boolean;
  isToday: boolean;
  isFuture: boolean;
}

// Define the type for the subtopic prop
interface HabitSubtopic {
  id: string;
  name: string;
  monthDays: MonthDay[];
  completedToday: boolean;
}

interface HabitTrackerCardProps {
  subtopic: HabitSubtopic;
  onLogHabit: (subtopicId: string, dateString: string) => Promise<void>;
}

export function HabitTrackerCard({ subtopic, onLogHabit }: HabitTrackerCardProps) {
  const todayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to today's date on mount
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="p-4 md:p-6 rounded-lg transition-all duration-300 border border-slate-700/50 bg-black shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-white text-center truncate">
        {subtopic.name}
      </h2>

      <div className="overflow-x-auto whitespace-nowrap py-4 -mx-4 px-4 dark-scrollbar">
        {subtopic.monthDays.map((day) => {
          // Allow clicking ONLY if it is today
          const isClickable = day.isToday;
          const isDisabled = !day.isToday;

          let circleClass = 'w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ';
          if (day.completed) {
            circleClass += 'bg-green-500 text-white';
          } else if (day.isToday) {
            circleClass += 'bg-gray-900 text-indigo-400 border-2 border-indigo-400';
          } else if (day.isFuture) {
            circleClass += 'bg-gray-950 text-gray-800';
          } else {
            // Past days
            circleClass += 'bg-gray-900 text-slate-600';
          }

          if (isClickable) {
            circleClass += ' cursor-pointer hover:opacity-80';
          }

          if (isDisabled) {
            circleClass += ' opacity-70 cursor-not-allowed';
          }

          return (
            <div
              key={day.date}
              ref={day.isToday ? todayRef : null}
              onClick={() => isClickable && onLogHabit(subtopic.id, day.date)}
              className={`inline-flex flex-col items-center justify-center space-y-1 mx-2 ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
              style={{ minWidth: '40px' }}
              title={isClickable ? (day.completed ? 'Completed (Click to undo)' : 'Click to log') : (day.isFuture ? 'Future date' : 'Past date')}
            >
              <div className={circleClass}>
                {day.dayNum}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center mt-4 text-center" style={{ height: 50 }}>
        {subtopic.completedToday ? (
          <span className="flex items-center space-x-2 text-green-500 font-semibold">
            <CheckCircle2 className="w-5 h-5" />
            <span>Done Today!</span>
          </span>
        ) : (
          <span className="text-slate-400 font-medium">
            Tap today to log your habit.
          </span>
        )}
      </div>
    </div>
  );
}