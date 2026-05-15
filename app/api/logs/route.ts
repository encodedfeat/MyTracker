import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Log from '@/models/Log';
import { auth } from "@/auth";

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();
        const log = await Log.create({ ...body, userId: session.user.id });

        // Serialize manually to ensure date format matches
        const serializedLog = {
            ...log.toObject(),
            id: log._id.toString(),
            _id: undefined,
            subtopicId: log.subtopicId.toString(),
            date: log.date.toISOString().split('T')[0]
        };

        return NextResponse.json(serializedLog, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create log' }, { status: 500 });
    }
}
