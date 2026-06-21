const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    collegeName: { type: String, default: 'Plant Care AI' },
    collegeIdVerified: { type: Boolean, default: false },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    avatar: { type: String },
    profilePhoto: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    profileImagePublicId: { type: String, default: '' },
    refreshToken: { type: String, default: '' },
    bio: { type: String, default: '' },
    address: { type: String, default: '' },
    location: {
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null },
        fullAddress: { type: String, default: '' }
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    rewardPoints: { type: Number, default: 0 }
}, {
    timestamps: true
});

// Hash password and sync photo/image fields before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('profileImage') && !this.isModified('profilePhoto')) {
        this.profilePhoto = this.profileImage;
    } else if (this.isModified('profilePhoto') && !this.isModified('profileImage')) {
        this.profileImage = this.profilePhoto;
    }

    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
