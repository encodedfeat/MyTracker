import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Log from '@/models/Log';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { subtopicId, date, value } = await request.json();

        // Check if a log already exists for this date
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const existingLog = await Log.findOne({
            subtopicId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (existingLog) {
            // If value is 0 (uncheck), delete the log
            if (value === 0) {
                await Log.findByIdAndDelete(existingLog._id);
                return NextResponse.json({
                    action: 'deleted',
                    log: { id: existingLog._id.toString() }
                });
            }
            // Otherwise update it
            existingLog.value = value;
            await existingLog.save();

            const serializedLog = {
                ...existingLog.toObject(),
                id: existingLog._id.toString(),
                _id: undefined,
                subtopicId: existingLog.subtopicId.toString(),
                date: existingLog.date.toISOString().split('T')[0]
            };

            return NextResponse.json({
                action: 'updated',
                log: serializedLog
            });
        } else if (value > 0) {
            // Create new log
            const log = await Log.create({
                subtopicId,
                date,
                value
            });

            const serializedLog = {
                ...log.toObject(),
                id: log._id.toString(),
                _id: undefined,
                subtopicId: log.subtopicId.toString(),
                date: log.date.toISOString().split('T')[0]
            };

            return NextResponse.json({
                action: 'created',
                log: serializedLog
            }, { status: 201 });
        }

        return NextResponse.json({ message: 'No action taken' });
    } catch (error) {
        console.error('Error in habit log:', error);
        return NextResponse.json({ error: 'Failed to update habit log' }, { status: 500 });
    }
}
