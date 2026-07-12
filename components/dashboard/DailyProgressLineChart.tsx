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
import { BrutalistSelect, BrutalistSelectOption } from '@/components/ui/BrutalistSelect';

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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [data.length, selectedCategoryId, selectedSubtopicId]);


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
    <div className="h-full flex flex-col bg-white rounded-xl border-2 border-black p-4 overflow-hidden relative">
      <div className="absolute inset-0  pointer-events-none" />
      <div className="relative z-10 flex flex-col h-full">
        <div className="grid grid-cols-2 sm:flex sm:flex-row items-center gap-2 sm:gap-3 mb-6 w-full">

          {/* Category Dropdown */}
          <div className="w-full sm:w-auto min-w-[150px] sm:min-w-[180px]">
            <BrutalistSelect
              value={selectedCategoryId}
              onChange={(value) => {
                setSelectedCategoryId(value);
                // Reset subtopic selection if it doesn't belong to the new category
                if (selectedSubtopicId) {
                  const st = subtopics.find(s => s.id === selectedSubtopicId);
                  if (st && st.goalId !== value && value !== '') {
                    onSubtopicChange('');
                  }
                }
              }}
              options={relevantCategories.map(goal => ({
                value: goal.id,
                label: goal.name
              }))}
              placeholder="All Categories"
            />
          </div>

          {/* Custom Subtopic Dropdown */}
          <div className="w-full sm:w-auto min-w-[150px] sm:min-w-[180px]">
            <BrutalistSelect
              value={selectedSubtopicId || ''}
              onChange={(value) => onSubtopicChange(value)}
              options={filteredSubtopics?.map(st => ({
                value: st.id,
                label: st.name,
                subLabel: getCategoryName(st.id)
              })) || []}
              placeholder="Select subtopic..."
            />
          </div>
        </div>
        
        <div className="mb-4 text-sm text-slate-500 italic max-w-2xl">
          <span className="font-bold text-slate-600">Note:</span> This graph tracks your overall daily progress percentage for the month. You can use the dropdowns above to filter by a specific category or subtopic.
        </div>

        <div className="flex w-full" style={{ height: '340px' }}>
          {/* Sticky Left Y-Axis */}
          <div style={{ width: '60px', flexShrink: 0, height: '320px', zIndex: 10, backgroundColor: 'white' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transformedData} margin={{ top: 10, right: 0, left: 0, bottom: 20 }}>
                <YAxis
                  yAxisId="left"
                  stroke="#3B82F6"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value + '%'}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  width={60}
                  label={{ value: 'Progress (%)', angle: -90, position: 'insideLeft', offset: 10, fill: '#3B82F6', fontSize: 13, fontWeight: 'bold', style: { textAnchor: 'middle' } }}
                />
                <Area yAxisId="left" type="monotone" dataKey="percent" fill="transparent" stroke="transparent" isAnimationActive={false} activeDot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Scrollable Chart Area */}
          <div ref={scrollRef} className="overflow-x-auto overflow-y-hidden flex-1 chart-scrollbar" style={{ height: '340px' }}>
            <div style={{ width: `${Math.max(100, (transformedData.length / 10) * 100)}%`, minWidth: '100%', height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={transformedData}
                  margin={{ top: 10, right: 15, left: 15, bottom: 20 }}
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
                    interval={0}
                    tickFormatter={(value) => value.replace('Day ', '')}
                    height={30}
                  />

                  {/* Hidden Y-Axis to maintain horizontal alignment of Area with ticks */}
                  <YAxis
                    yAxisId="left"
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    hide={true}
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
                      ticks={[0, 25, 50, 75, 100]}
                      width={40}
                      hide={true}
                    />
                  )}

                  <Tooltip
                    cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '3 3' }}
                    contentStyle={{
                      backgroundColor: '#000000',
                      border: '1px solid #2F3336',
                      borderRadius: '6px',
                      padding: '6px'
                    }}
                    labelStyle={{ color: '#9CA3AF', marginBottom: '2px', fontSize: '10px' }}
                    itemStyle={{ color: '#E5E7EB', fontSize: '11px', fontWeight: '500' }}
                    formatter={(value: any, name: string) => {
                      if (name === totalLineName) {
                        const dynamicName = selectedCategoryName 
                          ? `${selectedCategoryName} Total`
                          : `Total Progress`;
                        return [Number(value).toFixed(1) + '%', dynamicName];
                      }
                      // Shorten subtopic name if it's too long
                      const shortName = name.length > 20 ? name.substring(0, 20) + '...' : name;
                      return [Number(value).toFixed(1) + '%', shortName];
                    }}
                    labelFormatter={(label) => 'Date: ' + label.replace('Day ', '')}
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

        {/* Sticky Right Y-Axis */}
        {selectedSubtopic && (
          <div style={{ width: '40px', flexShrink: 0, height: '320px', zIndex: 10, backgroundColor: 'white' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transformedData} margin={{ top: 10, right: 0, left: 0, bottom: 20 }}>
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#10B981"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value + '%'}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  width={40}
                />
                <Area yAxisId="right" type="monotone" dataKey={'subtopic_' + selectedSubtopic.id} fill="transparent" stroke="transparent" isAnimationActive={false} activeDot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        </div>
        
        {/* Fixed Dates Label */}
        <div className="text-center w-full mt-2 text-[#6B7280] text-[13px] font-bold pointer-events-none">
          Dates
        </div>
      </div>
    </div>
  );
}




