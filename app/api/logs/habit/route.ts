// app/api/logs/habit/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Log from '@/models/Log';
import { Document } from 'mongoose';

interface MongooseDoc extends Document {
  _id: any;
  __v?: number;
}
import { getLocalDateString } from '@/lib/dateUtils'; // We don't use this, but good to know

export async function POST(request: Request) {
  await dbConnect();
  try {
    // We expect { subtopicId, date }
    // date will be a 'YYYY-MM-DD' string
    const { subtopicId, date: dateString } = await request.json();

    // Convert string date to Date object at midnight UTC
    const targetDate = new Date(dateString);
    targetDate.setUTCHours(0, 0, 0, 0);

    const existingLog = await Log.findOne({
      subtopicId: subtopicId,
      date: targetDate,
    });

      if (existingLog) {
      // Log exists, remove it (un-check)
      await Log.findByIdAndDelete(existingLog._id);
      
      const deletedLog = existingLog.toObject() as MongooseDoc;
      const { _id, __v, ...rest } = deletedLog;
      
      return NextResponse.json({ 
        action: 'deleted', 
        log: { ...rest, id: _id.toString() }
      }, { status: 200 });    } else {
      // Log doesn't exist, add it (check)
      const newLog = new Log({
        subtopicId: subtopicId,
        date: targetDate,
        value: 1, // Value is always 1 for a habit
      });
      await newLog.save();
      
      const savedLog = newLog.toObject() as MongooseDoc & { subtopicId: any; date: Date };
      const { _id, __v, subtopicId: stId, date, ...rest } = savedLog;
      
      return NextResponse.json({ 
        action: 'created', 
        log: {
          ...rest,
          id: _id.toString(),
          subtopicId: stId.toString(),
          date: date.toISOString().split('T')[0]
        }
      }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log habit' }, { status: 500 });
  }
}