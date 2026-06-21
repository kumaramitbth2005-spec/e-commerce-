const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    type: { type: String, enum: ['Purchase', 'Rent', 'Exchange', 'Auction'], required: true },
    amount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed', 'Refunded'], default: 'Pending' },
    orderStatus: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'], default: 'Processing' },
    paymentMethod: { type: String, required: true },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    shippingAddress: {
        name: { type: String },
        phone: { type: String },
        address: { type: String },
        pincode: { type: String },
        collegeName: { type: String }
    },
    rentDetails: {
        startDate: { type: Date },
        endDate: { type: Date },
        securityDepositReturned: { type: Boolean, default: false }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
