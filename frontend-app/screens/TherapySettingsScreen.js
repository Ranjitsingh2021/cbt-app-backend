import React, { useState } from 'react';
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

const GOALS = ['Anxiety', 'Stress', 'Depression', 'Habits', 'Sleep'];
const DIFFICULTY = ['Beginner', 'Intermediate', 'Advanced'];
const AI_TONE = ['Neutral', 'Supportive', 'Motivational'];

export default function TherapySettingsScreen() {
    const [selectedGoal, setSelectedGoal] = useState('Stress');
    const [selectedDifficulty, setSelectedDifficulty] = useState('Beginner');
    const [selectedTone, setSelectedTone] = useState('Supportive');

    const renderOption = (label, options, selected, onSelect) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{label}</Text>
            <View style={styles.optionsGrid}>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.optionCard,
                            selected === option && styles.selectedOptionCard
                        ]}
                        onPress={() => onSelect(option)}
                    >
                        <Text style={[
                            styles.optionText,
                            selected === option && styles.selectedOptionText
                        ]}>
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {renderOption('Therapy Goals', GOALS, selectedGoal, setSelectedGoal)}
                {renderOption('Difficulty Level', DIFFICULTY, selectedDifficulty, setSelectedDifficulty)}
                {renderOption('AI Coach Tone', AI_TONE, selectedTone, setSelectedTone)}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Session Preferences</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>Session Length</Text>
                        <Text style={styles.valueText}>Medium (15-20 min)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>Frequency</Text>
                        <Text style={styles.valueText}>3 times per week</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoCard}>
                    <Ionicons name="sparkles" size={20} color={colors.primary} />
                    <Text style={styles.infoText}>
                        Personalizing these settings helps our AI provide more relevant exercises and responses tailored to your journey.
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
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    optionCard: {
        backgroundColor: colors.surface,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.xs,
    },
    selectedOptionCard: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    optionText: {
        ...typography.bodySmall,
        color: colors.text,
        fontWeight: '600',
    },
    selectedOptionText: {
        color: '#fff',
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
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#fffbeb',
        padding: spacing.md,
        borderRadius: 12,
        alignItems: 'flex-start',
        marginTop: spacing.md,
        borderWidth: 1,
        borderColor: '#fef3c7',
    },
    infoText: {
        ...typography.bodySmall,
        color: '#92400e',
        marginLeft: spacing.md,
        flex: 1,
        lineHeight: 18,
    },
});
