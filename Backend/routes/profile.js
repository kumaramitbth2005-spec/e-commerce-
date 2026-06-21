const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/authMiddleware');
const { 
    getProfile, 
    updateProfile, 
    uploadAvatar, 
    uploadImage, 
    captureImage, 
    removeImage, 
    changePassword 
} = require('../controllers/profileController');

// Ensure uploads directory exists for temp files or local fallback
const uploadDir = path.join(__dirname, '..', 'uploads', 'avatars');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `img-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    cb(new Error('Only image files (jpg, png, gif, webp) are allowed'));
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter
});

// Routes
router.get('/', protect, getProfile);
router.put('/', protect, updateProfile); // Legacy support
router.put('/update', protect, updateProfile); // Profile Update

// Image Upload Routes
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar); // Legacy support
router.post('/upload-image', protect, upload.single('image'), uploadImage); // Profile image upload
router.post('/capture-image', protect, upload.single('image'), captureImage); // Webcam image capture

// Remove Image Route
router.delete('/remove-image', protect, removeImage); // Remove profile image

// Security Route
router.put('/change-password', protect, changePassword); // Change Password

module.exports = router;
