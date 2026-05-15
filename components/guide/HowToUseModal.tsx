'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, LayoutDashboard, Settings, ListTodo, PenTool } from 'lucide-react';
import Image from 'next/image';

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
        image: '/assets/guide/dashboard.png', // Placeholder, will use the dashboard image
    },
    {
        id: 'dashboard',
        title: 'Track Your Progress',
        description: 'The Dashboard gives you a bird\'s-eye view of your performance. Monitor your daily logs, visualize trends with charts, and stay motivated.',
        icon: LayoutDashboard,
        image: '/assets/guide/dashboard.png',
    },
    {
        id: 'manage-categories',
        title: 'Organize with Categories',
        description: 'Start by creating Categories (Goals) in the "Manage" tab. These are the high-level areas you want to focus on, like "Health", "Career", or "Learning".',
        icon: Settings,
        image: '/assets/guide/categories.png',
    },
    {
        id: 'manage-subtopics',
        title: 'Define Subtopics',
        description: 'Break down your categories into actionable Subtopics. Create "Habits" for daily routines, "Cumulative" goals for measurable targets, or "Task Lists" for specific projects.',
        icon: ListTodo,
        image: '/assets/guide/subtopics.png',
    },
    {
        id: 'logging',
        title: 'Log Your Journey',
        description: 'Use the "Log Your Cumulative" tab or the daily habit checklist to record your progress. Consistency is key!',
        icon: PenTool,
        image: '/assets/guide/logging.png',
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
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <Icon className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">{step.title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex flex-col md:flex-row h-[500px]">
                    {/* Image Section */}
                    <div className="w-full md:w-2/3 bg-black/50 relative overflow-hidden group">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-full h-full">
                                <Image
                                    src={step.image}
                                    alt={step.title}
                                    fill
                                    className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        </div>
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r" />
                    </div>

                    {/* Content Section */}
                    <div className="w-full md:w-1/3 p-8 flex flex-col justify-between bg-slate-900">
                        <div className="space-y-6">
                            <div className="flex space-x-1">
                                {steps.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${idx === currentStep ? 'bg-indigo-500' : 'bg-slate-700'
                                            }`}
                                    />
                                ))}
                            </div>

                            <div className="animate-fade-in">
                                <p className="text-lg text-slate-300 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-8">
                            <button
                                onClick={handlePrev}
                                disabled={currentStep === 0}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentStep === 0
                                        ? 'text-slate-600 cursor-not-allowed'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                <ChevronLeft size={16} />
                                <span>Back</span>
                            </button>

                            <button
                                onClick={handleNext}
                                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-105 active:scale-95"
                            >
                                <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
                                {currentStep < steps.length - 1 && <ChevronRight size={16} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
