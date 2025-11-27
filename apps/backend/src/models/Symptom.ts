import mongoose, { Document, Schema } from 'mongoose';

export interface ISymptom extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  intensity: number;
  notes?: string;
  location?: string;
  triggers?: string[];
  duration?: number;
  recordedAt: Date;
}

const symptomSchema = new Schema<ISymptom>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  intensity: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  notes: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  triggers: [{
    type: String,
    trim: true,
  }],
  duration: {
    type: Number, // in minutes
    min: 0,
  },
  recordedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, {
  timestamps: true,
});

symptomSchema.index({ userId: 1, recordedAt: -1 });
symptomSchema.index({ userId: 1, name: 1 });

export const Symptom = mongoose.model<ISymptom>('Symptom', symptomSchema);