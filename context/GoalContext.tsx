'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode
} from 'react';
import { getLocalDateString } from '@/lib/dateUtils';

// --- Define Types ---

interface Goal {
  id: string;
  name: string;
  icon: string;
  month?: number;
  year?: number;
}

interface Subtopic {
  id: string;
  goalId: string;
  name: string;
  type: 'habit' | 'cumulative' | 'tasks';
  target?: number;
  unit?: string;
}

interface Task {
  id: string;
  subtopicId: string;
  name: string;
  completed: boolean;
  completedAt?: string; // ISO Date String
}

interface Log {
  id: string;
  subtopicId: string;
  date: string; // 'YYYY-MM-DD'
  taskId?: string;
  value: number;
}

interface SubtopicProgress extends Subtopic {
  progressPercent: number;
  metricValue: number;
  completedTasks: number;
  totalTasks: number;
  monthDays: any[];
  completedToday: boolean;
}

interface IAdHocTask {
  id: string;
  name: string;
  completed: boolean;
}

interface DailyPlan {
  id: string;
  userId: string;
  date: string;
  taskIds: string[];
  subtopicIds: string[];
  adHocTasks: IAdHocTask[];
}

interface GoalContextType {
  goals: Goal[];
  subtopics: Subtopic[];
  tasks: Task[];
  dailyLogs: Log[];
  dailyPlans: DailyPlan[];
  isLoaded: boolean;
  subtopicProgress: SubtopicProgress[];
  overallAveragePercent: number;
  dailyLineChartData: {
    name: string;
    percent: number;
    subtopics?: { [key: string]: number };
  }[];

  // Date Selection
  selectedDate: Date;
  selectedDailyDate: Date; // For the Daily Plan feature
  changeMonth: (offset: number) => void;
  changeDailyDate: (offset: number) => void;
  isReadOnly: boolean;
  isFuture: boolean;

