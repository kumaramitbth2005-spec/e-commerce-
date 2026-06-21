const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: { 
        type: String, 
        required: true,
        enum: ['Engineering', 'Medical', 'BCA', 'BTech', 'Commerce', 'Law', 'UPSC', 'Notes', 'Calculator', 'Drafter', 'Lab Coat', 'Instruments', 'Laptop accessories']
    },
    condition: { type: String, enum: ['New', 'Like New', 'Good', 'Fair'], default: 'Good' },
    images: [{ type: String }], // Cloudinary URLs
    collegeName: { type: String, required: true },
    
    // Renting System
    isAvailableForRent: { type: Boolean, default: false },
    rentPrice: {
        daily: { type: Number },
        weekly: { type: Number },
        monthly: { type: Number }
    },
    securityDeposit: { type: Number },

    // Exchange System
    isAvailableForExchange: { type: Boolean, default: false },
    exchangePreferences: { type: String },

    // Bidding/Auction System
    isAuction: { type: Boolean, default: false },
    auctionEndTime: { type: Date },
    startingBid: { type: Number },
    currentHighestBid: { type: Number },
    highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // Digital Products
    isDigital: { type: Boolean, default: false },
    fileUrl: { type: String }, // For Notes/PDFs

    status: { type: String, enum: ['Available', 'Sold', 'Rented', 'Pending'], default: 'Available' },
    ratings: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            rating: { type: Number, min: 1, max: 5 },
            comment: { type: String }
        }
    ],
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// Search index
productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
