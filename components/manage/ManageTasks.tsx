'use client';

import React, { useState, useEffect } from 'react';
import { Check, Trash2, ChevronDown, Pencil, X, Lock } from 'lucide-react';

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
                  ) : (
    <tr>
      <td colSpan={2} className="py-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
            <Check size={32} className="text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Task Lists Found</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            Create a new task list in the "Manage Subtopics" tab to start adding tasks to this category.
          </p>
        </div>
      </td>
    </tr>
  )
}
                </tbody >
              </table >
            </div >
          </div >
        </div >
      )}

{/* Delete Confirmation Modal */ }
{
  deleteConfirm && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4 text-white shadow-xl border border-slate-700">
        <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
        <p className="text-gray-300 mb-4">
          Are you sure you want to delete this task? <strong>This cannot be undone.</strong>
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
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
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

{
  goals.length === 0 && (
    <div className="w-full rounded-lg border border-slate-700/50 bg-black shadow-lg p-12 text-center">
      <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check size={32} className="text-indigo-500" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">No Categories Found</h2>
      <p className="text-slate-400 mb-6 max-w-md mx-auto">
        You need to create a category before you can manage tasks.
        Go to the "Manage Categories" tab to create your first category.
      </p>
    </div>
  )
}
    </div >
  );
}