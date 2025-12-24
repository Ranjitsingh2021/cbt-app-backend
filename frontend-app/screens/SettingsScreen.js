import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../config/theme';

const SETTINGS_GROUPS = [
    {
        title: 'Personal',
        items: [
            { id: 'Account', title: 'Account & Profile', icon: 'person-outline', color: colors.primary },
            { id: 'Notifications', title: 'Notifications', icon: 'notifications-outline', color: '#f59e0b' },
        ]
    },
    {
        title: 'Therapy Experience',
        items: [
            { id: 'Therapy', title: 'Therapy Preferences', icon: 'heart-outline', color: '#ec4899' },
            { id: 'AICoach', title: 'AI Coach Settings', icon: 'chatbubble-ellipses-outline', color: '#8b5cf6' },
            { id: 'Progress', title: 'Progress & Motivation', icon: 'stats-chart-outline', color: '#10b981' },
        ]
    },
    {
        title: 'Safety & Comfort',
        items: [
            { id: 'Safety', title: 'Safety & Crisis Support', icon: 'alert-circle-outline', color: colors.crisis },
            { id: 'Accessibility', title: 'Accessibility', icon: 'body-outline', color: '#3b82f6' },
            { id: 'EmotionalSafety', title: 'Emotional Safety', icon: 'shield-outline', color: '#6366f1' },
        ]
    },
    {
        title: 'Data & Legal',
        items: [
            { id: 'Privacy', title: 'Privacy & Data', icon: 'lock-closed-outline', color: '#6b7280' },
            { id: 'Legal', title: 'Legal & About', icon: 'information-circle-outline', color: '#9ca3af' },
            { id: 'Technical', title: 'Technical Support', icon: 'bug-outline', color: '#d1d5db' },
        ]
    }
];

export default function SettingsScreen({ navigation }) {
    const renderSettingItem = (item) => (
        <TouchableOpacity
            key={item.id}
            style={styles.settingItem}
            onPress={() => navigation.navigate(`${item.id}Settings`)}
        >
            <View style={[styles.iconContainer, { backgroundColor: `${item.color}10` }]}>
                <Ionicons name={item.icon} size={22} color={item.color} />
            </View>
            <Text style={styles.settingTitle}>{item.title}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {SETTINGS_GROUPS.map((group, index) => (
                    <View key={index} style={styles.section}>
                        <Text style={styles.sectionHeader}>{group.title}</Text>
                        <View style={styles.sectionContent}>
                            {group.items.map(renderSettingItem)}
                        </View>
                    </View>
                ))}

                <View style={styles.footer}>
                    <Text style={styles.versionText}>Version 1.0.0</Text>
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
        padding: spacing.md,
    },
    section: {
        marginBottom: spacing.lg,
    },
    sectionHeader: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: spacing.sm,
        marginLeft: spacing.xs,
    },
    sectionContent: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    settingTitle: {
        ...typography.body,
        flex: 1,
    },
    footer: {
        alignItems: 'center',
        marginTop: spacing.xl,
        marginBottom: spacing.xl,
    },
    versionText: {
        ...typography.bodySmall,
        color: colors.textSecondary,
    },
});
