import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Calendar as CalendarIcon, HelpCircle, Check, X } from 'lucide-react';
import { GoalIcon } from '@/components/ui/GoalIcon';
import { getLocalDateString } from '@/lib/dateUtils';

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
}

interface Task {
    id: string;
    subtopicId: string;
    name: string;
    completed: boolean;
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
    adHocTasks: IAdHocTask[];
    cumulativeTargets?: { subtopicId: string; target: number }[];
}

interface ManageDailyPlanProps {
    goals: Goal[];
    subtopics: Subtopic[];
    tasks: Task[];
    dailyPlans: DailyPlan[];
    dailyLogs?: { subtopicId: string; date: string; value: number }[];
    selectedDailyDate: Date;
    changeDailyDate: (offset: number) => void;
    saveDailyPlan: (dateString: string, taskIds: string[], subtopicIds: string[], adHocTasks: IAdHocTask[], cumulativeTargets: { subtopicId: string; target: number }[]) => Promise<void>;
    toggleAdHocTask: (dateString: string, taskId: string, currentStatus: boolean) => Promise<void>;
    isReadOnly: boolean;
}

export function ManageDailyPlan({
    goals,
    subtopics,
    tasks,
    dailyPlans,
    dailyLogs = [],
    selectedDailyDate,
    changeDailyDate,
    saveDailyPlan,
    toggleAdHocTask,
    isReadOnly
}: ManageDailyPlanProps) {
    const dateString = getLocalDateString(selectedDailyDate);
    const planForDate = dailyPlans.find(p => p.date === dateString);
    const todayString = getLocalDateString(new Date());
    const isFuture = dateString > todayString;
    const isPast = dateString < todayString;
    const isNotToday = isFuture || isPast;

    const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
    const [selectedSubtopicIds, setSelectedSubtopicIds] = useState<string[]>([]);
    const [adHocTasks, setAdHocTasks] = useState<IAdHocTask[]>([]);
    const [cumulativeTargets, setCumulativeTargets] = useState<{subtopicId: string, target: number}[]>([]);
    
    const [isSaving, setIsSaving] = useState(false);
    const [isEditMode, setIsEditMode] = useState(true);
    const [formattedDate, setFormattedDate] = useState<string>('');
    const [newAdHocTaskName, setNewAdHocTaskName] = useState('');

    useEffect(() => {
        setFormattedDate(selectedDailyDate.toLocaleDateString('default', {
            weekday: 'short',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }));
    }, [selectedDailyDate]);

    useEffect(() => {
        if (planForDate && (planForDate.taskIds.length > 0 || planForDate.subtopicIds.length > 0 || (planForDate.adHocTasks && planForDate.adHocTasks.length > 0))) {
            setSelectedTaskIds(planForDate.taskIds || []);
            setSelectedSubtopicIds(planForDate.subtopicIds || []);
            setAdHocTasks(planForDate.adHocTasks || []);
            setCumulativeTargets(planForDate.cumulativeTargets || []);
            setIsEditMode(false); // Default to clean view if plan exists
        } else {
            setSelectedTaskIds([]);
            setSelectedSubtopicIds([]);
            setAdHocTasks([]);
            setCumulativeTargets([]);
            setIsEditMode(true); // Default to edit view if no plan
        }
    }, [planForDate, dateString]);

    const handleSave = async () => {
        setIsSaving(true);
        await saveDailyPlan(dateString, selectedTaskIds, selectedSubtopicIds, adHocTasks, cumulativeTargets);
        setIsSaving(false);
        setIsEditMode(false); // Switch to clean view after saving
    };

    const handleCancel = () => {
        if (planForDate) {
            setSelectedTaskIds(planForDate.taskIds || []);
            setSelectedSubtopicIds(planForDate.subtopicIds || []);
            setAdHocTasks(planForDate.adHocTasks || []);
            setCumulativeTargets(planForDate.cumulativeTargets || []);
        } else {
            setSelectedTaskIds([]);
            setSelectedSubtopicIds([]);
            setAdHocTasks([]);
            setCumulativeTargets([]);
        }
        setIsEditMode(false);
    };

    const toggleTask = (taskId: string) => {
        setSelectedTaskIds(prev =>
            prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
        );
    };

    const toggleSubtopic = (subtopicId: string) => {
        setSelectedSubtopicIds(prev =>
            prev.includes(subtopicId) ? prev.filter(id => id !== subtopicId) : [...prev, subtopicId]
        );
    };

    const handleTargetChange = (subtopicId: string, value: string) => {
        const target = parseInt(value, 10);
        if (isNaN(target) || target < 0) return;
        
        setCumulativeTargets(prev => {
            const existing = prev.findIndex(t => t.subtopicId === subtopicId);
            if (existing >= 0) {
                const next = [...prev];
                next[existing] = { subtopicId, target };
                return next;
            } else {
                return [...prev, { subtopicId, target }];
            }
        });
    };

    const handleAddAdHocTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAdHocTaskName.trim()) return;
        
        window.alert('Disclaimer: This task will not update any progress in your monthly progress.');
        
        const newTask: IAdHocTask = {
            id: 'ad-hoc-' + Date.now(),
            name: newAdHocTaskName.trim(),
            completed: false
        };
        
        setAdHocTasks(prev => [...prev, newTask]);
        setNewAdHocTaskName('');
    };

    const removeAdHocTask = (taskId: string) => {
        setAdHocTasks(prev => prev.filter(t => t.id !== taskId));
    };

    // Filter items based on mode
    const effectiveIsEditMode = isEditMode && !isPast && !isFuture;

    const availableTasks = effectiveIsEditMode
        ? tasks.filter(t => !t.completed || selectedTaskIds.includes(t.id))
        : tasks.filter(t => selectedTaskIds.includes(t.id));

    const availableCumulative = effectiveIsEditMode
        ? subtopics.filter(s => s.type === 'cumulative')
        : subtopics.filter(s => s.type === 'cumulative' && selectedSubtopicIds.includes(s.id));

    // Prepare table data grouped by Goal
    const tableData = goals.map(goal => {
        const goalTasks = availableTasks.filter(t => {
            const st = subtopics.find(s => s.id === t.subtopicId);
            return st && st.goalId === goal.id;
        });

        const goalSubtopics = availableCumulative.filter(st => st.goalId === goal.id);

        return {
            goal,
            items: [...goalTasks, ...goalSubtopics],
            goalTasks,
            goalSubtopics
        };
    }).filter(row => row.items.length > 0);

    return (
        <div className="bg-white rounded-lg border-2 border-black p-4 md:p-6 relative">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b-2 border-black pb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black uppercase tracking-tight">Daily Plan</h2>
                    <div className="relative group cursor-help outline-none flex items-center" tabIndex={0}>
                        <HelpCircle size={24} className="text-slate-400 group-hover:text-black transition-colors" />
                        
                        {/* Tooltip */}
                        <div className="absolute left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 top-full mt-2 w-64 md:w-72 p-3 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none z-10 shadow-[4px_4px_0_0_#000] border-2 border-white font-medium text-center md:text-left">
                            Select the specific tasks and cumulative targets you commit to completing today. This builds your Daily Focus plan on the Dashboard!
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:gap-4 bg-slate-100 p-2 rounded border-2 border-black">
                    <button
                        onClick={() => changeDailyDate(-1)}
                        className="p-1 hover:bg-slate-300 rounded transition-colors text-black flex-shrink-0"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <span className="text-base sm:text-lg font-bold text-black min-w-[130px] sm:min-w-[160px] text-center truncate">
                        {formattedDate || 'Loading...'}
                    </span>
                    <button
                        onClick={() => changeDailyDate(1)}
                        className="p-1 hover:bg-slate-300 rounded transition-colors text-black flex-shrink-0"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            {isFuture ? (
                <div className="p-8 md:p-12 text-center border-2 border-black rounded-lg bg-slate-50 shadow-[4px_4px_0_0_#000]">
                    <div className="inline-flex justify-center items-center w-16 h-16 bg-slate-200 rounded-full mb-4 border-2 border-black">
                        <CalendarIcon size={32} className="text-slate-600" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-wider mb-2">Wait for future dates</h3>
                    <p className="text-slate-600 font-medium max-w-md mx-auto">
                        Cannot create or edit plans for future dates. Only today's plan can be modified.
                    </p>
                </div>
            ) : isPast && tableData.length === 0 && adHocTasks.length === 0 ? (
                <div className="p-8 md:p-12 text-center border-2 border-black rounded-lg bg-slate-50 shadow-[4px_4px_0_0_#000]">
                    <div className="inline-flex justify-center items-center w-16 h-16 bg-slate-200 rounded-full mb-4 border-2 border-black">
                        <CalendarIcon size={32} className="text-slate-600" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-wider mb-2">No Plan Created</h3>
                    <p className="text-slate-600 font-medium max-w-md mx-auto">
                        You didn't plan anything for this day.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {effectiveIsEditMode && (
                        <div className="bg-slate-100 border border-slate-300 text-slate-800 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
                            <span className="text-xl">💡</span>
                            Select the specific tasks and cumulative targets you want to complete today. You can also add one-off tasks in the Ad-Hoc section below.
                        </div>
                    )}
                    <div className="overflow-x-auto border-2 border-black rounded-lg">
                        <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-100 border-b-2 border-black">
                            <th className="p-4 font-black uppercase tracking-wider border-r-2 border-black w-1/4">Category</th>
                            <th className="p-4 font-black uppercase tracking-wider border-r-2 border-black w-[37.5%]">Tasks</th>
                            <th className="p-4 font-black uppercase tracking-wider w-[37.5%]">Cumulative</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.length === 0 && adHocTasks.length === 0 && !isEditMode ? (
                            <tr>
                                <td colSpan={3} className="p-8 text-center text-slate-500 italic">No plan for this day.</td>
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
                                                return (
                                                    <label key={task.id} className={`flex items-start space-x-3 group ${effectiveIsEditMode && !isReadOnly ? 'cursor-pointer' : ''}`}>
                                                        {effectiveIsEditMode ? (
                                                            <div className="relative flex flex-shrink-0 items-center justify-center mt-1">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedTaskIds.includes(task.id)}
                                                                    onChange={() => toggleTask(task.id)}
                                                                    disabled={isReadOnly}
                                                                    className="peer appearance-none w-5 h-5 border-2 border-black rounded-sm checked:bg-black transition-colors cursor-pointer disabled:opacity-50"
                                                                />
                                                                <span className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none text-xs">
                                                                    ✓
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            isPast ? (
                                                                <div className="relative flex flex-shrink-0 items-center justify-center mt-1">
                                                                    {task.completed ? (
                                                                        <Check size={20} className="text-black" />
                                                                    ) : (
                                                                        <X size={20} className="text-slate-300" />
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-black mt-2 self-start"></div>
                                                            )
                                                        )}
                                                        <span className={`text-base font-medium ${effectiveIsEditMode ? 'group-hover:text-blue-600' : ''} transition-colors ${task.completed ? 'line-through text-slate-400' : 'text-black'}`}>
                                                            {task.name} {st && <span className="text-xs text-slate-400 ml-2 font-normal">({st.name})</span>}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="space-y-3">
                                            {row.goalSubtopics.map(st => {
                                                const isSelected = selectedSubtopicIds.includes(st.id);
                                                const targetObj = cumulativeTargets.find(t => t.subtopicId === st.id);
                                                const progressForToday = dailyLogs.filter(log => log.subtopicId === st.id && log.date === dateString).reduce((sum, log) => sum + log.value, 0);
                                                const isCompleted = targetObj && targetObj.target > 0 && progressForToday >= targetObj.target;
                                                
                                                return (
                                                <div key={st.id} className="flex flex-col gap-2">
                                                    <label className={`flex items-start space-x-3 group ${effectiveIsEditMode && !isReadOnly ? 'cursor-pointer' : ''}`}>
                                                        {effectiveIsEditMode ? (
                                                            <div className="relative flex flex-shrink-0 items-center justify-center mt-1">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isSelected}
                                                                    onChange={() => toggleSubtopic(st.id)}
                                                                    disabled={isReadOnly}
                                                                    className="peer appearance-none w-5 h-5 border-2 border-black rounded-sm checked:bg-black transition-colors cursor-pointer disabled:opacity-50"
                                                                />
                                                                <span className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none text-xs">
                                                                    ✓
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-black mt-2 self-start"></div>
                                                        )}
                                                        <span className={`text-base font-medium transition-colors ${effectiveIsEditMode ? 'group-hover:text-blue-600' : ''} ${isCompleted && !effectiveIsEditMode ? 'line-through text-slate-400' : 'text-black'}`}>
                                                            {st.name} <span className="text-xs text-slate-400 ml-2 font-normal">(Cumulative)</span>
                                                        </span>
                                                    </label>
                                                    {isSelected && effectiveIsEditMode && !isReadOnly && (
                                                        <div className="ml-8 flex items-center gap-2">
                                                            <span className="text-sm font-medium text-slate-600">Daily Target:</span>
                                                            <input 
                                                                type="number" 
                                                                min="0"
                                                                value={targetObj?.target || ''}
                                                                onChange={(e) => handleTargetChange(st.id, e.target.value)}
                                                                className="w-24 border-2 border-black rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
                                                                placeholder="e.g. 10"
                                                            />
                                                        </div>
                                                    )}
                                                    {isSelected && !effectiveIsEditMode && targetObj && targetObj.target > 0 && (
                                                        <div className="ml-5 text-sm font-bold text-slate-500">
                                                            Target: {targetObj.target}
                                                        </div>
                                                    )}
                                                </div>
                                                );
                                            })}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        
                        {/* Miscellaneous / Ad-Hoc Row */}
                        {(adHocTasks.length > 0 || effectiveIsEditMode) && (
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
                                        {adHocTasks.map(task => (
                                            <div key={task.id} className="flex items-start justify-between group">
                                                <label className={`flex items-start space-x-3 flex-1 ${!effectiveIsEditMode && !isReadOnly && !isNotToday ? 'cursor-pointer' : ''}`}>
                                                    {/* In Clean View for Today, these CAN be checked/unchecked */}
                                                    {isPast && !effectiveIsEditMode ? (
                                                        <div className="relative flex flex-shrink-0 items-center justify-center mt-1">
                                                            {task.completed ? (
                                                                <Check size={20} className="text-black" />
                                                            ) : (
                                                                <X size={20} className="text-slate-300" />
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="relative flex flex-shrink-0 items-center justify-center mt-1">
                                                            <input
                                                                type="checkbox"
                                                                checked={task.completed}
                                                                onChange={() => {
                                                                    if (!effectiveIsEditMode && !isReadOnly && !isNotToday) {
                                                                        toggleAdHocTask(dateString, task.id, task.completed);
                                                                    }
                                                                }}
                                                                disabled={effectiveIsEditMode || isReadOnly || isNotToday}
                                                                className="peer appearance-none w-5 h-5 border-2 border-black rounded-sm checked:bg-black transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                            />
                                                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none text-xs">
                                                                ✓
                                                            </span>
                                                        </div>
                                                    )}
                                                    <span className={`text-base font-medium transition-colors ${task.completed ? 'line-through text-slate-400' : 'text-black'}`}>
                                                        {task.name}
                                                    </span>
                                                </label>
                                                
                                                {effectiveIsEditMode && !isReadOnly && (
                                                    <button 
                                                        onClick={() => removeAdHocTask(task.id)}
                                                        className="text-slate-400 hover:text-red-500 transition-colors ml-2"
                                                        title="Remove task"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                        {effectiveIsEditMode && !isReadOnly && (
                                            <form onSubmit={handleAddAdHocTask} className="mt-4 flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newAdHocTaskName}
                                                    onChange={(e) => setNewAdHocTaskName(e.target.value)}
                                                    placeholder="Add an ad-hoc task..."
                                                    className="flex-1 border-2 border-slate-300 rounded p-2 text-sm focus:border-black focus:outline-none transition-colors"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={!newAdHocTaskName.trim()}
                                                    className="bg-black text-white p-2 rounded disabled:opacity-50 hover:bg-slate-800 transition-colors"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        )}

            {!isReadOnly && !isNotToday && (
                <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between pt-4 gap-6">
                    {!isEditMode && (
                        <div className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded border border-slate-200 flex-1">
                            <strong>Note:</strong> To complete a monthly planned task or log progress for a cumulative goal, please use their respective <strong>Tasks</strong> or <strong>Cumulative</strong> tabs above. Your daily plan and dashboard will update automatically! You can check/uncheck your Ad-Hoc tasks directly here.
                        </div>
                    )}
                    
                    <div className="flex justify-end gap-4 w-full md:w-auto flex-shrink-0 ml-auto">
                        {isEditMode ? (
                            <>
                                {planForDate && (planForDate.taskIds.length > 0 || planForDate.subtopicIds.length > 0 || (planForDate.adHocTasks && planForDate.adHocTasks.length > 0)) && (
                                    <button
                                        onClick={handleCancel}
                                        className="px-6 py-2 border-2 border-black font-bold uppercase tracking-wider text-black bg-white hover:bg-slate-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="button-89 text-lg"
                                    style={{ '--color': '#000000', color: 'white', backgroundColor: 'black' } as React.CSSProperties}
                                >
                                    {isSaving ? 'SAVING...' : 'SAVE DAILY PLAN'}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditMode(true)}
                                className="px-8 py-2 border-2 border-black font-bold uppercase tracking-wider text-white bg-black hover:bg-slate-800 transition-colors shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none flex-shrink-0"
                            >
                                EDIT PLAN
                            </button>
                        )}
                    </div>
                </div>
            )}
            
            {!isReadOnly && isNotToday && (
                <div className="mt-8 text-center text-slate-500 italic p-6 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                    Cannot create or edit plans for past or future dates. Only today's plan can be modified.
                </div>
            )}
        </div>
    );
}
