import React from 'react';
import Link from 'next/link';
import { ArrowLeft, PlayCircle, Image as ImageIcon } from 'lucide-react';

export default function HelpPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 mb-24">
            <div className="flex items-center gap-4 mb-8">
                <Link 
                    href="/home"
                    className="p-2 border-2 border-black rounded-lg hover:bg-slate-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white"
                >
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">How to Use MyTracker</h1>
            </div>

            <div className="space-y-12">
                {/* Introduction */}
                <section className="bg-white border-4 border-black p-6 md:p-8 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-2xl font-black uppercase mb-4 border-b-4 border-black pb-2">1. The Dashboard Overview</h2>
                    <p className="text-lg font-medium text-slate-800 mb-6 leading-relaxed">
                        Welcome to your command center. The dashboard gives you a bird's-eye view of your yearly goals, monthly targets, and daily progress. Here is how you can navigate through the different sections to stay on top of your tasks.
                    </p>
                    
                    {/* Placeholder for Video */}
                    <div className="bg-slate-100 border-2 border-black border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-slate-600 mb-6 cursor-pointer hover:bg-slate-200 transition-colors">
                        <PlayCircle size={48} className="mb-2" />
                        <span className="font-bold uppercase tracking-wider text-sm mt-2 text-center">Watch: Dashboard Walkthrough (YouTube)</span>
                    </div>

                    {/* Placeholder for Screenshot */}
                    <div className="bg-slate-100 border-2 border-black rounded-lg p-12 flex flex-col items-center justify-center text-slate-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <ImageIcon size={48} className="mb-2" />
                        <span className="font-bold uppercase tracking-wider text-sm text-center">Screenshot: Dashboard Layout</span>
                    </div>
                </section>

                {/* Managing Goals */}
                <section className="bg-[#facc15] border-4 border-black p-6 md:p-8 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-2xl font-black uppercase mb-4 border-b-4 border-black pb-2">2. Setting Up Your Goals</h2>
                    <p className="text-lg font-medium text-slate-900 mb-6 leading-relaxed">
                        Navigate to the <strong>Manage</strong> page to start planning. First, define your broad yearly goals. Then, break them down into specific categories and actionable tasks. You can edit or delete them anytime using the action buttons on each card.
                    </p>

                    {/* Placeholder for Video */}
                    <div className="bg-yellow-50 border-2 border-black border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-slate-700 mb-6 cursor-pointer hover:bg-yellow-100 transition-colors">
                        <PlayCircle size={48} className="mb-2" />
                        <span className="font-bold uppercase tracking-wider text-sm mt-2 text-center">Watch: Creating Goals & Subtopics (YouTube)</span>
                    </div>

                    {/* Placeholder for Screenshot */}
                    <div className="bg-white border-2 border-black rounded-lg p-12 flex flex-col items-center justify-center text-slate-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <ImageIcon size={48} className="mb-2" />
                        <span className="font-bold uppercase tracking-wider text-sm text-center">Screenshot: Manage Page Interface</span>
                    </div>
                </section>

                {/* Daily Planning */}
                <section className="bg-white border-4 border-black p-6 md:p-8 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-2xl font-black uppercase mb-4 border-b-4 border-black pb-2">3. The Daily Plan</h2>
                    <p className="text-lg font-medium text-slate-800 mb-6 leading-relaxed">
                        Every day, select the specific tasks and cumulative targets you want to focus on. Use the date picker to navigate between days. If you didn't plan anything for a past date, it will show as read-only. For today, you can freely edit your plan and add ad-hoc tasks!
                    </p>

                    {/* Placeholder for Video */}
                    <div className="bg-slate-100 border-2 border-black border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-slate-600 mb-6 cursor-pointer hover:bg-slate-200 transition-colors">
                        <PlayCircle size={48} className="mb-2" />
                        <span className="font-bold uppercase tracking-wider text-sm mt-2 text-center">Watch: Mastering the Daily Plan (YouTube)</span>
                    </div>

                    {/* Placeholder for Screenshot */}
                    <div className="bg-slate-100 border-2 border-black rounded-lg p-12 flex flex-col items-center justify-center text-slate-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <ImageIcon size={48} className="mb-2" />
                        <span className="font-bold uppercase tracking-wider text-sm text-center">Screenshot: Daily Plan Edit Mode</span>
                    </div>
                </section>
                
                {/* Need more help */}
                <section className="bg-black text-white border-4 border-black p-6 md:p-8 rounded-xl shadow-[8px_8px_0px_0px_rgba(250,204,21,1)]">
                    <h2 className="text-2xl font-black uppercase mb-4 border-b-4 border-white pb-2">Still Need Help?</h2>
                    <p className="text-lg font-medium mb-6 leading-relaxed text-slate-300">
                        If you have any more questions or run into issues, feel free to reach out to our support team or consult the community forums.
                    </p>
                    <button className="bg-white text-black font-black uppercase tracking-wider px-8 py-4 border-2 border-white rounded-lg hover:bg-slate-200 transition-colors w-full sm:w-auto">
                        Contact Support
                    </button>
                </section>
            </div>
        </div>
    );
}
