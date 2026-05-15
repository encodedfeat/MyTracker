// components/layout/AppHeader.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HowToUseModal } from '../guide/HowToUseModal';
import { LayoutDashboard, Settings, HelpCircle } from 'lucide-react';

const navItems = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { id: 'manage', name: 'Manage', icon: Settings, href: '/manage' },
];

export function AppHeader() {
  const pathname = usePathname();
  const [isGuideOpen, setIsGuideOpen] = React.useState(false);

  return (
    <>
      <header
        className="bg-gray-950/80 backdrop-blur-lg border-b border-gray-800/50 sticky top-0 z-50"
        style={{
          backgroundImage: "url('/assist/guide/divBackground.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/assist/guide/logo.jpg"
                alt="MyTracker Logo"
                className="h-10 w-10 object-cover rounded-full"
              />
              <span className="text-xl font-bold text-slate-200 tracking-tight">MyTracker</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Segmented Control Navigation */}
            <div className="flex items-center p-1 bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-700/50">
              {navItems.map(item => {
                const isActive = (item.href === '/' && pathname === '/') ||
                  (item.href !== '/' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${isActive
                      ? 'text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg -z-10" />
                    )}
                    <item.icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* How to Use Button */}
            <button
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-indigo-300 hover:text-white text-sm font-medium rounded-full transition-all duration-300 border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)] hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] backdrop-blur-md"
            >
              <HelpCircle size={16} />
              <span className="hidden sm:inline">How to Use</span>
            </button>
          </div>
        </nav>
      </header>

      <HowToUseModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </>
  );
}