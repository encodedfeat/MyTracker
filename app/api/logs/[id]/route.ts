import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Log from '@/models/Log';
import { isValidObjectId } from 'mongoose';

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await dbConnect();
        const { id } = params;

        if (!isValidObjectId(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const log = await Log.findByIdAndDelete(id);
        if (!log) {
            return NextResponse.json({ error: 'Log not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Log deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete log' }, { status: 500 });
    }
}
