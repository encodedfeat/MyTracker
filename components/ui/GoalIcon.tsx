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
    case 'Target': return <Target {...props} />;
    case 'Zap': return <Zap {...props} />;
    case 'Brain': return <Brain {...props} />;
    case 'BookOpen': return <BookOpen {...props} />;
    case 'Code': return <Code {...props} />;
    case 'Activity': return <Activity {...props} />;
    case 'Award': return <Award {...props} />;
    case 'Star': return <Star {...props} />;
    default: return <Target {...props} />;
  }
};