import React, { useState, useEffect } from 'react';
import { getLocalDateString } from '@/lib/dateUtils';
import { CheckCircle, Circle, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { GoalIcon } from '@/components/ui/GoalIcon';

interface Goal {
    id: string;
    name: string;
    icon: string;
}

interface Subtopic {
    id: string;
    goalId: string;
    name: string;
    type: 'habit' | 'cumulative' | 'tasks';
    target?: number;
}

interface Task {
    id: string;
    subtopicId: string;
    name: string;
    completed: boolean;
    completedAt?: string;
}

interface IAdHocTask {
    id: string;
    name: string;
    completed: boolean;
}

interface DailyPlan {
    id: string;
    userId: string;
    date: string;
    taskIds: string[];
    subtopicIds: string[];
    adHocTasks?: IAdHocTask[];
    cumulativeTargets?: { subtopicId: string; target: number }[];
}

interface Log {
    id: string;
    subtopicId: string;
    date: string;
    taskId?: string;
    value: number;
}

interface DailyFocusCardProps {
    dailyPlans: DailyPlan[];
    tasks: Task[];
    subtopics: Subtopic[];
    goals: Goal[];
    dailyLogs: Log[];
    selectedDailyDate: Date;
    changeDailyDate: (offset: number) => void;
}

export function DailyFocusCard({
    dailyPlans,
    tasks,
    subtopics,
    goals,
    dailyLogs,
    selectedDailyDate,
    changeDailyDate
}: DailyFocusCardProps) {
    const todayString = getLocalDateString(selectedDailyDate);
    const planForToday = dailyPlans.find(p => p.date === todayString);

    const [formattedDate, setFormattedDate] = useState<string>('');

    useEffect(() => {
        setFormattedDate(selectedDailyDate.toLocaleDateString('default', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        }));
    }, [selectedDailyDate]); 

    const [viewMode, setViewMode] = useState<'planned' | 'overall'>('planned');

    // Determine if selected date is today
    const isToday = getLocalDateString(selectedDailyDate) === getLocalDateString(new Date());

    const { taskIds = [], subtopicIds = [], adHocTasks = [], cumulativeTargets = [] } = planForToday || {};

    // Get planned tasks
    const plannedTasks = taskIds.map(id => tasks.find(t => t.id === id)).filter(Boolean) as Task[];
    
    // Get planned cumulative subtopics
    const plannedSubtopics = subtopicIds.map(id => subtopics.find(s => s.id === id)).filter(Boolean) as Subtopic[];

    let displayTasks = [...plannedTasks];
    let displaySubtopics = [...plannedSubtopics];
    let displayAdHocTasks = [...adHocTasks];

    if (viewMode === 'overall') {
        // Only tasks completed today
        displayTasks = tasks.filter(t => {
            if (!t.completed || !t.completedAt) return false;
            const completedDateStr = getLocalDateString(new Date(t.completedAt));
            return completedDateStr === todayString;
        });

        // Only subtopics (cumulative or habit) that have logs today
        const loggedSubtopicIds = new Set(
            dailyLogs
                .filter(l => l.date === todayString)
                .map(l => l.subtopicId)
        );
        
        displaySubtopics = subtopics.filter(st => {
            if (st.type === 'tasks') return false;
            return loggedSubtopicIds.has(st.id);
        });

        // Only completed ad hoc tasks
        displayAdHocTasks = adHocTasks.filter(t => t.completed);
    }

    // Prepare table data grouped by Goal
    const tableData = goals.map(goal => {
        const goalTasks = displayTasks.filter(t => {
            const st = subtopics.find(s => s.id === t.subtopicId);
            return st && st.goalId === goal.id;
        });

        const goalSubtopics = displaySubtopics.filter(st => st.goalId === goal.id);

        return {
            goal,
            items: [...goalTasks, ...goalSubtopics],
            goalTasks,
            goalSubtopics
        };
    }).filter(row => row.items.length > 0);

    return (
        <div className="bg-white rounded-xl border-2 border-black p-4 md:p-6 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 border-b-2 border-black pb-4 mb-8">
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black flex items-center justify-center lg:justify-start gap-3 order-1 lg:order-1">
                    <Target size={28} className="text-black" /> {formattedDate ? `${formattedDate} Focus` : "Daily Focus"}
                </h3>
                
                <div className="flex items-center justify-center bg-slate-100 rounded-lg p-1 border-2 border-black text-sm w-full lg:w-fit order-3 lg:order-2 lg:ml-4 lg:mr-auto">
                    <button 
                        onClick={() => setViewMode('planned')}
                        className={`flex-1 lg:flex-none px-3 py-1 rounded font-bold transition-colors ${viewMode === 'planned' ? 'bg-black text-white' : 'text-black hover:bg-slate-200'}`}
                    >
                        PLANNED
                    </button>
                    <button 
                        onClick={() => setViewMode('overall')}
                        className={`flex-1 lg:flex-none px-3 py-1 rounded font-bold transition-colors ${viewMode === 'overall' ? 'bg-black text-white' : 'text-black hover:bg-slate-200'}`}
                    >
                        OVERALL
                    </button>
                </div>

                <div className="flex items-center justify-between lg:justify-center gap-4 bg-slate-100 p-2 rounded border-2 border-black w-full lg:w-fit order-2 lg:order-3">
                    <button 
                        onClick={() => changeDailyDate(-1)}
                        className="p-1 hover:bg-slate-300 rounded transition-colors text-black"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <span className="text-lg font-bold text-black min-w-[120px] text-center">
                        {isToday ? "Today" : formattedDate}
                    </span>
                    <button 
                        onClick={() => changeDailyDate(1)}
                        className="p-1 hover:bg-slate-300 rounded transition-colors text-black"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
            
            <div className="overflow-x-auto border-2 border-black rounded-lg">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-100 border-b-2 border-black">
                            <th className="p-4 font-black uppercase tracking-wider border-r-2 border-black w-1/4">Category</th>
                            <th className="p-4 font-black uppercase tracking-wider border-r-2 border-black w-[37.5%]">Tasks</th>
                            <th className="p-4 font-black uppercase tracking-wider w-[37.5%]">Cumulative & Habits</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.length === 0 && displayAdHocTasks.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="p-8 text-center text-slate-500 italic">
                                    {viewMode === 'planned' ? 'No plan for this day.' : 'No activity recorded for this day.'}
                                </td>
                            </tr>
                        ) : (
                            tableData.map((row, index) => (
                                <tr key={row.goal.id} className="border-b-2 border-black last:border-b-0">
                                    <td className="p-4 border-r-2 border-black align-top">
                                        <div className="font-bold text-lg flex items-center gap-2 text-slate-700">
                                            <span className="text-2xl flex items-center justify-center"><GoalIcon iconName={row.goal.icon} size={24} /></span> {row.goal.name}
                                        </div>
                                    </td>
                                    <td className="p-4 border-r-2 border-black align-top">
                                        <div className="space-y-3">
                                            {row.goalTasks.map(task => {
                                                const st = subtopics.find(s => s.id === task.subtopicId);
                                                const isCompleted = task.completed;
                                                return (
                                                    <div key={task.id} className="flex items-start gap-2">
                                                        <div className="mt-1">
                                                            {isCompleted ? (
                                                                <CheckCircle size={18} className="text-black flex-shrink-0" />
                                                            ) : (
                                                                <Circle size={18} className="text-slate-300 flex-shrink-0" />
                                                            )}
                                                        </div>
                                                        <span className={`text-base font-medium ${isCompleted ? 'line-through text-slate-400' : 'text-black'}`}>
                                                            {task.name} {st && <span className="text-xs text-slate-400 ml-1 font-normal">({st.name})</span>}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="space-y-3">
                                            {row.goalSubtopics.map(subtopic => {
                                                const logToday = dailyLogs.find(l => l.subtopicId === subtopic.id && l.date === todayString);
                                                const loggedValue = logToday ? logToday.value : 0;
                                                const hasProgress = !!logToday;
                                                const targetObj = cumulativeTargets.find(t => t.subtopicId === subtopic.id);
                                                
                                                let isCompleted = false;
                                                let progressText = "";
                                                
                                                if (subtopic.type === 'cumulative') {
                                                    const monthlyTarget = subtopic.target || 0;
                                                    
                                                    // Determine completion based on daily target if set
                                                    if (targetObj && targetObj.target > 0) {
                                                        isCompleted = loggedValue >= targetObj.target;
                                                    }
                                                    
                                                    if (viewMode === 'planned') {
                                                        if (targetObj && targetObj.target > 0) {
                                                            progressText = `${loggedValue} / ${targetObj.target}`;
                                                        } else {
                                                            progressText = `+${loggedValue}`;
                                                        }
                                                    } else {
                                                        // Overall view mode
                                                        if (monthlyTarget > 0) {
                                                            progressText = `${loggedValue} / ${monthlyTarget}`;
                                                        } else if (targetObj && targetObj.target > 0) {
                                                            progressText = `${loggedValue} / ${targetObj.target}`;
                                                        } else {
                                                            progressText = `+${loggedValue}`;
                                                        }
                                                    }
                                                } else if (subtopic.type === 'habit') {
                                                    isCompleted = hasProgress;
                                                }
                                                
                                                return (
                                                    <div key={subtopic.id} className="flex items-start gap-2">
                                                        <div className="mt-1">
                                                            {isCompleted ? (
                                                                <CheckCircle size={18} className="text-black flex-shrink-0" />
                                                            ) : (
                                                                <Circle size={18} className="text-slate-300 flex-shrink-0" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <span className={`text-base font-medium ${isCompleted ? 'line-through text-slate-400' : (hasProgress ? 'text-slate-500' : 'text-black')}`}>
                                                                {subtopic.name} <span className="text-xs text-slate-400 ml-1 font-normal">({subtopic.type === 'habit' ? 'Habit' : 'Cumulative'})</span>
                                                            </span>
                                                            {hasProgress && subtopic.type === 'cumulative' && (
                                                                <div className={`text-xs font-bold mt-1 ${isCompleted ? 'text-slate-400 line-through' : 'text-black'}`}>
                                                                    Progress Logged ({progressText})
                                                                </div>
                                                            )}
                                                            {hasProgress && subtopic.type === 'habit' && (
                                                                <div className={`text-xs font-bold mt-1 ${isCompleted ? 'text-slate-400 line-through' : 'text-black'}`}>
                                                                    Completed Today
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        
                        {displayAdHocTasks.length > 0 && (
                            <tr className="border-t-4 border-black">
                                <td className="p-4 border-r-2 border-black align-top bg-slate-50">
                                    <div className="font-bold text-lg flex items-center gap-2 text-slate-700">
                                        <span className="text-2xl">📝</span> Miscellaneous (Ad-Hoc)
                                    </div>
                                    <div className="mt-2 text-slate-400 italic text-sm">
                                        These tasks are one-offs for today and do not count toward your monthly goals.
                                    </div>
                                </td>
                                <td colSpan={2} className="p-4 align-top bg-white">
                                    <div className="space-y-3">
                                        {displayAdHocTasks.map(task => {
                                            const isCompleted = task.completed;
                                            return (
                                                <div key={task.id} className="flex items-start gap-2">
                                                    <div className="mt-1">
                                                        {isCompleted ? (
                                                            <CheckCircle size={18} className="text-black flex-shrink-0" />
                                                        ) : (
                                                            <Circle size={18} className="text-slate-300 flex-shrink-0" />
                                                        )}
                                                    </div>
                                                    <span className={`text-base font-medium ${isCompleted ? 'line-through text-slate-400' : 'text-black'}`}>
                                                        {task.name}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
