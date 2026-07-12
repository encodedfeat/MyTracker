// components/dashboard/MonthlyProgressCard.tsx
'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { BrutalistSelect } from '@/components/ui/BrutalistSelect';

interface MonthlyProgressCardProps {
  percent: number;
  categories?: { id: string; name: string }[];
  selectedCategoryId?: string;
  onCategoryChange?: (categoryId: string) => void;
}

export function MonthlyProgressCard({
  percent,
  categories = [],
  selectedCategoryId = '',
  onCategoryChange
}: MonthlyProgressCardProps) {
  const percentRounded = Math.round(percent);
  const data = [
    { name: 'Completed', value: percentRounded },
    { name: 'Remaining', value: 100 - percentRounded },
  ];
  // Colors for dark mode
  const COLORS = ['#6366f1', '#374151']; // indigo-500, gray-700

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-xl font-semibold text-black">This Month's Progress</h2>
        <div className="w-full sm:w-auto min-w-[150px]">
          <BrutalistSelect
            value={selectedCategoryId}
            onChange={(value) => onCategoryChange?.(value)}
            options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
            placeholder="--select category--"
          />
        </div>
      </div >
      <div className="relative" style={{ width: '100%', height: '240px' }}>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              dataKey="value"
              startAngle={180}
              endAngle={-180}
              stroke="none"
              paddingAngle={percentRounded > 0 && percentRounded < 100 ? 5 : 0}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{ outline: 'none' }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
          <span className="text-5xl font-bold text-black font-bold">
            {percentRounded}%
          </span>
          <span className="text-lg font-medium text-slate-700">Completed</span>
        </div>
      </div>
      <p className="text-center text-slate-700 mt-4">
        This is an average of all your subtopic trackers for the current month.
      </p>
    </div >
  );
}


