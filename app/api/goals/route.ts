import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Goal from '@/models/Goal';
import { auth } from "@/auth";

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();
        const goal = await Goal.create({ ...body, userId: session.user.id });

        const serializedGoal = {
            ...goal.toObject(),
            id: (goal._id as any).toString(),
            _id: undefined
        };

        return NextResponse.json(serializedGoal, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
    }
}
