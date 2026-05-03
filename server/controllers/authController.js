const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { streamUpload } = require('../utils/cloudinaryHelper');

const signToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    console.error('MISSING JWT_SECRET');
    throw new Error('Server configuration error');
  }
  return jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const sendAuthResponse = (user, statusCode, res) => {
  try {
    const token = signToken(user._id);
    res.status(statusCode).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicUrl: user.profilePicUrl,
        isGuest: user.isGuest,
        isPremium: user.isPremium,
        onboardingComplete: user.onboardingComplete,
        provider: user.provider,
      },
    });
  } catch (err) {
    console.error('sendAuthResponse failed:', err);
    res.status(500).json({ message: 'Error generating authentication token' });
  }
};

// POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      provider: 'email',
    });

    sendAuthResponse(user, 201, res);
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    sendAuthResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};

// POST /api/auth/guest
const guestLogin = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.create({
      name: name || 'Guest',
      provider: 'guest',
      isGuest: true,
    });
    sendAuthResponse(user, 201, res);
  } catch (err) {
    res.status(500).json({ message: 'Guest login failed' });
  }
};

// GET /api/auth/google/callback
const googleCallback = async (req, res) => {
  try {
    const token = signToken(req.user._id);
    const needsOnboarding = !req.user.onboardingComplete;
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&onboarding=${needsOnboarding}`);
  } catch (err) {
    res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/auth/onboarding
const completeOnboarding = async (req, res) => {
  console.log('Onboarding request for user:', req.user.id);
  try {
    const { name } = req.body;
    const updates = { onboardingComplete: true };
    if (name) updates.name = name.trim();

    if (req.file) {
      console.log('Uploading profile pic to Cloudinary...');
      try {
        const result = await streamUpload(req.file.buffer, {
          folder: 'greetings-app/profiles',
          transformation: [{ width: 300, height: 300, crop: 'fill', gravity: 'face' }],
        });
        updates.profilePicUrl = result.secure_url;
        updates.profilePicPublicId = result.public_id;
        console.log('Cloudinary upload success:', result.secure_url);
      } catch (uploadErr) {
        console.error('Cloudinary upload FAILED:', uploadErr);
        return res.status(500).json({ message: 'Failed to upload image to cloud' });
      }
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    console.log('User profile updated in DB');
    res.json({ user });
  } catch (err) {
    console.error('Onboarding CRITICAL error:', err);
    res.status(500).json({ message: 'Failed to complete setup' });
  }
};

const logout = (req, res) => {
  res.json({ message: 'Logged out' });
};

module.exports = { signup, login, guestLogin, googleCallback, getMe, completeOnboarding, logout };
