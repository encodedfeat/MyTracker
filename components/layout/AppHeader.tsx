// components/layout/AppHeader.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { HowToUseModal } from '../guide/HowToUseModal';
import { Home, LayoutDashboard, Settings, HelpCircle, LogOut, User, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGoalTracker } from '@/context/GoalContext';

const navItems = [
    { id: 'home', name: 'Home', icon: Home, href: '/home' },
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'manage', name: 'Manage', icon: Settings, href: '/manage' },
];

export function AppHeader() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { selectedDate, changeMonth } = useGoalTracker();
    const [isGuideOpen, setIsGuideOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    
    const monthYear = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <>
            <header
                className="bg-gray-950/80 backdrop-blur-lg border-b-2 border-black sticky top-0 z-50"
                style={{
                    backgroundColor: '#ffffff',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center relative gap-4">
                    {/* Far Left: Logo */}
                    <div className="flex items-center flex-shrink-0">
                        <Link href="/" className="flex items-center gap-2 md:gap-3">
                            <img
                                src="/assist/guide/brutalist_logo.png"
                                alt="MyTracker Logo"
                                className="h-10 w-10 md:h-12 md:w-12 object-cover rounded-md"
                            />
                            <span className="hidden sm:inline text-base md:text-lg font-black uppercase tracking-wider text-black mt-1">MYTRACKER</span>
                        </Link>
                    </div>

                    {/* Middle-Left: Navigation (Desktop) */}
                    <div className="hidden md:flex items-center gap-4 flex-1 justify-start ml-8">
                        {navItems.map(item => {
                            const isActive = (item.href === '/' && pathname === '/') ||
                                (item.href !== '/' && pathname.startsWith(item.href));

                            if (item.id === 'home') {
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        title={item.name}
                                        className={`flex items-center justify-center w-[42px] h-[42px] transition-all duration-300 border-2 rounded-lg ${isActive
                                            ? 'text-black bg-white border-black border-4 shadow-[4px_4px_0_0_#000]'
                                            : 'text-black bg-white border-slate-300 hover:bg-slate-100 hover:border-black'
                                            }`}
                                    >
                                        <item.icon size={20} />
                                    </Link>
                                );
                            }

                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-6 py-2.5 font-black uppercase tracking-wider text-sm transition-all duration-300 border-2 rounded-lg ${isActive
                                        ? 'text-black bg-white border-black border-4 shadow-[4px_4px_0_0_#000]'
                                        : 'text-black bg-white border-slate-300 hover:bg-slate-100 hover:border-black'
                                        }`}
                                >
                                    <item.icon size={16} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                        
                    </div>

                    {/* Middle-Right: Month Picker */}
                    <div className="flex items-center justify-center flex-shrink-0">
                        <div className="flex items-center space-x-1 md:space-x-2 bg-slate-50/50 px-2 py-1.5 rounded-lg border-2 border-slate-300">
                            <button
                                onClick={() => changeMonth(-1)}
                                className="p-1 md:p-1.5 hover:bg-slate-200 rounded transition-colors text-slate-700 hover:text-black"
                                aria-label="Previous month"
                            >
                                <ChevronLeft size={18} className="md:w-5 md:h-5" />
                            </button>
                            <span className="text-sm md:text-base font-bold text-slate-800 min-w-[100px] md:min-w-[120px] text-center tracking-wide">
                                {monthYear}
                            </span>
                            <button
                                onClick={() => changeMonth(1)}
                                className="p-1 md:p-1.5 hover:bg-slate-200 rounded transition-colors text-slate-700 hover:text-black"
                                aria-label="Next month"
                            >
                                <ChevronRight size={18} className="md:w-5 md:h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Right: Profile Dropdown & Mobile Menu */}
                    <div className="flex items-center justify-end flex-shrink-0">
                        <div className="relative pl-2 md:pl-4 border-l-2 border-slate-300 ml-2 md:ml-4 flex items-center gap-3">
                            <button
                                onClick={() => setIsGuideOpen(true)}
                                title="How to Use"
                                className="hidden md:flex items-center justify-center w-[42px] h-[42px] bg-white hover:bg-slate-100 hover:border-black text-black text-xl font-black transition-all duration-300 border-2 border-slate-300 rounded-lg"
                            >
                                <span>?</span>
                            </button>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="focus:outline-none flex items-center justify-center"
                            >
                                {session?.user?.image ? (
                                    <img
                                        src={session.user.image}
                                        alt="Profile"
                                        className="w-10 h-10 md:w-[42px] md:h-[42px] rounded-lg border-2 border-slate-300 hover:border-black transition-colors object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 md:w-[42px] md:h-[42px] rounded-lg bg-slate-50 flex items-center justify-center border-2 border-slate-300 hover:border-black transition-colors">
                                        <User size={20} className="text-black" />
                                    </div>
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-50">
                                    <div className="px-4 py-3 border-b-2 border-slate-100">
                                        <p className="text-sm font-bold text-black truncate">{session?.user?.name || 'User'}</p>
                                        <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
                                    </div>
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-black hover:bg-slate-50 rounded-lg transition-colors ml-4"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-b-4 border-black absolute w-full z-40 animate-fadeIn">
                        <div className="px-4 py-6 space-y-4">
                            {navItems.map(item => {
                                const isActive = (item.href === '/' && pathname === '/') ||
                                    (item.href !== '/' && pathname.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-black uppercase tracking-wider transition-all border-2 ${isActive
                                            ? 'bg-white text-black border-black border-4 shadow-[4px_4px_0_0_#000]'
                                            : 'bg-white text-black border-slate-300 hover:border-black hover:shadow-[4px_4px_0_0_#000]'
                                            }`}
                                    >
                                        <item.icon size={20} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                            <button
                                onClick={() => {
                                    setIsGuideOpen(true);
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-black uppercase tracking-wider text-black bg-white border-2 border-slate-300 hover:border-black hover:shadow-[4px_4px_0_0_#000] transition-all text-left"
                            >
                                <span className="flex items-center justify-center w-5 h-5 font-black text-lg">?</span>
                                <span>How to Use</span>
                            </button>
                        </div>
                    </div>
                )}
            </header >

            <HowToUseModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
        </>
    );
}




