import express, { Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { auth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Mock forum data - in real app, this would be a proper model
let forumPosts: any[] = [];

// Get all forum posts
router.get('/posts', auth, async (req: AuthRequest, res: Response) => {
  try {
    res.json({ posts: forumPosts });
  } catch (error) {
    console.error('Get forum posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create forum post
router.post('/posts',
  auth,
  [
    body('title').trim().notEmpty().isLength({ max: 200 }),
    body('content').trim().notEmpty().isLength({ max: 2000 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const post = {
        id: Date.now().toString(),
        title: req.body.title,
        content: req.body.content,
        authorId: req.user!.userId,
        authorName: 'User', // Would come from user data
        createdAt: new Date(),
        comments: [],
      };

      forumPosts.unshift(post);
      res.status(201).json({ post });
    } catch (error) {
      console.error('Create forum post error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Add comment to post
router.post('/posts/:postId/comments',
  auth,
  [
    param('postId').notEmpty(),
    body('content').trim().notEmpty().isLength({ max: 1000 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const post = forumPosts.find(p => p.id === req.params.postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const comment = {
        id: Date.now().toString(),
        content: req.body.content,
        authorId: req.user!.userId,
        authorName: 'User',
        createdAt: new Date(),
      };

      post.comments.push(comment);
      res.status(201).json({ comment });
    } catch (error) {
      console.error('Add comment error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
