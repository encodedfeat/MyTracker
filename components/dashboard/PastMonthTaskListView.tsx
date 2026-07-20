// components/dashboard/PastMonthTaskListView.tsx
'use client';

import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface Task {
    id: string;
    subtopicId: string;
    name: string;
    completed: boolean;
}

interface Subtopic {
    id: string;
    goalId: string;
    name: string;
    type: 'habit' | 'cumulative' | 'tasks';
}

interface Goal {
    id: string;
    name: string;
    icon: string;
}

interface PastMonthTaskListViewProps {
    goals: Goal[];
    subtopics: Subtopic[];
    tasks: Task[];
    dailyLogs: any[]; // We need logs to check if a task was completed on a specific date if we were doing daily checks, but for "past month" view, usually we just show the static task list or check if it was completed *at all*? 
    // Wait, the user said "list of tasks for november was...". 
    // If tasks are one-off (not daily), then we just show the task state.
    // If tasks are daily recurring (which they seem to be based on the data model having logs for tasks), we might need to know *which* tasks were done. 
    // However, the current data model has `tasks` as static items, and `logs` track their completion if they are daily.
    // But `subtopic.type === 'tasks'` usually implies a checklist. 
    // Let's assume for now we just list the tasks and their current completion status, OR if we need to show what was done in that month.
    // Given the user request "list of tasks for november was...", it implies a record.
    // But `tasks` table is just a list of task definitions. `logs` contains `taskId`.
    // If I look at `GoalContext`, `handleToggleTask` updates the `completed` status on the task itself. This implies tasks are ONE-OFF, not daily recurring like habits.
    // BUT `dailyLineChartData` calculates "tasksCompletedToday".
    // Let's look at `GoalContext` again.
    // `handleToggleTask` updates `Task.completed`.
    // `dailyLineChartData` checks `dailyLogs` for `taskId`.
    // This is ambiguous. Is a task a one-off thing or a daily thing?
    // `handleToggleTask` sends PUT to `/api/tasks/${taskId}` with `completed`.
    // `handleAddTask` creates a task.
    // `dailyLineChartData` uses `dailyLogs.find(l => l.taskId === t.id && l.date === currentDateString)`.
    // This suggests tasks CAN be logged daily.
    // BUT `handleToggleTask` updates the `Task` object directly?
    // Let's check `handleToggleTask` in `GoalContext` again.
    // It updates `tasks` state.
    // Wait, `dailyLineChartData` uses `dailyLogs`.
    // Does `handleToggleTask` ALSO create a log?
    // I need to check `handleToggleTask` implementation in `GoalContext` carefully.
}

// Re-reading GoalContext.tsx from previous turns...
// handleToggleTask:
// const response = await fetch(`/api/tasks/${taskId}`, ... body: { completed: !currentStatus }
// It updates the TASK definition.
// It does NOT seem to create a log in `handleToggleTask`.
// However, `dailyLineChartData` does this:
// const tasksCompletedToday = tasks.filter(task => { const taskLog = dailyLogs.find(...); return taskLog !== undefined; });
// This implies `dailyLogs` SHOULD contain task logs.
// But `handleToggleTask` doesn't seem to call `handleAddLog`.
// Maybe I missed something.
// Let's check `GoalContext.tsx` again.

// If tasks are just one-off, then "tasks for November" might just mean "tasks that existed/were completed in November".
// But if the user wants a report, they probably want to see what was achieved.
// Let's stick to listing the tasks grouped by category as requested.
// "heading {Your Categories} subheading {tasks} under that {task name ex dbms} and then {content in bullets}"

export function PastMonthTaskListView({ goals, subtopics, tasks }: PastMonthTaskListViewProps) {
    // Filter out subtopics that are NOT of type 'tasks'
    const taskSubtopics = subtopics.filter(st => st.type === 'tasks');

    if (taskSubtopics.length === 0) {
        return null;
    }

    return (
        <div className="mt-12 animate-fadeIn">
            <h2 className="text-3xl font-bold text-black mb-8 border-b border-black pb-4">
                Your Categories
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {goals.map(goal => {
                    const goalSubtopics = taskSubtopics.filter(st => st.goalId === goal.id);

                    if (goalSubtopics.length === 0) return null;

                    return (
                        <div key={goal.id} className="bg-white/40 backdrop-blur-md rounded-xl p-6 border border-white/60 shadow-lg">
                            <div className="flex items-center space-x-3 mb-6">
                                <span className="text-2xl">{goal.icon}</span>
                                <h3 className="text-xl font-semibold text-black">{goal.name}</h3>
                            </div>

                            <div className="space-y-6">
                                {goalSubtopics.map(subtopic => {
                                    const subtopicTasks = tasks.filter(t => t.subtopicId === subtopic.id);

                                    if (subtopicTasks.length === 0) return null;

                                    return (
                                        <div key={subtopic.id} className=" rounded-lg p-4">
                                            <h4 className="text-black font-bold font-medium mb-3 uppercase text-sm tracking-wider">
                                                {subtopic.name}
                                            </h4>
                                            <ul className="space-y-2">
                                                {subtopicTasks.map(task => (
                                                    <li key={task.id} className="flex items-start space-x-2 text-slate-800">
                                                        <span className="mt-1.5 w-1.5 h-1.5 bg-slate-500 rounded-full flex-shrink-0" />
                                                        <span className={task.completed ? "line-through text-slate-500" : ""}>
                                                            {task.name}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}



