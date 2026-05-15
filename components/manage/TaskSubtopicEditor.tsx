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
    <div className="p-4 border border-gray-300/50 rounded-lg bg-white">
      <h3 className="text-xl font-semibold text-black mb-3">{subtopic.name}</h3>
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
              className="flex-grow px-3 py-1.5 bg-gray-50 border border-gray-300 text-black rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="button-89 text-sm"
              style={{ '--color': '#000000', color: 'black', backgroundColor: 'white' } as React.CSSProperties}
            >
              Add
            </button>
          </form>
        )}
      </div>

      {deletingTaskId && (
        <div className="fixed inset-0  flex items-center justify-center z-50">
          <div className="bg-gray-50 p-6 rounded-lg max-w-md w-full mx-4 text-black border-4 border-black shadow-[8px_8px_0_0_#000]">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-800 mb-4">
              Are you sure you want to delete this task? <strong>You can't undo that.</strong>
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeletingTaskId(null)}
                className="button-89 text-sm bg-gray-200"
                style={{ '--color': '#000000', color: 'black' } as React.CSSProperties}
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
                className="button-89 text-sm bg-red-600 text-white"
                style={{ '--color': '#000000' } as React.CSSProperties}
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


