const mongoose = require('mongoose');
require('dotenv').config();
const Template = require('../models/Template');

const templates = [
  // ─── BIRTHDAY ──────────────────────────────────────────────────────
  {
    title: 'Neon Celebration',
    category: 'Birthday',
    imageUrl: 'https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=1200',
    isPremium: false,
    overlayConfig: {
      nameBanner: { enabled: true, yPercent: 80, fontSize: 32, color: '#FFFFFF', bgColor: 'rgba(139, 92, 246, 0.7)' },
      avatar: { enabled: true, xPercent: 5, yPercent: 5, sizePercent: 18, borderColor: '#FFFFFF', borderWidth: 4 }
    }
  },
  {
    title: 'Golden Sparkle Pro',
    category: 'Birthday',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200',
    isPremium: true,
    overlayConfig: {
      nameBanner: { enabled: true, yPercent: 10, fontSize: 36, color: '#FFFFFF', bgColor: 'rgba(234, 179, 8, 0.8)' },
      avatar: { enabled: true, xPercent: 40, yPercent: 40, sizePercent: 20, borderColor: '#EAB308', borderWidth: 6 }
    }
  },
  {
    title: 'Pastel Party',
    category: 'Birthday',
    imageUrl: 'https://images.unsplash.com/photo-1464347744102-11db6282f854?q=80&w=1200',
    isPremium: false,
    overlayConfig: {
      nameBanner: { enabled: true, yPercent: 70, fontSize: 28, color: '#334155', bgColor: 'rgba(255, 255, 255, 0.6)' },
      avatar: { enabled: true, xPercent: 10, yPercent: 10, sizePercent: 15, borderColor: '#94a3b8', borderWidth: 2 }
    }
  },

  // ─── ANNIVERSARY ───────────────────────────────────────────────────
  {
    title: 'Eternal Love Premium',
    category: 'Anniversary',
    imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200',
    isPremium: true,
    overlayConfig: {
      nameBanner: { enabled: true, yPercent: 85, fontSize: 34, color: '#FFFFFF', bgColor: 'rgba(225, 29, 72, 0.7)' },
      avatar: { enabled: true, xPercent: 42, yPercent: 30, sizePercent: 16, borderColor: '#FB7185', borderWidth: 5 }
    }
  },
  {
    title: 'Classic Romance',
    category: 'Anniversary',
    imageUrl: 'https://images.unsplash.com/photo-1518196775741-2673012906b3?q=80&w=1200',
    isPremium: false,
    overlayConfig: {
      nameBanner: { enabled: true, yPercent: 15, fontSize: 30, color: '#FFFFFF', bgColor: 'rgba(0,0,0,0.5)' },
      avatar: { enabled: true, xPercent: 80, yPercent: 5, sizePercent: 14, borderColor: '#FFFFFF', borderWidth: 3 }
    }
  },

  // ─── FESTIVAL ──────────────────────────────────────────────────────
  {
    title: 'Diwali Glow',
    category: 'Diwali',
    imageUrl: 'https://images.unsplash.com/photo-1541093113199-a2e9d84e903f?q=80&w=1200',
    isPremium: false,
    overlayConfig: {
      nameBanner: { enabled: true, yPercent: 5, fontSize: 32, color: '#FCD34D', bgColor: 'rgba(0,0,0,0.6)' },
      avatar: { enabled: true, xPercent: 40, yPercent: 45, sizePercent: 20, borderColor: '#F59E0B', borderWidth: 4 }
    }
  },
  {
    title: 'Eid Celebration Pro',
    category: 'Eid',
    imageUrl: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?q=80&w=1200',
    isPremium: true,
    overlayConfig: {
      nameBanner: { enabled: true, yPercent: 80, fontSize: 36, color: '#D1FAE5', bgColor: 'rgba(5, 150, 105, 0.8)' },
      avatar: { enabled: true, xPercent: 40, yPercent: 15, sizePercent: 20, borderColor: '#10B981', borderWidth: 5 }
    }
  },
  {
    title: 'Vibrant Holi',
    category: 'Festival',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200',
    isPremium: false,
    overlayConfig: {
      nameBanner: { enabled: true, yPercent: 90, fontSize: 30, color: '#FFFFFF', bgColor: 'rgba(236, 72, 153, 0.7)' },
      avatar: { enabled: true, xPercent: 5, yPercent: 5, sizePercent: 15, borderColor: '#FFFFFF', borderWidth: 3 }
    }
  },

  // ─── SHAYARI ───────────────────────────────────────────────────────
  {
    title: 'Midnight Verse Premium',
    category: 'Shayari',
    imageUrl: 'https://images.unsplash.com/photo-1505506819681-39e247a852d2?q=80&w=1200',
    isPremium: true,
    overlayConfig: {
      nameBanner: { enabled: true, yPercent: 85, fontSize: 24, color: '#94A3B8', bgColor: 'rgba(0,0,0,0.4)' },
      avatar: { enabled: true, xPercent: 45, yPercent: 10, sizePercent: 12, borderColor: '#FFFFFF', borderWidth: 2 },
      textOverlay: { enabled: true, text: 'Dil se nikli hui baat...\nAsar rakhti hai.', xPercent: 50, yPercent: 50, fontSize: 35, color: '#FFFFFF' }
    }
  },
  {
    title: 'Rainy Melancholy',
    category: 'Shayari',
    imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1200',
    isPremium: false,
    overlayConfig: {
      nameBanner: { enabled: true, yPercent: 10, fontSize: 28, color: '#FFFFFF', bgColor: 'rgba(0,0,0,0.3)' },
      avatar: { enabled: true, xPercent: 5, yPercent: 80, sizePercent: 14, borderColor: '#CBD5E1', borderWidth: 3 },
      textOverlay: { enabled: true, text: 'Zindagi gulzar hai...', xPercent: 50, yPercent: 45, fontSize: 45, color: '#FFFFFF' }
    }
  },

  // ─── QUOTES ────────────────────────────────────────────────────────
  {
    title: 'Modern Wisdom Pro',
    category: 'Quotes',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200',
    isPremium: true,
    overlayConfig: {
      nameBanner: { enabled: true, yPercent: 75, fontSize: 22, color: '#FBBF24', bgColor: 'rgba(0,0,0,0.6)' },
      avatar: { enabled: true, xPercent: 45, yPercent: 85, sizePercent: 10, borderColor: '#FBBF24', borderWidth: 2 },
      textOverlay: { enabled: true, text: '"Success is not final,\nfailure is not fatal."', xPercent: 50, yPercent: 35, fontSize: 32, color: '#FFFFFF' }
    }
  },
  {
    title: 'Nature Serenity',
    category: 'Quotes',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200',
    isPremium: false,
    overlayConfig: {
      nameBanner: { enabled: true, yPercent: 5, fontSize: 24, color: '#FFFFFF', bgColor: 'rgba(0,0,0,0.2)' },
      avatar: { enabled: true, xPercent: 5, yPercent: 5, sizePercent: 12, borderColor: '#FFFFFF', borderWidth: 2 },
      textOverlay: { enabled: true, text: 'Nature never hurries,\nyet everything is accomplished.', xPercent: 50, yPercent: 60, fontSize: 30, color: '#FFFFFF' }
    }
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Template.deleteMany({});
    console.log('🗑️ Existing templates cleared');

    await Template.insertMany(templates);
    console.log(`✨ Successfully seeded ${templates.length} templates!`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();