  // Handlers
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>;
  updateGoal: (goalId: string, updates: Partial<Omit<Goal, 'id'>>) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  addSubtopic: (subtopic: Omit<Subtopic, 'id'>) => Promise<void>;
  updateSubtopic: (subtopicId: string, updates: Partial<Omit<Subtopic, 'id'>>) => Promise<void>;
  deleteSubtopic: (subtopicId: string) => Promise<void>;
  addTask: (subtopicId: string, taskName: string) => Promise<void>;
  toggleTask: (taskId: string, currentStatus: boolean) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  updateTask: (taskId: string, name: string) => Promise<void>;
  logHabit: (subtopicId: string, dateString: string) => Promise<void>;
  addLog: (log: Omit<Log, 'id'>) => Promise<void>;
  deleteLog: (logId: string) => Promise<void>;
  saveDailyPlan: (dateString: string, taskIds: string[], subtopicIds: string[], adHocTasks: IAdHocTask[]) => Promise<void>;
  toggleAdHocTask: (dateString: string, taskId: string, currentStatus: boolean) => Promise<void>;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export function GoalProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dailyLogs, setDailyLogs] = useState<Log[]>([]);
  const [dailyPlans, setDailyPlans] = useState<DailyPlan[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // New state for selected month
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // State for Daily Plan date
  const [selectedDailyDate, setSelectedDailyDate] = useState(new Date());

  // Calculate isReadOnly based on selectedDate
  const isReadOnly = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    // Read-only if the selected month is in the past
    if (selectedYear < currentYear) return true;
    if (selectedYear === currentYear && selectedMonth < currentMonth) return true;

    return false;
  }, [selectedDate]);

  // Calculate isFuture based on selectedDate
  const isFuture = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    if (selectedYear > currentYear) return true;
    if (selectedYear === currentYear && selectedMonth > currentMonth) return true;

    return false;
  }, [selectedDate]);

  // --- Data Fetching Effect ---
  useEffect(() => {
    const loadData = async () => {
      setIsLoaded(false);
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();
      const queryParams = `?month=${month}&year=${year}`;

      try {
        const res = await fetch(`/api/data${queryParams}`);
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();

        setGoals(data.goals || []);
        setSubtopics(data.subtopics || []);
        setTasks(data.tasks || []);
        setDailyLogs(data.logs || []);
        setDailyPlans(data.dailyPlans || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, [selectedDate]);

  const changeMonth = (offset: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setSelectedDate(newDate);

    // Also update the daily date to stay in sync
    const today = new Date();
    if (newDate.getMonth() === today.getMonth() && newDate.getFullYear() === today.getFullYear()) {
      // If navigating back to current month, set to today
      setSelectedDailyDate(new Date());
    } else {
      // Otherwise, set to the last day of the newly selected month
      const lastDayOfMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
      setSelectedDailyDate(lastDayOfMonth);
    }
  };

  const changeDailyDate = (offset: number) => {
    const newDate = new Date(selectedDailyDate);
    newDate.setDate(newDate.getDate() + offset);
    
    // Check if the daily date moved outside the currently selected month
    if (newDate.getMonth() !== selectedDate.getMonth() || newDate.getFullYear() !== selectedDate.getFullYear()) {
      if (offset > 0) {
        // Moving forward past the end of the month -> wrap to 1st day of the selected month
        newDate.setFullYear(selectedDate.getFullYear());
        newDate.setMonth(selectedDate.getMonth());
        newDate.setDate(1);
      } else {
        // Moving backward past the start of the month -> wrap to last day of the selected month
        newDate.setFullYear(selectedDate.getFullYear());
        newDate.setMonth(selectedDate.getMonth() + 1);
        newDate.setDate(0);
      }
    }
    
    setSelectedDailyDate(newDate);
  };

  // --- Handlers ---

  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    try {
      // Include current selected month/year when creating a goal
      const goalWithDate = {
        ...goal,
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear()
      };

      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalWithDate)
      });
      if (!response.ok) throw new Error('Failed to add goal');
      const newGoal = await response.json();
      setGoals([...goals, newGoal]);
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<Omit<Goal, 'id'>>) => {
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update goal');

      setGoals(prevGoals =>
        prevGoals.map(goal =>
          goal.id === goalId ? { ...goal, ...updates } : goal
        )
      );
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const response = await fetch(`/api/goals/${goalId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete goal');
      setGoals(goals.filter(g => g.id !== goalId));
      // Also remove related subtopics locally
      setSubtopics(subtopics.filter(st => st.goalId !== goalId));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const addSubtopic = async (subtopic: Omit<Subtopic, 'id'>) => {
    try {
      const response = await fetch('/api/subtopics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subtopic)
      });
      if (!response.ok) throw new Error('Failed to add subtopic');
      const newSubtopic = await response.json();
      setSubtopics([...subtopics, newSubtopic]);
    } catch (error) {
      console.error('Error adding subtopic:', error);
    }
  };

  const updateSubtopic = async (subtopicId: string, updates: Partial<Omit<Subtopic, 'id'>>) => {
    try {
      const response = await fetch(`/api/subtopics/${subtopicId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update subtopic');

      setSubtopics(prevSubtopics =>
        prevSubtopics.map(subtopic =>
          subtopic.id === subtopicId ? { ...subtopic, ...updates } : subtopic
        )
      );
    } catch (error) {
      console.error('Error updating subtopic:', error);
      throw error;
    }
  };

  const deleteSubtopic = async (subtopicId: string) => {
    try {
      const response = await fetch(`/api/subtopics/${subtopicId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete subtopic');
      setSubtopics(prevSubtopics => prevSubtopics.filter(st => st.id !== subtopicId));
      setTasks(prevTasks => prevTasks.filter(t => t.subtopicId !== subtopicId));
      setDailyLogs(prevLogs => prevLogs.filter(l => l.subtopicId !== subtopicId));
    } catch (error) {
      console.error('Error deleting subtopic:', error);
    }
  };

  const addTask = async (subtopicId: string, taskName: string) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtopicId, name: taskName })
      });
      if (!response.ok) throw new Error('Failed to add task');
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
      const dateString = getLocalDateString(selectedDate);
      const now = new Date();
      const completedAt = !currentStatus ? now.toISOString() : null;

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: !currentStatus,
          date: dateString,
          completedAt: completedAt
        })
      });
      if (!response.ok) throw new Error('Failed to toggle task');

      setTasks(prevTasks => prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !currentStatus, completedAt: completedAt || undefined } : task
      ));

      // Optimistically update dailyLogs for "Today" (selectedDate)

      if (!currentStatus) { // Marking as completed
        const task = tasks.find(t => t.id === taskId);
        if (task) {
          const newLog: Log = {
            id: 'temp-' + Date.now(), // Temporary ID
            subtopicId: task.subtopicId,
            date: dateString,
            taskId: taskId,
            value: 1
          };
          setDailyLogs(prev => [...prev, newLog]);
        }
      } else { // Marking as uncompleted
        setDailyLogs(prev => {
          // Try to find a log with the taskId first
          const logWithTaskId = prev.find(l => l.taskId === taskId && l.date === dateString);

          if (logWithTaskId) {
            return prev.filter(l => l.id !== logWithTaskId.id);
          } else {
            // Fallback: Remove ONE log for this subtopic and date (LIFO or FIFO doesn't matter for count)
            // This handles logs that don't have taskId
            const task = tasks.find(t => t.id === taskId);
            if (!task) return prev;

            const logIndex = prev.findIndex(l => l.subtopicId === task.subtopicId && l.date === dateString);
            if (logIndex !== -1) {
              const newLogs = [...prev];
              newLogs.splice(logIndex, 1);
              return newLogs;
            }
            return prev;
          }
        });
      }

    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const updateTask = async (taskId: string, name: string) => {
    try {
      // Optimistic update
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, name } : t));

      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, completed: tasks.find(t => t.id === taskId)?.completed })
      });

      if (!res.ok) {
        // Revert on failure
        const data = await res.json();
        console.error('Failed to update task:', data);
        // We might want to fetch tasks again here to ensure consistency
        const tasksRes = await fetch('/api/tasks');
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData);
        }
        throw new Error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const addLog = async (log: Omit<Log, 'id'>) => {
    try {
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log)
      });
      if (!response.ok) throw new Error('Failed to add log');
      const newLog = await response.json();
      setDailyLogs(prevLogs => [...prevLogs, newLog]);
    } catch (error) {
      console.error('Error adding log:', error);
    }
  };

  const logHabit = async (subtopicId: string, dateString: string) => {
    // Check if already logged
    const existingLog = dailyLogs.find(l => l.subtopicId === subtopicId && l.date === dateString);

    if (existingLog) {
      // Remove log (toggle off)
      try {
        const response = await fetch(`/api/logs/${existingLog.id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete log');
        setDailyLogs(prevLogs => prevLogs.filter(l => l.id !== existingLog.id));
      } catch (error) {
        console.error('Error removing habit log:', error);
      }
    } else {
      // Add log (toggle on)
      try {
        const response = await fetch('/api/logs/habit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subtopicId, date: dateString, value: 1 })
        });
        if (!response.ok) throw new Error('Failed to log habit');

        const data = await response.json();

        if (data.action === 'created' && data.log) {
          setDailyLogs(prevLogs => [...prevLogs, data.log]);
        } else if (data.action === 'deleted' && data.log) {
          setDailyLogs(prevLogs => prevLogs.filter(l => l.id !== data.log.id));
        }
      } catch (error) {
        console.error('Error logging habit:', error);
      }
    }
  };

  const deleteLog = async (logId: string) => {
    try {
      const response = await fetch(`/api/logs/${logId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete log');
      setDailyLogs(prevLogs => prevLogs.filter(l => l.id !== logId));
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  const saveDailyPlan = async (dateString: string, taskIds: string[], subtopicIds: string[], adHocTasks: IAdHocTask[]) => {
    try {
      const response = await fetch('/api/daily-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateString, taskIds, subtopicIds, adHocTasks })
      });
      if (!response.ok) throw new Error('Failed to save daily plan');
      const newPlan = await response.json();
      
      setDailyPlans(prev => {
        const existingIndex = prev.findIndex(p => p.date === dateString);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = newPlan;
          return updated;
        } else {
          return [...prev, newPlan];
        }
      });
    } catch (error) {
      console.error('Error saving daily plan:', error);
    }
  };

  const toggleAdHocTask = async (dateString: string, taskId: string, currentStatus: boolean) => {
    try {
      // Optimistic update
      setDailyPlans(prev => {
        const existingIndex = prev.findIndex(p => p.date === dateString);
        if (existingIndex >= 0) {
          const updated = [...prev];
          const plan = { ...updated[existingIndex] };
          plan.adHocTasks = plan.adHocTasks.map(t => 
            t.id === taskId ? { ...t, completed: !currentStatus } : t
          );
          updated[existingIndex] = plan;
          return updated;
        }
        return prev;
      });

      const response = await fetch('/api/daily-plans/ad-hoc/toggle', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateString, taskId, completed: !currentStatus })
      });

      if (!response.ok) {
        // Revert on failure
        const data = await response.json();
        console.error('Failed to toggle ad-hoc task:', data);
        const res = await fetch(`/api/data?month=${selectedDate.getMonth() + 1}&year=${selectedDate.getFullYear()}`);
        if (res.ok) {
          const data = await res.json();
          setDailyPlans(data.dailyPlans || []);
        }
        throw new Error('Failed to toggle ad-hoc task');
      }
    } catch (error) {
      console.error('Error toggling ad-hoc task:', error);
    }
  };

  // --- Data Calculation Memos ---

  const { overallAveragePercent, subtopicProgress } = useMemo(() => {
    // Use selectedDate instead of new Date()
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // For "today" checks, we still need the actual real-world today
    const realToday = new Date();
    const realTodayDateString = getLocalDateString(realToday);

    // But for calculating progress "so far" in the selected month:
    // If selected month is current month, go up to today.
    // If selected month is past, go up to end of month.
    // If selected month is future, daysSoFar is 0 (or handle as needed).
    let daysInThisPeriod = daysInMonth;
    if (currentMonth === realToday.getMonth() && currentYear === realToday.getFullYear()) {
      daysInThisPeriod = realToday.getDate();
    } else if (selectedDate > realToday) {
      daysInThisPeriod = 0;
    }

    // Calculate progress for each subtopic
    const allSubtopicProgress: SubtopicProgress[] = subtopics.map(subtopic => {
      let progressPercent = 0;
      let metricValue = 0;
      let target = subtopic.target || 0;
      let completedTasks = 0;
      let totalTasks = 0;
      let monthDays: any[] = [];
      let completedToday = false;

      if (subtopic.type === 'habit') {
        let daysCompletedThisMonth = 0;

        for (let i = 1; i <= daysInMonth; i++) {
          const date = new Date(currentYear, currentMonth, i);
          const dateString = getLocalDateString(date);
          const log = dailyLogs.find(l => l.subtopicId === subtopic.id && l.date === dateString);

          const isToday = (dateString === realTodayDateString);
          const isFuture = (date > realToday);

          const completed = !!log;
          // Only count towards progress if it's not in the future relative to real time
          // AND within the period we are calculating for
          if (completed && !isFuture) {
            daysCompletedThisMonth++;
          }
          if (isToday && completed) {
            completedToday = true;
          }

          monthDays.push({
            date: dateString,
            dayNum: i,
            completed: completed,
            isToday: isToday,
            isFuture: isFuture
          });
        }

        progressPercent = daysInThisPeriod > 0 ? (daysCompletedThisMonth / daysInThisPeriod) * 100 : 0;

      } else if (subtopic.type === 'cumulative') {
        const logsForSubtopic = dailyLogs.filter(log => {
          if (log.subtopicId !== subtopic.id) return false;
          const [y, m] = log.date.split('-').map(Number);
          return y === currentYear && (m - 1) === currentMonth;
        });
        metricValue = logsForSubtopic.reduce((sum, log) => sum + Number(log.value), 0);
        progressPercent = target > 0 ? (metricValue / target) * 100 : 0;

      } else if (subtopic.type === 'tasks') {
        const tasksForSubtopic = tasks.filter(task => task.subtopicId === subtopic.id);

        completedTasks = tasksForSubtopic.filter(task => {
          if (!task.completed) return false;
          if (!task.completedAt) return false;
          const completedDate = new Date(task.completedAt);
          return completedDate.getFullYear() === currentYear && completedDate.getMonth() === currentMonth;
        }).length;

        totalTasks = tasksForSubtopic.length;
        progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      }

      return {
        ...subtopic,
        progressPercent: Math.min(progressPercent, 100),
        metricValue,
        target,
        completedTasks,
        totalTasks,
        monthDays,
        completedToday
      };
    });

    // Calculate Overall Monthly Progress
    // Filter out habits and invalid subtopics (empty task lists or 0 target cumulative)
    const validSubtopics = allSubtopicProgress.filter(sp => {
      if (sp.type === 'habit') return false;
      if (sp.type === 'tasks' && sp.totalTasks === 0) return false;
      if (sp.type === 'cumulative' && (!sp.target || sp.target === 0)) return false;
      return true;
    });

    const allPercentages = validSubtopics.map(sp => sp.progressPercent);

    let overallAveragePercent = 0;
    if (allPercentages.length > 0) {
      overallAveragePercent = allPercentages.reduce((sum, percent) => sum + percent, 0) / allPercentages.length;
    }

    return {
      overallAveragePercent,
      subtopicProgress: allSubtopicProgress
    };
  }, [goals, subtopics, tasks, dailyLogs, selectedDate]);


  // --- Daily Line Chart Data Calculation ---
  const dailyLineChartData = useMemo(() => {
    const chartData = [];
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();

    const realToday = new Date();

    // Determine how many days to show in the chart
    let daysToShow;
    if (currentMonth === realToday.getMonth() && currentYear === realToday.getFullYear()) {
      daysToShow = realToday.getDate();
    } else {
      // Last day of the selected month
      daysToShow = new Date(currentYear, currentMonth + 1, 0).getDate();
    }

    // Identify valid subtopics for chart calculation (same logic as overall progress)
    const validSubtopics = subtopics.filter(subtopic => {
      if (subtopic.type === 'habit') return false; // EXCLUDE HABITS
      if (subtopic.type === 'tasks') {
        const totalTasks = tasks.filter(t => t.subtopicId === subtopic.id).length;
        return totalTasks > 0;
      }
      if (subtopic.type === 'cumulative') {
        return (subtopic.target || 0) > 0;
      }
      return false;
    });

    for (let day = 1; day <= daysToShow; day++) {
      const currentDate = new Date(currentYear, currentMonth, day);
      const currentDateString = getLocalDateString(currentDate);

      // Get only logs for this specific day
      const logsForThisDay = dailyLogs.filter(log => {
        return log.subtopicId && log.date === currentDateString;
      });

      const subtopicsData: { [key: string]: number } = {};
      const dailyPercentages: number[] = [];

      // --- Calculate daily progress for VALID subtopics ---
      validSubtopics.forEach(subtopic => {
        let progressPercent = 0;

        if (subtopic.type === 'cumulative') {
          const logs = logsForThisDay.filter(l => l.subtopicId === subtopic.id);
          const dailyValue = logs.reduce((sum, log) => sum + Number(log.value), 0);
          const target = subtopic.target || 0;
          progressPercent = target > 0 ? (dailyValue / target) * 100 : 0;

        } else if (subtopic.type === 'tasks') {
          const tasksForSubtopic = tasks.filter(t => t.subtopicId === subtopic.id);
          // Robust fix: Count logs for this subtopic instead of matching by taskId
          // This ensures it works even if taskId is missing from old logs
          const completedTasksCount = logsForThisDay.filter(l => l.subtopicId === subtopic.id).length;
          const totalTasks = tasksForSubtopic.length;
          progressPercent = totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0;
        }

        const cappedPercent = Math.min(progressPercent, 100);
        subtopicsData[subtopic.id] = cappedPercent;
        dailyPercentages.push(cappedPercent);
      });

      // Calculate overall daily percent as the average of all subtopic percentages
      let overallDailyPercent = 0;
      if (validSubtopics.length > 0) {
        overallDailyPercent = dailyPercentages.reduce((sum, p) => sum + p, 0) / validSubtopics.length;
      }

      chartData.push({
        name: `Day ${day}`,
        fullDate: currentDateString,
        percent: Math.min(overallDailyPercent, 100),
        subtopics: subtopicsData
      });
    }

    return chartData;
  }, [tasks, dailyLogs, selectedDate, subtopics]);


  return (
    <GoalContext.Provider value={{
      goals,
      subtopics,
      tasks,
      dailyLogs,
      dailyPlans,
      isLoaded,
      subtopicProgress,
      overallAveragePercent,
      dailyLineChartData,
      selectedDate,
      selectedDailyDate,
      changeMonth,
      changeDailyDate,
      isReadOnly,
      isFuture,
      addGoal,
      updateGoal,
      deleteGoal,
      addSubtopic,
      updateSubtopic,
      deleteSubtopic,
      addTask,
      toggleTask,
      deleteTask,
      updateTask,
      logHabit,
      addLog,
      deleteLog,
      saveDailyPlan,
      toggleAdHocTask
    }}>
      {children}
    </GoalContext.Provider>
  );
}

export function useGoalTracker() {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoalTracker must be used within a GoalProvider');
  }
  return context;
}