// components/dashboard/ModernDashboardView.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MonthlyProgressCard } from './MonthlyProgressCard';
import { DailyProgressLineChart } from './DailyProgressLineChart';
import { HabitTrackerCard } from './HabitTrackerCard';
import { SubtopicProgressCircle } from './SubtopicProgressCircle';
import { HabitSummaryCard } from './HabitSummaryCard';

import { HabitMonthlyReportView } from './HabitMonthlyReportView';

interface SubtopicProgress {
  id: string;
  name: string;
  type: 'habit' | 'cumulative' | 'tasks';
  progressPercent: number;
  metricValue: number;
  target?: number;
  completedTasks: number;
  totalTasks: number;
  monthDays: any[];
  completedToday: boolean;
  goalId: string;
}

interface Goal {
  id: string;
  name: string;
  icon: string;
}

interface Task {
  id: string;
  subtopicId: string;
  name: string;
  completed: boolean;
}

interface ModernDashboardViewProps {
  subtopicProgress: SubtopicProgress[];
  overallAveragePercent: number;
  dailyLineChartData: {
    name: string;
    percent: number;
    subtopics?: { [key: string]: number };
  }[];
  onLogHabit: (subtopicId: string, dateString: string) => Promise<void>;
  selectedDate: Date;
  changeMonth: (offset: number) => void;
  hasData: boolean;
  goals: Goal[];
  tasks: Task[];
}

const generateColor = (index: number): string => {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EC4899',
    '#8B5CF6', '#14B8A6', '#F43F5E', '#6366F1'
  ];
  return colors[index % colors.length];
};

export function ModernDashboardView({
  subtopicProgress,
  overallAveragePercent,
  dailyLineChartData,
  onLogHabit,
  selectedDate,
  changeMonth,
  hasData,
  goals,
  tasks
}: ModernDashboardViewProps) {

  const router = useRouter();
  const [selectedSubtopicId, setSelectedSubtopicId] = React.useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>('');

  const subtopicMeta = subtopicProgress
    .filter(subtopic => subtopic.type !== 'habit')
    .map((subtopic, index) => ({
      id: subtopic.id,
      name: subtopic.name,
      color: generateColor(index)
    }));

  // Filter categories that have at least one valid subtopic (cumulative or task with items)
  const validCategories = React.useMemo(() => {
    const validGoalIds = new Set(
      subtopicProgress
        .filter(st =>
          st.type === 'cumulative' ||
          (st.type === 'tasks' && st.totalTasks > 0)
        )
        .map(st => st.goalId)
    );
    return goals.filter(g => validGoalIds.has(g.id));
  }, [subtopicProgress, goals]);

  // Calculate displayed percent based on selection
  const displayedPercent = React.useMemo(() => {
    if (!selectedCategoryId) return overallAveragePercent;

    const relevantSubtopics = subtopicProgress.filter(st =>
      st.goalId === selectedCategoryId &&
      st.type !== 'habit' && // Ensure habits are excluded as per general rule
      (st.type === 'cumulative' || (st.type === 'tasks' && st.totalTasks > 0))
    );

    if (relevantSubtopics.length === 0) return 0;

    const totalPercent = relevantSubtopics.reduce((sum, st) => sum + st.progressPercent, 0);
    return totalPercent / relevantSubtopics.length;
  }, [selectedCategoryId, subtopicProgress, overallAveragePercent]);

  const monthYear = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const now = new Date();
  const isFutureMonth = selectedDate.getFullYear() > now.getFullYear() ||
    (selectedDate.getFullYear() === now.getFullYear() && selectedDate.getMonth() > now.getMonth());

  const isPastMonth = selectedDate.getFullYear() < now.getFullYear() ||
    (selectedDate.getFullYear() === now.getFullYear() && selectedDate.getMonth() < now.getMonth());

  const renderHeader = () => (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-0">
        {isPastMonth ? `Summary for ${monthYear}` : `Your Goals for ${monthYear}`}
      </h1>
      <div className="flex items-center space-x-4 bg-slate-800/50 p-2 rounded-lg border border-slate-700">
        <button
          onClick={() => changeMonth(-1)}
          className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-300 hover:text-white"
          aria-label="Previous month"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="text-lg font-medium text-white min-w-[140px] text-center">
          {monthYear}
        </span>
        <button
          onClick={() => changeMonth(1)}
          className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-300 hover:text-white"
          aria-label="Next month"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );

  if (isFutureMonth) {
    return (
      <div className="space-y-4 xl:space-y-6 animate-fadeIn px-4 xl:px-6">
        {renderHeader()}
        <div className="text-center p-20 rounded-lg border border-slate-800 bg-slate-900/50">
          <h2 className="text-2xl font-semibold text-slate-300">Wait for {monthYear}</h2>
          <p className="text-slate-500 mt-2">You can't track goals for the future yet.</p>
        </div>
      </div>
    );
  }

  if (isPastMonth && !hasData) {
    return (
      <div className="space-y-4 xl:space-y-6 animate-fadeIn px-4 xl:px-6">
        {renderHeader()}
        <div className="text-center p-20 rounded-lg border border-slate-800 bg-slate-900/50">
          <h2 className="text-2xl font-semibold text-slate-300">No record found</h2>
          <p className="text-slate-500 mt-2">No activity was recorded for this month.</p>
        </div>
      </div>
    );
  }

  if (subtopicProgress.length === 0) {
    return (
      <div className="space-y-4 xl:space-y-6 animate-fadeIn px-4 xl:px-6">
        {renderHeader()}
        <div className="text-center p-10 rounded-lg animate-fadeIn">
          <h2 className="text-2xl font-semibold mb-4 text-white">No categories yet!</h2>
          <p className="text-slate-400 mb-6">Get started by adding your first category and subtopic.</p>
          <button
            onClick={() => router.push('/manage')}
            className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all"
          >
            Manage Trackers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 xl:space-y-6 animate-fadeIn px-4 xl:px-6 pb-12">
      {renderHeader()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-6 mb-4 xl:mb-6">
        <div className="h-full">
          <div className="h-full bg-black rounded-lg border border-slate-700/50 p-4">
            <MonthlyProgressCard
              percent={displayedPercent}
              categories={validCategories}
              selectedCategoryId={selectedCategoryId}
              onCategoryChange={setSelectedCategoryId}
            />
          </div>
        </div>
        <div className="h-full">
          <DailyProgressLineChart
            data={dailyLineChartData}
            subtopicMeta={subtopicMeta}
            selectedSubtopicId={selectedSubtopicId}
            onSubtopicChange={setSelectedSubtopicId}
            goals={goals}
            subtopics={subtopicProgress}
          />
        </div>
      </div>

      <HabitMonthlyReportView
        subtopics={subtopicProgress}
        goals={goals}
        onLogHabit={onLogHabit}
        isCompact={true}
        isReadOnly={true}
      />

      {/* All non-habit progress cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {subtopicProgress
          .filter(st => st.type !== 'habit')
          .map(subtopic => (
            <SubtopicProgressCircle
              key={subtopic.id}
              subtopic={subtopic}
              categoryName={goals.find(g => g.id === subtopic.goalId)?.name || 'Unknown'}
            />
          ))}
      </div>


    </div>
  );
}
