import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../config/theme';
import { API_BASE_URL } from '../config/featureFlags';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AccountSettingsScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [settings, setSettings] = useState({
        profileName: '',
        ageRange: '',
        pronouns: '',
        language: 'English',
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            const response = await fetch(`${API_BASE_URL}/user/settings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.user_email) setUserEmail(data.user_email);
                if (data && data.settings_data) {
                    setSettings(prev => ({ ...prev, ...data.settings_data }));
                }
            } else {
                const errorText = await response.text();
                console.error('Fetch settings failed:', errorText);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = await AsyncStorage.getItem('access_token');
            const url = `${API_BASE_URL}/user/settings`;
            console.log(`DEBUG: Saving settings to ${url}`);

            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ settings_data: settings })
            });
            const responseText = await response.text();
            let responseData;
            try {
                responseData = JSON.parse(responseText);
            } catch (e) {
                responseData = { detail: responseText || 'Unknown error' };
            }

            if (response.ok) {
                Alert.alert('Success', 'Settings saved successfully');
            } else {
                console.error('Save failed:', responseData);
                Alert.alert('Error', responseData.detail || 'Failed to save settings');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            Alert.alert('Error', 'Connection error: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.label}>Email Address (Linked Account)</Text>
                    <View style={[styles.input, styles.readOnlyInput]}>
                        <Text style={styles.readOnlyText}>{userEmail || 'Loading...'}</Text>
                    </View>

                    <Text style={styles.label}>Profile Name</Text>
                    <TextInput
                        style={styles.input}
                        value={settings.profileName}
                        onChangeText={(text) => setSettings({ ...settings, profileName: text })}
                        placeholder="Real name or nickname"
                        placeholderTextColor={colors.textSecondary}
                    />

                    <Text style={styles.label}>Age Range</Text>
                    <TextInput
                        style={styles.input}
                        value={settings.ageRange}
                        onChangeText={(text) => setSettings({ ...settings, ageRange: text })}
                        placeholder="e.g., 25-34"
                        placeholderTextColor={colors.textSecondary}
                    />

                    <Text style={styles.label}>Pronouns</Text>
                    <TextInput
                        style={styles.input}
                        value={settings.pronouns}
                        onChangeText={(text) => setSettings({ ...settings, pronouns: text })}
                        placeholder="e.g., they/them"
                        placeholderTextColor={colors.textSecondary}
                    />

                    <Text style={styles.label}>Language Preference</Text>
                    <TextInput
                        style={styles.input}
                        value={settings.language}
                        onChangeText={(text) => setSettings({ ...settings, language: text })}
                        placeholder="e.g., English"
                        placeholderTextColor={colors.textSecondary}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: spacing.lg,
    },
    section: {
        marginBottom: spacing.xl,
    },
    label: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        fontWeight: '700',
        marginBottom: spacing.xs,
        marginLeft: spacing.xs,
    },
    input: {
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.md,
        ...typography.body,
        color: colors.text,
    },
    readOnlyInput: {
        backgroundColor: colors.background,
        borderColor: colors.border,
        opacity: 0.8,
    },
    readOnlyText: {
        ...typography.body,
        color: colors.textSecondary,
    },
    saveButton: {
        backgroundColor: colors.primary,
        padding: spacing.md,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: spacing.md,
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        ...typography.button,
        color: '#fff',
    },
});
