import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../config/theme';

export default function EmotionalSafetySettingsScreen() {
    const [triggerWarnings, setTriggerWarnings] = useState(true);
    const [visibleCrisisButton, setVisibleCrisisButton] = useState(true);

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Content Controls</Text>
                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Trigger Warnings</Text>
                            <Text style={styles.settingDescription}>Alert me before sensitive content</Text>
                        </View>
                        <Switch
                            value={triggerWarnings}
                            onValueChange={setTriggerWarnings}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Constant Crisis Button</Text>
                            <Text style={styles.settingDescription}>Keep emergency help visible at all times</Text>
                        </View>
                        <Switch
                            value={visibleCrisisButton}
                            onValueChange={setVisibleCrisisButton}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Grounding Tools</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="leaf-outline" size={22} color={colors.primary} />
                        <Text style={styles.menuText}>Grounding Shortcut</Text>
                        <Text style={styles.valueText}>Shake phone</Text>
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
        marginBottom: spacing.sm,
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
        flex: 1,
        fontWeight: '600',
    },
    valueText: {
        ...typography.body,
        color: colors.primary,
    },
});
