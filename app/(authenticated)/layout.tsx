
import { AppHeader } from '@/components/layout/AppHeader';
import { GoalProvider } from '@/context/GoalContext';

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <GoalProvider>
            <div className="flex-1 flex flex-col bg-[#f0f0f0] text-black font-['Courier_New'] overflow-clip relative w-full h-full min-h-0">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-300 rounded-full blur-[100px] opacity-30 animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-300 rounded-full blur-[100px] opacity-30 animate-pulse delay-1000" />
                </div>

                <div className="relative z-10 flex flex-col flex-1 h-full min-h-0">
                    <AppHeader />
                    <main className="flex-1 w-full flex flex-col">
                        {children}
                    </main>
                </div>
            </div>
        </GoalProvider>
    );
}


