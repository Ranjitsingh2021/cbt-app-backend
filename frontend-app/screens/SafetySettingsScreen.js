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

export default function SafetySettingsScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Ionicons name="shield-checkmark" size={48} color={colors.crisis} />
                    <Text style={styles.title}>Safety & Crisis Support</Text>
                    <Text style={styles.subtitle}>Manage your safety plan and emergency access.</Text>
                </View>

                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('CrisisResources')}
                    >
                        <View style={styles.menuIcon}>
                            <Ionicons name="warning-outline" size={24} color={colors.crisis} />
                        </View>
                        <View style={styles.menuInfo}>
                            <Text style={styles.menuLabel}>Crisis Resources</Text>
                            <Text style={styles.menuDescription}>View national and local helplines</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIcon}>
                            <Ionicons name="people-outline" size={24} color={colors.primary} />
                        </View>
                        <View style={styles.menuInfo}>
                            <Text style={styles.menuLabel}>Emergency Contact</Text>
                            <Text style={styles.menuDescription}>Assign a trusted person to contact in crisis</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.noteCard}>
                    <Text style={styles.noteTitle}>Emergency Access</Text>
                    <Text style={styles.noteText}>
                        The "I need help now" button is always available in the Profile and Chat menus for quick access to support.
                    </Text>
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
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    title: {
        ...typography.h2,
        marginTop: spacing.md,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    section: {
        marginBottom: spacing.xl,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        marginRight: spacing.md,
    },
    menuInfo: {
        flex: 1,
    },
    menuLabel: {
        ...typography.body,
        fontWeight: '700',
    },
    menuDescription: {
        ...typography.bodySmall,
        color: colors.textSecondary,
    },
    noteCard: {
        backgroundColor: '#fff1f2',
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#fecdd3',
    },
    noteTitle: {
        ...typography.h3,
        fontSize: 16,
        color: colors.crisis,
        marginBottom: spacing.xs,
    },
    noteText: {
        ...typography.bodySmall,
        color: colors.text,
        lineHeight: 18,
    },
});
