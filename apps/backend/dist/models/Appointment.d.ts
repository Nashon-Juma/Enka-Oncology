import mongoose, { Document } from 'mongoose';
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
export declare const Appointment: mongoose.Model<IAppointment, {}, {}, {}, mongoose.Document<unknown, {}, IAppointment> & IAppointment & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=Appointment.d.ts.map