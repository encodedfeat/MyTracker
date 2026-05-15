// models/Goal.ts
import mongoose, { Document, Schema, models, Model } from 'mongoose';

export interface IGoal extends Document {
  name: string;
  icon: string;
  month?: number;
  year?: number;
  userId: string;
}

const GoalSchema = new Schema<IGoal>({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  month: {
    type: Number,
    required: false, // Optional for now to allow migration
  },
  year: {
    type: Number,
    required: false, // Optional for now to allow migration
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
});

const Goal: Model<IGoal> = mongoose.models?.Goal || mongoose.model<IGoal>('Goal', GoalSchema);

export default Goal;