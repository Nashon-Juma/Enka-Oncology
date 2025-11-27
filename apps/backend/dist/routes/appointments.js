"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const Appointment_1 = require("../models/Appointment");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get all appointments for user
router.get('/', auth_1.auth, async (req, res) => {
    try {
        const { startDate, endDate, status } = req.query;
        let query = { userId: req.user.userId };
        if (startDate && endDate) {
            query.startTime = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }
        if (status) {
            query.status = status;
        }
        const appointments = await Appointment_1.Appointment.find(query)
            .sort({ startTime: 1 });
        res.json({ appointments });
    }
    catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Create appointment
router.post('/', auth_1.auth, [
    (0, express_validator_1.body)('title').trim().notEmpty(),
    (0, express_validator_1.body)('type').isIn(['consultation', 'treatment', 'checkup', 'test', 'other']),
    (0, express_validator_1.body)('provider').trim().notEmpty(),
    (0, express_validator_1.body)('location').trim().notEmpty(),
    (0, express_validator_1.body)('startTime').isISO8601(),
    (0, express_validator_1.body)('endTime').isISO8601(),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const appointment = new Appointment_1.Appointment({
            ...req.body,
            userId: req.user.userId,
        });
        await appointment.save();
        res.status(201).json({ appointment });
    }
    catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Update appointment
router.put('/:id', auth_1.auth, [
    (0, express_validator_1.param)('id').isMongoId(),
    (0, express_validator_1.body)('title').optional().trim().notEmpty(),
    (0, express_validator_1.body)('type').optional().isIn(['consultation', 'treatment', 'checkup', 'test', 'other']),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const appointment = await Appointment_1.Appointment.findOneAndUpdate({ _id: req.params.id, userId: req.user.userId }, { $set: req.body }, { new: true, runValidators: true });
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json({ appointment });
    }
    catch (error) {
        console.error('Update appointment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Update appointment reminders
router.put('/:id/reminders', auth_1.auth, [
    (0, express_validator_1.param)('id').isMongoId(),
    (0, express_validator_1.body)('email').optional().isBoolean(),
    (0, express_validator_1.body)('sms').optional().isBoolean(),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const appointment = await Appointment_1.Appointment.findOneAndUpdate({ _id: req.params.id, userId: req.user.userId }, {
            $set: {
                'reminders.email': req.body.email,
                'reminders.sms': req.body.sms,
            }
        }, { new: true });
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json({ appointment });
    }
    catch (error) {
        console.error('Update reminders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=appointments.js.map