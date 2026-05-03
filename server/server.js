require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStoreModule = require('connect-mongo');
const { MongoStore } = MongoStoreModule;
const passport = require('./config/passport');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for platforms like Render/Vercel
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// ─── Logging Middleware ──────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ─── CORS ───────────────────────────────────────────────────────────
app.use(cors({
  origin: true, // Allow all origins in dev for stability
  credentials: true,
}));

// ─── Body Parsing ────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Session Store Fix ───────────────────────────────────────────────
let store;
try {
  // Try different export patterns for connect-mongo
  if (typeof MongoStore?.create === 'function') {
    store = MongoStore.create({ mongoUrl: process.env.MONGODB_URI });
  } else if (typeof MongoStoreModule?.create === 'function') {
    store = MongoStoreModule.create({ mongoUrl: process.env.MONGODB_URI });
  } else if (typeof MongoStoreModule?.default?.create === 'function') {
    store = MongoStoreModule.default.create({ mongoUrl: process.env.MONGODB_URI });
  }
} catch (e) {
  console.error('MongoStore init error:', e);
}

// ─── Session ─────────────────────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  store: store || undefined,
  cookie: {
    secure: process.env.NODE_ENV === 'production', 
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

// ─── Passport ────────────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());

// ─── Routes ──────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/templates', require('./routes/templates'));

// ─── Health Check ────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// ─── 404 ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  console.warn(`404 - Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

// ─── Error Handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack 
  });
});

// ─── Start Server ────────────────────────────────────────────────────
const startServer = async () => {
  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Don't wait forever
      socketTimeoutMS: 45000,        // Close sockets after 45s of inactivity
      family: 4,                     // Force IPv4 (often faster/more stable for Atlas)
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('💡 Tip: Check your IP whitelist in MongoDB Atlas or your internet connection.');
    process.exit(1);
  }
};

startServer();
