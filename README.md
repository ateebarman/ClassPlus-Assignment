# ✨ Custom Greetings & Wishes App

A premium, full-stack MERN application designed for creating high-quality, personalized greeting cards and wishes. Using a custom-built canvas engine, it overlays user names and profile pictures onto aesthetic templates with pixel-perfect precision.

![Banner](https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80)

## 🌟 Key Features

- **🎯 Personalization Engine**: Real-time canvas rendering that overlays names and circular avatars onto templates.
- **🔐 Dual-Mode Authentication**:
  - **Google OAuth**: Secure login with profile sync.
  - **Guest Access**: Instant entry with persistent sessions.
- **🖼️ Smart Templates**: Categorized library (Birthday, Festivals, Shayari) with dynamic background management.
- **📥 One-Click Export**: Download high-resolution PNGs directly to your device.
- **🔗 Social Sharing**: Integrated Web Share API for WhatsApp, Instagram, and more.
- **💎 Premium UI**: Dark-mode glassmorphism design with fluid animations and responsive layouts.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Auth** | Passport.js (Google Strategy), Express Session |
| **Storage** | Cloudinary (Image Hosting) |
| **Canvas** | HTML5 Canvas API |

---

## 📂 Project Structure

```text
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # UI Components (Navbar, Footer, Modals)
│   │   ├── pages/          # View Logic (Home, Editor, Login)
│   │   ├── utils/          # Canvas Engine & API Helpers
│   │   └── store/          # Context/State Management
├── server/                 # Node.js Backend
│   ├── config/             # Passport & DB Config
│   ├── models/             # Mongoose Schemas (User, Template)
│   ├── routes/             # API Endpoints
│   ├── controllers/        # Request Handlers
│   └── seed/               # Database Seeding Scripts
├── package.json            # Root scripts for concurrent execution
└── .gitignore              # Project-wide exclusion rules
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Google Cloud Console Project (for OAuth)
- Cloudinary account

### 2. Installation
Clone the repo and install all dependencies (root, client, and server) with a single command:
```bash
npm run install-all
```

### 3. Environment Setup
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_random_secret
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLIENT_URL=http://localhost:5173
```

### 4. Database Seeding
Populate the database with default templates:
```bash
npm run seed
```

### 5. Running the App
Start both backend and frontend concurrently:
```bash
npm start
```
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## 🧠 Technical Architecture: The Canvas Engine

The core of this app is the **Percentage-Based Positioning System**. To ensure overlays look consistent across different template resolutions:

1. **Coordinate Mapping**: Elements are stored with `xPercent` and `yPercent` values.
2. **Dynamic Scaling**: The engine calculates pixel coordinates based on the template's aspect ratio at runtime.
3. **Circular Clipping**: Avatars are rendered using `ctx.clip()` to create perfect rounded profile pictures.
4. **CORS Handling**: To prevent "tainted canvas" errors during download, all images are loaded with `crossOrigin = 'anonymous'`.

---

## 🛤️ Roadmap

- [ ] **Custom Studio**: Allow users to drag/resize text and images.
- [ ] **PWA Support**: Offline mode for browsing templates.
- [ ] **Video Wishes**: Generate short animated clips using Remotion.
- [ ] **AI Shayari**: Integration with OpenAI for personalized message generation.


