import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import TimeSession from '@/models/TimeSession';
import { auth } from '@/auth';

// GET - Fetch all time sessions for the current user
export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const month = searchParams.get('month');
        const year = searchParams.get('year');

        const filter: any = { userId: session.user.id };

        if (month && year) {
            const m = parseInt(month);
            const y = parseInt(year);
            const startDate = new Date(Date.UTC(y, m - 1, 1));
            const endDate = new Date(Date.UTC(y, m, 1));
            filter.date = { $gte: startDate, $lt: endDate };
        }

        const sessions = await TimeSession.find(filter).sort({ createdAt: -1 }).lean();

        const serialized = sessions.map((s: any) => ({
            id: s._id.toString(),
            userId: s.userId,
            goalId: s.goalId.toString(),
            subtopicId: s.subtopicId.toString(),
            taskId: s.taskId ? s.taskId.toString() : null,
            durationSeconds: s.durationSeconds,
            durationDisplay: s.durationDisplay,
            date: s.date.toISOString().split('T')[0],
            createdAt: s.createdAt.toISOString(),
        }));

        return NextResponse.json(serialized);
    } catch (error) {
        console.error('Error fetching time sessions:', error);
        return NextResponse.json({ error: 'Failed to fetch time sessions' }, { status: 500 });
    }
}

// POST - Create a new time session
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();

        const { goalId, subtopicId, taskId, durationSeconds, durationDisplay, date } = body;

        if (!goalId || !subtopicId || !durationSeconds || !date) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const timeSession = await TimeSession.create({
            userId: session.user.id,
            goalId,
            subtopicId,
            taskId: taskId || undefined,
            durationSeconds,
            durationDisplay,
            date: new Date(date),
        });

        const serialized = {
            id: timeSession._id.toString(),
            userId: timeSession.userId,
            goalId: timeSession.goalId.toString(),
            subtopicId: timeSession.subtopicId.toString(),
            taskId: timeSession.taskId ? timeSession.taskId.toString() : null,
            durationSeconds: timeSession.durationSeconds,
            durationDisplay: timeSession.durationDisplay,
            date: timeSession.date.toISOString().split('T')[0],
            createdAt: timeSession.createdAt.toISOString(),
        };

        return NextResponse.json(serialized, { status: 201 });
    } catch (error) {
        console.error('Error creating time session:', error);
        return NextResponse.json({ error: 'Failed to create time session' }, { status: 500 });
    }
}
