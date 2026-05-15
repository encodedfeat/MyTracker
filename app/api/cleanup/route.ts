
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Goal from '@/models/Goal';
import Subtopic from '@/models/Subtopic';
import Task from '@/models/Task';
import Log from '@/models/Log';
import User from '@/models/User';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        // Delete all data from collections
        await Goal.deleteMany({});
        await Subtopic.deleteMany({});
        await Task.deleteMany({});
        await Log.deleteMany({});
        await User.deleteMany({});

        return NextResponse.json({ message: 'All data cleared successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error clearing data:', error);
        return NextResponse.json({ error: 'Failed to clear data' }, { status: 500 });
    }
}
