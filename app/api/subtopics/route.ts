// app/api/subtopics/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Subtopic from '@/models/Subtopic';
import { Document } from 'mongoose';

interface MongooseDoc extends Document {
  _id: any;
  __v?: number;
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const newSubtopic = new Subtopic(body);
    await newSubtopic.save();
    
    const savedSubtopic = newSubtopic.toObject() as MongooseDoc & { goalId: any };
    const { _id, __v, goalId, ...rest } = savedSubtopic;
    return NextResponse.json({
      ...rest,
      id: _id.toString(),
      goalId: goalId.toString()
    }, { status: 201 });

    return NextResponse.json(savedSubtopic, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create subtopic' }, { status: 500 });
  }
}