import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../config/theme';

const HELP_CATEGORIES = [
    {
        id: 'getting-started',
        title: 'Getting Started',
        icon: 'rocket-outline',
        description: 'Learn the basics of CBT and how this app works.',
    },
    {
        id: 'cbt-tools',
        title: 'Using CBT Tools',
        icon: 'construct-outline',
        description: 'Mood tracking, thought records, and exercises explained.',
    },
    {
        id: 'safety',
        title: 'Safety & Crisis Support',
        icon: 'medical-outline',
        description: 'Immediate help and emergency resources.',
    },
    {
        id: 'privacy',
        title: 'Privacy & Security',
        icon: 'shield-checkmark-outline',
        description: 'How we protect your personal thoughts and data.',
    },
    {
        id: 'personalization',
        title: 'Personalization & Settings',
        icon: 'options-outline',
        description: 'Customizing your therapy journey.',
    },
    {
        id: 'faq',
        title: 'Common Questions (FAQ)',
        icon: 'help-circle-outline',
        description: 'Quick answers to common concerns.',
    },
    {
        id: 'professional',
        title: 'Professional Integration',
        icon: 'people-outline',
        description: 'Using the app along with professional therapy.',
    },
    {
        id: 'technical',
        title: 'Technical Support',
        icon: 'bug-outline',
        description: 'Troubleshooting and contacting our team.',
    },
];

export default function HelpSupportScreen({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCategories = HELP_CATEGORIES.filter(cat =>
        cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderCategory = ({ item }) => (
        <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => navigation.navigate('HelpDetail', { categoryId: item.id, title: item.title })}
        >
            <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={28} color={colors.primary} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.categoryTitle}>{item.title}</Text>
                <Text style={styles.categoryDescription} numberOfLines={2}>
                    {item.description}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search help topics..."
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <FlatList
                data={filteredCategories}
                renderItem={renderCategory}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
                        <Text style={styles.emptyText}>No matching help topics found.</Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.contactFooter}
                onPress={() => navigation.navigate('HelpDetail', { categoryId: 'technical' })}
            >
                <Text style={styles.contactText}>Still need help? </Text>
                <Text style={styles.contactLink}>Contact Support</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: spacing.md,
        backgroundColor: colors.background,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.md,
        borderRadius: 12,
        height: 50,
        borderWidth: 1,
        borderColor: colors.border,
    },
    searchIcon: {
        marginRight: spacing.sm,
    },
    searchInput: {
        flex: 1,
        ...typography.body,
        color: colors.text,
    },
    listContent: {
        padding: spacing.md,
        paddingBottom: spacing.xl,
    },
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#eef2ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    textContainer: {
        flex: 1,
    },
    categoryTitle: {
        ...typography.h3,
        fontSize: 16,
        marginBottom: 4,
    },
    categoryDescription: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        lineHeight: 18,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: spacing.xl * 2,
    },
    emptyText: {
        ...typography.body,
        color: colors.textSecondary,
        marginTop: spacing.md,
    },
    contactFooter: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    contactText: {
        ...typography.body,
        color: colors.textSecondary,
    },
    contactLink: {
        ...typography.body,
        color: colors.primary,
        fontWeight: '700',
    },
});
