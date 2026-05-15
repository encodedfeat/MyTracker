// components/manage/TaskSubtopicEditor.tsx
'use client';

import React, { useState } from 'react';
import { TaskItem } from '@/components/ui/TaskItem';

// Define the types this component needs
interface Subtopic {
  id: string;
  name: string;
}

interface Task {
  id: string;
  subtopicId: string;
  name: string;
  completed: boolean;
}

interface TaskSubtopicEditorProps {
  subtopic: Subtopic;
  tasks: Task[];
  onAddTask: (subtopicId: string, taskName: string) => Promise<void>;
  onToggleTask: (taskId: string, currentStatus: boolean) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  isReadOnly?: boolean;
}

export function TaskSubtopicEditor({
  subtopic,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  isReadOnly = false
}: TaskSubtopicEditorProps) {

  const [taskInput, setTaskInput] = useState('');
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput) return;
    onAddTask(subtopic.id, taskInput);
    setTaskInput('');
  };

  return (
    <div className="p-4 border border-gray-700/50 rounded-lg bg-gray-900">
      <h3 className="text-xl font-semibold text-white mb-3">{subtopic.name}</h3>
      <div className="space-y-2">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleTask={onToggleTask}
            onDeleteTask={(id) => setDeletingTaskId(id)}
            isReadOnly={isReadOnly}
          />
        ))}

        {tasks.length === 0 && (
          <p className="text-sm text-slate-500">No content added yet.</p>
        )}

        {!isReadOnly && (
          <form onSubmit={handleAddTaskSubmit} className="flex space-x-2 pt-2">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="Add new content/task"
              className="flex-grow px-3 py-1.5 bg-gray-800 border border-gray-700 text-white rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              Add
            </button>
          </form>
        )}
      </div>

      {deletingTaskId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4 text-white">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete this task? <strong>You can't undo that.</strong>
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeletingTaskId(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await onDeleteTask(deletingTaskId);
                    setDeletingTaskId(null);
                  } catch (error) {
                    alert('Failed to delete task. Please try again.');
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}