// Feature Toggle: Set to false to disable backend API calls
export const ENABLE_BACKEND = true; // Backend enabled - ready to connect

// API Base URL Configuration
// For Expo Go on physical device:
// Option 1: Use your computer's local IP (same WiFi network)
//   - Find IP: Windows: ipconfig | Android: Settings > About > IP
//   - Example: 'http://192.168.1.100:8000/api'
// Option 2: Use ngrok for external access
//   - Run: ngrok http 8000
//   - Use: 'https://your-ngrok-url.ngrok.io/api'
// Option 3: Use Expo tunnel (if both devices on same network)
//   - Start Expo with: npm start -- --tunnel
//   - Then use localhost or local IP

// For development on same machine (emulator/simulator):
// Use Expo's public env variable if available, otherwise fall back to local IP logic
const ENV_API_URL = process.env.EXPO_PUBLIC_API_URL;
const LOCAL_IP = '192.168.1.101'; // WiFi IP address
const PORT = '8082';//Backend port (matches backend/.env PORT setting)

export const API_BASE_URL = ENV_API_URL || (__DEV__
  ? `http://${LOCAL_IP}:${PORT}/api`
  : 'https://your-api-domain.com/api');

