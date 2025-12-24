import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../config/theme';
import { API_BASE_URL, ENABLE_BACKEND } from '../config/featureFlags';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoryScreen({ navigation }) {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        if (!ENABLE_BACKEND) {
            setLoading(false);
            return;
        }

        try {
            const token = await AsyncStorage.getItem('access_token');
            if (!token) {
                navigation.replace('Login');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                await AsyncStorage.removeItem('access_token');
                navigation.replace('Login');
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setConversations(data);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchConversations();
    };

    const handleConversationPress = (conversation) => {
        navigation.navigate('Chat', { conversationId: conversation.id });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.conversationItem}
            onPress={() => handleConversationPress(item)}
        >
            <View style={styles.iconContainer}>
                <Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.conversationTitle} numberOfLines={1}>
                    {item.title || 'New Conversation'}
                </Text>
                <Text style={styles.conversationDate}>{formatDate(item.updated_at)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
    );

    const renderEmpty = () => (
        <View style={styles.emptyState}>
            <Ionicons name="journal-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Conversations Yet</Text>
            <Text style={styles.emptyText}>
                Your therapy journey starts here. Start a new chat to see your history.
            </Text>
            <TouchableOpacity
                style={styles.startButton}
                onPress={() => navigation.navigate('Chat')}
            >
                <Text style={styles.startButtonText}>Start New Chat</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <FlatList
                data={conversations}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={[
                    styles.listContent,
                    conversations.length === 0 && styles.emptyList,
                ]}
                ListEmptyComponent={renderEmpty}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    listContent: {
        padding: spacing.md,
        flexGrow: 1,
    },
    emptyList: {
        justifyContent: 'center',
    },
    conversationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: 12,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#eef2ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    textContainer: {
        flex: 1,
    },
    conversationTitle: {
        ...typography.body,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    conversationDate: {
        ...typography.bodySmall,
        color: colors.textSecondary,
    },
    emptyState: {
        alignItems: 'center',
        padding: spacing.xl,
    },
    emptyTitle: {
        ...typography.h3,
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
    },
    emptyText: {
        ...typography.body,
        textAlign: 'center',
        color: colors.textSecondary,
        marginBottom: spacing.xl,
    },
    startButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: 25,
    },
    startButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});
