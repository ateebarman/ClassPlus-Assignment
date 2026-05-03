const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { upload, uploadProfilePic, uploadTemplate } = require('../controllers/uploadController');

// POST /api/upload/profile — authenticated users only
router.post('/profile', protect, upload.single('image'), uploadProfilePic);

// POST /api/upload/template — (would be admin-only in production)
router.post('/template', protect, upload.single('image'), uploadTemplate);

module.exports = router;
