"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const Symptom_1 = require("../models/Symptom");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get all symptoms for user with optional date range
router.get('/', auth_1.auth, async (req, res) => {
    try {
        const { startDate, endDate, limit = 50 } = req.query;
        let query = { userId: req.user.userId };
        if (startDate && endDate) {
            query.recordedAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }
        const symptoms = await Symptom_1.Symptom.find(query)
            .sort({ recordedAt: -1 })
            .limit(Number(limit));
        res.json({ symptoms });
    }
    catch (error) {
        console.error('Get symptoms error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get symptom statistics
router.get('/stats', auth_1.auth, async (req, res) => {
    try {
        const { days = 7 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - Number(days));
        const stats = await Symptom_1.Symptom.aggregate([
            {
                $match: {
                    userId: req.user.userId,
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
    }
    catch (error) {
        console.error('Get symptom stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Create symptom
router.post('/', auth_1.auth, [
    (0, express_validator_1.body)('name').trim().notEmpty(),
    (0, express_validator_1.body)('intensity').isInt({ min: 1, max: 10 }),
    (0, express_validator_1.body)('recordedAt').optional().isISO8601(),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const symptom = new Symptom_1.Symptom({
            ...req.body,
            userId: req.user.userId,
            recordedAt: req.body.recordedAt || new Date(),
        });
        await symptom.save();
        res.status(201).json({ symptom });
    }
    catch (error) {
        console.error('Create symptom error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Export symptoms as CSV
router.get('/export/csv', auth_1.auth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = { userId: req.user.userId };
        if (startDate && endDate) {
            query.recordedAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }
        const symptoms = await Symptom_1.Symptom.find(query)
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
    }
    catch (error) {
        console.error('Export symptoms error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=symptoms.js.map