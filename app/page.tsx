'use client';

import { useGoalTracker } from '@/context/GoalContext';
import { ModernDashboardView } from '@/components/dashboard/ModernDashboardView';
export default function DashboardPage() {
    // Get all data and handlers from the context
    const {
        subtopicProgress,
        overallAveragePercent,
        dailyLineChartData,
        logHabit,
        isLoaded,
        selectedDate,
        changeMonth,
        dailyLogs,
        goals,
        tasks
    } = useGoalTracker();

    if (!isLoaded) {
        // You can make a proper loading spinner here
        return (
            <div className="text-center p-10">
                <h2 className="text-2xl font-semibold text-white">Loading your data...</h2>
            </div>
        );
    }

    const hasData = dailyLogs.length > 0;

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
