import React, { useState, useEffect } from 'react';
import { User, SlidersHorizontal, LayoutGrid, List, Flame, Bell, Lock, Database, Palette, Plug, CreditCard, HelpCircle, History, ArrowRight, Menu, X } from 'lucide-react';

const navigationItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
    { id: 'categories', label: 'Categories', icon: LayoutGrid },
    { id: 'subtopics', label: 'Subtopics', icon: List },
    { id: 'tasks', label: 'Tasks', icon: Flame },
    { id: 'habits', label: 'Habit Settings', icon: Flame },
    { id: 'log', label: 'Cumulative', icon: History },
    { id: 'dailyPlan', label: 'Daily Plan', icon: LayoutGrid },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Lock },
    { id: 'data', label: 'Data & Backup', icon: Database },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
    { id: 'activity', label: 'Activity Logs', icon: History },
];

interface SettingsSidebarProps {
    activeSection: string;
    onSelectSection: (id: string) => void;
}

export function SettingsSidebar({ activeSection, onSelectSection }: SettingsSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Close sidebar on section select (mobile)
    const handleSelect = (id: string) => {
        onSelectSection(id);
        setIsOpen(false);
    };

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    return (
        <>
            {/* Mobile Toggle Button */}
            <div className="md:hidden w-full flex justify-start">
                <button 
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-black rounded-lg font-bold bg-white shadow-[2px_2px_0_0_#000] hover:bg-slate-50 transition-colors"
                >
                    <Menu size={18} />
                    <span>Settings Menu</span>
                </button>
            </div>

            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar (Drawer on mobile, Sticky on desktop) */}
            <aside className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 border-r-2 border-black shadow-[4px_0_10px_rgba(0,0,0,0.1)] transform transition-transform duration-300 ease-in-out md:relative md:h-auto md:w-64 md:bg-transparent md:border-none md:shadow-none md:translate-x-0 flex-shrink-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                
                <div className="flex flex-col h-full md:block md:sticky md:top-24 md:max-h-[calc(100vh-8rem)] p-6 md:p-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    
                    {/* Mobile Header with Close Button */}
                    <div className="flex justify-between items-center mb-8 md:hidden">
                        <h3 className="font-black text-xl uppercase tracking-widest pl-1">Settings</h3>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="p-1 border-2 border-black rounded bg-slate-50 hover:bg-slate-200 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <h3 className="hidden md:block font-black text-lg mb-4 uppercase tracking-widest pl-2">Settings</h3>
                    
                    <div className="mb-6 mx-2 md:mx-0 px-3 py-2 bg-amber-50 border-2 border-amber-500 rounded-lg shadow-[2px_2px_0_0_#f59e0b]">
                        <p className="text-xs font-bold text-amber-900 leading-snug">
                            ⚠️ Note: This entire page is under construction and features may not work.
                        </p>
                    </div>
                    
                    <nav className="flex flex-col space-y-1 mb-8">
                        {navigationItems.map(item => {
                            const isActive = activeSection === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleSelect(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 md:py-2.5 rounded-lg font-bold text-sm md:text-sm transition-all text-left ${
                                        isActive 
                                        ? 'bg-[#eef3fb] text-blue-700 shadow-sm border border-blue-100' 
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-black'
                                    }`}
                                >
                                    <item.icon size={18} className={`flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                                    <span className="truncate">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    <div className="mt-auto md:mt-0 bg-white border-2 border-black rounded-xl p-4 shadow-[4px_4px_0_0_#000]">
                        <h4 className="font-bold text-sm mb-1">Need Help?</h4>
                        <p className="text-xs font-medium text-slate-500 mb-4 leading-relaxed">
                            Check our docs or contact support.
                        </p>
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-black rounded-md font-bold text-xs hover:bg-slate-100 transition-colors shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]">
                            Go to Help Center <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
