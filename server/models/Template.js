const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Birthday', 'Anniversary', 'Festival', 'Shayari', 'Love', 'Motivation', 'Eid', 'Diwali', 'New Year', 'Quotes', 'Other'],
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String, // Cloudinary public_id
    },
    thumbnailUrl: {
      type: String, // Cloudinary auto-generated thumbnail
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    tags: [{ type: String }],
    // Overlay configuration — percentage-based positioning
    overlayConfig: {
      // Name banner
      nameBanner: {
        enabled: { type: Boolean, default: true },
        yPercent: { type: Number, default: 5 },    // top 5% from top
        fontSize: { type: Number, default: 28 },
        color: { type: String, default: '#ffffff' },
        bgColor: { type: String, default: 'rgba(0,0,0,0.55)' },
      },
      // Profile avatar
      avatar: {
        enabled: { type: Boolean, default: true },
        xPercent: { type: Number, default: 4 },    // 4% from left
        yPercent: { type: Number, default: 3 },    // 3% from top
        sizePercent: { type: Number, default: 16 }, // 16% of canvas width
        borderColor: { type: String, default: '#ffffff' },
        borderWidth: { type: Number, default: 3 },
      },
      // Optional text overlay (shayari/quote printed on template)
      textOverlay: {
        enabled: { type: Boolean, default: false },
        text: { type: String, default: '' },
        xPercent: { type: Number, default: 10 },
        yPercent: { type: Number, default: 60 },
        widthPercent: { type: Number, default: 80 },
        fontSize: { type: Number, default: 18 },
        color: { type: String, default: '#ffffff' },
        fontFamily: { type: String, default: 'Plus Jakarta Sans' },
        align: { type: String, default: 'center' },
        shadow: { type: Boolean, default: true },
      },
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

templateSchema.index({ category: 1, isPremium: 1 });
templateSchema.index({ tags: 1 });

module.exports = mongoose.model('Template', templateSchema);
