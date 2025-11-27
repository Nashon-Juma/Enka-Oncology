"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const Appointment_1 = require("../models/Appointment");
const Medication_1 = require("../models/Medication");
const Symptom_1 = require("../models/Symptom");
const Document_1 = require("../models/Document");
const router = express_1.default.Router();
// Get dashboard data
router.get('/', auth_1.auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        // Get upcoming appointments (next 7 days)
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfWeek = new Date();
        endOfWeek.setDate(endOfWeek.getDate() + 7);
        const [appointments, medications, recentSymptoms, documents] = await Promise.all([
            // Upcoming appointments
            Appointment_1.Appointment.find({
                userId,
                startTime: {
                    $gte: startOfToday,
                    $lte: endOfWeek
                },
                status: 'scheduled'
            }).sort({ startTime: 1 }).limit(5),
            // Active medications
            Medication_1.Medication.find({
                userId,
                status: 'active'
            }).sort({ startDate: -1 }).limit(5),
            // Recent symptoms
            Symptom_1.Symptom.find({
                userId
            }).sort({ recordedAt: -1 }).limit(5),
            // Recent documents
            Document_1.Document.find({
                userId
            }).sort({ createdAt: -1 }).limit(5)
        ]);
        // Get stats
        const stats = {
            upcomingAppointments: await Appointment_1.Appointment.countDocuments({
                userId,
                startTime: { $gte: startOfToday },
                status: 'scheduled'
            }),
            activeMedications: await Medication_1.Medication.countDocuments({
                userId,
                status: 'active'
            }),
            symptomsThisWeek: await Symptom_1.Symptom.countDocuments({
                userId,
                recordedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            }),
            totalDocuments: await Document_1.Document.countDocuments({ userId })
        };
        res.json({
            stats,
            upcomingAppointments: appointments,
            activeMedications: medications,
            recentSymptoms,
            recentDocuments: documents
        });
    }
    catch (error) {
        console.error('Get dashboard data error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=dashboard.js.map