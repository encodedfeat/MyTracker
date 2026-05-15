// components/manage/ManageGoals.tsx
'use client';

import React, { useState } from 'react';
import { GoalIcon } from '@/components/ui/GoalIcon';
import { Trash2, Edit2, Check, X, Plus } from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  icon: string;
}

interface ManageGoalsProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id'>) => Promise<void>;
  onDeleteGoal: (goalId: string) => Promise<void>;
  onUpdateGoal: (goalId: string, updates: Partial<Omit<Goal, 'id'>>) => Promise<void>;
  isReadOnly?: boolean;
}

export function ManageGoals({ goals, onAddGoal, onDeleteGoal, onUpdateGoal, isReadOnly = false }: ManageGoalsProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Target');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const iconOptions = ['Target', 'Zap', 'Brain', 'BookOpen', 'Code', 'Activity', 'Award', 'Star'];

  const isDuplicateName = (nameToCheck: string, excludeId?: string) => {
    return goals.some(goal =>
      goal.name.toLowerCase() === nameToCheck.toLowerCase() &&
      goal.id !== excludeId
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (isDuplicateName(name)) {
      alert('A category with this name already exists. Please use a different name.');
      return;
    }

    try {
      await onAddGoal({ name, icon });
      setName('');
      setIcon('Target');
    } catch (error) {
      alert('Failed to add category. Please try again.');
    }
  };

  const handleStartEdit = (goal: Goal) => {
    setEditingId(goal.id);
    setEditName(goal.name);
  };

  const handleSaveEdit = async (goalId: string) => {
    if (!editName.trim()) {
      alert('Category name cannot be empty.');
      return;
    }

    if (isDuplicateName(editName, goalId)) {
      alert('A category with this name already exists. Please use a different name.');
      return;
    }

    try {
      await onUpdateGoal(goalId, { name: editName });
      setEditingId(null);
      setEditName('');
    } catch (error) {
      alert('Failed to update category. Please try again.');
    }
  };

  return (
    <div className="space-y-12">
      {/* Add Category Section */}
      <div
        className="relative overflow-hidden rounded-3xl border border-slate-700/50 shadow-2xl"
        style={{
          backgroundImage: "url('/assist/guide/divBackground.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Brushed Metal Effect Overlay */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        <div className="relative p-8 md:p-12">
          <div className="flex items-center justify-center mb-10">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">Manage Categories</h2>
            {isReadOnly && (
              <span className="ml-4 bg-amber-500/20 text-amber-500 text-xs font-bold px-2 py-1 rounded border border-amber-500/50">
                READ ONLY
              </span>
            )}
          </div>

          {!isReadOnly && (
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Name Input */}
                <div className="space-y-2">
                  <label htmlFor="goalName" className="block text-sm font-medium text-slate-400 ml-1">
                    Category Name
                  </label>
                  <div className="brutal-input-container">
                    <input
                      type="text"
                      id="goalName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Academics"
                      className="brutal-input"
                    />
                  </div>
                </div>

                {/* Icon Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-400 ml-1">
                    Icon
                  </label>
                  <div className="flex flex-nowrap gap-3 justify-start overflow-x-auto pb-2 scrollbar-hide">
                    {iconOptions.map(iconName => (
                      <button
                        type="button"
                        key={iconName}
                        onClick={() => setIcon(iconName)}
                        className={`relative p-2.5 transition-all duration-200 border-4 flex-shrink-0 ${icon === iconName
                          ? 'bg-black border-white shadow-[5px_5px_0_#fff] translate-x-[-2px] translate-y-[-2px]'
                          : 'bg-white border-black shadow-[3px_3px_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_#000]'
                          }`}
                      >
                        <GoalIcon
                          iconName={iconName}
                          className={`w-4 h-4 ${icon === iconName ? 'text-white' : 'text-black'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  className="button-89 flex items-center space-x-2"
                >
                  <Plus size={18} />
                  <span>Add Category</span>
                </button>
              </div>
            </form>
          )}

          {/* Divider */}
          <div className="my-8 border-t border-slate-400/50" />

          {/* Categories List */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white text-center">
              Your Categories
            </h3>

            {goals.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border border-slate-800 bg-slate-900/30 border-dashed">
                <p className="text-slate-500 italic">No categories added yet. Create one above to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {goals.map(goal => (
                  <div
                    key={goal.id}
                    className="group relative overflow-hidden rounded-2xl border border-slate-700/50 p-1 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] w-full"
                    style={{
                      backgroundImage: "url('/assist/guide/component.jpg')",
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    {/* Glassy content container */}
                    <div className="relative h-full bg-black/40 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 pr-16">
                      {editingId === goal.id ? (
                        <div className="flex items-center space-x-2 w-full">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1 min-w-0 bg-slate-800 text-white px-3 py-1.5 rounded-lg border border-indigo-500 focus:outline-none text-sm"
                            autoFocus
                          />
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleSaveEdit(goal.id)}
                              className="p-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500 hover:text-white transition-colors"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditName('');
                              }}
                              className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="p-3 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 shadow-inner flex-shrink-0">
                            <GoalIcon iconName={goal.icon} className="w-6 h-6 text-white" />
                          </div>
                          <span className="font-medium text-slate-200 text-lg truncate">
                            {goal.name}
                          </span>

                          {!isReadOnly && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <button
                                onClick={() => handleStartEdit(goal)}
                                className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(goal.id)}
                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-slate-900 p-6 rounded-2xl max-w-md w-full mx-4 text-white shadow-2xl border border-slate-700 transform transition-all scale-100">
            <h3 className="text-xl font-bold mb-4 text-red-400 flex items-center gap-2">
              <Trash2 size={20} />
              Delete Category?
            </h3>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Are you sure you want to delete this category? This will permanently remove all associated habits, tasks, and progress data.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-colors text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!deleteConfirm) return;
                  try {
                    await onDeleteGoal(deleteConfirm);
                    setDeleteConfirm(null);
                  } catch (error) {
                    alert('Failed to delete category.');
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl font-medium transition-colors shadow-lg shadow-red-900/20"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}