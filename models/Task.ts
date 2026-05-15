// models/Task.ts
import mongoose, { Document, Schema, models, Model } from 'mongoose';

export interface ITask extends Document {
  subtopicId: mongoose.Schema.Types.ObjectId;
  name: string;
  completed: boolean;
  completedAt?: Date;
  userId: string;
}

const TaskSchema = new Schema<ITask>({
  subtopicId: {
    type: Schema.Types.ObjectId,
    ref: 'Subtopic',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
});

const Task: Model<ITask> = mongoose.models?.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;