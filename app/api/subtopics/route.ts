import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Subtopic from '@/models/Subtopic';
import { auth } from "@/auth";

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();
        const subtopic = await Subtopic.create({ ...body, userId: session.user.id });

        const serializedSubtopic = {
            ...subtopic.toObject(),
            id: (subtopic._id as any).toString(),
            _id: undefined
        };

        return NextResponse.json(serializedSubtopic, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create subtopic' }, { status: 500 });
    }
}
