const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');
const { 
  uploadToCloudinary, 
  uploadBase64ToCloudinary, 
  deleteFromCloudinary 
} = require('../services/cloudinaryService');

// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.json(user);
});

// @desc    Update user profile details
// @route   PUT /api/profile/update
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Fields that can be updated
    const { name, phone, bio, address, location, collegeName } = req.body;

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (address !== undefined) user.address = address;
    if (collegeName !== undefined) user.collegeName = collegeName;
    
    if (location) {
        user.location = {
            latitude: location.latitude !== undefined ? location.latitude : user.location.latitude,
            longitude: location.longitude !== undefined ? location.longitude : user.location.longitude,
            fullAddress: location.fullAddress !== undefined ? location.fullAddress : user.location.fullAddress
        };
    }

    const updatedUser = await user.save();
    
    // Select user without password
    const userResponse = await User.findById(updatedUser._id).select('-password');
    res.json(userResponse);
});

// @desc    Upload profile photo (Legacy support for /avatar)
// @route   POST /api/profile/avatar
// @access  Private
const uploadAvatar = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('No file uploaded');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Delete old image from Cloudinary / local
    await deleteFromCloudinary(user.profileImagePublicId, user.profileImage);

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.path);

    user.profileImage = uploadResult.secure_url;
    user.profileImagePublicId = uploadResult.public_id || '';
    await user.save();

    res.json({
        profilePhoto: user.profileImage, // keep legacy field name in response
        profileImage: user.profileImage,
        message: 'Profile photo uploaded successfully'
    });
});

// @desc    Upload profile image to Cloudinary
// @route   POST /api/profile/upload-image
// @access  Private
const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Please select an image file to upload');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Delete old image from Cloudinary / local
    await deleteFromCloudinary(user.profileImagePublicId, user.profileImage);

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.path);

    user.profileImage = uploadResult.secure_url;
    user.profileImagePublicId = uploadResult.public_id || '';
    await user.save();

    res.json({
        profileImage: user.profileImage,
        message: 'Profile image uploaded successfully'
    });
});

// @desc    Upload webcam captured image
// @route   POST /api/profile/capture-image
// @access  Private
const captureImage = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    let uploadResult;

    // Check if uploaded as a multipart file
    if (req.file) {
        // Delete old image
        await deleteFromCloudinary(user.profileImagePublicId, user.profileImage);
        // Upload new image
        uploadResult = await uploadToCloudinary(req.file.path);
    } 
    // Check if uploaded as a base64 string
    else if (req.body.image) {
        // Delete old image
        await deleteFromCloudinary(user.profileImagePublicId, user.profileImage);
        // Upload new image
        uploadResult = await uploadBase64ToCloudinary(req.body.image);
    } 
    else {
        res.status(400);
        throw new Error('No image file or base64 data provided');
    }

    user.profileImage = uploadResult.secure_url;
    user.profileImagePublicId = uploadResult.public_id || '';
    await user.save();

    res.json({
        profileImage: user.profileImage,
        message: 'Camera capture uploaded successfully'
    });
});

// @desc    Remove profile image
// @route   DELETE /api/profile/remove-image
// @access  Private
const removeImage = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (!user.profileImage) {
        res.status(400);
        throw new Error('No profile image to remove');
    }

    // Delete image from Cloudinary / local
    await deleteFromCloudinary(user.profileImagePublicId, user.profileImage);

    // Reset database fields
    user.profileImage = '';
    user.profileImagePublicId = '';
    user.profilePhoto = '';
    await user.save();

    res.json({
        message: 'Profile image removed successfully'
    });
});

// @desc    Change user password
// @route   PUT /api/profile/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        res.status(400);
        throw new Error('Please provide both current password and new password');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
        res.status(401);
        throw new Error('Incorrect current password');
    }

    // Update password (pre-save hook will automatically hash this new password)
    user.password = newPassword;
    await user.save();

    res.json({
        message: 'Password changed successfully'
    });
});

module.exports = {
    getProfile,
    updateProfile,
    uploadAvatar,
    uploadImage,
    captureImage,
    removeImage,
    changePassword
};
