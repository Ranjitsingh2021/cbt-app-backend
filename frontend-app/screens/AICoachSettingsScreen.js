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

export default function AICoachSettingsScreen() {
    const [allowReflections, setAllowReflections] = useState(true);
    const [detailedResponses, setDetailedResponses] = useState(true);

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Interaction Style</Text>
                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Reflective Questions</Text>
                            <Text style={styles.settingDescription}>Allow AI to ask deep, exploratory questions</Text>
                        </View>
                        <Switch
                            value={allowReflections}
                            onValueChange={setAllowReflections}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Detailed Responses</Text>
                            <Text style={styles.settingDescription}>Receive longer, more comprehensive feedback</Text>
                        </View>
                        <Switch
                            value={detailedResponses}
                            onValueChange={setDetailedResponses}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Frequency</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>Emotional Check-ins</Text>
                        <Text style={styles.valueText}>High Frequency</Text>
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
