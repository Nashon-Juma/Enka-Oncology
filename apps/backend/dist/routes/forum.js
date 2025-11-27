"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Mock forum data - in real app, this would be a proper model
let forumPosts = [];
// Get all forum posts
router.get('/posts', auth_1.auth, async (req, res) => {
    try {
        res.json({ posts: forumPosts });
    }
    catch (error) {
        console.error('Get forum posts error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Create forum post
router.post('/posts', auth_1.auth, [
    (0, express_validator_1.body)('title').trim().notEmpty().isLength({ max: 200 }),
    (0, express_validator_1.body)('content').trim().notEmpty().isLength({ max: 2000 }),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const post = {
            id: Date.now().toString(),
            title: req.body.title,
            content: req.body.content,
            authorId: req.user.userId,
            authorName: 'User', // Would come from user data
            createdAt: new Date(),
            comments: [],
        };
        forumPosts.unshift(post);
        res.status(201).json({ post });
    }
    catch (error) {
        console.error('Create forum post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Add comment to post
router.post('/posts/:postId/comments', auth_1.auth, [
    (0, express_validator_1.param)('postId').notEmpty(),
    (0, express_validator_1.body)('content').trim().notEmpty().isLength({ max: 1000 }),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
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
            authorId: req.user.userId,
            authorName: 'User',
            createdAt: new Date(),
        };
        post.comments.push(comment);
        res.status(201).json({ comment });
    }
    catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=forum.js.map