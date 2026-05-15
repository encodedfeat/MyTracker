// components/ui/TaskItem.tsx
'use client';

import { Check, Trash2 } from 'lucide-react';
import React from 'react';

// Define Task type inline or import from context
interface Task {
  id: string;
  subtopicId: string;
  name: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onToggleTask: (taskId: string, currentStatus: boolean) => Promise<void>;
  onDeleteTask: (taskId: string) => void;
  isReadOnly?: boolean;
}

export function TaskItem({ task, onToggleTask, onDeleteTask, isReadOnly = false }: TaskItemProps) {
  return (
    <div className={`flex items-center justify-between p-2 bg-gray-800 rounded ${isReadOnly ? 'opacity-80' : ''}`}>
      <div className="flex items-center space-x-2 flex-1">
        <button
          onClick={() => !isReadOnly && onToggleTask(task.id, task.completed)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-600 hover:border-green-500'
            } ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}`}
          disabled={isReadOnly}
        >
          {task.completed && <Check className="w-3 h-3 text-white" />}
        </button>
        <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-slate-200'}`}>
          {task.name}
        </span>
      </div>
      {!isReadOnly && (
        <button
          onClick={() => onDeleteTask(task.id)}
          className="text-red-500 hover:text-red-400 p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}