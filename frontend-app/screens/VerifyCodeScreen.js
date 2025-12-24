import React, { useState, useRef } from 'react';
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

export default function VerifyCodeScreen({ navigation, route }) {
    const { email } = route.params;
    const [code, setCode] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const handleChangeCode = (text, index) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        // Auto-focus next input
        if (text && index < 3) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyPress = (e, index) => {
        // Backspace to previous input
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handleVerify = async () => {
        const fullCode = code.join('');
        if (fullCode.length < 4) {
            Alert.alert('Error', 'Please enter the 4-digit code');
            return;
        }

        setLoading(true);

        if (ENABLE_BACKEND) {
            try {
                const response = await fetch(`${API_BASE_URL}/auth/verify-reset-code`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, code: fullCode }),
                });

                const data = await response.json();

                if (response.ok) {
                    navigation.navigate('NewPassword', { email, code: fullCode });
                } else {
                    Alert.alert('Error', data.detail || 'Invalid verification code');
                }
            } catch (error) {
                console.error('Verify code error:', error);
                Alert.alert('Error', 'Could not connect to server');
            } finally {
                setLoading(false);
            }
        } else {
            setTimeout(() => {
                setLoading(false);
                navigation.navigate('NewPassword', { email, code: fullCode });
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
                        <Text style={styles.title}>Verification Code</Text>
                        <Text style={styles.subtitle}>
                            We've sent a 4-digit code to {email}.
                        </Text>
                    </View>

                    <View style={styles.codeContainer}>
                        {code.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={inputRefs[index]}
                                style={styles.codeInput}
                                maxLength={1}
                                keyboardType="number-pad"
                                value={digit}
                                onChangeText={(text) => handleChangeCode(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleVerify}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Verifying...' : 'Verify Code'}
                        </Text>
                    </TouchableOpacity>
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
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xl * 2,
    },
    codeInput: {
        width: 64,
        height: 64,
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        color: colors.text,
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        ...typography.button,
    },
});
