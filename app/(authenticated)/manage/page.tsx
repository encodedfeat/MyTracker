'use client';

import { useState } from 'react';
import { useGoalTracker } from '@/context/GoalContext';
import { ManageGoals } from '@/components/manage/ManageGoals';
import { ManageSubtopics } from '@/components/manage/ManageSubtopics';
import { ManageTasks } from '@/components/manage/ManageTasks';
import { LogProgressView } from '@/components/log/LogProgressView';
import { HabitMonthlyReportView } from '@/components/dashboard/HabitMonthlyReportView';
import { RecentLogsView } from '@/components/log/RecentLogsView';

type TabType = 'categories' | 'subtopics' | 'habits' | 'tasks' | 'log' | 'recentLogs';

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
        { id: 'categories' as TabType, label: 'Categories' },
        { id: 'subtopics' as TabType, label: 'Subtopics' },
        { id: 'tasks' as TabType, label: 'Tasks' },
        { id: 'habits' as TabType, label: 'Habits' },
        { id: 'log' as TabType, label: 'Cumulative' },
        { id: 'recentLogs' as TabType, label: 'Recent Logs' }
    ];

    return (
        <div className="min-h-screen relative">
            {/* Background Image */}
            <div
                className="fixed inset-0 z-0 opacity-20 backdrop-blur-sm pointer-events-none"
                style={{
                    backgroundColor: 'transparent',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            />

            <div className="relative z-10 p-6 max-w-[1800px] mx-auto">
                {/* Tab Navigation */}
                <div className="mb-8 border-b-2 border-black">
                    <div className="flex space-x-1 overflow-x-auto pb-0 w-full">
                        {tabs.map(tab => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 relative px-2 py-3 md:px-4 md:py-4 font-black uppercase tracking-wider text-xs md:text-sm transition-all duration-300 whitespace-nowrap border-t-2 border-x-2 rounded-t-lg ${isActive
                                        ? 'text-black bg-white border-black border-4 shadow-[4px_4px_0_0_#000]'
                                        : 'text-black bg-white border-slate-300 hover:bg-slate-100'
                                        }`}
                                >
                                    {tab.label}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                    )}
                                </button>
                            );
                        })}
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

                    {activeTab === 'recentLogs' && (
                        <RecentLogsView
                            subtopics={subtopics}
                            dailyLogs={dailyLogs}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}



