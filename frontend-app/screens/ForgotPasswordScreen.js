import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../config/theme';
import { ENABLE_BACKEND, API_BASE_URL } from '../config/featureFlags';

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendCode = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        setLoading(true);

        if (ENABLE_BACKEND) {
            try {
                const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });

                const data = await response.json();

                if (response.ok) {
                    Alert.alert('Success', 'Verification code sent to your email');
                    navigation.navigate('VerifyCode', { email });
                } else {
                    Alert.alert('Error', data.detail || 'Failed to send code');
                }
            } catch (error) {
                console.error('Forgot password error:', error);
                Alert.alert('Error', 'Could not connect to server');
            } finally {
                setLoading(false);
            }
        } else {
            setTimeout(() => {
                setLoading(false);
                navigation.navigate('VerifyCode', { email });
            }, 1000);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.title}>Forgot Password?</Text>
                        <Text style={styles.subtitle}>
                            Enter your email and we'll send you a 4-digit code to reset your password.
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color={colors.textSecondary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email Address"
                                placeholderTextColor={colors.textSecondary}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleSendCode}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Sending...' : 'Send Code'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: spacing.lg,
    },
    backButton: {
        marginBottom: spacing.xl,
    },
    header: {
        marginBottom: spacing.xl * 2,
    },
    title: {
        ...typography.h2,
        marginBottom: spacing.sm,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.md,
        paddingHorizontal: spacing.md,
        height: 56,
    },
    inputIcon: {
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        ...typography.body,
        height: '100%',
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.md,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        ...typography.button,
    },
});
