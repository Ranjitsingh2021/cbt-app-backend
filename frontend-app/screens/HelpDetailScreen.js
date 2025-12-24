import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Linking,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../config/theme';

const HELP_CONTENT = {
    'getting-started': [
        {
            title: 'What is CBT?',
            content: 'Cognitive Behavioral Therapy (CBT) is a structured, goal-oriented type of psychotherapy. It focuses on how your thoughts (cognitions), feelings, and behaviors are interconnected. By identifying and changing negative thought patterns, you can improve your emotional state and behavior.',
        },
        {
            title: 'Who is this app for?',
            content: 'This app is designed for individuals dealing with anxiety, stress, mild to moderate depression, or those looking to improve their mental well-being and habits through self-guided techniques.',
        },
        {
            title: 'Boundaries & Scope',
            content: 'This app is a self-help tool based on CBT principles. It is NOT a replacement for professional medical advice, diagnosis, or treatment. It is not an emergency care tool.',
        },
        {
            title: 'How to use the app',
            content: '1. Daily Check-ins: Log your mood daily.\n2. Chat with AI: Work through specific thoughts.\n3. Thought Records: Use the tools to challenge distortions.\n4. Exercises: Practice grounding and breathing.',
        },
    ],
    'cbt-tools': [
        {
            title: 'Mood Tracking',
            content: 'Tracking your mood helps you see patterns over time. Try to log your mood at least once a day, or whenever you feel a significant shift in your emotions.',
        },
        {
            title: 'Thought Records',
            content: 'Thought records help you spot "automatic thoughts" and challenge "cognitive distortions" (like black-and-white thinking or catastrophic thinking).',
        },
        {
            title: 'Behavioral Activation',
            content: 'This involves scheduling activities that bring a sense of pleasure or accomplishment, helping to break the cycle of avoidance and low mood.',
        },
    ],
    'safety': [
        {
            title: 'When to seek help',
            content: 'If you are experiencing suicidal thoughts, urges for self-harm, or panic attacks that feel completely unmanageable, please seek professional help immediately.',
        },
        {
            title: 'Emergency Contacts',
            content: '• Tele-MANAS: 14416 (India)\n• iCall: 022-25521111\n• Crisis Text Line (US): Text HOME to 741741\n• Emergency Services: 112 or 100',
        },
        {
            title: 'Safety Disclaimer',
            content: 'This app is not a substitute for professional medical care. If you are in crisis, please call emergency services immediately.',
        },
    ],
    'privacy': [
        {
            title: 'Data Privacy',
            content: 'Your thoughts are private. We encrypt your chat history and store it securely. We do not sell your personal data to third parties.',
        },
        {
            title: 'Data Control',
            content: 'You can delete your account and all associated data permanently from the Settings menu at any time.',
        },
    ],
    'faq': [
        {
            title: 'Is this a replacement for therapy?',
            content: 'No. While it uses the same techniques, it lacks the human connection and personalized guidance of a licensed therapist. It is best used as a companion tool.',
        },
        {
            title: 'How long before I see results?',
            content: 'Consistency is key. Most people notice improvements after 2-4 weeks of regular practice (daily or 3-4 times a week).',
        },
    ],
    'technical': [
        {
            title: 'Contact Support',
            content: 'Having issues? You can reach our technical support team at support@cbtapp.example.com. We typically respond within 24-48 hours.',
        },
        {
            title: 'Common Troubleshooting',
            content: '• App not loading: Check your internet connection.\n• Data not syncing: Logout and log back in.\n• Chat errors: Ensure the backend is running.',
        },
    ],
};

export default function HelpDetailScreen({ route, navigation }) {
    const { categoryId, title } = route.params;
    const content = HELP_CONTENT[categoryId] || [];

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                </View>

                {content.map((section, index) => (
                    <View key={index} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <Text style={styles.sectionContent}>{section.content}</Text>
                    </View>
                ))}

                {categoryId === 'safety' && (
                    <TouchableOpacity
                        style={styles.crisisButton}
                        onPress={() => navigation.navigate('CrisisResources')}
                    >
                        <Text style={styles.crisisButtonText}>Open Crisis Resources</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
    },
    header: {
        marginBottom: spacing.xl,
    },
    title: {
        ...typography.h2,
        color: colors.primary,
    },
    section: {
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: 12,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    sectionTitle: {
        ...typography.h3,
        fontSize: 18,
        marginBottom: spacing.sm,
    },
    sectionContent: {
        ...typography.body,
        lineHeight: 24,
        color: colors.text,
    },
    crisisButton: {
        backgroundColor: colors.crisis,
        padding: spacing.md,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: spacing.md,
    },
    crisisButtonText: {
        ...typography.button,
        color: '#fff',
    },
});
