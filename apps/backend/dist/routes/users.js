"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../models/User");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get user profile
router.get('/profile', auth_1.auth, async (req, res) => {
    try {
        const user = await User_1.User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    }
    catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Update user profile
router.put('/profile', auth_1.auth, async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, emergencyContact } = req.body;
        const user = await User_1.User.findByIdAndUpdate(req.user.userId, {
            firstName,
            lastName,
            phoneNumber,
            emergencyContact
        }, { new: true, runValidators: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    }
    catch (error) {
        console.error('Update user profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get care team members (clinicians)
router.get('/care-team', auth_1.auth, (0, auth_1.requireRole)(['patient', 'caregiver']), async (req, res) => {
    try {
        const clinicians = await User_1.User.find({
            role: 'clinician',
            isActive: true
        }).select('firstName lastName email phoneNumber');
        res.json({ clinicians });
    }
    catch (error) {
        console.error('Get care team error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map