
'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { ArrowRight, CheckCircle, BarChart2, Target } from 'lucide-react';
import { HowToUseSection } from '@/components/HowToUseSection';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const { data: session } = useSession();
    const router = useRouter();

    React.useEffect(() => {
        if (session) {
            router.push('/dashboard');
        }
    }, [session, router]);
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
            },
        },
    };

    return (
        <div className="min-h-screen bg-[#f0f0f0] text-black font-['Courier_New'] overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-300 rounded-full blur-[100px] opacity-30 animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-300 rounded-full blur-[100px] opacity-30 animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center"
                >
                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-7xl font-black mb-6 tracking-tighter border-b-8 border-black inline-block pb-2"
                    >
                        GOAL TRACKER
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="mt-4 text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-bold mb-12"
                    >
                        DOMINATE YOUR DAY. CRUSH YOUR GOALS. NO EXCUSES.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex justify-center mb-20">
                        <button
                            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                            className="button-89 text-2xl"
                            style={{ '--color': '#000000', color: 'white', backgroundColor: 'black' } as React.CSSProperties}
                        >
                            GET STARTED NOW <ArrowRight className="inline ml-2" />
                        </button>
                    </motion.div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-20">
                        {[
                            {
                                icon: <Target className="w-12 h-12 mb-4" />,
                                title: 'Set Targets',
                                desc: 'Define clear, actionable goals. Break them down. Conquer them.',
                                color: 'bg-[#ff9a9e]',
                            },
                            {
                                icon: <CheckCircle className="w-12 h-12 mb-4" />,
                                title: 'Track Habits',
                                desc: 'Build consistency. Log your daily wins. Don\'t break the chain.',
                                color: 'bg-[#a18cd1]',
                            },
                            {
                                icon: <BarChart2 className="w-12 h-12 mb-4" />,
                                title: 'Visualize Progress',
                                desc: 'See your growth. Data-driven insights to keep you motivated.',
                                color: 'bg-[#84fab0]',
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ scale: 1.05, rotate: 1 }}
                                className={`p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${feature.color} transition-all`}
                            >
                                {feature.icon}
                                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                                <p className="font-semibold">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <HowToUseSection />
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="absolute bottom-0 w-full py-6 text-center border-t-4 border-black bg-white z-10">
                <p className="font-bold">© {new Date().getFullYear()} MY GOAL TRACKER. BUILT FOR WINNERS.</p>
            </footer>
        </div>
    );
}
