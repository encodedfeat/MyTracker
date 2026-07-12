
import { AppHeader } from '@/components/layout/AppHeader';
import { GoalProvider } from '@/context/GoalContext';

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <GoalProvider>
            <div className="min-h-screen bg-[#f0f0f0] text-black font-['Courier_New'] overflow-clip relative">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-300 rounded-full blur-[100px] opacity-30 animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-300 rounded-full blur-[100px] opacity-30 animate-pulse delay-1000" />
                </div>

                <div className="relative z-10 flex flex-col min-h-screen">
                    <AppHeader />
                    <main className="flex-1 w-full flex flex-col">
                        {children}
                    </main>
                    <footer className="text-center p-4 text-slate-700 font-bold text-sm">
                        Your Personal Goal Tracker
                    </footer>
                </div>
            </div>
        </GoalProvider>
    );
}


