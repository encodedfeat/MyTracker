// components/layout/AppHeader.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { HowToUseModal } from '../guide/HowToUseModal';
import { LayoutDashboard, Settings, HelpCircle, LogOut, User, Menu, X } from 'lucide-react';

const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'manage', name: 'Manage', icon: Settings, href: '/manage' },
];

export function AppHeader() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isGuideOpen, setIsGuideOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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
                <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-3">
                            <img
                                src="/assist/guide/brutalist_logo.png"
                                alt="MyTracker Logo"
                                className="h-10 w-10 object-cover"
                            />
                            <span className="text-xl font-black uppercase tracking-wider text-black">MyTracker</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-2">
                            {navItems.map(item => {
                                const isActive = (item.href === '/' && pathname === '/') ||
                                    (item.href !== '/' && pathname.startsWith(item.href));

                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className={`flex items-center gap-2 px-6 py-2.5 font-black uppercase tracking-wider text-sm transition-all duration-300 border-2 rounded-lg ${isActive
                                            ? 'text-black bg-white border-black border-4 shadow-[4px_4px_0_0_#000]'
                                            : 'text-black bg-white border-slate-300 hover:bg-slate-100'
                                            }`}
                                    >
                                        <item.icon size={16} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* How to Use Button - Desktop */}
                        <button
                            onClick={() => setIsGuideOpen(true)}
                            className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-slate-100 text-black text-sm font-black uppercase tracking-wider transition-all duration-300 border-2 border-slate-300 rounded-lg"
                        >
                            <HelpCircle size={16} />
                            <span className="hidden sm:inline">How to Use</span>
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative pl-4 border-l-2 border-slate-300">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="focus:outline-none"
                            >
                                {session?.user?.image ? (
                                    <img
                                        src={session.user.image}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full border-2 border-white hover:border-slate-300 transition-colors"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border-2 border-slate-600 hover:border-slate-400 transition-colors">
                                        <User size={20} className="text-black" />
                                    </div>
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-50">
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
                    </div>
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-black hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </nav>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-gray-950/95 backdrop-blur-xl border-b-2 border-black absolute w-full z-40 animate-fadeIn">
                        <div className="px-4 py-6 space-y-4">
                            {navItems.map(item => {
                                const isActive = (item.href === '/' && pathname === '/') ||
                                    (item.href !== '/' && pathname.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold uppercase tracking-wider transition-all ${isActive
                                            ? 'bg-white text-black'
                                            : 'text-slate-800 hover:bg-slate-50 hover:text-black'
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
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold uppercase tracking-wider text-slate-800 hover:bg-slate-50 hover:text-black transition-all text-left"
                            >
                                <HelpCircle size={20} />
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




