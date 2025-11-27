import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  type: 'consultation' | 'treatment' | 'checkup' | 'test' | 'other';
  provider: string;
  location: string;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  reminders: {
    email: boolean;
    sms: boolean;
    sentAt?: Date;
  };
  notes?: string;
}

const appointmentSchema = new Schema<IAppointment>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ['consultation', 'treatment', 'checkup', 'test', 'other'],
    required: true,
  },
  provider: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'cancelled', 'completed'],
    default: 'scheduled',
  },
  reminders: {
    email: {
      type: Boolean,
      default: false,
    },
    sms: {
      type: Boolean,
      default: false,
    },
    sentAt: Date,
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

appointmentSchema.index({ userId: 1, startTime: -1 });
appointmentSchema.index({ startTime: 1, status: 1 });

export const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);