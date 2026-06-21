const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');

// @desc Get all products with filters
// @route GET /api/products
router.get('/', asyncHandler(async (req, res) => {
    const { category, search, minPrice, maxPrice, condition, college } = req.query;
    
    let query = {};
    
    if (category && category !== 'All') query.category = category;
    if (condition) query.condition = condition;
    if (college) query.collegeName = college;
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (search) {
        query.$text = { $search: search };
    }

    const products = await Product.find(query).populate('seller', 'name avatar');
    res.json(products);
}));

// @desc Get single product
// @route GET /api/products/:id
router.get('/:id', asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('seller', 'name avatar collegeName');
    if (product) {
        // Increment views
        product.views += 1;
        await product.save();
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
}));

// @desc Create a product
// @route POST /api/products
router.post('/', protect, asyncHandler(async (req, res) => {
    const { name, description, price, category, condition, images, isAvailableForRent, rentPrice, isAvailableForExchange, exchangePreferences, isAuction, auctionEndTime } = req.body;

    const product = new Product({
        seller: req.user._id,
        name,
        description,
        price,
        category,
        condition,
        images,
        collegeName: req.user.collegeName,
        isAvailableForRent,
        rentPrice,
        isAvailableForExchange,
        exchangePreferences,
        isAuction,
        auctionEndTime
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
}));

module.exports = router;
