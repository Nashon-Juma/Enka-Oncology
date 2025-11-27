import express, { Response } from 'express';
import { auth, AuthRequest } from '../middleware/auth';
import { Appointment } from '../models/Appointment';
import { Medication } from '../models/Medication';
import { Symptom } from '../models/Symptom';
import { Document } from '../models/Document';

const router = express.Router();

// Get dashboard data
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    // Get upcoming appointments (next 7 days)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date();
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const [appointments, medications, recentSymptoms, documents] = await Promise.all([
      // Upcoming appointments
      Appointment.find({
        userId,
        startTime: { 
          $gte: startOfToday,
          $lte: endOfWeek 
        },
        status: 'scheduled'
      }).sort({ startTime: 1 }).limit(5),

      // Active medications
      Medication.find({
        userId,
        status: 'active'
      }).sort({ startDate: -1 }).limit(5),

      // Recent symptoms
      Symptom.find({
        userId
      }).sort({ recordedAt: -1 }).limit(5),

      // Recent documents
      Document.find({
        userId
      }).sort({ createdAt: -1 }).limit(5)
    ]);

    // Get stats
    const stats = {
      upcomingAppointments: await Appointment.countDocuments({
        userId,
        startTime: { $gte: startOfToday },
        status: 'scheduled'
      }),
      activeMedications: await Medication.countDocuments({
        userId,
        status: 'active'
      }),
      symptomsThisWeek: await Symptom.countDocuments({
        userId,
        recordedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      totalDocuments: await Document.countDocuments({ userId })
    };

    res.json({
      stats,
      upcomingAppointments: appointments,
      activeMedications: medications,
      recentSymptoms,
      recentDocuments: documents
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
