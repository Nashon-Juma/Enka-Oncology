import express, { Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { Appointment } from '../models/Appointment';
import { auth, AuthRequest } from '../middleware/auth';
import { sendEmailReminder, sendSMSReminder } from '../services/notificationService';

const router = express.Router();

// Get all appointments for user
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate, status } = req.query;
    
    let query: any = { userId: req.user!.userId };
    
    if (startDate && endDate) {
      query.startTime = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }
    
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .sort({ startTime: 1 });

    res.json({ appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create appointment
router.post('/',
  auth,
  [
    body('title').trim().notEmpty(),
    body('type').isIn(['consultation', 'treatment', 'checkup', 'test', 'other']),
    body('provider').trim().notEmpty(),
    body('location').trim().notEmpty(),
    body('startTime').isISO8601(),
    body('endTime').isISO8601(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const appointment = new Appointment({
        ...req.body,
        userId: req.user!.userId,
      });

      await appointment.save();

      res.status(201).json({ appointment });
    } catch (error) {
      console.error('Create appointment error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update appointment
router.put('/:id',
  auth,
  [
    param('id').isMongoId(),
    body('title').optional().trim().notEmpty(),
    body('type').optional().isIn(['consultation', 'treatment', 'checkup', 'test', 'other']),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const appointment = await Appointment.findOneAndUpdate(
        { _id: req.params.id, userId: req.user!.userId },
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      res.json({ appointment });
    } catch (error) {
      console.error('Update appointment error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update appointment reminders
router.put('/:id/reminders',
  auth,
  [
    param('id').isMongoId(),
    body('email').optional().isBoolean(),
    body('sms').optional().isBoolean(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const appointment = await Appointment.findOneAndUpdate(
        { _id: req.params.id, userId: req.user!.userId },
        { 
          $set: { 
            'reminders.email': req.body.email,
            'reminders.sms': req.body.sms,
          } 
        },
        { new: true }
      );

      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      res.json({ appointment });
    } catch (error) {
      console.error('Update reminders error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
