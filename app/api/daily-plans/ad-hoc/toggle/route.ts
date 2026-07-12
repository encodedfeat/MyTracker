import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import DailyPlan from '@/models/DailyPlan';
import { auth } from "@/auth";

export async function PUT(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { date, taskId, completed } = await request.json();

        if (!date || !taskId || typeof completed !== 'boolean') {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();
        const userId = session.user.id;

        const dailyPlan = await DailyPlan.findOneAndUpdate(
            { userId, date, 'adHocTasks.id': taskId },
            { $set: { 'adHocTasks.$.completed': completed } },
            { new: true }
        );

        if (!dailyPlan) {
            return NextResponse.json({ error: 'Daily plan or task not found' }, { status: 404 });
        }

        return NextResponse.json(dailyPlan);
    } catch (error) {
        console.error('Error toggling ad-hoc task:', error);
        return NextResponse.json({ error: 'Failed to toggle ad-hoc task' }, { status: 500 });
    }
}
