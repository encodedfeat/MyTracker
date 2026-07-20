'use client';
import React from 'react';
import { User, SlidersHorizontal, LayoutGrid, List, Flame, Bell, Lock, Database, Palette, Plug, CreditCard, HelpCircle, History, ShieldCheck, ChevronDown, Download, Upload, Save, ArrowRight, Target as TargetIcon, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export function ProfileSection({ session }: { session?: any }) {
    return (
        <section id="profile" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-black mb-2 tracking-tight">Profile Settings</h2>
            <p className="text-slate-500 font-medium text-sm mb-6">Manage your personal information and account details.</p>

            <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0_0_#000] mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b-2 border-slate-100 pb-4 gap-4">
                    <h3 className="font-bold text-lg">Profile Information</h3>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button className="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-2 border-2 border-black rounded-md font-bold text-sm hover:bg-slate-100 transition-colors shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]">
                            <User size={16} /> Edit Profile
                        </button>
                        <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-2 border-2 border-red-600 text-red-600 rounded-md font-bold text-sm hover:bg-red-50 transition-colors shadow-[2px_2px_0_0_#dc2626] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
                
                <div className="flex flex-col gap-6 md:gap-8">
                    {/* Top Row: Icon + Username/Email */}
                    <div className="flex flex-row items-center gap-4 md:gap-6">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-blue-400 to-orange-400 border-2 border-black flex items-center justify-center overflow-hidden shadow-inner flex-shrink-0">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl md:text-4xl">🦁</span>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 md:gap-4">
                            <div>
                                <p className="text-[10px] md:text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">User Name</p>
                                <p className="font-black text-sm md:text-lg leading-none">{session?.user?.name || 'Lion Tracker'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] md:text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Email Address</p>
                                <p className="font-bold text-slate-700 text-xs md:text-base leading-none break-all">{session?.user?.email || 'lion.tracker@example.com'}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Bottom Row: Member Since / Account Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] md:text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Member Since</p>
                            <p className="font-black text-sm md:text-lg">June 12, 2026</p>
                        </div>
                        <div>
                            <p className="text-[10px] md:text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Account Type</p>
                            <div className="flex items-start">
                                <span className="inline-block px-3 py-1 border-2 border-black rounded-md font-bold text-xs bg-white">Free Plan</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0_0_#000]">
                    <h3 className="font-bold text-lg mb-6 border-b-2 border-slate-100 pb-4">Account Summary</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b-2 border-dashed border-slate-200 pb-2">
                            <span className="font-bold flex items-center gap-2"><LayoutGrid size={16} /> Goals Tracked</span>
                            <span className="font-black text-lg">24</span>
                        </div>
                        <div className="flex items-center justify-between border-b-2 border-dashed border-slate-200 pb-2">
                            <span className="font-bold flex items-center gap-2"><List size={16} /> Tasks Completed</span>
                            <span className="font-black text-lg">238</span>
                        </div>
                        <div className="flex items-center justify-between border-b-2 border-dashed border-slate-200 pb-2">
                            <span className="font-bold flex items-center gap-2"><Flame size={16} /> Habits Active</span>
                            <span className="font-black text-lg">7</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-bold flex items-center gap-2"><History size={16} /> Current Streak</span>
                            <span className="font-black text-lg">12 days</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-[#f9f9f9] border-2 border-black rounded-xl p-6 shadow-[4px_4px_0_0_#000] flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="font-bold text-lg">Your Plan</h3>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-black rounded-md font-bold text-xs hover:bg-slate-100 transition-colors shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]">
                                Upgrade <ArrowRight size={14} />
                            </button>
                        </div>
                        <p className="font-black mb-4">Free Plan</p>
                        <ul className="space-y-2 text-sm font-medium text-slate-700">
                            <li className="flex items-center gap-2"><span>✓</span> Up to 10 active goals</li>
                            <li className="flex items-center gap-2"><span>✓</span> Basic analytics</li>
                            <li className="flex items-center gap-2"><span>✓</span> Habit tracking</li>
                            <li className="flex items-center gap-2"><span>✓</span> Community support</li>
                        </ul>
                    </div>
                    <p className="text-xs font-bold text-slate-500 mt-6">Upgrade to unlock more powerful features.</p>
                </div>
            </div>
        </section>
    );
}

export function PreferencesSection() {
    return (
        <section id="preferences" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-black mb-2 tracking-tight">Preferences</h2>
            <p className="text-slate-500 font-medium text-sm mb-6">Manage how MyTracker works for you.</p>

            <div className="bg-white border-2 border-black rounded-xl p-0 shadow-[4px_4px_0_0_#000] overflow-hidden">
                <div className="p-4 md:p-6 border-b-2 border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex gap-4">
                        <div className="mt-1"><LayoutGrid size={24} /></div>
                        <div>
                            <h4 className="font-bold">Default View</h4>
                            <p className="text-xs text-slate-500 font-medium">Choose your default landing page.</p>
                        </div>
                    </div>
                    <div className="relative">
                        <select className="appearance-none bg-white border-2 border-black rounded-md font-bold text-sm px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black w-full md:w-auto cursor-pointer shadow-[2px_2px_0_0_#000]">
                            <option>Dashboard</option>
                            <option>Home</option>
                            <option>Daily Plan</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
                    </div>
                </div>

                <div className="p-4 md:p-6 border-b-2 border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex gap-4">
                        <div className="mt-1"><Flame size={24} /></div>
                        <div>
                            <h4 className="font-bold">Week Starts On</h4>
                            <p className="text-xs text-slate-500 font-medium">Select the first day of your week.</p>
                        </div>
                    </div>
                    <div className="relative">
                        <select className="appearance-none bg-white border-2 border-black rounded-md font-bold text-sm px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black w-full md:w-auto cursor-pointer shadow-[2px_2px_0_0_#000]">
                            <option>Sunday</option>
                            <option>Monday</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
                    </div>
                </div>

                <div className="p-4 md:p-6 border-b-2 border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex gap-4">
                        <div className="mt-1"><History size={24} /></div>
                        <div>
                            <h4 className="font-bold">Date Format</h4>
                            <p className="text-xs text-slate-500 font-medium">Choose your preferred date format.</p>
                        </div>
                    </div>
                    <div className="relative">
                        <select className="appearance-none bg-white border-2 border-black rounded-md font-bold text-sm px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black w-full md:w-auto cursor-pointer shadow-[2px_2px_0_0_#000]">
                            <option>Jul 19, 2026 (MMM DD, YYYY)</option>
                            <option>2026-07-19 (YYYY-MM-DD)</option>
                            <option>19/07/2026 (DD/MM/YYYY)</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
                    </div>
                </div>

                <div className="p-4 md:p-6 border-b-2 border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex gap-4">
                        <div className="mt-1"><List size={24} /></div>
                        <div>
                            <h4 className="font-bold">Show Completed Tasks</h4>
                            <p className="text-xs text-slate-500 font-medium">Show completed tasks in task lists.</p>
                        </div>
                    </div>
                    <Toggle isOn={true} />
                </div>

                <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50">
                    <div className="flex gap-4">
                        <div className="mt-1"><Target size={24} /></div>
                        <div>
                            <h4 className="font-bold">Enable Focus Mode</h4>
                            <p className="text-xs text-slate-500 font-medium">Hide distractions and boost productivity.</p>
                        </div>
                    </div>
                    <Toggle isOn={false} />
                </div>
            </div>
        </section>
    );
}

export function NotificationsSection() {
    return (
        <section id="notifications" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-black mb-2 tracking-tight">Notifications</h2>
            <p className="text-slate-500 font-medium text-sm mb-6">Choose what you want to be notified about.</p>

            <div className="bg-white border-2 border-black rounded-xl p-0 shadow-[4px_4px_0_0_#000] overflow-hidden">
                <NotificationRow icon={<Bell />} title="Daily Reminders" desc="Get reminded about your daily plan and tasks." isOn={true} />
                <NotificationRow icon={<Flame />} title="Habit Reminders" desc="Get reminded to complete your habits." isOn={true} />
                <NotificationRow icon={<LayoutGrid />} title="Weekly Summary" desc="Receive a weekly summary of your progress." isOn={true} />
                <NotificationRow icon={<History />} title="Motivational Quotes" desc="Get daily motivational quotes." isOn={false} />
                <NotificationRow icon={<List />} title="Task Due Alerts" desc="Get alerts for upcoming due tasks." isOn={true} />
                <NotificationRow icon={<Target />} title="Goal Milestones" desc="Get notified when you reach goal milestones." isOn={true} isLast />
            </div>
        </section>
    );
}

function NotificationRow({ icon, title, desc, isOn, isLast = false }: { icon: React.ReactNode, title: string, desc: string, isOn: boolean, isLast?: boolean }) {
    return (
        <div className={`p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${!isLast ? 'border-b-2 border-slate-100' : ''}`}>
            <div className="flex gap-4">
                <div className="mt-1">{icon}</div>
                <div>
                    <h4 className="font-bold">{title}</h4>
                    <p className="text-xs text-slate-500 font-medium">{desc}</p>
                </div>
            </div>
            <Toggle isOn={isOn} />
        </div>
    );
}

export function PrivacyDataSection() {
    return (
        <section id="privacy" className="mb-16 scroll-mt-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Privacy & Security */}
                <div>
                    <h2 className="text-2xl font-black mb-6 tracking-tight">Privacy & Security</h2>
                    <div className="bg-white border-2 border-black rounded-xl p-0 shadow-[4px_4px_0_0_#000] overflow-hidden">
                        <div className="p-4 md:p-6 border-b-2 border-slate-100 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-sm">Change Password</h4>
                                <p className="text-xs text-slate-500 font-medium mt-1">Update your account password.</p>
                            </div>
                            <button className="px-4 py-1.5 border-2 border-black rounded-md font-bold text-xs hover:bg-slate-100 shadow-[2px_2px_0_0_#000]">Change</button>
                        </div>
                        <div className="p-4 md:p-6 border-b-2 border-slate-100 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-sm">Two-Factor Authentication</h4>
                                <p className="text-xs text-slate-500 font-medium mt-1">Add an extra layer of security.</p>
                            </div>
                            <button className="px-4 py-1.5 border-2 border-black rounded-md font-bold text-xs hover:bg-slate-100 shadow-[2px_2px_0_0_#000]">Enable</button>
                        </div>
                        <div className="p-4 md:p-6 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-sm">Active Sessions</h4>
                                <p className="text-xs text-slate-500 font-medium mt-1">Manage your active sessions.</p>
                            </div>
                            <button className="px-4 py-1.5 border-2 border-black rounded-md font-bold text-xs hover:bg-slate-100 shadow-[2px_2px_0_0_#000]">View</button>
                        </div>
                    </div>
                </div>

                {/* Data & Backup */}
                <div id="data">
                    <h2 className="text-2xl font-black mb-6 tracking-tight">Data & Backup</h2>
                    <div className="bg-white border-2 border-black rounded-xl p-0 shadow-[4px_4px_0_0_#000] overflow-hidden">
                        <div className="p-4 md:p-6 border-b-2 border-slate-100 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-sm">Export Data</h4>
                                <p className="text-xs text-slate-500 font-medium mt-1">Download all your data.</p>
                            </div>
                            <button className="px-4 py-1.5 border-2 border-black rounded-md font-bold text-xs hover:bg-slate-100 shadow-[2px_2px_0_0_#000] flex items-center gap-1"><Download size={14}/> Export</button>
                        </div>
                        <div className="p-4 md:p-6 border-b-2 border-slate-100 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-sm">Import Data</h4>
                                <p className="text-xs text-slate-500 font-medium mt-1">Import data from a file.</p>
                            </div>
                            <button className="px-4 py-1.5 border-2 border-black rounded-md font-bold text-xs hover:bg-slate-100 shadow-[2px_2px_0_0_#000] flex items-center gap-1"><Upload size={14}/> Import</button>
                        </div>
                        <div className="p-4 md:p-6 flex justify-between items-center bg-[#fdfaf5]">
                            <div>
                                <h4 className="font-bold text-sm">Backup Now</h4>
                                <p className="text-xs text-slate-500 font-medium mt-1">Create a backup of your data.</p>
                            </div>
                            <button className="px-4 py-1.5 border-2 border-black rounded-md font-bold text-xs bg-yellow-300 hover:bg-yellow-400 shadow-[2px_2px_0_0_#000] flex items-center gap-1"><Save size={14}/> Backup</button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Trust Banner */}
            <div className="mt-8 bg-[#f4f7fe] border-2 border-[#b5c7f2] rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-white border-2 border-[#b5c7f2] flex items-center justify-center shrink-0">
                    <ShieldCheck size={32} className="text-blue-500" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-bold text-lg mb-1">Your data is safe with us.</h4>
                    <p className="text-sm font-medium text-slate-600 max-w-lg">We use industry-standard encryption and security measures to protect your information.</p>
                </div>
                <button className="px-6 py-2 border-2 border-black rounded-md font-bold text-sm bg-white hover:bg-slate-50 shadow-[2px_2px_0_0_#000] flex items-center gap-2 whitespace-nowrap">
                    Learn More <ArrowRight size={16} />
                </button>
            </div>
        </section>
    );
}

// Simple Toggle Component
function Toggle({ isOn }: { isOn: boolean }) {
    return (
        <div className={`w-12 h-6 rounded-full border-2 border-black flex items-center px-1 transition-colors ${isOn ? 'bg-blue-500' : 'bg-slate-300'}`}>
            <div className={`w-4 h-4 rounded-full bg-white border-2 border-black transition-transform ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
        </div>
    );
}

// Target icon alias
function Target(props: any) {
    return <TargetIcon {...props} />
}
