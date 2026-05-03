const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false,
    },
    profilePicUrl: {
      type: String,
      default: null,
    },
    profilePicPublicId: {
      type: String,
      default: null,
    },
    provider: {
      type: String,
      enum: ['google', 'guest', 'email'],
      default: 'guest',
    },
    googleId: {
      type: String,
      sparse: true,
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    onboardingComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
// Modern Mongoose async hooks should NOT use the 'next' callback
userSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) return;
  
  try {
    this.password = await bcrypt.hash(this.password, 12);
  } catch (err) {
    throw err; // In async hooks, throw instead of next(err)
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);
