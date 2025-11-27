import express, { Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { Symptom } from '../models/Symptom';
import { auth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all symptoms for user with optional date range
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate, limit = 50 } = req.query;
    
    let query: any = { userId: req.user!.userId };
    
    if (startDate && endDate) {
      query.recordedAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const symptoms = await Symptom.find(query)
      .sort({ recordedAt: -1 })
      .limit(Number(limit));

    res.json({ symptoms });
  } catch (error) {
    console.error('Get symptoms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get symptom statistics
router.get('/stats', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { days = 7 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    const stats = await Symptom.aggregate([
      {
        $match: {
          userId: req.user!.userId,
          recordedAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$name',
          averageIntensity: { $avg: '$intensity' },
          maxIntensity: { $max: '$intensity' },
          minIntensity: { $min: '$intensity' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.json({ stats });
  } catch (error) {
    console.error('Get symptom stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create symptom
router.post('/',
  auth,
  [
    body('name').trim().notEmpty(),
    body('intensity').isInt({ min: 1, max: 10 }),
    body('recordedAt').optional().isISO8601(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const symptom = new Symptom({
        ...req.body,
        userId: req.user!.userId,
        recordedAt: req.body.recordedAt || new Date(),
      });

      await symptom.save();

      res.status(201).json({ symptom });
    } catch (error) {
      console.error('Create symptom error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Export symptoms as CSV
router.get('/export/csv', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query: any = { userId: req.user!.userId };
    
    if (startDate && endDate) {
      query.recordedAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const symptoms = await Symptom.find(query)
      .sort({ recordedAt: -1 })
      .select('name intensity location triggers duration notes recordedAt')
      .lean();

    // Convert to CSV
    const headers = ['Date', 'Symptom', 'Intensity', 'Location', 'Triggers', 'Duration', 'Notes'];
    const csvRows = symptoms.map(symptom => [
      new Date(symptom.recordedAt).toISOString(),
      symptom.name,
      symptom.intensity,
      symptom.location || '',
      symptom.triggers?.join('; ') || '',
      symptom.duration ? `${symptom.duration} minutes` : '',
      symptom.notes || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.map(field => `"${field}"`).join(',')),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=symptoms.csv');
    res.send(csvContent);
  } catch (error) {
    console.error('Export symptoms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
