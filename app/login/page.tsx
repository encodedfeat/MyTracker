'use client';

import { signIn } from 'next-auth/react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f0f0] relative overflow-hidden font-sans">
            {/* Background Elements — identical to authenticated layout */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-300 rounded-full blur-[100px] opacity-30 animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-300 rounded-full blur-[100px] opacity-30 animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-md px-6 z-10">
                {/* Back link */}
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8 font-medium">
                    <ArrowLeft size={16} /> Back to home
                </Link>

                <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 flex flex-col items-center text-center">

                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-8">
                        <Sparkles className="text-slate-400 w-6 h-6" />
                        <span className="font-serif font-bold text-2xl text-slate-900">MyTracker</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-serif text-slate-900 mb-3 tracking-tight">Welcome back</h1>
                    <p className="text-sm text-slate-500 font-light mb-10 max-w-[280px] leading-relaxed">
                        Sign in to track your goals, build habits, and find your clarity.
                    </p>

                    {/* Google Sign In */}
                    <button
                        onClick={() => signIn('google', { callbackUrl: '/home' })}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-800 py-4 px-6 rounded-2xl font-medium hover:border-slate-300 hover:shadow-md transition-all shadow-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>

                    <p className="text-[10px] text-slate-400 mt-8 leading-relaxed">
                        By continuing, you agree to our{' '}
                        <a href="#" className="underline hover:text-slate-600">Terms of Service</a> and{' '}
                        <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
