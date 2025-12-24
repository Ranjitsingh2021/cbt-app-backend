import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../config/theme';

export default function TechnicalSettingsScreen() {
    const handleClearCache = () => {
        Alert.alert('Clear Cache', 'This will reload all assets. Continue?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', onPress: () => Alert.alert('Success', 'Cache cleared.') },
        ]);
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="mail-outline" size={22} color={colors.primary} />
                        <Text style={styles.menuText}>Contact Technical Support</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="bug-outline" size={22} color={colors.primary} />
                        <Text style={styles.menuText}>Report a Bug</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Diagnostics</Text>
                    <TouchableOpacity style={styles.menuItem} onPress={handleClearCache}>
                        <Ionicons name="refresh-outline" size={22} color={colors.text} />
                        <Text style={styles.menuText}>Clear App Cache</Text>
                    </TouchableOpacity>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Server Connection</Text>
                        <Text style={[styles.infoValue, { color: '#10b981' }]}>Online</Text>
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
        fontWeight: '600',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        marginTop: spacing.sm,
    },
    infoLabel: {
        ...typography.bodySmall,
        color: colors.textSecondary,
    },
    infoValue: {
        ...typography.bodySmall,
        fontWeight: '700',
    },
});
