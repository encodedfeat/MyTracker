'use client';

import React from 'react';
import { useGoalTracker } from '@/context/GoalContext';
import { ModernDashboardView } from './ModernDashboardView';

export default function DashboardView() {
    const {
        subtopicProgress,
        overallAveragePercent,
        dailyLineChartData,
        logHabit,
        selectedDate,
        changeMonth,
        goals,
        tasks,
        dailyLogs
    } = useGoalTracker();

    // Determine if there is any data for the current month
    const hasData = React.useMemo(() => {
        const currentMonth = selectedDate.getMonth();
        const currentYear = selectedDate.getFullYear();

        return dailyLogs.some(log => {
            if (!log.date) return false;
            const [y, m] = log.date.split('-').map(Number);
            return y === currentYear && (m - 1) === currentMonth;
        });
    }, [dailyLogs, selectedDate]);

    return (
        <ModernDashboardView
            subtopicProgress={subtopicProgress}
            overallAveragePercent={overallAveragePercent}
            dailyLineChartData={dailyLineChartData}
            onLogHabit={logHabit}
            selectedDate={selectedDate}
            changeMonth={changeMonth}
            hasData={hasData}
            goals={goals}
            tasks={tasks}
        />
    );
}



