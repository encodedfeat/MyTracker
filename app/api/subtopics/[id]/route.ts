import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Subtopic from '@/models/Subtopic';
import Task from '@/models/Task';
import Log from '@/models/Log';
import { isValidObjectId } from 'mongoose';
import { auth } from "@/auth";

export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        await dbConnect();
        const { id } = params;
        const body = await request.json();

        if (!isValidObjectId(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const subtopic = await Subtopic.findByIdAndUpdate(id, body, { new: true });
        if (!subtopic) {
            return NextResponse.json({ error: 'Subtopic not found' }, { status: 404 });
        }

        return NextResponse.json(subtopic);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update subtopic' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        await dbConnect();
        const { id } = params;

        if (!isValidObjectId(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        // Delete related tasks and logs
        await Task.deleteMany({ subtopicId: id });
        await Log.deleteMany({ subtopicId: id });

        const subtopic = await Subtopic.findByIdAndDelete(id);
        if (!subtopic) {
            return NextResponse.json({ error: 'Subtopic not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Subtopic deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete subtopic' }, { status: 500 });
    }
}
