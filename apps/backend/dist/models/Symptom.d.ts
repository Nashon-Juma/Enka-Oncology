import mongoose, { Document } from 'mongoose';
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
export declare const Symptom: mongoose.Model<ISymptom, {}, {}, {}, mongoose.Document<unknown, {}, ISymptom> & ISymptom & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=Symptom.d.ts.map