import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import TimeSession from '@/models/TimeSession';
import { auth } from '@/auth';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;

        const timeSession = await TimeSession.findOneAndDelete({
            _id: id,
            userId: session.user.id,
        });

        if (!timeSession) {
            return NextResponse.json({ error: 'Time session not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting time session:', error);
        return NextResponse.json({ error: 'Failed to delete time session' }, { status: 500 });
    }
}
