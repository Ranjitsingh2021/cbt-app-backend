import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import HistoryScreen from './screens/HistoryScreen';
import CrisisResourcesScreen from './screens/CrisisResourcesScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import VerifyCodeScreen from './screens/VerifyCodeScreen';
import NewPasswordScreen from './screens/NewPasswordScreen';
import HelpSupportScreen from './screens/HelpSupportScreen';
import HelpDetailScreen from './screens/HelpDetailScreen';
import SettingsScreen from './screens/SettingsScreen';
import AccountSettingsScreen from './screens/AccountSettingsScreen';
import PrivacySettingsScreen from './screens/PrivacySettingsScreen';
import NotificationSettingsScreen from './screens/NotificationSettingsScreen';
import TherapySettingsScreen from './screens/TherapySettingsScreen';
import AICoachSettingsScreen from './screens/AICoachSettingsScreen';
import ProgressSettingsScreen from './screens/ProgressSettingsScreen';
import SafetySettingsScreen from './screens/SafetySettingsScreen';
import AccessibilitySettingsScreen from './screens/AccessibilitySettingsScreen';
import EmotionalSafetySettingsScreen from './screens/EmotionalSafetySettingsScreen';
import LegalSettingsScreen from './screens/LegalSettingsScreen';
import TechnicalSettingsScreen from './screens/TechnicalSettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#6366f1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: '600',
            },
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ title: 'Create Account' }}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{
              title: 'CBT Therapy',
              headerLeft: null,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: 'Profile' }}
          />
          <Stack.Screen
            name="History"
            component={HistoryScreen}
            options={{ title: 'Conversation History' }}
          />
          <Stack.Screen
            name="CrisisResources"
            component={CrisisResourcesScreen}
            options={{ title: 'Crisis Resources' }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ title: 'Reset Password' }}
          />
          <Stack.Screen
            name="VerifyCode"
            component={VerifyCodeScreen}
            options={{ title: 'Verification' }}
          />
          <Stack.Screen
            name="NewPassword"
            component={NewPasswordScreen}
            options={{ title: 'New Password' }}
          />
          <Stack.Screen
            name="HelpSupport"
            component={HelpSupportScreen}
            options={{ title: 'Help & Support' }}
          />
          <Stack.Screen
            name="HelpDetail"
            component={HelpDetailScreen}
            options={({ route }) => ({ title: route.params.title || 'Help' })}
          />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
          <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} options={{ title: 'Account Settings' }} />
          <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} options={{ title: 'Privacy & Data' }} />
          <Stack.Screen name="NotificationsSettings" component={NotificationSettingsScreen} options={{ title: 'Notifications' }} />
          <Stack.Screen name="TherapySettings" component={TherapySettingsScreen} options={{ title: 'Therapy Preferences' }} />
          <Stack.Screen name="AICoachSettings" component={AICoachSettingsScreen} options={{ title: 'AI Coach Settings' }} />
          <Stack.Screen name="ProgressSettings" component={ProgressSettingsScreen} options={{ title: 'Progress & Motivation' }} />
          <Stack.Screen name="SafetySettings" component={SafetySettingsScreen} options={{ title: 'Safety & Crisis' }} />
          <Stack.Screen name="AccessibilitySettings" component={AccessibilitySettingsScreen} options={{ title: 'Accessibility' }} />
          <Stack.Screen name="EmotionalSafetySettings" component={EmotionalSafetySettingsScreen} options={{ title: 'Emotional Safety' }} />
          <Stack.Screen name="LegalSettings" component={LegalSettingsScreen} options={{ title: 'Legal & About' }} />
          <Stack.Screen name="TechnicalSettings" component={TechnicalSettingsScreen} options={{ title: 'Technical Support' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

