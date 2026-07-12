import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Goal from '@/models/Goal';
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
        const goalId = params.id;

        if (!isValidObjectId(goalId)) {
            return NextResponse.json({ error: 'Invalid goal ID' }, { status: 400 });
        }

        const updates = await request.json();
        const goal = await Goal.findByIdAndUpdate(goalId, updates, { new: true });

        if (!goal) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }

        return NextResponse.json(goal);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const authSession = await auth();
        if (!authSession?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        await dbConnect();
        const goalId = params.id;

        if (!isValidObjectId(goalId)) {
            return NextResponse.json({ error: 'Invalid goal ID' }, { status: 400 });
        }

        const goal = await Goal.findById(goalId);
        if (!goal) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }

        // Start a transaction to delete everything related to this goal
        const session = await dbConnect().then(db => db.startSession());
        session.startTransaction();

        try {
            // Find subtopics to get their IDs
            const subtopics = await Subtopic.find({ goalId }).session(session);
            const subtopicIds = subtopics.map(s => s._id);

            // Delete logs and tasks for these subtopics
            if (subtopicIds.length > 0) {
                await Log.deleteMany({ subtopicId: { $in: subtopicIds } }).session(session);
                await Task.deleteMany({ subtopicId: { $in: subtopicIds } }).session(session);
            }

            // Delete subtopics
            await Subtopic.deleteMany({ goalId }).session(session);

            // Delete goal
            await Goal.findByIdAndDelete(goalId).session(session);

            await session.commitTransaction();
            return NextResponse.json({ message: 'Goal deleted successfully' });
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.error('Error deleting goal:', error);
        return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 });
    }
}
