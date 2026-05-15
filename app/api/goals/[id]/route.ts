// app/api/goals/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Goal from '@/models/Goal';
import Subtopic from '@/models/Subtopic';
import Task from '@/models/Task';
import Log from '@/models/Log';

import { isValidObjectId } from 'mongoose';

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const params = await props.params;
    const goalId = params.id;

    if (!isValidObjectId(goalId)) {
      return NextResponse.json(
        { error: 'Invalid goal ID format' },
        { status: 400 }
      );
    }

    const goal = await Goal.findById(goalId);
    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    const updates = await request.json();
    const updatedGoal = await Goal.findByIdAndUpdate(
      goalId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error('Error updating goal:', error);
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  console.log('DELETE request for goal:', params.id);

  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Database connected');

    const goalId = params.id;

    // Validate MongoDB ObjectId format
    console.log('Validating ObjectId:', goalId);
    if (!isValidObjectId(goalId)) {
      console.log('Invalid ObjectId format');
      return NextResponse.json(
        { error: 'Invalid goal ID format' },
        { status: 400 }
      );
    }

    // First check if the goal exists
    console.log('Checking if goal exists...');
    const goal = await Goal.findById(goalId);
    console.log('Goal lookup result:', goal);

    if (!goal) {
      console.log('Goal not found in database');
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }
    console.log('Goal found, proceeding with deletion');

    // Start a session for transaction
    const session = await dbConnect().then(db => db.startSession());

    try {
      await session.withTransaction(async () => {
        // 1. Find all subtopics for this goal
        const subtopics = await Subtopic.find({ goalId: goalId }).session(session);
        const subtopicIds = subtopics.map(st => st._id);
        const subtopicsCount = subtopics.length;

        // 2. Delete all tasks and logs for those subtopics
        let tasksCount = 0;
        let logsCount = 0;
        if (subtopicIds.length > 0) {
          const [tasksResult, logsResult] = await Promise.all([
            Task.deleteMany({ subtopicId: { $in: subtopicIds } }).session(session),
            Log.deleteMany({ subtopicId: { $in: subtopicIds } }).session(session)
          ]);
          tasksCount = tasksResult.deletedCount;
          logsCount = logsResult.deletedCount;
        }

        // 3. Delete all subtopics
        await Subtopic.deleteMany({ goalId: goalId }).session(session);

        // 4. Delete the goal
        const deletedGoal = await Goal.findByIdAndDelete(goalId).session(session);

        if (!deletedGoal) {
          throw new Error('Goal not found');
        }

        return { subtopicsCount, tasksCount, logsCount };
      });

      const result = await session.endSession();

      return NextResponse.json({
        success: true,
        deletedItems: result
      }, { status: 200 });

    } catch (error) {
      await session.abortTransaction();
      console.error('Error in deletion transaction:', error);
      return NextResponse.json({
        error: 'Failed to delete goal and its related items',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error in delete operation:', error);
    return NextResponse.json({
      error: 'Failed to delete goal',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}