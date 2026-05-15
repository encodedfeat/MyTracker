import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Goal from '@/models/Goal';
import Subtopic from '@/models/Subtopic';
import Task from '@/models/Task';
import Log from '@/models/Log';
import { auth } from "@/auth";

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const month = searchParams.get('month');
        const year = searchParams.get('year');

        // Migration: Assign current month/year to any goals missing them
        // This ensures legacy data doesn't "leak" into future months when filtering
        const now = new Date();
        await Goal.updateMany(
            { $or: [{ month: { $exists: false } }, { month: null }] },
            { $set: { month: now.getMonth() + 1, year: now.getFullYear() } }
        );

        const goalFilter: any = { userId };
        if (month && year) {
            goalFilter.month = parseInt(month);
            goalFilter.year = parseInt(year);
        }

        const goals = await Goal.find(goalFilter).lean();
        const goalIds = goals.map((g: any) => g._id);

        const subtopics = await Subtopic.find({ goalId: { $in: goalIds } }).lean();
        const subtopicIds = subtopics.map((s: any) => s._id);

        const tasks = await Task.find({ subtopicId: { $in: subtopicIds } }).lean();

        let logFilter: any = { subtopicId: { $in: subtopicIds } };
        if (month && year) {
            const m = parseInt(month);
            const y = parseInt(year);
            // Create date range for the entire month
            // Note: Month in Date constructor is 0-indexed (0-11)
            // We use UTC to ensure consistent querying against stored UTC dates
            const startDate = new Date(Date.UTC(y, m - 1, 1));
            const endDate = new Date(Date.UTC(y, m, 1)); // First day of next month

            logFilter.date = {
                $gte: startDate,
                $lt: endDate
            };
        }

        const logs = await Log.find(logFilter).lean();

        // Helper to convert _id to string and handle dates
        const serialize = (doc: any) => {
            const { _id, ...rest } = doc;
            return {
                id: _id.toString(),
                ...rest,
                // Convert dates to YYYY-MM-DD string
                ...(rest.date && { date: rest.date.toISOString().split('T')[0] }),
                ...(rest.createdAt && { createdAt: rest.createdAt.toISOString() }),
                ...(rest.updatedAt && { updatedAt: rest.updatedAt.toISOString() }),
                // Handle nested ObjectIds if any (e.g. goalId, subtopicId)
                ...(rest.goalId && { goalId: rest.goalId.toString() }),
                ...(rest.subtopicId && { subtopicId: rest.subtopicId.toString() }),
            };
        };

        return NextResponse.json({
            goals: goals.map(serialize),
            subtopics: subtopics.map(serialize),
            tasks: tasks.map(serialize),
            logs: logs.map(serialize),
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
