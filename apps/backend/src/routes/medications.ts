import express, { Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { Medication } from '../models/Medication';
import { auth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all medications for user
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const medications = await Medication.find({ userId: req.user!.userId })
      .sort({ startDate: -1 });
    
    res.json({ medications });
  } catch (error) {
    console.error('Get medications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get medication by ID
router.get('/:id', 
  auth,
  [param('id').isMongoId()],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const medication = await Medication.findOne({
        _id: req.params.id,
        userId: req.user!.userId,
      });

      if (!medication) {
        return res.status(404).json({ message: 'Medication not found' });
      }

      res.json({ medication });
    } catch (error) {
      console.error('Get medication error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Create medication
router.post('/',
  auth,
  [
    body('name').trim().notEmpty(),
    body('dosage').trim().notEmpty(),
    body('frequency').trim().notEmpty(),
    body('startDate').isISO8601(),
    body('prescribedBy').trim().notEmpty(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const medication = new Medication({
        ...req.body,
        userId: req.user!.userId,
      });

      await medication.save();

      res.status(201).json({ medication });
    } catch (error) {
      console.error('Create medication error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update medication
router.put('/:id',
  auth,
  [
    param('id').isMongoId(),
    body('name').optional().trim().notEmpty(),
    body('dosage').optional().trim().notEmpty(),
    body('frequency').optional().trim().notEmpty(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const medication = await Medication.findOneAndUpdate(
        { _id: req.params.id, userId: req.user!.userId },
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!medication) {
        return res.status(404).json({ message: 'Medication not found' });
      }

      res.json({ medication });
    } catch (error) {
      console.error('Update medication error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete medication
router.delete('/:id',
  auth,
  [param('id').isMongoId()],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const medication = await Medication.findOneAndDelete({
        _id: req.params.id,
        userId: req.user!.userId,
      });

      if (!medication) {
        return res.status(404).json({ message: 'Medication not found' });
      }

      res.json({ message: 'Medication deleted successfully' });
    } catch (error) {
      console.error('Delete medication error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
