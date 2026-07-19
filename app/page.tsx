'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { Target, ChevronRight, Sparkles, CheckCircle2, ClipboardCheck, Calendar, BarChart, Trophy } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter as useNextRouter } from 'next/navigation';

export default function LandingPage() {
    const { data: session } = useSession();
    const router = useNextRouter();

    useEffect(() => {
        if (session) {
            router.push('/home');
        }
    }, [session, router]);

    return (
        <div className="w-full bg-[#f0f0f0] text-slate-800 font-sans pb-32 relative overflow-hidden z-10">
            {/* Background Elements — identical to authenticated layout */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-300 rounded-full blur-[100px] opacity-30 animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-300 rounded-full blur-[100px] opacity-30 animate-pulse delay-1000" />
            </div>

            {/* HEADER */}
            <header className="w-full absolute top-0 left-0 right-0 px-6 md:px-16 py-6 flex justify-between items-center z-50 max-w-7xl mx-auto">
                <div className="font-serif font-bold text-2xl flex items-center gap-2 text-slate-900">
                    <Sparkles className="text-slate-400 w-5 h-5" />
                    MyTracker
                </div>
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Sign in</Link>
                    <Link href="/login" className="px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center gap-2">
                        Get Started <ChevronRight size={16} />
                    </Link>
                </div>
            </header>

            {/* HERO */}
            <section className="min-h-screen flex flex-col justify-center items-center px-4 md:px-16 max-w-5xl mx-auto pt-12 pb-8 md:pb-24 relative text-center">

                {/* Hero Illustration */}
                <div className="w-full max-w-xl mx-auto mb-12 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#e3ecef]/60 to-transparent rounded-full blur-3xl -z-10" />
                    <img
                        src="/assets/hero-illustration.png"
                        alt="Hero Illustration"
                        className="w-full object-contain mix-blend-multiply drop-shadow-2xl opacity-90"
                    />
                </div>

                {/* Headline */}
                <h1 className="text-5xl sm:text-6xl md:text-[5.5rem] font-serif text-slate-900 tracking-tight leading-[1.05] mb-6">
                    Master goals, <br />
                    <span className="italic text-slate-600 font-light">habits & clarity.</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-500 font-light max-w-2xl mx-auto leading-relaxed mb-10">
                    The beautifully designed tracking platform that brings structure to your ambitions and elegance to your daily routine.
                </p>

                {/* CTA */}
                <Link href="/login" className="px-10 py-4 bg-slate-900 text-white rounded-full text-base font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 inline-flex items-center gap-2">
                    Get Started <ChevronRight size={18} />
                </Link>
            </section>

            {/* ELEGANT QUOTE */}
            <section className="mt-4 md:mt-8 px-6 md:px-16 max-w-6xl mx-auto text-center">
                <Sparkles className="mx-auto text-slate-300 mb-6" size={32} />
                <h3 className="text-3xl md:text-5xl font-serif text-slate-800 leading-tight">
                    "Transform your daily routines into a masterpiece of productivity and peace."
                </h3>
            </section>

            {/* WHY MYTRACKER */}
            <section className="mt-24 md:mt-32 px-6 md:px-16 max-w-6xl mx-auto relative z-10">
                <div className="mb-12">
                    <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase mb-3">Why Choose Us</p>
                    <h2 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight">Why MyTracker?</h2>
                </div>

                <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <p className="text-lg text-slate-500 font-light mb-10">
                                One place for everything that matters to you.
                            </p>

                            <div className="space-y-5">
                                {[
                                    'Track Goals',
                                    'Manage Tasks',
                                    'Build Habits',
                                    'Plan Your Day',
                                    'Analyze Progress',
                                    'Stay Consistent',
                                    'Achieve More'
                                ].map(item => (
                                    <div key={item} className="flex items-center gap-4 text-base font-medium text-slate-700">
                                        <CheckCircle2 className="w-5 h-5 text-[#8fb2c4] shrink-0" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-center items-center">
                            <div className="relative w-full aspect-square max-w-[320px] border border-white/60 bg-white/40 backdrop-blur-3xl rounded-full shadow-xl flex items-center justify-center overflow-hidden">
                                <img
                                    src="/assets/illustration.png"
                                    alt="Dashboard Illustration"
                                    className="w-[75%] h-[75%] object-contain mix-blend-multiply drop-shadow-lg opacity-90"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* THE EXPERIENCE */}
            <section className="mt-32 px-6 md:px-16 max-w-6xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1 relative">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-[#e3ecef]/50 to-transparent rounded-[3rem] blur-xl -z-10" />
                        <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-white/50">
                            <div className="grid grid-cols-2 gap-8">
                                {[
                                    { stat: '87%', text: 'Reported higher daily clarity' },
                                    { stat: '3.2M', text: 'Goals accomplished globally' },
                                    { stat: '15M', text: 'Daily routines optimized' },
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

            {/* HOW IT WORKS */}
            <section className="mt-40 px-6 md:px-16 max-w-6xl mx-auto text-center relative z-10">
                <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase mb-4">How It Works</p>
                <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-20 tracking-tight">Simple Steps, Big Results</h2>

                <div className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-4 relative w-full pb-8">
                    <div className="hidden md:block absolute top-12 left-[10%] right-[10%] border-t-2 border-dashed border-slate-300 -z-10" />

                    {[
                        { num: '1', title: 'Create Goal', desc: 'Define what you want to achieve.', icon: Target },
                        { num: '2', title: 'Break into Tasks', desc: 'Divide goals into actionable steps.', icon: ClipboardCheck },
                        { num: '3', title: 'Work Daily', desc: 'Focus and build consistency.', icon: Calendar },
                        { num: '4', title: 'Track Progress', desc: 'Visualize results, stay motivated.', icon: BarChart },
                        { num: '5', title: 'Achieve Goal', desc: 'Celebrate wins, set new goals.', icon: Trophy }
                    ].map((step, i) => (
                        <div key={i} className="flex flex-col items-center group flex-1 text-center px-2">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/70 backdrop-blur-sm flex items-center justify-center mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/50 group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300 relative">
                                <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-medium">{step.num}</span>
                                <step.icon className="w-8 h-8 text-slate-500" strokeWidth={1.5} />
                            </div>
                            <h4 className="text-sm font-medium text-slate-900 mb-1">{step.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* SIMPLE STEPS TO SUCCESS */}
            <section className="mt-40 px-6 md:px-16 max-w-6xl mx-auto text-center relative z-10">
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

            {/* LOVED BY THOUSANDS */}
            <section className="mt-40 px-6 md:px-16 max-w-6xl mx-auto text-center mb-40 relative z-10">
                <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase mb-4">Testimonials</p>
                <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-20 tracking-tight">Loved by Thousands</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    {[
                        { quote: "MyTracker helped me stay consistent and finally crack GATE. The best tracking tool I've ever used.", name: "Rohit Sharma", title: "Engineering Student", initial: "R" },
                        { quote: "The habit tracker and analytics keep me motivated every single day. Highly recommended!", name: "Ananya Verma", title: "UPSC Aspirant", initial: "A" },
                        { quote: "Clean, simple and powerful. Everything I need in one place.", name: "Karan Mehta", title: "Software Developer", initial: "K" }
                    ].map((t, i) => (
                        <div key={i} className="bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-white/50 flex flex-col justify-between h-full hover:-translate-y-1 transition-transform duration-300">
                            <div>
                                <div className="text-6xl font-serif text-slate-200 leading-none mb-4">"</div>
                                <p className="text-slate-600 leading-relaxed mb-8 text-base font-light">{t.quote}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-serif text-xl">{t.initial}</div>
                                <div>
                                    <h4 className="font-medium text-slate-900">{t.name}</h4>
                                    <p className="text-sm text-slate-500">{t.title}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA BANNER */}
            <section className="mt-20 px-6 md:px-16 max-w-6xl mx-auto relative z-10">
                <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-slate-900/20">
                    <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-bl from-slate-700/40 via-transparent to-transparent opacity-60" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight">Ready to take control?</h2>
                        <p className="text-slate-300 text-lg font-light max-w-xl mx-auto">
                            Join thousands of others who have found their focus and elevated their daily routines with MyTracker.
                        </p>
                        <div className="pt-4">
                            <Link href="/login" className="inline-flex px-10 py-4 bg-white text-slate-900 rounded-full text-sm font-medium hover:bg-slate-100 transition-all shadow-lg items-center gap-2">
                                Sign up free <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
