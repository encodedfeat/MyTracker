// app/api/subtopics/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Subtopic from '@/models/Subtopic';
import Task from '@/models/Task';
import Log from '@/models/Log';

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const params = await props.params;
  const subtopicId = params.id;

  try {
    // 1. Find the subtopic
    const subtopic = await Subtopic.findById(subtopicId);
    if (!subtopic) {
      return NextResponse.json({ error: 'Subtopic not found' }, { status: 404 });
    }

    // 2. Get the update data
    const updates = await request.json();

    // 3. Update the subtopic
    const updatedSubtopic = await Subtopic.findByIdAndUpdate(
      subtopicId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedSubtopic);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update subtopic' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const params = await props.params;
  const subtopicId = params.id;

  try {
    // 1. Delete all tasks and logs for this subtopic
    await Task.deleteMany({ subtopicId: subtopicId });
    await Log.deleteMany({ subtopicId: subtopicId });

    // 2. Delete the subtopic
    const deletedSubtopic = await Subtopic.findByIdAndDelete(subtopicId);

    if (!deletedSubtopic) {
      return NextResponse.json({ error: 'Subtopic not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete subtopic' }, { status: 500 });
  }
}