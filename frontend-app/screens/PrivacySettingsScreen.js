import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../config/theme';

export default function PrivacySettingsScreen({ navigation }) {
    const [anonymousMode, setAnonymousMode] = useState(false);

    const handleExportData = () => {
        Alert.alert('Export Data', 'Your data is being prepared. You will receive an email with your chat history in CSV format shortly.');
    };

    const handleDeleteData = () => {
        Alert.alert(
            'Delete Data',
            'Are you sure you want to delete all your chat history? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Deleted', 'Your data has been cleared.') },
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'This will permanently delete your account and all associated data. Are you absolutely sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Permanently Delete', style: 'destructive', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Identity</Text>
                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Anonymous Mode</Text>
                            <Text style={styles.settingDescription}>Hide your real name in the app</Text>
                        </View>
                        <Switch
                            value={anonymousMode}
                            onValueChange={setAnonymousMode}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data Control</Text>
                    <TouchableOpacity style={styles.menuItem} onPress={handleExportData}>
                        <Ionicons name="download-outline" size={22} color={colors.text} />
                        <Text style={styles.menuText}>Export My Data (CSV)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={handleDeleteData}>
                        <Ionicons name="trash-outline" size={22} color={colors.error} />
                        <Text style={[styles.menuText, { color: colors.error }]}>Delete Chat History</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Security</Text>
                    <View style={styles.infoCard}>
                        <Ionicons name="lock-closed" size={20} color={colors.primary} />
                        <Text style={styles.infoText}>
                            All your conversations and data are encrypted in transit and at rest using industry-standard protocols.
                        </Text>
                    </View>
                </View>

                <View style={styles.dangerZone}>
                    <Text style={styles.dangerTitle}>Danger Zone</Text>
                    <TouchableOpacity style={styles.dangerButton} onPress={handleDeleteAccount}>
                        <Text style={styles.dangerButtonText}>Delete Account Permanently</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        padding: spacing.lg,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: spacing.md,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    settingInfo: {
        flex: 1,
    },
    settingLabel: {
        ...typography.body,
        fontWeight: '600',
    },
    settingDescription: {
        ...typography.bodySmall,
        color: colors.textSecondary,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.sm,
    },
    menuText: {
        ...typography.body,
        marginLeft: spacing.md,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#eef2ff',
        padding: spacing.md,
        borderRadius: 12,
        alignItems: 'flex-start',
    },
    infoText: {
        ...typography.bodySmall,
        color: colors.text,
        marginLeft: spacing.md,
        flex: 1,
        lineHeight: 18,
    },
    dangerZone: {
        marginTop: spacing.xl,
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: `${colors.error}30`,
        backgroundColor: `${colors.error}05`,
    },
    dangerTitle: {
        ...typography.bodySmall,
        color: colors.error,
        fontWeight: '700',
        marginBottom: spacing.md,
    },
    dangerButton: {
        backgroundColor: colors.error,
        padding: spacing.md,
        borderRadius: 12,
        alignItems: 'center',
    },
    dangerButtonText: {
        ...typography.button,
        color: '#fff',
    },
});
