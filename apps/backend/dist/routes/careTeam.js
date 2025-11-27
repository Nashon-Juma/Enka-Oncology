"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const User_1 = require("../models/User");
const router = express_1.default.Router();
// Get care team directory
router.get('/', auth_1.auth, async (req, res) => {
    try {
        const careTeam = await User_1.User.find({
            role: { $in: ['clinician', 'admin'] },
            isActive: true
        }).select('firstName lastName email role phoneNumber');
        res.json({ careTeam });
    }
    catch (error) {
        console.error('Get care team error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=careTeam.js.map