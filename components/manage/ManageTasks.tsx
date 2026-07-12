'use client';

import React, { useState, useEffect } from 'react';
import { Check, Trash2, Pencil, X, Lock, HelpCircle } from 'lucide-react';
import { BrutalistSelect } from '@/components/ui/BrutalistSelect';

// Define the types this component needs
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
  completedAt?: string;
}

interface Goal {
  id: string;
  name: string;
}

interface ManageTasksProps {
  goals: Goal[];
  subtopics: Subtopic[];
  tasks: Task[];
  onAddTask: (subtopicId: string, taskName: string) => Promise<void>;
  onToggleTask: (taskId: string, currentStatus: boolean) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onEditTask: (taskId: string, newName: string) => Promise<void>;
  isReadOnly: boolean;
  isFuture?: boolean;
}

export function ManageTasks({
  goals,
  subtopics,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  isReadOnly,
  isFuture
}: ManageTasksProps) {

  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [taskInputs, setTaskInputs] = useState<{ [key: string]: string }>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Initialize selectedGoalId with the first goal if available
  useEffect(() => {
    if (goals.length > 0 && !selectedGoalId) {
      setSelectedGoalId(goals[0].id);
    }
  }, [goals, selectedGoalId]);

  // Filter subtopics based on selected goal
  const filteredSubtopics = subtopics.filter(s => s.goalId === selectedGoalId);

  const handleInputChange = (subtopicId: string, value: string) => {
    setTaskInputs(prev => ({ ...prev, [subtopicId]: value }));
  };

  const handleAddTask = async (subtopicId: string) => {
    const value = taskInputs[subtopicId]?.trim();
    if (!value) return;

    // Support multiple lines
    const lines = value.split('\n').filter(line => line.trim());

    // Check for duplicates
    const existingTasks = tasks.filter(t => t.subtopicId === subtopicId);
    const duplicates = lines.filter(line => existingTasks.some(t => t.name.toLowerCase() === line.toLowerCase()));

    if (duplicates.length > 0) {
      alert(`The following tasks already exist: ${duplicates.join(', ')}`);
      return;
    }

    for (const line of lines) {
      await onAddTask(subtopicId, line.trim());
    }

    setTaskInputs(prev => ({ ...prev, [subtopicId]: '' }));
  };

  const handleToggleTask = (task: Task) => {
    if (isReadOnly) return;

    if (isFuture) {
      alert('You cannot complete tasks in the future.');
      return;
    }

    // Locking Logic: Prevent unmarking if completed on a previous day
    if (task.completed && task.completedAt) {
      const completedDate = new Date(task.completedAt);
      const today = new Date();

      // Reset hours to compare only dates
      completedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      // If completed date is strictly before today, it's locked
      if (completedDate.getTime() < today.getTime()) {
        alert('This task was completed on a previous day and cannot be unchecked.');
        return;
      }
    }

    onToggleTask(task.id, task.completed);
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditValue(task.name);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditValue('');
  };

  const saveEdit = async (taskId: string) => {
    const trimmedValue = editValue.trim();
    if (!trimmedValue) return;

    // Find the task to get its subtopicId
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Check for duplicates (excluding the current task)
    const isDuplicate = tasks.some(t =>
      t.subtopicId === task.subtopicId &&
      t.id !== taskId &&
      t.name.toLowerCase() === trimmedValue.toLowerCase()
    );

    if (isDuplicate) {
      alert('A task with this name already exists in this category.');
      return;
    }

    await onEditTask(taskId, trimmedValue);
    setEditingTaskId(null);
    setEditValue('');
  };

  const formatCompletedAt = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  // Get selected goal name
  const selectedGoal = goals.find(g => g.id === selectedGoalId);

  return (
    <div className="space-y-12">
      <div
        className="relative overflow-hidden rounded-3xl border border-slate-300/50 shadow-2xl"
        style={{
          backgroundColor: '#ffffff',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Brushed Metal Effect Overlay */}
        <div className="absolute inset-0  pointer-events-none" />

        <div className="relative p-4 md:p-12">
          <div className="flex flex-wrap items-center justify-center mb-10 gap-3">
            <h2 className="text-3xl font-bold text-black tracking-tight">Manage Task Content</h2>
            <div className="relative group cursor-help outline-none flex items-center" tabIndex={0}>
              <HelpCircle size={24} className="text-slate-400 group-hover:text-black transition-colors" />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 md:w-72 p-3 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none z-20 shadow-[4px_4px_0_0_#000] border-2 border-white font-medium text-center">
                Add and manage individual tasks under your specific task lists.
              </div>
            </div>
            {isReadOnly && (
              <span className="ml-4 bg-amber-500/20 text-amber-500 text-xs font-bold px-2 py-1 rounded border border-amber-500/50">
                READ ONLY
              </span>
            )}
          </div>

          <div className="space-y-6">
            {/* Category Selection Dropdown */}
            <h3 className="text-lg font-bold text-black mb-2">Select Category</h3>
            <div className="max-w-xs">
              <BrutalistSelect
                value={selectedGoalId}
                onChange={(value) => setSelectedGoalId(value)}
                options={goals.map(goal => ({
                  value: goal.id,
                  label: goal.name
                }))}
                placeholder="-- Select Category --"
              />
            </div>

            {/* Task List for Selected Category */}
            {selectedGoalId && (
              <div>
                <h3 className="text-lg font-bold text-black mb-4 flex items-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>
                  Category: {selectedGoal?.name}
                </h3>

                <div
                  className="hidden md:block relative overflow-hidden border border-black rounded-lg"
                  style={{
                    backgroundColor: '#fefefe',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  <div className="absolute inset-0  pointer-events-none" />
                  <div className="relative z-10 p-0">
                    <table className="w-full border-collapse">
                      <tbody className="divide-y-2 divide-slate-200">
                        {filteredSubtopics.length > 0 ? (
                          filteredSubtopics.map(subtopic => {
                            const subtopicTasks = tasks.filter(t => t.subtopicId === subtopic.id);

                            return (
                              <tr key={subtopic.id} className="group border-b-2 border-slate-200 last:border-b-0">
                                <td className="py-6 pl-6 pr-4 w-1/4 align-top border-r-2 border-slate-200  backdrop-blur-sm">
                                  <span className="text-lg font-black text-black uppercase tracking-wider">{subtopic.name}</span>
                                </td>
                                <td className="p-4 align-top ">
                                  <div className="space-y-3">
                                    {/* Task List */}
                                    {subtopicTasks.map(task => {
                                      const isLocked = task.completed && task.completedAt && new Date(task.completedAt).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

                                      return (
                                        <div
                                          key={task.id}
                                          className="flex items-start justify-between group/task border-2 border-slate-200 rounded-lg p-3 hover:border-white transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.4)] overflow-hidden relative"
                                          style={{
                                            backgroundColor: '#fefefe',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat'
                                          }}
                                        >
                                          <div className="absolute inset-0  backdrop-blur-[1px]" />
                                          <div className="relative z-10 flex items-start justify-between w-full">
                                            <div className="flex items-start space-x-4 flex-1">
                                              {/* Heart Checkbox */}
                                              <div className="heart-checkbox-container mt-0.5" title={task.completed ? "Completed" : "Mark as complete"}>
                                                <input
                                                  type="checkbox"
                                                  className="checkbox"
                                                  checked={task.completed}
                                                  onChange={() => handleToggleTask(task)}
                                                  disabled={isReadOnly || isFuture || !!isLocked}
                                                />
                                                <div className="svg-container">
                                                  <svg viewBox="0 0 24 24" className="svg-outline" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z">
                                                    </path>
                                                  </svg>
                                                  <svg viewBox="0 0 24 24" className="svg-filled" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z">
                                                    </path>
                                                  </svg>
                                                  <svg className="svg-celebrate" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                                                    <polygon points="10,10 20,20"></polygon>
                                                    <polygon points="10,50 20,50"></polygon>
                                                    <polygon points="20,80 30,70"></polygon>
                                                    <polygon points="90,10 80,20"></polygon>
                                                    <polygon points="90,50 80,50"></polygon>
                                                    <polygon points="80,80 70,70"></polygon>
                                                  </svg>
                                                </div>
                                              </div>

                                              <div className="flex flex-col flex-1 pt-1">
                                                {editingTaskId === task.id ? (
                                                  <div className="flex items-center space-x-2">
                                                    <div className="flex-1 brutal-input-container">
                                                      <input
                                                        type="text"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onKeyDown={(e) => {
                                                          if (e.key === 'Enter') saveEdit(task.id);
                                                          if (e.key === 'Escape') cancelEditing();
                                                        }}
                                                        className="brutal-input h-[40px] px-3 py-1 text-sm bg-slate-50 text-black"
                                                        autoFocus
                                                      />
                                                    </div>
                                                    <button onClick={() => saveEdit(task.id)} className="text-green-500 hover:text-green-400">
                                                      <Check size={16} />
                                                    </button>
                                                    <button onClick={cancelEditing} className="text-red-500 hover:text-red-400">
                                                      <X size={16} />
                                                    </button>
                                                  </div>
                                                ) : (
                                                  <>
                                                    <span className={`text-sm font-medium ${task.completed ? 'text-slate-500 line-through decoration-2 decoration-slate-500' : 'text-black'}`}>
                                                      {task.name}
                                                    </span>
                                                    {task.completed && task.completedAt && (
                                                      <span className="text-[10px] text-slate-700 font-mono mt-1 block">
                                                        Completed: {formatCompletedAt(task.completedAt)}
                                                      </span>
                                                    )}
                                                  </>
                                                )}
                                              </div>
                                            </div>

                                            {!isReadOnly && !editingTaskId && (
                                              <div className="flex items-center space-x-2 opacity-100 md:opacity-0 md:group-hover/task:opacity-100 transition-opacity ml-2">
                                                <button
                                                  onClick={() => startEditing(task)}
                                                  className="p-1.5 text-slate-700 hover:text-black hover:bg-slate-200 rounded transition-colors"
                                                >
                                                  <Pencil size={14} />
                                                </button>
                                                <button
                                                  onClick={() => setDeleteConfirm(task.id)}
                                                  className="p-1.5 text-slate-700 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                                                >
                                                  <Trash2 size={14} />
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )
                                    })}

                                    {/* Add Task Input */}
                                    {!isReadOnly && (
                                      <div className="flex items-start space-x-2 pt-4 border-t-2 border-slate-300 border-dashed mt-4">
                                        <div className="flex-1 brutal-input-container">
                                          <textarea
                                            value={taskInputs[subtopic.id] || ''}
                                            onChange={(e) => handleInputChange(subtopic.id, e.target.value)}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleAddTask(subtopic.id);
                                              }
                                            }}
                                            placeholder="Add New Content/Task (Shift+Enter for new line)"
                                            className="brutal-input min-h-[60px] resize-y bg-white/50 border-slate-600 focus:border-white text-black placeholder-slate-500"
                                            rows={1}
                                          />
                                        </div>
                                        <button
                                          onClick={() => handleAddTask(subtopic.id)}
                                          disabled={!taskInputs[subtopic.id]}
                                          className="button-89 h-[60px] disabled:opacity-50 disabled:cursor-not-allowed bg-white text-black hover:bg-slate-200"
                                        >
                                          Add
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={2} className="py-12 text-center">
                              <div className="flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 border-2 border-white/20">
                                  <Check size={32} className="text-black" />
                                </div>
                                <h3 className="text-xl font-bold text-black mb-2 uppercase tracking-wide">No Task Lists Found</h3>
                                <p className="text-slate-700 max-w-md mx-auto">
                                  Create a new task list in the "Manage Subtopics" tab to start adding tasks to this category.
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-6">
                  {filteredSubtopics.length > 0 ? (
                    filteredSubtopics.map(subtopic => {
                      const subtopicTasks = tasks.filter(t => t.subtopicId === subtopic.id);

                      return (
                        <div
                          key={subtopic.id}
                          className="rounded-xl border border-slate-300/50 overflow-hidden relative"
                          style={{
                            backgroundColor: '#fefefe',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                          }}
                        >
                          <div className="absolute inset-0  pointer-events-none" />
                          <div className="relative z-10">
                            {/* Header */}
                            <div className="p-4 bg-white/80 border-b border-slate-300">
                              <span className="text-lg font-black text-black uppercase tracking-wider">{subtopic.name}</span>
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-3">
                              {/* Task List */}
                              {subtopicTasks.map(task => {
                                const isLocked = task.completed && task.completedAt && new Date(task.completedAt).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

                                return (
                                  <div
                                    key={task.id}
                                    className="flex items-start justify-between group/task border-2 border-slate-200 rounded-lg p-3 hover:border-white transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.4)] overflow-hidden relative"
                                    style={{
                                      backgroundColor: '#fefefe',
                                      backgroundSize: 'cover',
                                      backgroundPosition: 'center',
                                      backgroundRepeat: 'no-repeat'
                                    }}
                                  >
                                    <div className="absolute inset-0  backdrop-blur-[1px]" />
                                    <div className="relative z-10 flex items-start justify-between w-full">
                                      <div className="flex items-start space-x-4 flex-1">
                                        {/* Heart Checkbox */}
                                        <div className="heart-checkbox-container mt-0.5" title={task.completed ? "Completed" : "Mark as complete"}>
                                          <input
                                            type="checkbox"
                                            className="checkbox"
                                            checked={task.completed}
                                            onChange={() => handleToggleTask(task)}
                                            disabled={isReadOnly || isFuture || !!isLocked}
                                          />
                                          <div className="svg-container">
                                            <svg viewBox="0 0 24 24" className="svg-outline" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z">
                                              </path>
                                            </svg>
                                            <svg viewBox="0 0 24 24" className="svg-filled" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z">
                                              </path>
                                            </svg>
                                            <svg className="svg-celebrate" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                                              <polygon points="10,10 20,20"></polygon>
                                              <polygon points="10,50 20,50"></polygon>
                                              <polygon points="20,80 30,70"></polygon>
                                              <polygon points="90,10 80,20"></polygon>
                                              <polygon points="90,50 80,50"></polygon>
                                              <polygon points="80,80 70,70"></polygon>
                                            </svg>
                                          </div>
                                        </div>

                                        <div className="flex flex-col flex-1 pt-1">
                                          {editingTaskId === task.id ? (
                                            <div className="flex items-center space-x-2">
                                              <div className="flex-1 brutal-input-container">
                                                <input
                                                  type="text"
                                                  value={editValue}
                                                  onChange={(e) => setEditValue(e.target.value)}
                                                  onKeyDown={(e) => {
                                                    if (e.key === 'Enter') saveEdit(task.id);
                                                    if (e.key === 'Escape') cancelEditing();
                                                  }}
                                                  className="brutal-input h-[40px] px-3 py-1 text-sm bg-slate-50 text-black"
                                                  autoFocus
                                                />
                                              </div>
                                              <button onClick={() => saveEdit(task.id)} className="text-green-500 hover:text-green-400">
                                                <Check size={16} />
                                              </button>
                                              <button onClick={cancelEditing} className="text-red-500 hover:text-red-400">
                                                <X size={16} />
                                              </button>
                                            </div>
                                          ) : (
                                            <>
                                              <span className={`text-sm font-medium ${task.completed ? 'text-slate-500 line-through decoration-2 decoration-slate-500' : 'text-black'}`}>
                                                {task.name}
                                              </span>
                                              {task.completed && task.completedAt && (
                                                <span className="text-[10px] text-slate-700 font-mono mt-1 block">
                                                  Completed: {formatCompletedAt(task.completedAt)}
                                                </span>
                                              )}
                                            </>
                                          )}
                                        </div>
                                      </div>

                                      {!isReadOnly && !editingTaskId && (
                                        <div className="flex items-center space-x-2 opacity-100 md:opacity-0 md:group-hover/task:opacity-100 transition-opacity ml-2">
                                          <button
                                            onClick={() => startEditing(task)}
                                            className="p-1.5 text-slate-700 hover:text-black hover:bg-slate-200 rounded transition-colors"
                                          >
                                            <Pencil size={14} />
                                          </button>
                                          <button
                                            onClick={() => setDeleteConfirm(task.id)}
                                            className="p-1.5 text-slate-700 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                                          >
                                            <Trash2 size={14} />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}

                              {/* Add Task Input */}
                              {!isReadOnly && (
                                <div className="flex items-start space-x-2 pt-4 border-t-2 border-slate-300 border-dashed mt-4">
                                  <div className="flex-1 brutal-input-container">
                                    <textarea
                                      value={taskInputs[subtopic.id] || ''}
                                      onChange={(e) => handleInputChange(subtopic.id, e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                          e.preventDefault();
                                          handleAddTask(subtopic.id);
                                        }
                                      }}
                                      placeholder="Add New Content/Task (Shift+Enter for new line)"
                                      className="brutal-input min-h-[60px] resize-y bg-white/50 border-slate-600 focus:border-white text-black placeholder-slate-500"
                                      rows={1}
                                    />
                                  </div>
                                  <button
                                    onClick={() => handleAddTask(subtopic.id)}
                                    disabled={!taskInputs[subtopic.id]}
                                    className="button-89 h-[60px] disabled:opacity-50 disabled:cursor-not-allowed bg-white text-black hover:bg-slate-200"
                                  >
                                    Add
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 text-slate-500 italic bg-white/40 rounded-lg border border-black">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 border-2 border-white/20">
                          <Check size={32} className="text-black" />
                        </div>
                        <h3 className="text-xl font-bold text-black mb-2 uppercase tracking-wide">No Task Lists Found</h3>
                        <p className="text-slate-700 max-w-md mx-auto">
                          Create a new task list in the "Manage Subtopics" tab to start adding tasks to this category.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {
              deleteConfirm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                  <div
                    className="relative overflow-hidden rounded-lg max-w-md w-full mx-4 shadow-2xl border-2 border-slate-200"
                    style={{
                      backgroundColor: '#fefefe',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute inset-0 " />
                    <div className="relative z-10 p-8 text-center">
                      <h3 className="text-2xl font-black text-black mb-4 uppercase tracking-wider">Confirm Delete</h3>
                      <p className="text-slate-800 mb-8 text-lg">
                        Are you sure you want to delete this task? <br />
                        <span className="text-red-400 font-bold block mt-2">This cannot be undone.</span>
                      </p>
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="button-89 bg-slate-600 hover:bg-slate-200 text-black text-sm py-3 px-6"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await onDeleteTask(deleteConfirm);
                              setDeleteConfirm(null);
                            } catch (error) {
                              alert('Failed to delete task.');
                            }
                          }}
                          className="button-89 bg-red-600 hover:bg-red-700 text-black text-sm py-3 px-6"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }

            {
              goals.length === 0 && (
                <div className="w-full p-12 text-center">
                  <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-indigo-500" />
                  </div>
                  <h2 className="text-xl font-bold text-black mb-2">No Categories Found</h2>
                  <p className="text-slate-700 mb-6 max-w-md mx-auto">
                    You need to create a category before you can manage tasks.
                    Go to the "Manage Categories" tab to create your first category.
                  </p>
                </div>
              )
            }
          </div >
        </div >
      </div >
    </div >
  );
}




