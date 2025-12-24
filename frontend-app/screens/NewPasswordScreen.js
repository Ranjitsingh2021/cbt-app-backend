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

export default function NewPasswordScreen({ navigation, route }) {
    const { email, code } = route.params;
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        if (ENABLE_BACKEND) {
            try {
                const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, code, new_password: newPassword }),
                });

                const data = await response.json();

                if (response.ok) {
                    Alert.alert('Success', 'Password reset successfully. Please login with your new password.', [
                        { text: 'Login', onPress: () => navigation.navigate('Login') }
                    ]);
                } else {
                    Alert.alert('Error', data.detail || 'Failed to reset password');
                }
            } catch (error) {
                console.error('Reset password error:', error);
                Alert.alert('Error', 'Could not connect to server');
            } finally {
                setLoading(false);
            }
        } else {
            setTimeout(() => {
                setLoading(false);
                Alert.alert('Success', 'Demo mode: Password reset simulated.', [
                    { text: 'Login', onPress: () => navigation.navigate('Login') }
                ]);
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
                        <Text style={styles.title}>New Password</Text>
                        <Text style={styles.subtitle}>
                            Please enter your new password.
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color={colors.textSecondary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="New Password"
                                placeholderTextColor={colors.textSecondary}
                                value={newPassword}
                                onChangeText={(text) => {
                                    setNewPassword(text);
                                    if (loading) setLoading(false);
                                }}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color={colors.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color={colors.textSecondary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm New Password"
                                placeholderTextColor={colors.textSecondary}
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    if (loading) setLoading(false);
                                }}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleResetPassword}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Updating...' : 'Reset Password'}
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
