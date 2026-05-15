// app/api/data/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Goal from '@/models/Goal';
import Subtopic from '@/models/Subtopic';
import Task from '@/models/Task';
import Log from '@/models/Log';

// Helper to convert Mongoose docs to plain objects and fix _id
const serialize = (doc: any) => {
  const obj = doc.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;

  // Recursively serialize nested objects (if any)
  if (obj.goalId) obj.goalId = obj.goalId.toString();
  if (obj.subtopicId) obj.subtopicId = obj.subtopicId.toString();

  // Convert Date to YYYY-MM-DD string
  if (obj.date) {
    obj.date = obj.date.toISOString().split('T')[0];
  }

  return obj;
};

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));

    // Migration: Update existing goals without month/year to November 2025
    await Goal.updateMany(
      { month: { $exists: false } },
      { $set: { month: 11, year: 2025 } }
    );

    // Fetch goals for the requested month/year
    const goals = await Goal.find({ month, year });
    const goalIds = goals.map(g => g._id);

    // Fetch related data
    const subtopics = await Subtopic.find({ goalId: { $in: goalIds } });
    const subtopicIds = subtopics.map(st => st._id);

    const tasks = await Task.find({ subtopicId: { $in: subtopicIds } });
    const dailyLogs = await Log.find({ subtopicId: { $in: subtopicIds } });

    return NextResponse.json({
      goals: goals.map(serialize),
      subtopics: subtopics.map(serialize),
      tasks: tasks.map(serialize),
      logs: dailyLogs.map(serialize),
    });
  } catch (error) {
    console.error("Data API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
