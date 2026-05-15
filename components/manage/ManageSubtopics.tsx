// components/manage/ManageSubtopics.tsx
'use client';

import React, { useState } from 'react';
import { Trash2, Edit2, Check, X, Plus, Layers, Activity, ListTodo } from 'lucide-react';
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

interface ManageSubtopicsProps {
    goals: Goal[];
    subtopics: Subtopic[];
    onAddSubtopic: (subtopic: Omit<Subtopic, 'id'>) => Promise<void>;
    onUpdateSubtopic: (subtopicId: string, updates: Partial<Omit<Subtopic, 'id'>>) => Promise<void>;
    onDeleteSubtopic: (subtopicId: string) => Promise<void>;
    isReadOnly?: boolean;
}

export function ManageSubtopics({ goals, subtopics, onAddSubtopic, onUpdateSubtopic, onDeleteSubtopic, isReadOnly = false }: ManageSubtopicsProps) {
    const [goalId, setGoalId] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState<'habit' | 'cumulative' | 'tasks'>('habit');
    const [target, setTarget] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editTarget, setEditTarget] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const isDuplicateName = (nameToCheck: string, goalIdToCheck: string, typeToCheck: string, excludeId?: string) => {
        return subtopics.some(st =>
            st.name.toLowerCase() === nameToCheck.toLowerCase() &&
            st.goalId === goalIdToCheck &&
            st.type === typeToCheck &&
            st.id !== excludeId
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!goalId || !name) return;

        if (type === 'cumulative') {
            const numTarget = Number(target);
            if (!target || isNaN(numTarget) || numTarget <= 0) {
                alert('Please enter a valid positive number for the Monthly Target.');
                return;
            }
        }

        if (isDuplicateName(name, goalId, type)) {
            alert(`A ${type === 'tasks' ? 'Task List' : type} with the name "${name}" already exists in this category.`);
            return;
        }

        try {
            await onAddSubtopic({
                goalId,
                name,
                type,
                target: type === 'cumulative' ? Number(target) : undefined,
            });
            setName('');
            setTarget('');
        } catch (error) {
            alert('Failed to add subtopic. Please try again.');
        }
    };

    const handleStartEdit = (subtopic: Subtopic) => {
        setEditingId(subtopic.id);
        setEditName(subtopic.name);
        setEditTarget(subtopic.target ? String(subtopic.target) : '');
    };

    const handleSaveEdit = async (subtopicId: string, currentGoalId: string, currentType: string) => {
        if (!editName.trim()) {
            alert('Subtopic name cannot be empty.');
            return;
        }

        if (currentType === 'cumulative') {
            const numTarget = Number(editTarget);
            if (!editTarget || isNaN(numTarget) || numTarget <= 0) {
                alert('Please enter a valid positive number for the Monthly Target.');
                return;
            }
        }

        if (isDuplicateName(editName, currentGoalId, currentType, subtopicId)) {
            alert(`A ${currentType === 'tasks' ? 'Task List' : currentType} with the name "${editName}" already exists in this category.`);
            return;
        }

        try {
            await onUpdateSubtopic(subtopicId, {
                name: editName,
                target: currentType === 'cumulative' ? Number(editTarget) : undefined,
            });
            setEditingId(null);
            setEditName('');
            setEditTarget('');
        } catch (error) {
            alert('Failed to update subtopic. Please try again.');
        }
    };

    return (
        <div className="space-y-12">
            {/* Add Subtopic Section */}
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
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">Manage Subtopics</h2>
                        {isReadOnly && (
                            <span className="ml-4 bg-amber-500/20 text-amber-500 text-xs font-bold px-2 py-1 rounded border border-amber-500/50">
                                READ ONLY
                            </span>
                        )}
                    </div>

                    {!isReadOnly && (
                        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                                {/* Select Category */}
                                <div className="space-y-2">
                                    <label htmlFor="goalSelect" className="block text-sm font-medium text-slate-400 ml-1">
                                        Select Category
                                    </label>
                                    <select
                                        id="goalSelect"
                                        value={goalId}
                                        onChange={(e) => setGoalId(e.target.value)}
                                        className="select-55"
                                    >
                                        <option value="">-- Select Category --</option>
                                        {goals.map(goal => (
                                            <option key={goal.id} value={goal.id}>{goal.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Subtopic Name */}
                                <div className="space-y-2">
                                    <label htmlFor="subtopicName" className="block text-sm font-medium text-slate-400 ml-1">
                                        Subtopic Name
                                    </label>
                                    <div className="brutal-input-container">
                                        <input
                                            type="text"
                                            id="subtopicName"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g., Morning Run"
                                            className="brutal-input"
                                        />
                                    </div>
                                </div>

                                {/* Type Selection */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-400 ml-1">
                                        Type
                                    </label>
                                    <div className="flex justify-center">
                                        <div className="radio-wrapper">
                                            {(['habit', 'cumulative', 'tasks'] as const).map((t) => (
                                                <div className="radio-option" key={t}>
                                                    <input
                                                        className="radio-input"
                                                        type="radio"
                                                        name="type"
                                                        value={t}
                                                        checked={type === t}
                                                        onChange={() => setType(t)}
                                                    />
                                                    <div className="radio-btn">
                                                        <span className="radio-span">
                                                            {t === 'habit' && 'Habit'}
                                                            {t === 'cumulative' && 'Cumulative'}
                                                            {t === 'tasks' && 'Task List'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {type === 'cumulative' && (
                                <div className="max-w-xs mx-auto animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label htmlFor="target" className="block text-sm font-medium text-slate-400 ml-1 mb-2">
                                        Monthly Target *
                                    </label>
                                    <div className="brutal-input-container">
                                        <input
                                            type="number"
                                            id="target"
                                            value={target}
                                            onChange={(e) => setTarget(e.target.value)}
                                            placeholder="e.g., 100"
                                            min="1"
                                            className="brutal-input"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex justify-center pt-4">
                                <button
                                    type="submit"
                                    className="button-89 flex items-center space-x-2"
                                >
                                    <Plus size={18} />
                                    <span>Add Subtopic</span>
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Divider */}
                    <div className="my-12 border-t border-slate-400/50" />

                    {/* Subtopics List */}
                    <div className="space-y-8">
                        <h3 className="text-xl font-bold text-white text-center">
                            Your Subtopics by Category
                        </h3>

                        <div className="overflow-x-auto custom-scrollbar rounded-2xl border border-slate-500/50 shadow-2xl">
                            <table className="w-full text-sm text-left text-slate-300">
                                <thead className="text-xs uppercase bg-slate-900/80 text-slate-300 backdrop-blur-sm">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 font-bold border-b border-slate-500/50 min-w-[200px]">
                                            Category
                                        </th>
                                        <th scope="col" className="px-6 py-4 font-bold border-b border-slate-500/50 min-w-[250px]">
                                            Habits
                                        </th>
                                        <th scope="col" className="px-6 py-4 font-bold border-b border-slate-500/50 min-w-[250px]">
                                            Cumulative
                                        </th>
                                        <th scope="col" className="px-6 py-4 font-bold border-b border-slate-500/50 min-w-[250px]">
                                            Task List
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-600/50">
                                    {goals.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic bg-slate-900/40">
                                                No categories found. Add a category first.
                                            </td>
                                        </tr>
                                    ) : (
                                        goals.map(goal => {
                                            const goalSubtopics = subtopics.filter(st => st.goalId === goal.id);
                                            const habits = goalSubtopics.filter(st => st.type === 'habit');
                                            const cumulative = goalSubtopics.filter(st => st.type === 'cumulative');
                                            const tasks = goalSubtopics.filter(st => st.type === 'tasks');

                                            return (
                                                <tr key={goal.id} className="group hover:bg-slate-800/30 transition-colors bg-slate-900/20">
                                                    <td className="px-6 py-6 align-top border-r border-slate-600/50 bg-slate-900/40 backdrop-blur-sm">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-lg bg-slate-800 border border-slate-600/50 shadow-lg">
                                                                <GoalIcon iconName={goal.icon} className="w-5 h-5 text-indigo-400" />
                                                            </div>
                                                            <span className="font-bold text-white text-lg">{goal.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 align-top border-r border-slate-600/50">
                                                        <div className="space-y-2">
                                                            {habits.length > 0 ? habits.map(st => (
                                                                <SubtopicItem
                                                                    key={st.id}
                                                                    subtopic={st}
                                                                    editingId={editingId}
                                                                    editName={editName}
                                                                    editTarget={editTarget}
                                                                    deleteConfirm={deleteConfirm}
                                                                    isReadOnly={isReadOnly}
                                                                    onStartEdit={handleStartEdit}
                                                                    onSaveEdit={handleSaveEdit}
                                                                    onCancelEdit={() => {
                                                                        setEditingId(null);
                                                                        setEditName('');
                                                                        setEditTarget('');
                                                                    }}
                                                                    setEditName={setEditName}
                                                                    setEditTarget={setEditTarget}
                                                                    onDeleteConfirm={setDeleteConfirm}
                                                                    onDelete={onDeleteSubtopic}
                                                                />
                                                            )) : <span className="text-xs text-slate-500 italic px-2">No habits</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 align-top border-r border-slate-600/50">
                                                        <div className="space-y-2">
                                                            {cumulative.length > 0 ? cumulative.map(st => (
                                                                <SubtopicItem
                                                                    key={st.id}
                                                                    subtopic={st}
                                                                    editingId={editingId}
                                                                    editName={editName}
                                                                    editTarget={editTarget}
                                                                    deleteConfirm={deleteConfirm}
                                                                    isReadOnly={isReadOnly}
                                                                    onStartEdit={handleStartEdit}
                                                                    onSaveEdit={handleSaveEdit}
                                                                    onCancelEdit={() => {
                                                                        setEditingId(null);
                                                                        setEditName('');
                                                                        setEditTarget('');
                                                                    }}
                                                                    setEditName={setEditName}
                                                                    setEditTarget={setEditTarget}
                                                                    onDeleteConfirm={setDeleteConfirm}
                                                                    onDelete={onDeleteSubtopic}
                                                                />
                                                            )) : <span className="text-xs text-slate-500 italic px-2">No cumulative items</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 align-top">
                                                        <div className="space-y-2">
                                                            {tasks.length > 0 ? tasks.map(st => (
                                                                <SubtopicItem
                                                                    key={st.id}
                                                                    subtopic={st}
                                                                    editingId={editingId}
                                                                    editName={editName}
                                                                    editTarget={editTarget}
                                                                    deleteConfirm={deleteConfirm}
                                                                    isReadOnly={isReadOnly}
                                                                    onStartEdit={handleStartEdit}
                                                                    onSaveEdit={handleSaveEdit}
                                                                    onCancelEdit={() => {
                                                                        setEditingId(null);
                                                                        setEditName('');
                                                                        setEditTarget('');
                                                                    }}
                                                                    setEditName={setEditName}
                                                                    setEditTarget={setEditTarget}
                                                                    onDeleteConfirm={setDeleteConfirm}
                                                                    onDelete={onDeleteSubtopic}
                                                                />
                                                            )) : <span className="text-xs text-slate-500 italic px-2">No task lists</span>}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper component for rendering individual subtopic items
function SubtopicItem({
    subtopic,
    editingId,
    editName,
    editTarget,
    deleteConfirm,
    isReadOnly,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    setEditName,
    setEditTarget,
    onDeleteConfirm,
    onDelete
}: {
    subtopic: Subtopic;
    editingId: string | null;
    editName: string;
    editTarget: string;
    deleteConfirm: string | null;
    isReadOnly: boolean;
    onStartEdit: (st: Subtopic) => void;
    onSaveEdit: (id: string, goalId: string, type: string) => void;
    onCancelEdit: () => void;
    setEditName: (val: string) => void;
    setEditTarget: (val: string) => void;
    onDeleteConfirm: (id: string | null) => void;
    onDelete: (id: string) => Promise<void>;
}) {
    if (editingId === subtopic.id) {
        return (
            <div className="flex flex-col gap-2 p-2 bg-slate-800/80 rounded-lg border border-indigo-500/50">
                <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-900 text-white px-2 py-1.5 rounded border border-slate-600 focus:border-indigo-500 focus:outline-none text-xs"
                    placeholder="Name"
                    autoFocus
                />
                {subtopic.type === 'cumulative' && (
                    <input
                        type="number"
                        value={editTarget}
                        onChange={(e) => setEditTarget(e.target.value)}
                        className="w-full bg-slate-900 text-white px-2 py-1.5 rounded border border-slate-600 focus:border-indigo-500 focus:outline-none text-xs"
                        placeholder="Target"
                        min="1"
                    />
                )}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancelEdit}
                        className="p-1 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={14} />
                    </button>
                    <button
                        onClick={() => onSaveEdit(subtopic.id, subtopic.goalId, subtopic.type)}
                        className="p-1 text-green-400 hover:text-green-300 transition-colors"
                    >
                        <Check size={14} />
                    </button>
                </div>
            </div>
        );
    }

    if (deleteConfirm === subtopic.id) {
        return (
            <div className="p-2 bg-red-900/20 rounded-lg border border-red-500/30 flex flex-col gap-2 animate-in fade-in duration-200">
                <p className="text-xs text-red-200 font-medium text-center">Delete this?</p>
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => onDeleteConfirm(null)}
                        className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs hover:bg-slate-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onDelete(subtopic.id).then(() => onDeleteConfirm(null))}
                        className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-500"
                    >
                        Delete
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="group/item flex items-center justify-between p-2 rounded-lg border border-slate-700/50 hover:border-slate-500 transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden relative"
            style={{
                backgroundImage: "url('/assist/guide/component.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
            <div className="relative z-10 flex-1 min-w-0 mr-2">
                <p className="text-sm text-slate-200 font-medium truncate">{subtopic.name}</p>
                {subtopic.type === 'cumulative' && subtopic.target && (
                    <p className="text-xs text-slate-400">Target: {subtopic.target}</p>
                )}
            </div>
            {!isReadOnly && (
                <div className="relative z-10 flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <button
                        onClick={() => onStartEdit(subtopic)}
                        className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/20 rounded transition-colors"
                    >
                        <Edit2 size={12} />
                    </button>
                    <button
                        onClick={() => onDeleteConfirm(subtopic.id)}
                        className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded transition-colors"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            )}
        </div>
    );
}
