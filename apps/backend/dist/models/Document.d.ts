import mongoose, { Document as MongooseDocument } from 'mongoose';
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
export declare const Document: mongoose.Model<IDocument, {}, {}, {}, mongoose.Document<unknown, {}, IDocument> & IDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=Document.d.ts.map