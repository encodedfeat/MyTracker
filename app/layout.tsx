import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';



const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My Goal Tracker',
  description: 'Your personal goal tracker',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>

          {/* --- CSS Animations Style Tag --- */}
          <style dangerouslySetInnerHTML={{
            __html: `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
          .animate-fadeIn > * {
            opacity: 0;
            animation: fadeIn 0.5s ease-out forwards;
          }
          .animate-fadeIn > *:nth-child(1) { animation-delay: 0.1s; }
          .animate-fadeIn > *:nth-child(2) { animation-delay: 0.2s; }
          .animate-fadeIn > *:nth-child(3) { animation-delay: 0.3s; }
          .animate-fadeIn > *:nth-child(4) { animation-delay: 0.4s; }
          .animate-fadeIn > *:nth-child(5) { animation-delay: 0.5s; }
          .animate-fadeIn > *:nth-child(6) { animation-delay: 0.6s; }
          .animate-fadeIn > *:nth-child(7) { animation-delay: 0.7s; }
          .animate-fadeIn > *:nth-child(8) { animation-delay: 0.8s; }
          .dark-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #4b5563 #1f2937;
          }
          .dark-scrollbar::-webkit-scrollbar { height: 8px; }
          .dark-scrollbar::-webkit-scrollbar-track { background: #1f2937; border-radius: 4px; }
          .dark-scrollbar::-webkit-scrollbar-thumb { background-color: #4b5563; border-radius: 4px; }
          .dark-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #6b7280; }
        `}} />

          <div className="min-h-screen bg-black font-sans text-slate-200">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
