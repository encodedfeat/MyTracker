// components/dashboard/SubtopicProgressCircle.tsx
'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

// Define the type for the subtopic prop
interface SubtopicProgress {
  id: string;
  name: string;
  type: 'habit' | 'cumulative' | 'tasks';
  progressPercent: number;
  metricValue: number;
  target?: number;
  completedTasks: number;
  totalTasks: number;
}

interface SubtopicProgressCircleProps {
  subtopic: SubtopicProgress;
  categoryName?: string;
}

export function SubtopicProgressCircle({ subtopic, categoryName }: SubtopicProgressCircleProps) {
  const percentRounded = Math.round(subtopic.progressPercent);
  const data = [
    { name: 'Completed', value: percentRounded },
    { name: 'Remaining', value: 100 - percentRounded },
  ];

  const COLORS = {
    tasks: ['#000000', '#f4f4f5'], // Black, Zinc-100
    cumulative: ['#3f3f46', '#f4f4f5'], // Zinc-700, Zinc-100
    habit: ['#52525b', '#f4f4f5'], // Zinc-600, Zinc-100
  };

  const colorPair = COLORS[subtopic.type] || COLORS.cumulative;

  let metricDisplay = '';
  if (subtopic.type === 'tasks') {
    metricDisplay = `${subtopic.completedTasks} / ${subtopic.totalTasks} Tasks`;
  } else if (subtopic.type === 'cumulative') {
    metricDisplay = `${subtopic.metricValue} / ${subtopic.target}`;
  } else if (subtopic.type === 'habit') {
    metricDisplay = `${Math.round(percentRounded)}% This Month`;
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6 flex flex-col items-center justify-center shadow-lg hover:border-zinc-300 transition-colors duration-300">
      <h2 className="text-lg font-bold text-black text-center truncate w-full mb-1">
        {subtopic.name}
      </h2>
      {categoryName && (
        <p className="text-xs text-zinc-500 text-center mb-4 uppercase tracking-wider font-medium">
          {categoryName}
        </p>
      )}

      <div className="relative w-32 h-32 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={60}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              stroke="none"
              cornerRadius={4}
              paddingAngle={percentRounded > 0 && percentRounded < 100 ? 5 : 0}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colorPair[index % colorPair.length]}
                  style={{ outline: 'none' }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-2xl font-bold" style={{ color: colorPair[0] }}>
            {percentRounded}%
          </span>
          <span className="text-[10px] uppercase tracking-wide text-zinc-500 font-medium">Completed</span>
        </div>
      </div>

      <p className="text-sm text-zinc-800 font-medium bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
        {metricDisplay}
      </p>
    </div>
  );
}


