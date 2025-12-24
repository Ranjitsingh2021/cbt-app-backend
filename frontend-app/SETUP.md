# Setup Instructions

## Quick Start (5 minutes)

```bash
# 1. Navigate to frontend-app directory
cd frontend-app

# 2. Install dependencies
npm install

# 3. Start Expo
npm start

# 4. Scan QR code with Expo Go app on your phone
#    - iOS: Camera app
#    - Android: Expo Go app
```

## What You'll See

1. **Login Screen** - Professional login UI
2. **Signup Screen** - Create account (any email/password works)
3. **Chat Screen** - Main therapy interface
4. **Profile Screen** - User profile
5. **Crisis Resources** - Emergency contacts

## Navigation Flow

```
Login → Signup → Chat → Profile → Crisis Resources
```

All navigation works! No backend needed.

## Features

✅ **Feature Toggle** - Backend disabled by default (`config/featureFlags.js`)  
✅ **Empty States** - No mock data, clean UI  
✅ **Professional Design** - Ready for production  
✅ **Crisis Detection** - Try typing "suicide" in chat  
✅ **All Screens** - Complete navigation  

## Troubleshooting

**Issue: Metro bundler errors**
```bash
npm start -- --reset-cache
```

**Issue: Package conflicts**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Issue: Expo Go not connecting**
- Make sure phone and computer are on same WiFi
- Try tunnel mode: `npm start -- --tunnel`

## Next Steps

1. ✅ Test all screens
2. ✅ Verify navigation
3. ✅ Check UI on your phone
4. When backend ready: Set `ENABLE_BACKEND = true` in `config/featureFlags.js`

## Notes

- All screens are functional
- No API calls made (backend disabled)
- Professional UI ready
- Perfect for demo/presentation

