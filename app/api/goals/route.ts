// app/api/goals/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Goal, { IGoal } from '@/models/Goal';
import { Document } from 'mongoose';

interface MongooseDoc extends Document {
  _id: any;
  __v?: any;
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, icon, month, year } = body;

    const newGoal = new Goal({ name, icon, month, year });
    await newGoal.save();

    const savedGoal = newGoal.toObject() as MongooseDoc & IGoal;
    const { _id, __v, ...rest } = savedGoal;

    return NextResponse.json({ ...rest, id: _id.toString() }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}