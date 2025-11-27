"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const multer_1 = __importDefault(require("multer"));
const Document_1 = require("../models/Document");
const auth_1 = require("../middleware/auth");
const s3Service_1 = require("../services/s3Service");
const encryption_1 = require("../utils/encryption");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// Get all documents for user
router.get('/', auth_1.auth, async (req, res) => {
    try {
        const { category, shared } = req.query;
        let query = { userId: req.user.userId };
        if (category) {
            query.category = category;
        }
        if (shared === 'true') {
            query.sharedWith = { $exists: true, $ne: [] };
        }
        const documents = await Document_1.Document.find(query)
            .sort({ createdAt: -1 })
            .populate('sharedWith', 'firstName lastName email');
        res.json({ documents });
    }
    catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Upload document
router.post('/upload', auth_1.auth, upload.single('file'), [
    (0, express_validator_1.body)('category').isIn(['medical_record', 'prescription', 'lab_result', 'insurance', 'other']),
    (0, express_validator_1.body)('description').optional().trim(),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        // Encrypt file buffer
        const encryptedBuffer = (0, encryption_1.encryptBuffer)(req.file.buffer);
        // Upload to S3
        const s3Key = await (0, s3Service_1.uploadToS3)(encryptedBuffer, req.file.originalname, req.file.mimetype);
        // Create document record
        const document = new Document_1.Document({
            userId: req.user.userId,
            filename: req.file.originalname,
            originalName: req.file.originalname,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            s3Key,
            encryptionKey: process.env.ENCRYPTION_KEY, // In production, use KMS
            category: req.body.category,
            description: req.body.description,
            tags: req.body.tags ? JSON.parse(req.body.tags) : [],
            isEncrypted: true,
        });
        await document.save();
        res.status(201).json({ document });
    }
    catch (error) {
        console.error('Upload document error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Download document
router.get('/:id/download', auth_1.auth, [(0, express_validator_1.param)('id').isMongoId()], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const document = await Document_1.Document.findOne({
            _id: req.params.id,
            $or: [
                { userId: req.user.userId },
                { sharedWith: req.user.userId },
            ],
        });
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        // Generate presigned URL for download
        const downloadUrl = await (0, s3Service_1.generatePresignedUrl)(document.s3Key, document.originalName);
        // Log download activity
        console.log(`Document downloaded: ${document._id} by user: ${req.user.userId}`);
        res.json({ downloadUrl });
    }
    catch (error) {
        console.error('Download document error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Share document
router.post('/:id/share', auth_1.auth, [
    (0, express_validator_1.param)('id').isMongoId(),
    (0, express_validator_1.body)('userIds').isArray({ min: 1 }),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const document = await Document_1.Document.findOneAndUpdate({ _id: req.params.id, userId: req.user.userId }, { $addToSet: { sharedWith: { $each: req.body.userIds } } }, { new: true }).populate('sharedWith', 'firstName lastName email');
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.json({ document });
    }
    catch (error) {
        console.error('Share document error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Delete document
router.delete('/:id', auth_1.auth, [(0, express_validator_1.param)('id').isMongoId()], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const document = await Document_1.Document.findOne({
            _id: req.params.id,
            userId: req.user.userId,
        });
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        // Delete from S3
        await (0, s3Service_1.deleteFromS3)(document.s3Key);
        // Delete from database
        await Document_1.Document.findByIdAndDelete(req.params.id);
        res.json({ message: 'Document deleted successfully' });
    }
    catch (error) {
        console.error('Delete document error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=documents.js.map