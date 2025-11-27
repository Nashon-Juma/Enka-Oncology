import express, { Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import multer from 'multer';
import { Document } from '../models/Document';
import { auth, AuthRequest } from '../middleware/auth';
import { uploadToS3, deleteFromS3, generatePresignedUrl } from '../services/s3Service';
import { encryptBuffer, decryptBuffer } from '../utils/encryption';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all documents for user
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { category, shared } = req.query;
    
    let query: any = { userId: req.user!.userId };
    
    if (category) {
      query.category = category;
    }
    
    if (shared === 'true') {
      query.sharedWith = { $exists: true, $ne: [] };
    }

    const documents = await Document.find(query)
      .sort({ createdAt: -1 })
      .populate('sharedWith', 'firstName lastName email');

    res.json({ documents });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload document
router.post('/upload',
  auth,
  upload.single('file'),
  [
    body('category').isIn(['medical_record', 'prescription', 'lab_result', 'insurance', 'other']),
    body('description').optional().trim(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Encrypt file buffer
      const encryptedBuffer = encryptBuffer(req.file.buffer);
      
      // Upload to S3
      const s3Key = await uploadToS3(
        encryptedBuffer,
        req.file.originalname,
        req.file.mimetype
      );

      // Create document record
      const document = new Document({
        userId: req.user!.userId,
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
    } catch (error) {
      console.error('Upload document error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Download document
router.get('/:id/download',
  auth,
  [param('id').isMongoId()],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const document = await Document.findOne({
        _id: req.params.id,
        $or: [
          { userId: req.user!.userId },
          { sharedWith: req.user!.userId },
        ],
      });

      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }

      // Generate presigned URL for download
      const downloadUrl = await generatePresignedUrl(document.s3Key, document.originalName);

      // Log download activity
      console.log(`Document downloaded: ${document._id} by user: ${req.user!.userId}`);

      res.json({ downloadUrl });
    } catch (error) {
      console.error('Download document error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Share document
router.post('/:id/share',
  auth,
  [
    param('id').isMongoId(),
    body('userIds').isArray({ min: 1 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const document = await Document.findOneAndUpdate(
        { _id: req.params.id, userId: req.user!.userId },
        { $addToSet: { sharedWith: { $each: req.body.userIds } } },
        { new: true }
      ).populate('sharedWith', 'firstName lastName email');

      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }

      res.json({ document });
    } catch (error) {
      console.error('Share document error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete document
router.delete('/:id',
  auth,
  [param('id').isMongoId()],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const document = await Document.findOne({
        _id: req.params.id,
        userId: req.user!.userId,
      });

      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }

      // Delete from S3
      await deleteFromS3(document.s3Key);

      // Delete from database
      await Document.findByIdAndDelete(req.params.id);

      res.json({ message: 'Document deleted successfully' });
    } catch (error) {
      console.error('Delete document error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
