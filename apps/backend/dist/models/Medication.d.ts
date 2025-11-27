import mongoose, { Document } from 'mongoose';
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
export declare const Medication: mongoose.Model<IMedication, {}, {}, {}, mongoose.Document<unknown, {}, IMedication> & IMedication & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=Medication.d.ts.map