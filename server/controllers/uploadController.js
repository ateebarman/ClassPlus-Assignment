const User = require('../models/User');
const Template = require('../models/Template');
const multer = require('multer');
const { streamUpload } = require('../utils/cloudinaryHelper');
const cloudinary = require('../config/cloudinary');

// Use memory storage — we'll stream directly to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files allowed'), false);
    }
    cb(null, true);
  },
});

// POST /api/upload/profile — upload user profile picture (generic endpoint)
const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });

    const user = await User.findById(req.user.id);
    if (user.profilePicPublicId) {
      await cloudinary.uploader.destroy(user.profilePicPublicId).catch(() => {});
    }

    const result = await streamUpload(req.file.buffer, {
      folder: 'greetings-app/profiles',
      transformation: [
        { width: 300, height: 300, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    });

    user.profilePicUrl = result.secure_url;
    user.profilePicPublicId = result.public_id;
    await user.save();

    res.json({
      profilePicUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error('Profile upload error:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

// POST /api/upload/template — upload a new template image (admin-style)
const uploadTemplate = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });

    const { title, category, isPremium, tags, textOverlay } = req.body;

    const result = await streamUpload(req.file.buffer, {
      folder: 'greetings-app/templates',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
      ],
    });

    const thumbnailUrl = cloudinary.url(result.public_id, {
      width: 400,
      height: 600,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto',
    });

    const template = await Template.create({
      title,
      category,
      imageUrl: result.secure_url,
      imagePublicId: result.public_id,
      thumbnailUrl,
      isPremium: isPremium === 'true' || isPremium === true,
      tags: tags ? JSON.parse(tags) : [],
      overlayConfig: {
        nameBanner: { enabled: true },
        avatar: { enabled: true },
        textOverlay: {
          enabled: !!textOverlay,
          text: textOverlay || '',
        },
      },
    });

    res.status(201).json({ template });
  } catch (err) {
    console.error('Template upload error:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

module.exports = { upload, uploadProfilePic, uploadTemplate };
