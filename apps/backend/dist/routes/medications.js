"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const Medication_1 = require("../models/Medication");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get all medications for user
router.get('/', auth_1.auth, async (req, res) => {
    try {
        const medications = await Medication_1.Medication.find({ userId: req.user.userId })
            .sort({ startDate: -1 });
        res.json({ medications });
    }
    catch (error) {
        console.error('Get medications error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get medication by ID
router.get('/:id', auth_1.auth, [(0, express_validator_1.param)('id').isMongoId()], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const medication = await Medication_1.Medication.findOne({
            _id: req.params.id,
            userId: req.user.userId,
        });
        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }
        res.json({ medication });
    }
    catch (error) {
        console.error('Get medication error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Create medication
router.post('/', auth_1.auth, [
    (0, express_validator_1.body)('name').trim().notEmpty(),
    (0, express_validator_1.body)('dosage').trim().notEmpty(),
    (0, express_validator_1.body)('frequency').trim().notEmpty(),
    (0, express_validator_1.body)('startDate').isISO8601(),
    (0, express_validator_1.body)('prescribedBy').trim().notEmpty(),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const medication = new Medication_1.Medication({
            ...req.body,
            userId: req.user.userId,
        });
        await medication.save();
        res.status(201).json({ medication });
    }
    catch (error) {
        console.error('Create medication error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Update medication
router.put('/:id', auth_1.auth, [
    (0, express_validator_1.param)('id').isMongoId(),
    (0, express_validator_1.body)('name').optional().trim().notEmpty(),
    (0, express_validator_1.body)('dosage').optional().trim().notEmpty(),
    (0, express_validator_1.body)('frequency').optional().trim().notEmpty(),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const medication = await Medication_1.Medication.findOneAndUpdate({ _id: req.params.id, userId: req.user.userId }, { $set: req.body }, { new: true, runValidators: true });
        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }
        res.json({ medication });
    }
    catch (error) {
        console.error('Update medication error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Delete medication
router.delete('/:id', auth_1.auth, [(0, express_validator_1.param)('id').isMongoId()], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const medication = await Medication_1.Medication.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId,
        });
        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }
        res.json({ message: 'Medication deleted successfully' });
    }
    catch (error) {
        console.error('Delete medication error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=medications.js.map