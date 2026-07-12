'use client';

import React from 'react';
import Link from 'next/link';
import { useGoalTracker } from '@/context/GoalContext';
import { Target, ListTodo, CheckSquare, Activity, Phone, Mail, Instagram, Twitter, BookOpen, TrendingUp, Info } from 'lucide-react';
import { getLocalDateString } from '@/lib/dateUtils';

export default function AuthenticatedHome() {
    const { goals, subtopics, tasks, dailyLineChartData, selectedDate, overallAveragePercent } = useGoalTracker();

    const totalCategories = goals.length;
    const totalSubtopics = subtopics.length;
    const habitCount = subtopics.filter(s => s.type === 'habit').length;
    const cumulativeCount = subtopics.filter(s => s.type === 'cumulative').length;
    const taskGroupCount = subtopics.filter(s => s.type === 'tasks').length;
    const totalTaskItems = tasks.length;

    // Calculate today's trend or month's trend
    const todayStr = getLocalDateString(new Date());
    const isCurrentMonth = selectedDate.getMonth() === new Date().getMonth() && selectedDate.getFullYear() === new Date().getFullYear();
    
    let trendPercent = 0;
    let trendLabel = "Today's Trend";
    let trendDesc = "Completion rate for today";

    if (isCurrentMonth) {
        // @ts-ignore - fullDate was added to dailyLineChartData
        const todayData = dailyLineChartData.find(d => d.fullDate === todayStr) || { percent: 0 };
        trendPercent = todayData.percent;
    } else {
        trendPercent = overallAveragePercent;
        trendLabel = "Month's Trend";
        trendDesc = "Average completion rate";
    }

    const displayPercent = trendPercent.toFixed(0);

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 pb-24">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-10 border-b-8 border-black inline-block pb-2">Home Base</h1>

            {/* Stats Overview Grid */}
            <section className="mb-16">
                <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2"><Activity size={28} /> Your Stats at a Glance</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Categories */}
                    <div className="bg-[#ff9a9e] border-4 border-black p-6 rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <Target size={32} className="text-black" />
                            <span className="text-4xl font-black">{totalCategories}</span>
                        </div>
                        <h3 className="font-bold uppercase tracking-wider text-lg">Total Categories</h3>
                        <p className="text-sm font-medium mt-1">Your high-level goals</p>
                    </div>

                    {/* Subtasks / Subtopics */}
                    <div className="bg-[#a18cd1] border-4 border-black p-6 rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <ListTodo size={32} className="text-black" />
                            <span className="text-4xl font-black">{totalSubtopics}</span>
                        </div>
                        <h3 className="font-bold uppercase tracking-wider text-lg">Total Subtasks</h3>
                        <div className="mt-2 text-sm font-bold flex flex-col gap-1 bg-black/10 p-2 rounded">
                            <span>{habitCount} Habits</span>
                            <span>{cumulativeCount} Cumulative</span>
                            <span>{taskGroupCount} Task Groups</span>
                        </div>
                    </div>

                    {/* Task Items */}
                    <div className="bg-[#84fab0] border-4 border-black p-6 rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <CheckSquare size={32} className="text-black" />
                            <span className="text-4xl font-black">{totalTaskItems}</span>
                        </div>
                        <h3 className="font-bold uppercase tracking-wider text-lg">Task Items</h3>
                        <p className="text-sm font-medium mt-1">Individual one-off tasks</p>
                    </div>

                    {/* Today's Trends */}
                    <div className="bg-yellow-300 border-4 border-black p-6 rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <TrendingUp size={32} className="text-black" />
                            <span className="text-4xl font-black">{displayPercent}%</span>
                        </div>
                        <h3 className="font-bold uppercase tracking-wider text-lg">{trendLabel}</h3>
                        <p className="text-sm font-medium mt-1">{trendDesc}</p>
                    </div>
                </div>
            </section>

            {/* Info Grid (About & Guide) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                <section className="bg-white border-4 border-black p-8 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-2xl font-black uppercase mb-4 flex items-center gap-2 border-b-4 border-black pb-2"><Info /> About MyTracker</h2>
                    <p className="text-lg font-medium text-slate-800 leading-relaxed">
                        MyTracker is a robust, no-excuses platform designed to help you break down your biggest ambitions into actionable daily steps. Whether you are building new habits, tracking cumulative targets like pages read, or managing a list of tasks, MyTracker keeps you accountable.
                    </p>
                </section>

                <section className="bg-slate-100 border-4 border-black p-8 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-2xl font-black uppercase mb-4 flex items-center gap-2 border-b-4 border-black pb-2"><BookOpen /> Quick Guide</h2>
                    <p className="text-lg font-medium text-slate-800 leading-relaxed mb-6">
                        Need a refresher on how to use the dashboard, manage your goals, or set up your daily plan? We have a comprehensive guide with videos and screenshots.
                    </p>
                    <Link href="/help" className="inline-block bg-black text-white font-black uppercase px-6 py-3 border-2 border-transparent hover:bg-slate-800 transition-colors rounded-lg">
                        Read Full Guide
                    </Link>
                </section>
            </div>

            {/* Contact & Socials */}
            <section className="bg-[#1a1a1a] text-white border-4 border-black p-8 rounded-xl shadow-[8px_8px_0px_0px_rgba(250,204,21,1)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-2xl font-black uppercase mb-4 border-b-2 border-white pb-2">Contact Us</h2>
                        <ul className="space-y-4 font-bold">
                            <li className="flex items-center gap-3 hover:text-yellow-400 transition-colors cursor-pointer">
                                <Mail /> support@mytracker.com
                            </li>
                            <li className="flex items-center gap-3 hover:text-yellow-400 transition-colors cursor-pointer">
                                <Phone /> +1 (555) 123-4567
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase mb-4 border-b-2 border-white pb-2">Follow Us</h2>
                        <ul className="space-y-4 font-bold">
                            <li className="flex items-center gap-3 hover:text-yellow-400 transition-colors cursor-pointer">
                                <Twitter /> @MyTrackerApp
                            </li>
                            <li className="flex items-center gap-3 hover:text-yellow-400 transition-colors cursor-pointer">
                                <Instagram /> @mytracker_official
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
