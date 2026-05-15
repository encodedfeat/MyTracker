import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Task from '@/models/Task';
import Log from '@/models/Log';

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const params = await props.params;
  try {
    const { completed, date, completedAt, name } = await request.json(); // Expect date string 'YYYY-MM-DD'

    const updateData: any = {
      completed: completed,
      completedAt: completedAt || null
    };

    if (name !== undefined) {
      updateData.name = name;
    }

    const task = await Task.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Handle Logging
    if (date) {
      const targetDate = new Date(date);
      targetDate.setUTCHours(0, 0, 0, 0);

      if (completed) {
        // Create Log
        // Check if exists first to avoid duplicates (optional but safer)
        const existingLog = await Log.findOne({ taskId: task._id, date: targetDate });
        if (!existingLog) {
          await Log.create({
            subtopicId: task.subtopicId,
            taskId: task._id,
            date: targetDate,
            value: 1
          });
        }
      } else {
        // Delete Log
        // Try to find by taskId first (best case)
        let logToDelete = await Log.findOne({ taskId: task._id, date: targetDate });

        // If not found (e.g. old data or schema missing taskId), find ANY log for this subtopic/date
        if (!logToDelete) {
          logToDelete = await Log.findOne({ subtopicId: task.subtopicId, date: targetDate });
        }

        if (logToDelete) {
          await Log.findByIdAndDelete(logToDelete._id);
        }
      }
    }

    return NextResponse.json({ success: true, task }, { status: 200 });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const params = await props.params;
  try {
    const deletedTask = await Task.findByIdAndDelete(params.id);

    if (!deletedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}