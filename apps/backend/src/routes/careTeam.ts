import express, { Response } from 'express';
import { auth, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';

const router = express.Router();

// Get care team directory
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const careTeam = await User.find({
      role: { $in: ['clinician', 'admin'] },
      isActive: true
    }).select('firstName lastName email role phoneNumber');

    res.json({ careTeam });
  } catch (error) {
    console.error('Get care team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
