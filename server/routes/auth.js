const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { protect } = require('../middleware/auth');
const { upload } = require('../controllers/uploadController');
const {
  signup,
  login,
  googleCallback,
  guestLogin,
  getMe,
  completeOnboarding,
  logout,
} = require('../controllers/authController');

// Public Auth Routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/guest', guestLogin);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback
);

// Protected Routes
router.get('/me', protect, getMe);
router.patch('/onboarding', protect, upload.single('profilePic'), completeOnboarding);
router.post('/logout', protect, logout);

module.exports = router;
