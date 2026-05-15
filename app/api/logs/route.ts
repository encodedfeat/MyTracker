// app/api/logs/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Log from '@/models/Log';
import { Document } from 'mongoose';

interface MongooseDoc extends Document {
  _id: any;
  __v?: number;
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    // We expect { subtopicId, date, value }
    const { subtopicId: stId, date: dateString, value } = await request.json();
    
    // Convert string date to Date object at midnight UTC
    const targetDate = new Date(dateString);
    targetDate.setUTCHours(0, 0, 0, 0);

    const newLog = new Log({
      subtopicId: stId,
      date: targetDate,
      value: Number(value),
    });
    
    await newLog.save();
    
    const savedLog = newLog.toObject() as MongooseDoc & { subtopicId: any; date: Date };
    const { _id, __v, subtopicId, date, ...rest } = savedLog;
    return NextResponse.json({
      ...rest,
      id: _id.toString(),
      subtopicId: subtopicId.toString(),
      date: date.toISOString().split('T')[0]
    }, { status: 201 });

    return NextResponse.json(savedLog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 });
  }
}