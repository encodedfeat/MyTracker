
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, BarChart2, Calendar } from 'lucide-react';

export function HowToUseSection() {
    const steps = [
        {
            icon: <Plus className="w-8 h-8" />,
            title: "1. Create Goals",
            description: "Define your main goals (e.g., 'Fitness', 'Learning')."
        },
        {
            icon: <Calendar className="w-8 h-8" />,
            title: "2. Add Subtopics",
            description: "Break goals into habits (daily) or tasks (one-time)."
        },
        {
            icon: <Check className="w-8 h-8" />,
            title: "3. Log Progress",
            description: "Check off habits daily or complete tasks."
        },
        {
            icon: <BarChart2 className="w-8 h-8" />,
            title: "4. View Analytics",
            description: "Track your consistency with visual charts."
        }
    ];

    return (
        <section className="py-16 px-4 bg-white border-t-4 border-black">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-black mb-12 text-center tracking-tighter uppercase">
                    How It Works
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-yellow-100 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                        >
                            <div className="bg-black text-black w-16 h-16 flex items-center justify-center rounded-full mb-4 mx-auto border-4 border-black">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-center font-mono">{step.title}</h3>
                            <p className="text-center font-medium">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}



