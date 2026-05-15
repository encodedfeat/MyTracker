// models/Subtopic.ts
import mongoose, { Document, Schema, models, Model } from 'mongoose';

export interface ISubtopic extends Document {
  goalId: mongoose.Schema.Types.ObjectId;
  name: string;
  type: 'habit' | 'cumulative' | 'tasks';
  target?: number;
  userId: string;
}

const SubtopicSchema = new Schema<ISubtopic>({
  goalId: {
    type: Schema.Types.ObjectId,
    ref: 'Goal',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['habit', 'cumulative', 'tasks'],
    required: true,
  },
  target: {
    type: Number,
    required: false, // Only required for 'cumulative'
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
});

const Subtopic: Model<ISubtopic> = mongoose.models?.Subtopic || mongoose.model<ISubtopic>('Subtopic', SubtopicSchema);

export default Subtopic;