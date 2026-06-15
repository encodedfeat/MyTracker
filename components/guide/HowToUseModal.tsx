'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, LayoutDashboard, Settings, ListTodo, PenTool } from 'lucide-react';

interface HowToUseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const steps = [
    {
        id: 'welcome',
        title: 'Welcome to MyTracker',
        description: 'Your personal companion for tracking goals, habits, and tasks. Let\'s take a quick tour to help you get started.',
        icon: LayoutDashboard,
    },
    {
        id: 'dashboard',
        title: 'Track Your Progress',
        description: 'The Dashboard gives you a bird\'s-eye view of your performance. Monitor your daily logs, visualize trends with charts, and stay motivated.',
        icon: LayoutDashboard,
    },
    {
        id: 'manage-categories',
        title: 'Organize with Categories',
        description: 'Start by creating Categories (Goals) in the "Manage" tab. These are the high-level areas you want to focus on, like "Health", "Career", or "Learning".',
        icon: Settings,
    },
    {
        id: 'manage-subtopics',
        title: 'Define Subtopics',
        description: 'Break down your categories into actionable Subtopics. Create "Habits" for daily routines, "Cumulative" goals for measurable targets, or "Task Lists" for specific projects.',
        icon: ListTodo,
    },
    {
        id: 'logging',
        title: 'Log Your Journey',
        description: 'Use the "Log Your Cumulative" tab or the daily habit checklist to record your progress. Consistency is key!',
        icon: PenTool,
    },
];

export function HowToUseModal({ isOpen, onClose }: HowToUseModalProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setCurrentStep(0);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const step = steps[currentStep];
    const Icon = step.icon;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-white/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative w-full max-w-4xl bg-white border-4 border-black shadow-[12px_12px_0_0_#000] rounded-none overflow-hidden transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b-4 border-black bg-white">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white border-2 border-black shadow-[2px_2px_0_0_#000]">
                            <Icon className="w-6 h-6 text-black font-bold" />
                        </div>
                        <h2 className="text-2xl font-black text-black uppercase tracking-wider">{step.title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-black hover:bg-slate-200 border-2 border-transparent hover:border-black transition-all"
                    >
                        <X size={24} strokeWidth={3} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex flex-col md:flex-row h-[450px]">
                    {/* Icon Showcase Section */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 bg-slate-50 flex items-center justify-center border-b-4 md:border-b-0 md:border-r-4 border-black group">
                        <div className="p-16 bg-white border-4 border-black shadow-[8px_8px_0_0_#000] transform transition-transform duration-500 group-hover:scale-105">
                            <Icon className="w-32 h-32 text-black" strokeWidth={1.5} />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between bg-white">
                        <div className="space-y-8">
                            {/* Progress Bar */}
                            <div className="flex space-x-2">
                                {steps.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-2 flex-1 border border-black transition-all duration-300 ${idx === currentStep ? 'bg-black' : 'bg-slate-100'
                                            }`}
                                    />
                                ))}
                            </div>

                            <div className="animate-fade-in">
                                <p className="text-xl text-black font-medium leading-relaxed font-mono">
                                    {step.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-8">
                            <button
                                onClick={handlePrev}
                                disabled={currentStep === 0}
                                className={`flex items-center space-x-2 px-4 py-2 font-bold text-sm uppercase transition-colors ${currentStep === 0
                                    ? 'text-slate-400 cursor-not-allowed'
                                    : 'text-black hover:bg-slate-100 border-2 border-transparent hover:border-black'
                                    }`}
                            >
                                <ChevronLeft size={20} strokeWidth={3} />
                                <span>Back</span>
                            </button>

                            <button
                                onClick={handleNext}
                                className="button-89 flex items-center space-x-2 text-lg uppercase font-black"
                                style={{ '--color': '#000000', color: 'black', backgroundColor: 'white' } as React.CSSProperties}
                            >
                                <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
                                {currentStep < steps.length - 1 && <ChevronRight size={20} strokeWidth={3} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



