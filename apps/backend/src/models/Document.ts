import mongoose, { Document as MongooseDocument, Schema } from 'mongoose';

export interface IDocument extends MongooseDocument {
  userId: mongoose.Types.ObjectId;
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  s3Key: string;
  encryptionKey: string;
  category: 'medical_record' | 'prescription' | 'lab_result' | 'insurance' | 'other';
  description?: string;
  tags: string[];
  sharedWith: mongoose.Types.ObjectId[];
  isEncrypted: boolean;
  metadata: Record<string, any>;
}

const documentSchema = new Schema<IDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  s3Key: {
    type: String,
    required: true,
    unique: true,
  },
  encryptionKey: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['medical_record', 'prescription', 'lab_result', 'insurance', 'other'],
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  sharedWith: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  isEncrypted: {
    type: Boolean,
    default: true,
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

documentSchema.index({ userId: 1, category: 1 });
documentSchema.index({ sharedWith: 1 });
documentSchema.index({ tags: 1 });

export const Document = mongoose.model<IDocument>('Document', documentSchema);
