import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Task from '@/models/Task';
import { auth } from "@/auth";

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();
        const task = await Task.create({ ...body, userId: session.user.id });

        const serializedTask = {
            ...task.toObject(),
            id: (task as any)._id.toString(),
            _id: undefined
        };

        return NextResponse.json(serializedTask, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
}
