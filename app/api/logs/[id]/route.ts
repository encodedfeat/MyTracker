// app/api/logs/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Log from '@/models/Log';

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const params = await props.params;
    try {
        const deletedLog = await Log.findByIdAndDelete(params.id);

        if (!deletedLog) {
            return NextResponse.json({ error: 'Log not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete log' }, { status: 500 });
    }
}
