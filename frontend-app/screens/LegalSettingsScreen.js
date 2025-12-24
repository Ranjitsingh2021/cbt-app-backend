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

export default function LegalSettingsScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Legal</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>Terms of Service</Text>
                        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>Privacy Policy</Text>
                        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>Medical Disclaimer</Text>
                        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>App Info</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Version</Text>
                        <Text style={styles.infoValue}>1.0.0 (Building 42)</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Device ID</Text>
                        <Text style={styles.infoValue}>A1B2-C3D4-E5F6</Text>
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
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
        paddingHorizontal: spacing.xs,
    },
    infoLabel: {
        ...typography.bodySmall,
        color: colors.textSecondary,
    },
    infoValue: {
        ...typography.bodySmall,
        color: colors.text,
        fontWeight: '600',
    },
});
