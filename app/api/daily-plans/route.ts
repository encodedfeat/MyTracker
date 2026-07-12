import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import DailyPlan from '@/models/DailyPlan';
import { auth } from "@/auth";
import { getLocalDateString } from '@/lib/dateUtils';

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { date, taskIds, subtopicIds, adHocTasks } = await request.json();

        if (!date) {
            return NextResponse.json({ error: 'Date is required' }, { status: 400 });
        }

        const today = getLocalDateString(new Date());
        if (date !== today) {
            return NextResponse.json({ error: 'Cannot save plans for past or future dates. Only today is allowed.' }, { status: 400 });
        }

        const userId = session.user.id;

        // Use findOneAndUpdate with upsert to create or update the daily plan
        const dailyPlan = await DailyPlan.findOneAndUpdate(
            { userId, date },
            { $set: { taskIds: taskIds || [], subtopicIds: subtopicIds || [], adHocTasks: adHocTasks || [] } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json(dailyPlan);
    } catch (error) {
        console.error('Error saving daily plan:', error);
        return NextResponse.json({ error: 'Failed to save daily plan' }, { status: 500 });
    }
}
