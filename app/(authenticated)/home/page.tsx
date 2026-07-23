'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Target, CheckSquare, Flame, Clock, Calendar, Activity, Star, ChevronRight, Sparkles } from 'lucide-react';
import { useGoalTracker } from '@/context/GoalContext';
import { getLocalDateString } from '@/lib/dateUtils';

export default function AuthenticatedHome() {
    const [hoveredDay, setHoveredDay] = useState<{date: string, count: number, x: number, y: number, pointerOffset: number} | null>(null);
    const { overallAveragePercent, dailyLineChartData, dailyPlans, dailyLogs } = useGoalTracker();
    const todayDateStr = getLocalDateString(new Date());
    const todayPlan = dailyPlans.find(dp => dp.date === todayDateStr);
    const focusCount = todayPlan ? (todayPlan.taskIds.length + todayPlan.subtopicIds.length + todayPlan.adHocTasks.length) : 0;
    
    // Calculate Github-like Activity Map Data
    const logCountsByDate = dailyLogs.reduce((acc, log) => {
        acc[log.date] = (acc[log.date] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const todayObj = new Date();
    const todayDayOfWeek = todayObj.getDay();
    const totalActivityMapDays = 24 * 7 + (todayDayOfWeek + 1);
    const activityMapDays = Array.from({ length: totalActivityMapDays }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (totalActivityMapDays - 1 - i));
        const dateStr = getLocalDateString(d);
        return {
            date: dateStr,
            count: logCountsByDate[dateStr] || 0
        };
    });

    // Calculate trend points
    const trendPoints = dailyLineChartData.map((d, i) => {
        const x = dailyLineChartData.length > 1 ? (i / (dailyLineChartData.length - 1)) * 100 : 50;
        const y = 100 - (d.percent || 0);
        return `${x},${y}`;
    });
    
    let trendPath = '';
    if (trendPoints.length > 0) {
        if (trendPoints.length === 1) {
            trendPath = `M0,${trendPoints[0].split(',')[1]} L100,${trendPoints[0].split(',')[1]}`;
        } else {
            trendPath = `M${trendPoints[0]}`;
            for (let i = 1; i < trendPoints.length; i++) {
                trendPath += ` L${trendPoints[i]}`;
            }
        }
    } else {
        trendPath = "M0,90 Q20,60 40,70 T80,40 T100,20"; // fallback
    }
    const fillPath = trendPoints.length > 0 ? `${trendPath} L100,100 L0,100 Z` : "M0,90 Q20,60 40,70 T80,40 T100,20 L100,100 L0,100 Z";

    return (
        <div className="w-full bg-transparent text-slate-800 font-sans pb-32 relative overflow-hidden z-10">


            {/* HERO SECTION */}
            <section className="min-h-[calc(100svh-8rem)] flex flex-col justify-center px-4 md:px-16 max-w-7xl mx-auto pt-12 mb-20 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-12">
                    <h1 className="order-1 lg:order-1 text-center lg:text-left text-6xl sm:text-7xl lg:text-[6rem] font-serif text-slate-900 tracking-tight leading-[1.05] z-10">
                        Master goals, <br />
                        <span className="italic text-slate-600 font-light">habits & clarity.</span>
                    </h1>
                    
                    <div className="order-2 lg:order-2 lg:row-span-3 flex justify-center lg:justify-end relative">
                        {/* Soft decorative background element for the image */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#e3ecef]/50 to-transparent rounded-full blur-3xl -z-10" />
                        <img
                            src="/assets/illustration.png"
                            alt="Dashboard Illustration"
                            className="w-full max-w-[280px] sm:max-w-md lg:max-w-lg object-contain mix-blend-multiply drop-shadow-2xl opacity-90"
                        />
                    </div>

                    <p className="order-3 lg:order-3 text-center lg:text-left text-lg md:text-xl text-slate-500 font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed z-10 pt-2 lg:pt-0">
                        We're a beautifully designed tracking platform, delivering the structure you'd expect from a robust system with the elegance you'd demand for your daily life.
                    </p>

                    <div className="order-4 lg:order-4 flex flex-wrap justify-center lg:justify-start gap-4 z-10 pt-4 lg:pt-2">
                        <Link href="/manage" className="px-8 py-4 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center gap-2">
                            Start Tracking <ChevronRight size={16} />
                        </Link>
                        <Link href="/profile" className="px-8 py-4 bg-white/70 backdrop-blur-md text-slate-700 rounded-full text-sm font-medium hover:bg-white/90 transition-all shadow-lg shadow-slate-200 border border-white/50">
                            View Profile
                        </Link>
                    </div>
                </div>
            </section>

            {/* ELEGANT QUOTE / MOTIVATION */}
            <section className="mt-24 px-6 md:px-16 max-w-5xl mx-auto text-center">
                <Sparkles className="mx-auto text-slate-300 mb-6" size={32} />
                <h3 className="text-3xl md:text-5xl font-serif text-slate-800 leading-tight">
                    "Transform your daily routines into a masterpiece of productivity and peace."
                </h3>
            </section>

            {/* PROGRESS AT A GLANCE (SOFT DASHBOARD) */}
            <section className="mt-32 px-6 md:px-16 max-w-7xl mx-auto">
                <div className="mb-16 md:flex md:items-end justify-between">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase mb-3">Your Progress</p>
                        <h2 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight">At a Glance.</h2>
                    </div>
                </div>

                {/* Soft Dashboard Grid Layout */}
                <div className="flex flex-col xl:flex-row gap-8 items-stretch">
                    {/* Left Column */}
                    <div className="grid grid-cols-2 xl:flex xl:flex-col gap-4 xl:gap-8 w-full xl:w-1/4">
                        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-4 sm:p-6 xl:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 transition-transform hover:-translate-y-1 duration-500">
                            <h4 className="text-xs sm:text-sm font-medium text-slate-500 flex items-center gap-1 sm:gap-2 mb-4 sm:mb-6"><Flame size={16} /> <span className="hidden sm:inline">Daily Streak</span><span className="sm:hidden">Streak</span></h4>
                            <div className="flex items-baseline gap-1 sm:gap-2 mb-4 sm:mb-8">
                                <span className="text-4xl sm:text-5xl xl:text-6xl font-serif text-slate-900 tracking-tighter">12</span>
                                <span className="text-slate-400 text-xs sm:text-sm">days</span>
                            </div>
                            <div className="flex items-end gap-1.5 h-16">
                                {[30, 45, 20, 60, 40, 80, 50].map((h, i) => (
                                    <div key={i} className="flex-1 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="w-full bg-[#8fb2c4] rounded-full transition-all duration-1000" style={{ height: `${h}%`, marginTop: `${100 - h}%` }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-4 sm:p-6 xl:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 flex-1 transition-transform hover:-translate-y-1 duration-500">
                            <h4 className="text-xs sm:text-sm font-medium text-slate-500 flex items-center gap-1 sm:gap-2 mb-4 sm:mb-6"><CheckSquare size={16} /> <span className="hidden sm:inline">Tasks Completed</span><span className="sm:hidden">Tasks</span></h4>
                            <div className="mb-4 sm:mb-6">
                                <span className="text-4xl sm:text-5xl xl:text-6xl font-serif text-slate-900 tracking-tighter">28</span>
                                <p className="text-slate-400 text-xs sm:text-sm mt-1">This Week</p>
                            </div>
                            <div className="w-24 h-24 rounded-full border-[6px] border-slate-50 border-t-[#8fb2c4] border-r-[#8fb2c4] mx-auto mt-8 rotate-45 transition-all duration-1000"></div>
                        </div>
                    </div>

                    {/* Middle Column */}
                    <div className="flex flex-col gap-8 w-full xl:w-2/4">
                        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 overflow-hidden h-full flex flex-col transition-transform hover:-translate-y-1 duration-500">
                            <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                                <h3 className="text-lg font-medium text-slate-900">Visuals</h3>
                            </div>

                            <div className="p-8 flex-1 flex flex-col">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 flex-1">
                                    <div className="bg-white/50 rounded-2xl p-6 flex flex-col justify-between border border-white/30">
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="text-sm font-medium text-slate-700">Monthly Progress</h4>
                                        </div>
                                        <div className="flex justify-center items-center flex-1">
                                            <div className="relative w-36 h-36 rounded-full border-[8px] border-slate-200 border-l-[#8fb2c4] flex items-center justify-center rotate-[-45deg]">
                                                <div className="text-center rotate-[45deg]">
                                                    <span className="text-3xl font-serif text-slate-900">{Math.round(overallAveragePercent || 0)}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/50 rounded-2xl p-6 flex flex-col justify-between border border-white/30 min-h-[160px]">
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="text-sm font-medium text-slate-700">Activity Trend</h4>
                                        </div>
                                        <div className="flex items-end flex-1 w-full relative min-h-[80px]">
                                            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                                <defs>
                                                    <linearGradient id="trend-gradient" x1="0" x2="0" y1="0" y2="1">
                                                        <stop offset="0%" stopColor="#8fb2c4" stopOpacity="0.4" />
                                                        <stop offset="100%" stopColor="#8fb2c4" stopOpacity="0.0" />
                                                    </linearGradient>
                                                </defs>
                                                <path d={fillPath} fill="url(#trend-gradient)" />
                                                <path d={trendPath} fill="none" stroke="#8fb2c4" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-end mb-4">
                                        <h4 className="text-sm font-medium text-slate-700">Activity Map</h4>
                                        <span className="text-xs text-slate-400">Last 6 months</span>
                                    </div>
                                    <div className="overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
                                        <div className="grid grid-rows-7 grid-flow-col gap-[3px] sm:gap-1.5 w-max">
                                            {activityMapDays.map((day) => (
                                                <div 
                                                    key={day.date} 
                                                    onMouseEnter={(e) => {
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const x = rect.left + rect.width / 2;
                                                        const safeX = Math.max(90, Math.min(x, (typeof window !== 'undefined' ? window.innerWidth : 1000) - 90));
                                                        setHoveredDay({ date: day.date, count: day.count, x: safeX, y: rect.top, pointerOffset: x - safeX });
                                                    }}
                                                    onMouseLeave={() => setHoveredDay(null)}
                                                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 rounded-[2px] sm:rounded-sm transition-colors duration-300 cursor-pointer ${
                                                        day.count === 0 ? 'bg-slate-100 hover:bg-slate-200' :
                                                        day.count < 2 ? 'bg-[#8fb2c4]/40 hover:bg-[#8fb2c4]/50' :
                                                        day.count < 4 ? 'bg-[#8fb2c4]/70 hover:bg-[#8fb2c4]/80' :
                                                        'bg-[#8fb2c4] hover:bg-[#7fa3b5]'
                                                    }`} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="grid grid-cols-2 xl:flex xl:flex-col gap-4 xl:gap-8 w-full xl:w-1/4">
                        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-4 sm:p-6 xl:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 transition-transform hover:-translate-y-1 duration-500 flex flex-col">
                            <h4 className="text-xs sm:text-sm font-medium text-slate-500 flex items-center gap-1 sm:gap-2 mb-4 sm:mb-6"><Target size={16} /> <span className="hidden sm:inline">Today's Focus</span><span className="sm:hidden">Focus</span></h4>
                            <div className="mb-4 sm:mb-6">
                                <span className="text-4xl sm:text-5xl xl:text-6xl font-serif text-slate-900 tracking-tighter">{focusCount}</span>
                                <p className="text-slate-400 text-xs sm:text-sm mt-1">Tasks Planned</p>
                            </div>
                            <Link href="/manage" className="text-sm font-medium text-[#8fb2c4] flex items-center gap-1 hover:text-slate-900 transition-colors mt-8">
                                View daily plan <ChevronRight size={14} />
                            </Link>
                        </div>

                        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-4 sm:p-6 xl:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 flex-1 transition-transform hover:-translate-y-1 duration-500 flex flex-col">
                            <h4 className="text-xs sm:text-sm font-medium text-slate-500 flex items-center gap-1 sm:gap-2 mb-4 sm:mb-6"><Clock size={16} /> <span className="hidden sm:inline">Time Logged</span><span className="sm:hidden">Time</span></h4>
                            <div className="mb-4 sm:mb-6">
                                <span className="text-4xl sm:text-5xl xl:text-6xl font-serif text-slate-900 tracking-tighter">3.6<span className="text-2xl sm:text-3xl text-slate-400">h</span></span>
                                <p className="text-slate-400 text-xs sm:text-sm mt-1">Productive hours</p>
                            </div>
                            <div className="h-16 mt-auto flex items-end relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#8fb2c4]/20 to-transparent rounded-lg" />
                                <svg className="w-full h-full relative z-10" preserveAspectRatio="none" viewBox="0 0 100 100">
                                    <path d="M0,80 Q25,30 50,60 T100,20" fill="none" stroke="#8fb2c4" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ELEGANT FEATURES */}
            <section className="mt-32 px-6 md:px-16 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1 relative">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-[#e3ecef]/50 to-transparent rounded-[3rem] blur-xl -z-10" />
                        <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-white/50">
                            <div className="grid grid-cols-2 gap-8">
                                {[
                                    { stat: '87%', text: 'Reported higher daily clarity' },
                                    { stat: '50+', text: 'Goals accomplished globally' },
                                    { stat: '100+', text: 'Daily routines optimized' },
                                    { stat: '4.9', text: 'Average user satisfaction' }
                                ].map((item, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="text-4xl font-serif text-slate-900">{item.stat}</div>
                                        <p className="text-sm text-slate-500 leading-relaxed pr-4">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 space-y-8">
                        <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">The Experience</p>
                        <h2 className="text-4xl md:text-5xl font-serif text-slate-900 leading-[1.1]">Everything you need.<br /><span className="text-slate-400 italic font-light">Nothing you don't.</span></h2>
                        <p className="text-lg text-slate-500 font-light leading-relaxed max-w-lg">
                            We've stripped away the noise so you can focus on the signal. A tranquil space designed specifically to help you build habits, track goals, and maintain your peace of mind.
                        </p>
                        <ul className="space-y-4 pt-4">
                            {['Intelligent daily tracking', 'Seamless habit formation', 'Beautiful, calm analytics'].map(item => (
                                <li key={item} className="flex items-center gap-4 text-slate-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#8fb2c4]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS (REFINED) */}
            <section className="mt-40 px-6 md:px-16 max-w-7xl mx-auto text-center">
                <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase mb-4">Methodology</p>
                <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-20">Simple steps to success</h2>

                <div className="flex justify-between items-start md:grid md:grid-cols-3 gap-2 sm:gap-4 md:gap-12 relative w-full">
                    {/* Connecting line */}
                    <div className="absolute top-8 sm:top-10 md:top-12 left-[16.6%] right-[16.6%] border-t-2 border-dashed border-[#8fb2c4]/40 -z-10" />

                    {[
                        { num: '01', title: 'Define', desc: 'Plant the seed. Articulate your goals with clarity and purpose.' },
                        { num: '02', title: 'Execute', desc: 'Nurture it daily. Break ambitions down into manageable habits.' },
                        { num: '03', title: 'Reflect', desc: 'Watch it grow. View beautiful insights that inspire continued action.' }
                    ].map((step, i) => (
                        <div key={i} className="flex flex-col items-center group flex-1 text-center px-1">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center mb-4 md:mb-8 border border-white/50 shadow-sm group-hover:shadow-md transition-shadow">
                                <span className="text-lg md:text-2xl font-serif text-[#8fb2c4]">{step.num}</span>
                            </div>
                            <h4 className="text-sm sm:text-base md:text-xl font-medium text-slate-900 mb-1 md:mb-3">{step.title}</h4>
                            <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 leading-snug md:leading-relaxed max-w-[100px] sm:max-w-xs">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="mt-40 px-6 md:px-16 max-w-5xl mx-auto">
                <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-slate-900/20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-700/40 via-transparent to-transparent opacity-60" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight">Ready for clarity?</h2>
                        <p className="text-slate-300 text-lg font-light max-w-xl mx-auto">
                            Join thousands of others who have found their focus and elevated their daily routines with MyTracker.
                        </p>
                        <div className="pt-4">
                            <Link href="/manage" className="inline-flex px-10 py-4 bg-white/90 backdrop-blur-md text-slate-900 rounded-full text-sm font-medium hover:bg-white transition-all shadow-lg shadow-white/10 items-center gap-2">
                                Begin Your Journey
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tooltip Portal */}
            {hoveredDay && (
                <div 
                    className="fixed z-[9999] pointer-events-none -translate-x-1/2 -translate-y-full pb-2"
                    style={{ left: hoveredDay.x, top: hoveredDay.y }}
                >
                    <div className="bg-slate-900 text-white text-xs py-1.5 px-3 rounded shadow-xl whitespace-nowrap relative">
                        <span className="font-semibold text-[#8fb2c4]">{hoveredDay.count}</span> {hoveredDay.count === 1 ? 'activity' : 'activities'} on {hoveredDay.date}
                        <svg 
                            className="absolute text-slate-900 h-2 w-4 top-full -translate-x-1/2" 
                            style={{ left: `calc(50% + ${hoveredDay.pointerOffset}px)` }}
                            x="0px" y="0px" viewBox="0 0 255 255"
                        >
                            <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
}
