# 🚀 ASTEL Deployment Guide

## Prerequisites

- Node.js 18+ and npm
- React Native development environment
- Firebase project setup
- Google Cloud Platform account (for production)

## Quick Start

### 1. Install Dependencies

```bash
# Root level
npm run setup

# Or manually:
npm install
cd server && npm install
cd ../mobile-app && npm install
```

### 2. Environment Setup

Create `.env` files in both `server/` and `mobile-app/` directories:

**Server (.env):**
```env
NODE_ENV=development
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
OPENAI_API_KEY=your-openai-key
JWT_SECRET=your-jwt-secret
```

**Mobile App (.env):**
```env
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
```

### 3. Firebase Setup

1. Create a new Firebase project
2. Enable Authentication, Firestore, Storage
3. Download service account key for server
4. Configure mobile app with Firebase config

### 4. Run Development

```bash
# Start both server and mobile app
npm run dev

# Or separately:
npm run server:dev  # Backend on port 5000
npm run client:dev  # React Native Metro bundler
```

## Production Deployment

### Backend (Server)

1. **Deploy to Google Cloud Run:**
```bash
cd server
gcloud run deploy astel-server --source .
```

2. **Or deploy to Heroku:**
```bash
cd server
heroku create astel-server
git push heroku main
```

### Mobile App

1. **Android:**
```bash
cd mobile-app
npm run build:android
```

2. **iOS:**
```bash
cd mobile-app
npm run build:ios
```

## Testing

```bash
# Run all tests
npm test

# Lint code
npm run lint
```

## Monitoring

- Backend health: `GET /health`
- Firebase console for database/storage
- Google Analytics for mobile app

## Support

For deployment issues, check:
- Firebase configuration
- Environment variables
- Network/firewall settings
- Service account permissions
