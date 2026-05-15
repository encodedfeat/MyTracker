// app/api/tasks/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Task from '@/models/Task';
import { Document } from 'mongoose';

interface MongooseDoc extends Document {
  _id: any;
  __v?: number;
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const newTask = new Task(body);
    await newTask.save();
    
    const savedTask = newTask.toObject() as MongooseDoc & { subtopicId: any };
    const { _id, __v, subtopicId, ...rest } = savedTask;
    return NextResponse.json({
      ...rest,
      id: _id.toString(),
      subtopicId: subtopicId.toString()
    }, { status: 201 });

    return NextResponse.json(savedTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}