import mongoose, { Document, Schema, models, Model } from 'mongoose';

export interface IAdHocTask {
  id: string;
  name: string;
  completed: boolean;
}

export interface IDailyPlan extends Document {
  userId: string;
  date: string; // YYYY-MM-DD
  taskIds: string[];
  subtopicIds: string[];
  adHocTasks: IAdHocTask[];
}

const DailyPlanSchema = new Schema<IDailyPlan>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  date: {
    type: String,
    required: true,
  },
  taskIds: {
    type: [String],
    default: [],
  },
  subtopicIds: {
    type: [String],
    default: [],
  },
  adHocTasks: {
    type: [{
      id: { type: String, required: true },
      name: { type: String, required: true },
      completed: { type: Boolean, default: false }
    }],
    default: []
  }
});

DailyPlanSchema.index({ userId: 1, date: 1 }, { unique: true });

if (mongoose.models && mongoose.models.DailyPlan) {
  delete mongoose.models.DailyPlan;
}

const DailyPlan: Model<IDailyPlan> = mongoose.model<IDailyPlan>('DailyPlan', DailyPlanSchema);

export default DailyPlan;
