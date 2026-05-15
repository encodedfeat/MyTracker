// models/Log.ts
import mongoose, { Document, Schema, models, Model } from 'mongoose';

export interface ILog extends Document {
  subtopicId: mongoose.Schema.Types.ObjectId;
  date: Date; // Store as Date for easier querying
  value: number;
}

const LogSchema = new Schema<ILog>({
  subtopicId: {
    type: Schema.Types.ObjectId,
    ref: 'Subtopic',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

// Create a compound index to quickly find logs by subtopic and date
LogSchema.index({ subtopicId: 1, date: 1 });

const Log: Model<ILog> = models.Log || mongoose.model<ILog>('Log', LogSchema);

export default Log;