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

export default function AccessibilitySettingsScreen() {
    const [darkMode, setDarkMode] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(false);

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Visuals</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Dark Mode</Text>
                            <Text style={styles.settingDescription}>Easier on the eyes at night</Text>
                        </View>
                        <Switch
                            value={darkMode}
                            onValueChange={setDarkMode}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>High Contrast</Text>
                            <Text style={styles.settingDescription}>Make text stand out more</Text>
                        </View>
                        <Switch
                            value={highContrast}
                            onValueChange={setHighContrast}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Interaction</Text>
                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Reduce Motion</Text>
                            <Text style={styles.settingDescription}>Minimize animations and transitions</Text>
                        </View>
                        <Switch
                            value={reduceMotion}
                            onValueChange={setReduceMotion}
                            trackColor={{ false: colors.border, true: colors.primary }}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Text Size</Text>
                    <View style={styles.textSizeControl}>
                        <TouchableOpacity style={styles.sizeButton}>
                            <Text style={[styles.sizeButtonText, { fontSize: 14 }]}>A</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.sizeButton, styles.activeSizeButton]}>
                            <Text style={[styles.sizeButtonText, styles.activeSizeText, { fontSize: 18 }]}>A</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sizeButton}>
                            <Text style={[styles.sizeButtonText, { fontSize: 24 }]}>A</Text>
                        </TouchableOpacity>
                    </View>
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
    textSizeControl: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    sizeButton: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    activeSizeButton: {
        backgroundColor: colors.primary,
    },
    sizeButtonText: {
        color: colors.text,
        fontWeight: '700',
    },
    activeSizeText: {
        color: '#fff',
    },
});
