# CBT Therapist - React Native App

Professional React Native app built with Expo for AI-powered CBT therapy.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start Expo
npm start

# Scan QR code with Expo Go app on your phone
```

## 📱 Screens

1. **Login Screen** - Email/password login
2. **Signup Screen** - Create new account
3. **Chat Screen** - Main therapy conversation interface
4. **Profile Screen** - User profile and settings
5. **Crisis Resources Screen** - Emergency contacts and resources

## ⚙️ Configuration

### Enable Backend

Edit `config/featureFlags.js`:

```javascript
export const ENABLE_BACKEND = true; // Change to true when backend is ready
```

When `ENABLE_BACKEND = false`:
- No API calls are made
- Navigation works normally
- Empty states shown
- Perfect for UI development

## 📦 Packages Used

- `expo` - React Native framework
- `@react-navigation/native` - Navigation
- `@react-navigation/native-stack` - Stack navigation
- `react-native-safe-area-context` - Safe area handling
- `react-native-screens` - Native screens
- `react-native-gesture-handler` - Gesture support
- `@expo/vector-icons` - Icons

All packages are stable and well-maintained (as of May 2025).

## 🎨 Features

- ✅ Professional UI design
- ✅ Empty states (no mock data)
- ✅ Feature toggle for backend
- ✅ Crisis detection in chat
- ✅ Navigation between all screens
- ✅ Responsive design
- ✅ Keyboard handling
- ✅ Safe area support

## 📁 Project Structure

```
frontend-app/
├── App.js                 # Main app with navigation
├── config/
│   ├── featureFlags.js    # Backend toggle
│   └── theme.js           # Colors, typography
├── screens/
│   ├── LoginScreen.js
│   ├── SignupScreen.js
│   ├── ChatScreen.js
│   ├── ProfileScreen.js
│   └── CrisisResourcesScreen.js
└── package.json
```

## 🔧 Next Steps

1. Run the app: `npm start`
2. Test all screens and navigation
3. When backend is ready, set `ENABLE_BACKEND = true`
4. Connect API endpoints

## 📝 Notes

- All screens are functional with navigation
- No mock data - clean empty states
- Professional UI ready for production
- Backend integration ready when needed

