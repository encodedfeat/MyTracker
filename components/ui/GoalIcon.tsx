// components/ui/GoalIcon.tsx
'use client';

import { Target, Zap, Brain, BookOpen, Code, Activity, Award, Star, LucideProps } from 'lucide-react';
import React from 'react';

// Define props
interface GoalIconProps extends LucideProps {
  iconName: string;
  className?: string;
}

export const GoalIcon: React.FC<GoalIconProps> = ({ iconName, className, ...props }) => {
  switch (iconName) {
    case 'Target': return <Target className={className} {...props} />;
    case 'Zap': return <Zap className={className} {...props} />;
    case 'Brain': return <Brain className={className} {...props} />;
    case 'BookOpen': return <BookOpen className={className} {...props} />;
    case 'Code': return <Code className={className} {...props} />;
    case 'Activity': return <Activity className={className} {...props} />;
    case 'Award': return <Award className={className} {...props} />;
    case 'Star': return <Star className={className} {...props} />;
    default: return <Target className={className} {...props} />;
  }
};


