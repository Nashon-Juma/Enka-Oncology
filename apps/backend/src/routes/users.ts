import express, { Response } from 'express';
import { param, validationResult } from 'express-validator';
import { User } from '../models/User';
import { auth, AuthRequest, requireRole } from '../middleware/auth';

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, phoneNumber, emergencyContact } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user!.userId,
      { 
        firstName, 
        lastName, 
        phoneNumber, 
        emergencyContact 
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get care team members (clinicians)
router.get('/care-team', 
  auth,
  requireRole(['patient', 'caregiver']),
  async (req: AuthRequest, res: Response) => {
    try {
      const clinicians = await User.find({
        role: 'clinician',
        isActive: true 
      }).select('firstName lastName email phoneNumber');

      res.json({ clinicians });
    } catch (error) {
      console.error('Get care team error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
