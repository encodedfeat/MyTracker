'use client';

import { useState } from 'react';
import { useGoalTracker } from '@/context/GoalContext';
import { ManageGoals } from '@/components/manage/ManageGoals';
import { ManageSubtopics } from '@/components/manage/ManageSubtopics';
import { ManageTasks } from '@/components/manage/ManageTasks';
import { LogProgressView } from '@/components/log/LogProgressView';
import { HabitMonthlyReportView } from '@/components/dashboard/HabitMonthlyReportView';

type TabType = 'categories' | 'subtopics' | 'habits' | 'tasks' | 'log';

export default function ManagePage() {
  const [activeTab, setActiveTab] = useState<TabType>('categories');

  const {
    goals,
    subtopics,
    tasks,
    addGoal,
    deleteGoal,
    updateGoal,
    addSubtopic,
    updateSubtopic,
    deleteSubtopic,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    addLog,
    deleteLog,
    dailyLogs,
    isReadOnly,
    logHabit,
    subtopicProgress,
    isFuture
  } = useGoalTracker();

  // Filter task-type subtopics
  const taskSubtopics = subtopics.filter(st => st.type === 'tasks');

  const tabs = [
    { id: 'categories' as TabType, label: 'Manage Categories' },
    { id: 'subtopics' as TabType, label: 'Manage Subtopics' },
    { id: 'habits' as TabType, label: 'Monthly Habit' },
    { id: 'tasks' as TabType, label: 'Manage Task Content' },
    { id: 'log' as TabType, label: 'Log Your Cumulative' }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "url('/assist/guide/background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      <div className="relative z-10 p-6 max-w-[1800px] mx-auto">
        {/* Tab Navigation */}
        <div className="mb-8 border-b border-slate-800/50">
          <div className="flex space-x-2 overflow-x-auto pb-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3 rounded-t-xl font-medium whitespace-nowrap transition-all duration-300 ${activeTab === tab.id
                  ? 'text-white bg-gradient-to-b from-slate-800 to-slate-900/50 border-t border-x border-slate-700/50 shadow-[0_-4px_20px_rgba(79,70,229,0.1)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                  }`}
              >
                <span className="relative z-10">{tab.label}</span>

                {/* Active Glow Bar */}
                {activeTab === tab.id && (
                  <>
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-t-xl" />
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'categories' && (
            <ManageGoals
              goals={goals}
              onAddGoal={addGoal}
              onDeleteGoal={deleteGoal}
              onUpdateGoal={updateGoal}
              isReadOnly={isReadOnly}
            />
          )}

          {activeTab === 'subtopics' && (
            <ManageSubtopics
              goals={goals}
              subtopics={subtopics}
              onAddSubtopic={addSubtopic}
              onUpdateSubtopic={updateSubtopic}
              onDeleteSubtopic={deleteSubtopic}
              isReadOnly={isReadOnly}
            />
          )}

          {activeTab === 'habits' && (
            <HabitMonthlyReportView
              subtopics={subtopicProgress}
              goals={goals}
              onLogHabit={logHabit}
              isCompact={false}
              isReadOnly={isReadOnly}
            />
          )}

          {activeTab === 'tasks' && (
            <ManageTasks
              goals={goals}
              subtopics={taskSubtopics}
              tasks={tasks}
              onAddTask={addTask}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              onEditTask={updateTask}
              isReadOnly={isReadOnly}
              isFuture={isFuture}
            />
          )}

          {activeTab === 'log' && (
            <LogProgressView
              subtopics={subtopics}
              goals={goals}
              onAddLog={addLog}
              onDeleteLog={deleteLog}
              dailyLogs={dailyLogs}
              isReadOnly={isReadOnly}
              isFuture={isFuture}
            />
          )}
        </div>
      </div>
    </div>
  );
}