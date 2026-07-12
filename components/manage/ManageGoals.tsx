// components/manage/ManageGoals.tsx
'use client';

import React, { useState } from 'react';
import { GoalIcon } from '@/components/ui/GoalIcon';
import { Trash2, Edit2, Check, X, Plus, HelpCircle } from 'lucide-react';

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
            <h2 className="text-3xl font-bold text-black tracking-tight">Manage Categories</h2>
            <div className="relative group cursor-help outline-none flex items-center" tabIndex={0}>
                <HelpCircle size={24} className="text-slate-400 group-hover:text-black transition-colors" />
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 md:w-72 p-3 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none z-20 shadow-[4px_4px_0_0_#000] border-2 border-white font-medium text-center">
                    Create and manage the high-level categories for your goals.
                </div>
            </div>
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
                  <label htmlFor="goalName" className="block text-sm font-medium text-slate-700 ml-1">
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
                  <label className="block text-sm font-medium text-slate-700 ml-1">
                    Icon
                  </label>
                  <div className="flex flex-nowrap gap-3 justify-start overflow-x-auto pb-2 scrollbar-hide">
                    {iconOptions.map(iconName => (
                      <button
                        type="button"
                        key={iconName}
                        onClick={() => setIcon(iconName)}
                        className={`relative p-2.5 transition-all duration-200 border-4 flex-shrink-0 ${icon === iconName
                          ? 'bg-black border-black shadow-[5px_5px_0_#000] translate-x-[-2px] translate-y-[-2px]'
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
            <h3 className="text-xl font-bold text-black text-center">
              Your Categories
            </h3>

            {goals.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-700">No categories added yet. Create one above to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {goals.map(goal => (
                  <div
                    key={goal.id}
                    className="group relative overflow-hidden rounded-2xl border border-slate-300/50 p-1 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] w-full"
                    style={{
                      backgroundColor: '#fefefe',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    {/* Glassy content container */}
                    <div className={`relative h-full  backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 ${editingId === goal.id ? 'pr-4' : 'pr-16'}`}>
                      {editingId === goal.id ? (
                        <div className="flex items-center space-x-2 w-full">
                          <div className="flex-1 brutal-input-container">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="brutal-input h-[40px] px-3 py-1 text-sm bg-slate-50 text-black"
                              autoFocus
                            />
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleSaveEdit(goal.id)}
                              className="p-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500 hover:text-black transition-colors"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditName('');
                              }}
                              className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-black transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="p-3 rounded-xl bg-white border-2 border-black shadow-[4px_4px_0_0_#000] flex-shrink-0">
                            <GoalIcon iconName={goal.icon} className="w-6 h-6 text-black" />
                          </div>
                          <span className="font-medium text-slate-900 text-lg truncate">
                            {goal.name}
                          </span>

                          {!isReadOnly && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
                              <button
                                onClick={() => handleStartEdit(goal)}
                                className="p-1.5 text-slate-700 hover:text-black hover:bg-slate-200 rounded-lg transition-colors"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(goal.id)}
                                className="p-1.5 text-slate-700 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
              <h3 className="text-2xl font-black text-black mb-4 uppercase tracking-wider">Delete Category?</h3>
              <p className="text-slate-800 mb-8 text-lg">
                Are you sure you want to delete this category? <br />
                <span className="text-red-400 font-bold block mt-2">This will permanently remove all associated habits, tasks, and progress data.</span>
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
                    if (!deleteConfirm) return;
                    try {
                      await onDeleteGoal(deleteConfirm);
                      setDeleteConfirm(null);
                    } catch (error) {
                      alert('Failed to delete category.');
                    }
                  }}
                  className="button-89 bg-red-600 hover:bg-red-700 text-black text-sm py-3 px-6"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




