const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');

// @desc Create new order
// @route POST /api/orders
router.post('/', protect, asyncHandler(async (req, res) => {
    const { product, seller, type, amount, paymentMethod, shippingAddress, rentDetails } = req.body;

    const order = new Order({
        buyer: req.user._id,
        seller,
        product,
        type,
        amount,
        paymentMethod,
        shippingAddress,
        rentDetails
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
}));

// @desc Get logged in user orders
// @route GET /api/orders/myorders
router.get('/myorders', protect, asyncHandler(async (req, res) => {
    const orders = await Order.find({ buyer: req.user._id }).populate('product');
    res.json(orders);
}));

// @desc Get seller orders
// @route GET /api/orders/sales
router.get('/sales', protect, asyncHandler(async (req, res) => {
    const orders = await Order.find({ seller: req.user._id }).populate('product');
    res.json(orders);
}));

module.exports = router;
