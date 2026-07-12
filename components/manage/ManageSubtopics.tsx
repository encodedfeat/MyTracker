// components/manage/ManageSubtopics.tsx
'use client';

import React, { useState } from 'react';
import { Trash2, Edit2, Check, X, Plus, Layers, Activity, ListTodo, HelpCircle } from 'lucide-react';
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
                        <h2 className="text-3xl font-bold text-black tracking-tight">Manage Subtopics</h2>
                        <div className="relative group cursor-help outline-none flex items-center" tabIndex={0}>
                            <HelpCircle size={24} className="text-slate-400 group-hover:text-black transition-colors" />
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 md:w-72 p-3 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none z-20 shadow-[4px_4px_0_0_#000] border-2 border-white font-medium text-center">
                                Break your categories down into smaller habits, tasks, or cumulative targets to track daily!
                            </div>
                        </div>
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
                                    <label htmlFor="goalSelect" className="block text-sm font-medium text-slate-700 ml-1">
                                        Select Category
                                    </label>
                                    <select
                                        id="goalSelect"
                                        value={goalId}
                                        onChange={(e) => setGoalId(e.target.value)}
                                        className="select-55"
                                    >
                                        <option value="" className="bg-white text-black">-- Select Category --</option>
                                        {goals.map(goal => (
                                            <option key={goal.id} value={goal.id} className="bg-white text-black hover:bg-slate-50">
                                                {goal.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Subtopic Name */}
                                <div className="space-y-2">
                                    <label htmlFor="subtopicName" className="block text-sm font-medium text-slate-700 ml-1">
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
                                    <label className="block text-sm font-medium text-slate-700 ml-1">
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
                                    <label htmlFor="target" className="block text-sm font-medium text-slate-700 ml-1 mb-2">
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
                        <h3 className="text-xl font-bold text-black text-center">
                            Your Subtopics by Category
                        </h3>

                        {/* Desktop Table View */}
                        <div
                            className="hidden md:block overflow-x-auto custom-scrollbar rounded-lg border border-black shadow-2xl relative"
                            style={{
                                backgroundColor: '#fefefe',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }}
                        >
                            <div className="absolute inset-0  pointer-events-none" />
                            <div className="relative z-10">
                                <table className="w-full text-sm text-left text-slate-800 border-collapse">
                                    <thead className="text-xs uppercase bg-white/80 text-slate-800 backdrop-blur-sm border-b-2 border-slate-200">
                                        <tr>
                                            <th scope="col" className="px-6 py-4 font-bold border-r-2 border-slate-200 min-w-[200px]">
                                                Category
                                            </th>
                                            <th scope="col" className="px-6 py-4 font-bold border-r-2 border-slate-200 min-w-[250px]">
                                                Habits
                                            </th>
                                            <th scope="col" className="px-6 py-4 font-bold border-r-2 border-slate-200 min-w-[250px]">
                                                Cumulative
                                            </th>
                                            <th scope="col" className="px-6 py-4 font-bold min-w-[250px]">
                                                Task List
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-slate-200">
                                        {goals.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic bg-white/40">
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
                                                    <tr key={goal.id} className="group border-b-2 border-slate-200 last:border-b-0 hover:bg-slate-50/30 transition-colors">
                                                        <td className="px-6 py-6 align-top border-r-2 border-slate-200  backdrop-blur-sm">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 rounded-lg bg-slate-50 border border-slate-600/50 shadow-lg">
                                                                    <GoalIcon iconName={goal.icon} className="w-5 h-5 text-black font-bold" />
                                                                </div>
                                                                <span className="font-bold text-black text-lg">{goal.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 align-top border-r-2 border-slate-200 ">
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
                                                        <td className="px-4 py-4 align-top border-r-2 border-slate-200 ">
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
                                                        <td className="px-4 py-4 align-top ">
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

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-6">
                            {goals.length === 0 ? (
                                <div className="text-center py-12 text-slate-500 italic bg-white/40 rounded-lg border border-black">
                                    No categories found. Add a category first.
                                </div>
                            ) : (
                                goals.map(goal => {
                                    const goalSubtopics = subtopics.filter(st => st.goalId === goal.id);
                                    const habits = goalSubtopics.filter(st => st.type === 'habit');
                                    const cumulative = goalSubtopics.filter(st => st.type === 'cumulative');
                                    const tasks = goalSubtopics.filter(st => st.type === 'tasks');

                                    return (
                                        <div
                                            key={goal.id}
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
                                                <div className="p-4 bg-white/80 border-b border-slate-300 flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-600/50 shadow-lg">
                                                        <GoalIcon iconName={goal.icon} className="w-5 h-5 text-black font-bold" />
                                                    </div>
                                                    <span className="font-bold text-black text-lg">{goal.name}</span>
                                                </div>

                                                {/* Content */}
                                                <div className="p-4 space-y-6">
                                                    {/* Habits Section */}
                                                    <div>
                                                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                            <Activity size={12} /> Habits
                                                        </h4>
                                                        <div className="space-y-2 pl-2 border-l-2 border-black">
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
                                                    </div>

                                                    {/* Cumulative Section */}
                                                    <div>
                                                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                            <Layers size={12} /> Cumulative
                                                        </h4>
                                                        <div className="space-y-2 pl-2 border-l-2 border-black">
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
                                                    </div>

                                                    {/* Tasks Section */}
                                                    <div>
                                                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                            <ListTodo size={12} /> Task Lists
                                                        </h4>
                                                        <div className="space-y-2 pl-2 border-l-2 border-black">
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
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
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
                            <h3 className="text-2xl font-black text-black mb-4 uppercase tracking-wider">Delete Subtopic?</h3>
                            <p className="text-slate-800 mb-8 text-lg">
                                Are you sure you want to delete this subtopic? <br />
                                <span className="text-red-400 font-bold block mt-2">This action cannot be undone.</span>
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
                                            await onDeleteSubtopic(deleteConfirm);
                                            setDeleteConfirm(null);
                                        } catch (error) {
                                            alert('Failed to delete subtopic.');
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
            )}
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
            <div
                className="flex flex-col gap-2 p-2 rounded-lg border border-indigo-500/50 overflow-hidden relative"
                style={{
                    backgroundColor: '#fefefe',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0  backdrop-blur-[1px]" />
                <div className="relative z-10 flex flex-col gap-2">
                    <div className="brutal-input-container">
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="brutal-input h-[35px] px-2 py-1 text-sm bg-white text-black"
                            placeholder="Name"
                            autoFocus
                        />
                    </div>
                    {subtopic.type === 'cumulative' && (
                        <div className="brutal-input-container">
                            <input
                                type="number"
                                value={editTarget}
                                onChange={(e) => setEditTarget(e.target.value)}
                                className="brutal-input h-[35px] px-2 py-1 text-sm bg-white text-black"
                                placeholder="Target"
                                min="1"
                            />
                        </div>
                    )}
                    <div className="flex justify-end gap-2 mt-1">
                        <button
                            onClick={onCancelEdit}
                            className="p-1.5 bg-slate-200 text-slate-800 rounded hover:bg-slate-600 hover:text-black transition-colors"
                        >
                            <X size={14} />
                        </button>
                        <button
                            onClick={() => onSaveEdit(subtopic.id, subtopic.goalId, subtopic.type)}
                            className="p-1.5 bg-green-600 text-black rounded hover:bg-green-500 transition-colors"
                        >
                            <Check size={14} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="group/item flex items-center justify-between p-2 rounded-lg border border-slate-300/50 hover:border-slate-500 transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden relative"
            style={{
                backgroundColor: '#fefefe',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="absolute inset-0  backdrop-blur-[1px]" />
            <div className="relative z-10 flex-1 min-w-0 mr-2">
                <p className="text-sm text-slate-900 font-medium truncate">{subtopic.name}</p>
                {subtopic.type === 'cumulative' && subtopic.target && (
                    <p className="text-xs text-slate-700">Target: {subtopic.target}</p>
                )}
            </div>
            {!isReadOnly && (
                <div className="relative z-10 flex gap-1 opacity-100 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity">
                    <button
                        onClick={() => onStartEdit(subtopic)}
                        className="p-1 text-slate-700 hover:text-black hover:bg-slate-200 rounded transition-colors"
                    >
                        <Edit2 size={12} />
                    </button>
                    <button
                        onClick={() => onDeleteConfirm(subtopic.id)}
                        className="p-1 text-slate-700 hover:text-red-400 hover:bg-red-500/20 rounded transition-colors"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            )}
        </div>
    );
}




