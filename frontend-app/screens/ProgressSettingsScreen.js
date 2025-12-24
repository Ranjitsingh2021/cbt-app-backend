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
import { colors, spacing, typography } from '../config/theme';

export default function ProgressSettingsScreen() {
    const [showStreaks, setShowStreaks] = useState(true);
    const [weeklyView, setWeeklyView] = useState(true);

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Stats Visibility</Text>
                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Show Streaks</Text>
                            <Text style={styles.settingDescription}>Display daily consistency count</Text>
                        </View>
                        <Switch
                            value={showStreaks}
                            onValueChange={setShowStreaks}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Weekly Progress View</Text>
                            <Text style={styles.settingDescription}>Show summarized weekly stats</Text>
                        </View>
                        <Switch
                            value={weeklyView}
                            onValueChange={setWeeklyView}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Motivation</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>Achievement Badges</Text>
                        <Text style={styles.valueText}>Enabled</Text>
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
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.sm,
    },
    menuText: {
        ...typography.body,
        fontWeight: '600',
    },
    valueText: {
        ...typography.body,
        color: colors.primary,
    },
});
