const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

// Helper to check if credentials are dummy or missing
const isCloudinaryConfigured = () => {
  const name = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  
  return (
    name && name !== 'your_cloud_name' &&
    key && key !== 'your_api_key' &&
    secret && secret !== 'your_api_secret'
  );
};

/**
 * Uploads a local file to Cloudinary with compression transformations.
 * Automatically falls back to local storage if Cloudinary is not configured.
 * Removes the temporary local file on successful Cloudinary upload.
 */
const uploadToCloudinary = async (filePath, folder = 'plantcare_avatars') => {
  const localRelativeUrl = `/uploads/avatars/${path.basename(filePath)}`;
  
  if (!isCloudinaryConfigured()) {
    console.warn('⚠️ Cloudinary not fully configured in env. Using local storage fallback.');
    return {
      secure_url: localRelativeUrl,
      public_id: null
    };
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 600, height: 600, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' }
      ]
    });
    
    // Clean up local temp file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    return {
      secure_url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    // Keep local file as fallback instead of throwing error if possible, or rethrow
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

/**
 * Uploads a base64 string image to Cloudinary (for webcam captures).
 * Falls back to saving base64 to a local file if Cloudinary is not configured.
 */
const uploadBase64ToCloudinary = async (base64Str, folder = 'plantcare_avatars') => {
  if (!isCloudinaryConfigured()) {
    console.warn('⚠️ Cloudinary not configured. Saving base64 capture locally.');
    // Generate a unique filename and save base64 to uploads/avatars/
    const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 image data');
    }
    const buffer = Buffer.from(matches[2], 'base64');
    const filename = `capture-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
    const uploadDir = path.join(__dirname, '..', 'uploads', 'avatars');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const localFilePath = path.join(uploadDir, filename);
    fs.writeFileSync(localFilePath, buffer);
    return {
      secure_url: `/uploads/avatars/${filename}`,
      public_id: null
    };
  }

  try {
    const result = await cloudinary.uploader.upload(base64Str, {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 600, height: 600, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' }
      ]
    });
    
    return {
      secure_url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('❌ Cloudinary base64 upload error:', error);
    throw new Error(`Cloudinary capture upload failed: ${error.message}`);
  }
};

/**
 * Deletes an image from Cloudinary (or local uploads) if public ID exists.
 */
const deleteFromCloudinary = async (publicId, secureUrl = '') => {
  if (!publicId) {
    // If it was a local file, try to delete it locally
    if (secureUrl && secureUrl.startsWith('/uploads/')) {
      try {
        const localPath = path.join(__dirname, '..', secureUrl);
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
          console.log(`🗑️ Deleted local file: ${localPath}`);
        }
      } catch (err) {
        console.error('Failed to delete local fallback file:', err.message);
      }
    }
    return { result: 'ok' };
  }

  if (!isCloudinaryConfigured()) {
    return { result: 'ok' };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('❌ Cloudinary delete error:', error);
    throw new Error(`Cloudinary deletion failed: ${error.message}`);
  }
};

module.exports = {
  uploadToCloudinary,
  uploadBase64ToCloudinary,
  deleteFromCloudinary
};
