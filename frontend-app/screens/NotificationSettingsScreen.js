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

export default function NotificationSettingsScreen() {
    const [reminders, setReminders] = useState({
        dailyCheckIn: true,
        exercises: false,
        journaling: true,
        streaks: true,
    });

    const toggleReminder = (key) => {
        setReminders({ ...reminders, [key]: !reminders[key] });
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Reminders</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Daily Check-ins</Text>
                            <Text style={styles.settingDescription}>Remind me to log my mood daily</Text>
                        </View>
                        <Switch
                            value={reminders.dailyCheckIn}
                            onValueChange={() => toggleReminder('dailyCheckIn')}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>CBT Exercises</Text>
                            <Text style={styles.settingDescription}>Time to practice grounding/breathing</Text>
                        </View>
                        <Switch
                            value={reminders.exercises}
                            onValueChange={() => toggleReminder('exercises')}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Journaling</Text>
                            <Text style={styles.settingDescription}>Remind me to reflect on my thoughts</Text>
                        </View>
                        <Switch
                            value={reminders.journaling}
                            onValueChange={() => toggleReminder('journaling')}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Motivation</Text>
                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Streak Notifications</Text>
                            <Text style={styles.settingDescription}>Keep me updated on my consistency</Text>
                        </View>
                        <Switch
                            value={reminders.streaks}
                            onValueChange={() => toggleReminder('streaks')}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>Reminder Tone</Text>
                        <View style={styles.menuValue}>
                            <Text style={styles.valueText}>Gentle</Text>
                            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>Preferred Time</Text>
                        <View style={styles.menuValue}>
                            <Text style={styles.valueText}>8:00 PM</Text>
                            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                        </View>
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
    menuValue: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    valueText: {
        ...typography.body,
        color: colors.textSecondary,
        marginRight: spacing.xs,
    },
});
