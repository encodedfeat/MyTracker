// models/TimeSession.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ITimeSession extends Document {
  userId: string;
  goalId: mongoose.Schema.Types.ObjectId;
  subtopicId: mongoose.Schema.Types.ObjectId;
  taskId?: mongoose.Schema.Types.ObjectId;
  durationSeconds: number; // Total elapsed time in seconds
  durationDisplay: string; // e.g. "1h 30m"
  date: Date;
  createdAt: Date;
}

const TimeSessionSchema = new Schema<ITimeSession>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  goalId: {
    type: Schema.Types.ObjectId,
    ref: 'Goal',
    required: true,
  },
  subtopicId: {
    type: Schema.Types.ObjectId,
    ref: 'Subtopic',
    required: true,
  },
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: false,
  },
  durationSeconds: {
    type: Number,
    required: true,
  },
  durationDisplay: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

TimeSessionSchema.index({ userId: 1, date: -1 });

const TimeSession: Model<ITimeSession> =
  mongoose.models?.TimeSession || mongoose.model<ITimeSession>('TimeSession', TimeSessionSchema);

export default TimeSession;
