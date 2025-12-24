import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../config/theme';
import { ENABLE_BACKEND, API_BASE_URL } from '../config/featureFlags';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatScreen({ navigation, route }) {
  const { conversationId } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(ENABLE_BACKEND);
  const [currentConversationId, setCurrentConversationId] = useState(conversationId);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (ENABLE_BACKEND) {
      if (currentConversationId) {
        fetchConversationMessages(currentConversationId);
      } else {
        fetchHistory(); // Default to latest or keep empty
      }
    }
  }, [currentConversationId]);

  const fetchConversationMessages = async (id) => {
    setInitialLoading(true);
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/chat/conversations/${id}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const historyData = await response.json();
        const formattedMessages = historyData.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/chat/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const historyData = await response.json();
        // Backend returns: { id, text, sender, timestamp }
        // Frontend expects same format. Need to ensure timestamp is Date object.
        const formattedMessages = historyData.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setInitialLoading(false);
    }
  };
  // Set up navigation header buttons
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              setCurrentConversationId(null);
              setMessages([]);
            }}
            style={{ marginRight: spacing.md }}
          >
            <Ionicons name="add-circle-outline" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={{ marginRight: spacing.md }}
          >
            <Ionicons name="person-circle-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    if (ENABLE_BACKEND) {
      try {
        const token = await AsyncStorage.getItem('access_token');
        console.log("DEBUG FRONTEND: Retreived token:", token ? `${token.substring(0, 20)}...` : "null");
        console.log("DEBUG FRONTEND: Sending request to:", `${API_BASE_URL}/chat`);
        if (!token) {
          Alert.alert("Error", "Session expired. Please login again.");
          navigation.replace("Login");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            message: userMessage.text,
            conversation_id: currentConversationId
          })
        });

        if (response.status === 401) {
          await AsyncStorage.removeItem('access_token');
          navigation.replace('Login');
          return;
        }

        const responseText = await response.text();
        let chatData;
        try {
          chatData = JSON.parse(responseText);
        } catch (e) {
          throw new Error("Invalid response from server");
        }

        if (!response.ok) {
          throw new Error(chatData.detail || "Backend error");
        }

        if (chatData.conversation_id && !currentConversationId) {
          setCurrentConversationId(chatData.conversation_id);
        }

        const aiMessage = {
          id: (Date.now() + 1).toString(),
          text: chatData.message,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);

      } catch (error) {
        console.error('Chat error:', error);
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I'm having trouble connecting to the server. Please try again.",
          sender: 'ai',
          timestamp: new Date(),
          isError: true
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } else {
      // Simulate AI response delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check for crisis keywords
      const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'self harm'];
      const isCrisis = crisisKeywords.some(keyword =>
        userMessage.text.toLowerCase().includes(keyword)
      );

      if (isCrisis) {
        const crisisMessage = {
          id: (Date.now() + 1).toString(),
          text: 'I\'m concerned about what you\'re saying. Please reach out to a crisis hotline immediately. Tap here for resources.',
          sender: 'ai',
          timestamp: new Date(),
          isCrisis: true,
        };
        setMessages(prev => [...prev, crisisMessage]);
        navigation.navigate('CrisisResources');
      } else {
        // Empty state message
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          text: 'Backend is disabled. This is a placeholder response. Enable backend in config/featureFlags.js to see AI responses.',
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    }

    setLoading(false);
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.aiMessage,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.aiBubble,
            item.isCrisis && styles.crisisBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userText : styles.aiText,
            ]}
          >
            {item.text}
          </Text>
          {item.isCrisis && (
            <TouchableOpacity
              style={styles.crisisButton}
              onPress={() => navigation.navigate('CrisisResources')}
            >
              <Text style={styles.crisisButtonText}>View Resources</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="chatbubbles-outline" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>Start Your Therapy Session</Text>
      <Text style={styles.emptyText}>
        I'm here to help you work through your thoughts and feelings using CBT techniques.
      </Text>
      <Text style={styles.emptyText}>
        How are you feeling today?
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.messagesList,
            messages.length === 0 && styles.emptyList,
          ]}
          ListEmptyComponent={initialLoading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Loading history...</Text>
            </View>
          ) : renderEmptyState}
          onContentSizeChange={() => {
            if (messages.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: true });
            }
          }}
          showsVerticalScrollIndicator={true}
          style={styles.flatList}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor={colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || loading) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || loading}
          >
            {loading ? (
              <Ionicons name="hourglass-outline" size={24} color="#fff" />
            ) : (
              <Ionicons name="send" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  messagesList: {
    padding: spacing.md,
    paddingBottom: 80, // Fixed padding to account for input container height
    flexGrow: 1,
  },
  emptyList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    ...typography.h3,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.bodySmall,
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  messageContainer: {
    marginBottom: spacing.md,
    flexDirection: 'row',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  crisisBubble: {
    backgroundColor: colors.crisisBg,
    borderColor: colors.crisis,
    borderWidth: 2,
  },
  messageText: {
    ...typography.body,
    lineHeight: 22,
  },
  userText: {
    color: '#ffffff',
  },
  aiText: {
    color: colors.text,
  },
  crisisButton: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.crisis,
    borderRadius: 8,
    alignItems: 'center',
  },
  crisisButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'flex-end',
    minHeight: 80,
  },
  input: {
    flex: 1,
    ...typography.body,
    backgroundColor: colors.background,
    borderRadius: 24,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

