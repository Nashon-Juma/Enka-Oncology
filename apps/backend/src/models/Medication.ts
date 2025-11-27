import mongoose, { Document, Schema } from 'mongoose';

export interface IMedication extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  instructions?: string;
  prescribedBy: string;
  status: 'active' | 'completed' | 'discontinued';
  notes?: string;
}

const medicationSchema = new Schema<IMedication>({
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
  dosage: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  instructions: {
    type: String,
    trim: true,
  },
  prescribedBy: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'discontinued'],
    default: 'active',
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

medicationSchema.index({ userId: 1, status: 1 });
medicationSchema.index({ userId: 1, startDate: -1 });

export const Medication = mongoose.model<IMedication>('Medication', medicationSchema);