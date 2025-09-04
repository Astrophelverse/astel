# 🚀 ASTEL - Advanced Social Trade & Education Link

A mobile-first marketplace platform combining social commerce, learning, and AI-powered features.

## ✨ Features

- **Marketplace**: Buy and sell phones (cars coming soon)
- **Social**: Follow sellers, share stories, engage with content
- **Learning**: Tutorials and educational content
- **AI-Powered**: Auto-moderation and GPT assistant
- **Premium**: Astel+ subscription with evolving badges
- **Advertising**: Native ad system for sellers

## 🏗️ Architecture

- **Frontend**: React Native (iOS/Android)
- **Backend**: Node.js/Express
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth + Google Sign-In
- **Real-time**: WebSocket connections
- **AI**: OpenAI GPT integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- React Native CLI
- Firebase account
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd astel-marketplace
```

2. **Install dependencies**
```bash
npm run setup
```

3. **Configure Firebase**
```bash
# Copy firebase config files
cp firebase/config.example.js firebase/config.js
# Edit with your Firebase credentials
```

4. **Set environment variables**
```bash
cp .env.example .env
# Add your API keys and configuration
```

5. **Start development**
```bash
npm run dev
```

## 📱 App Structure

```
astel/
├── mobile-app/          # React Native app
├── server/              # Node.js backend
├── admin-dashboard/     # Admin panel
├── firebase/            # Firebase config & rules
└── docs/               # Documentation
```

## 🔧 Development

- **Mobile App**: `cd mobile-app && npm start`
- **Backend**: `cd server && npm run dev`
- **Admin Panel**: `cd admin-dashboard && npm start`

## 📊 Key Metrics

- **Target Users**: Phone buyers/sellers in Nigeria
- **Core Value**: Trust-based offline transactions
- **Monetization**: Subscriptions + native advertising
- **Differentiator**: Social learning + AI features

## 🎯 Roadmap

- [x] Project setup
- [ ] Authentication system
- [ ] Core marketplace
- [ ] Social features
- [ ] AI integration
- [ ] Premium system
- [ ] Launch preparation

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ for the Nigerian marketplace community**
