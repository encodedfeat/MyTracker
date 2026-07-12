import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
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

        // 1. Get the current task BEFORE update to check if status changed
        const currentTask = await Task.findOne({ _id: id, userId: session.user.id });
        if (!currentTask) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        // 2. Update the task
        const updatedTask = await Task.findOneAndUpdate({ _id: id, userId: session.user.id }, body, { new: true });

        if (!updatedTask) {
            return NextResponse.json({ error: 'Task not found after update' }, { status: 404 });
        }

        // 3. Handle Log Logic if 'completed' status changed
        if (body.completed !== undefined && body.completed !== currentTask.completed) {
            if (body.completed) {
                // Task marked as COMPLETED -> Create a Log
                // We need the date. The frontend sends 'date' in the body usually, or we use current date.
                // However, the Task model stores 'completedAt'.
                // Let's use the date provided in the body or default to now.
                const logDate = body.date || new Date().toISOString().split('T')[0];

                await Log.create({
                    subtopicId: updatedTask.subtopicId,
                    date: logDate,
                    value: 1,
                    taskId: updatedTask._id, // Link log to this task
                    userId: session.user.id
                });
            } else {
                // Task marked as UNCOMPLETED -> Delete the Log
                await Log.findOneAndDelete({ taskId: updatedTask._id, userId: session.user.id });
            }
        }

        return NextResponse.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
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

        const task = await Task.findOneAndDelete({ _id: id, userId: session.user.id });
        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        // Delete related logs
        await Log.deleteMany({ taskId: id, userId: session.user.id });

        return NextResponse.json({ message: 'Task deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
    }
}
