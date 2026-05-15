'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ChevronDown } from 'lucide-react';

interface SubtopicMeta {
  id: string;
  name: string;
  color: string;
}

interface Goal {
  id: string;
  name: string;
}

interface Subtopic {
  id: string;
  goalId: string;
  name: string;
  type: 'habit' | 'cumulative' | 'tasks';
  target?: number;
  totalTasks?: number;
}

interface DailyProgressLineChartProps {
  data: {
    name: string;
    percent: number;
    subtopics?: { [key: string]: number };
  }[];
  subtopicMeta?: SubtopicMeta[];
  selectedSubtopicId?: string | null;
  onSubtopicChange: (id: string) => void;
  goals?: Goal[];
  subtopics?: Subtopic[];
}

export function DailyProgressLineChart({
  data,
  subtopicMeta,
  selectedSubtopicId,
  onSubtopicChange,
  goals = [],
  subtopics = []
}: DailyProgressLineChartProps) {

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [isSubtopicDropdownOpen, setIsSubtopicDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSubtopicDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const selectedSubtopic = selectedSubtopicId
    ? subtopicMeta?.find(s => s.id === selectedSubtopicId)
    : null;

  const transformedData = React.useMemo(() => {
    return data.map(item => {
      const transformed: any = {
        name: item.name,
      };

      // Calculate "Today's Total" (or Category Total) dynamically
      let totalPercent = 0;
      let count = 0;

      if (selectedCategoryId) {
        // Filter subtopics for the selected category
        const categorySubtopics = subtopics.filter(s => s.goalId === selectedCategoryId);

        categorySubtopics.forEach(st => {
          if (item.subtopics && item.subtopics[st.id] !== undefined) {
            totalPercent += item.subtopics[st.id];
            count++;
          }
        });

        transformed.percent = count > 0 ? totalPercent / count : 0;
      } else {
        // Use the pre-calculated overall average from props (or recalculate if preferred)
        transformed.percent = item.percent;
      }

      if (item.subtopics) {
        Object.keys(item.subtopics).forEach(key => {
          transformed['subtopic_' + key] = item.subtopics![key];
        });
      }

      return transformed;
    });
  }, [data, selectedCategoryId, subtopics]);

  // Helper to check if a subtopic is valid (not habit, not empty)
  const isValidSubtopic = (st: Subtopic) => {
    if (st.type === 'habit') return false;
    if (st.type === 'tasks' && (st.totalTasks === 0 || st.totalTasks === undefined)) return false;
    if (st.type === 'cumulative' && (!st.target || st.target === 0)) return false;
    return true;
  };

  // Filter categories that have at least one VALID task/cumulative subtopic
  const relevantCategories = goals.filter(goal =>
    subtopics.some(st => st.goalId === goal.id && isValidSubtopic(st))
  );

  // Filter subtopics based on selected category AND validity
  const filteredSubtopics = subtopicMeta?.filter(st => {
    const fullSubtopic = subtopics.find(s => s.id === st.id);
    if (!fullSubtopic || !isValidSubtopic(fullSubtopic)) return false;

    if (!selectedCategoryId) return true;
    return fullSubtopic.goalId === selectedCategoryId;
  });

  const getCategoryName = (subtopicId: string) => {
    const st = subtopics.find(s => s.id === subtopicId);
    if (!st) return '';
    const goal = goals.find(g => g.id === st.goalId);
    return goal?.name || '';
  };

  const selectedCategoryName = selectedCategoryId
    ? goals.find(g => g.id === selectedCategoryId)?.name
    : null;

  const totalLineName = selectedCategoryName
    ? `Today's ${selectedCategoryName} Total`
    : "Today's Total";

  return (
    <div className="h-full flex flex-col bg-black rounded-lg border border-slate-700/50 p-4">
      <div className="flex flex-wrap items-center gap-3 mb-6">

        {/* Category Dropdown */}
        <div className="relative">
          <select
            value={selectedCategoryId}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value);
              // Reset subtopic selection if it doesn't belong to the new category
              if (selectedSubtopicId) {
                const st = subtopics.find(s => s.id === selectedSubtopicId);
                if (st && st.goalId !== e.target.value && e.target.value !== '') {
                  onSubtopicChange('');
                }
              }
            }}
            className="appearance-none flex items-center gap-2 px-4 py-2 rounded-full bg-transparent border border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6]/10 transition-colors cursor-pointer text-sm font-medium pr-10 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            style={{ minWidth: '160px' }}
          >
            <option value="" className="bg-[#15202B] text-white">All Categories</option>
            {relevantCategories.map(goal => (
              <option key={goal.id} value={goal.id} className="bg-[#15202B] text-white">
                {goal.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#3B82F6]" />
        </div>

        {/* Custom Subtopic Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsSubtopicDropdownOpen(!isSubtopicDropdownOpen)}
            className="flex items-center justify-between gap-2 px-4 py-2 rounded-full bg-transparent border border-[#10B981] text-[#10B981] hover:bg-[#10B981]/10 transition-colors cursor-pointer text-sm font-medium min-w-[200px]"
          >
            <span className="truncate max-w-[180px]">
              {selectedSubtopic ? selectedSubtopic.name : "Select subtopic..."}
            </span>
            <ChevronDown className="w-4 h-4 text-[#10B981]" />
          </button>

          {isSubtopicDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-[280px] max-h-[300px] overflow-y-auto bg-[#15202B] border border-slate-700 rounded-lg shadow-xl z-50 custom-scrollbar">
              <div
                onClick={() => {
                  onSubtopicChange('');
                  setIsSubtopicDropdownOpen(false);
                }}
                className={`px-4 py-3 cursor-pointer hover:bg-slate-800 transition-colors ${!selectedSubtopicId ? 'bg-slate-800' : ''}`}
              >
                <span className="text-white text-sm">None</span>
              </div>

              {filteredSubtopics?.map(st => (
                <div
                  key={st.id}
                  onClick={() => {
                    onSubtopicChange(st.id);
                    setIsSubtopicDropdownOpen(false);
                  }}
                  className={`px-4 py-3 cursor-pointer hover:bg-slate-800 transition-colors border-t border-slate-800 ${selectedSubtopicId === st.id ? 'bg-slate-800' : ''}`}
                >
                  <div className="flex flex-col">
                    <span className="text-white text-sm font-medium">{st.name}</span>
                    <span className="text-xs text-slate-500 font-normal">
                      {getCategoryName(st.id)}
                    </span>
                  </div>
                </div>
              ))}

              {filteredSubtopics?.length === 0 && (
                <div className="px-4 py-3 text-slate-500 text-sm italic text-center">
                  No subtopics found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 relative" style={{ minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={transformedData}
            margin={{ top: 10, right: 40, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSubtopic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2F3336" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval={0} // Force show all ticks
              tickFormatter={(value) => value.replace('Day ', '')}
            />

            <YAxis
              yAxisId="left"
              stroke="#3B82F6"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value + '%'}
              domain={[0, 100]}
              width={40}
            />

            {selectedSubtopic && (
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#10B981"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value + '%'}
                domain={[0, 100]}
                width={40}
              />
            )}

            <Tooltip
              cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: '#000000',
                border: '1px solid #2F3336',
                borderRadius: '12px',
                padding: '12px'
              }}
              labelStyle={{ color: '#9CA3AF', marginBottom: '8px', fontSize: '13px' }}
              itemStyle={{ color: '#E5E7EB', fontSize: '14px', fontWeight: '500' }}
              formatter={(value: any, name: string) => {
                if (name === totalLineName) {
                  return [value.toLocaleString(), name];
                }
                return [value + '%', name];
              }}
              labelFormatter={(label) => 'Day ' + label.replace('Day ', '')}
            />

            <Area
              yAxisId="left"
              type="monotone"
              dataKey="percent"
              name={totalLineName}
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorTotal)"
              strokeWidth={2.5}
              activeDot={{ r: 5, fill: '#3B82F6', stroke: '#15202B', strokeWidth: 2 }}
            />

            {selectedSubtopic && (
              <Area
                yAxisId="right"
                type="monotone"
                name={selectedSubtopic.name}
                dataKey={'subtopic_' + selectedSubtopic.id}
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorSubtopic)"
                strokeWidth={2.5}
                activeDot={{ r: 5, fill: '#10B981', stroke: '#15202B', strokeWidth: 2 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
