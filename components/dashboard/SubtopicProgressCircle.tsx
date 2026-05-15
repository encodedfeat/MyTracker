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
    tasks: ['#10b981', '#374151'], // green-500, gray-700
    cumulative: ['#6366f1', '#374151'], // indigo-500, gray-700
    habit: ['#0ea5e9', '#374151'], // sky-500, gray-700 (fallback)
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
    <div className="p-3 rounded-lg transition-all duration-300 border border-slate-700/50 bg-black shadow-lg">
      <h2 className="text-lg font-semibold text-white text-center truncate">
        {subtopic.name}
      </h2>
      {categoryName && (
        <p className="text-xs text-slate-400 text-center mb-2">{categoryName}</p>
      )}
      <div className="relative" style={{ width: '100%', height: 140 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={60}
              dataKey="value"
              startAngle={180}
              endAngle={-180}
              stroke="none"
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
          <span className="text-xs font-medium text-slate-400">Completed</span>
        </div>
      </div>
      <p className="text-center text-slate-400 mt-4 font-medium">
        {metricDisplay}
      </p>
    </div>
  );
}