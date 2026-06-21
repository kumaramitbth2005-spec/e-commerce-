const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');

// @desc Get messages for a specific conversation
// @route GET /api/chat/:userId
router.get('/:userId', protect, asyncHandler(async (req, res) => {
    const messages = await Message.find({
        $or: [
            { sender: req.user._id, receiver: req.params.userId },
            { sender: req.params.userId, receiver: req.user._id }
        ]
    }).sort({ createdAt: 1 });
    
    res.json(messages);
}));

// @desc Send a message (also handled via Socket.io)
// @route POST /api/chat
router.post('/', protect, asyncHandler(async (req, res) => {
    const { receiver, content, product, imageUrl } = req.body;

    const message = await Message.create({
        sender: req.user._id,
        receiver,
        content,
        product,
        imageUrl
    });

    res.status(201).json(message);
}));

module.exports = router;
