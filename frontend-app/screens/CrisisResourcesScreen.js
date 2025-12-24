import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../config/theme';

export default function CrisisResourcesScreen() {
  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleText = (phoneNumber) => {
    Linking.openURL(`sms:${phoneNumber}`);
  };

  const handleWebsite = (url) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Emergency Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="alert-circle" size={24} color={colors.crisis} />
            <Text style={styles.sectionTitle}>Emergency Help</Text>
          </View>
          <Text style={styles.sectionDescription}>
            If you're in immediate danger, please call emergency services right away.
          </Text>

          <TouchableOpacity
            style={[styles.resourceCard, styles.emergencyCard]}
            onPress={() => handleCall('112')}
          >
            <View style={styles.resourceHeader}>
              <Ionicons name="call" size={28} color="#fff" />
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle}>Emergency Services (Police)</Text>
                <Text style={styles.resourceSubtitle}>112 or 100</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.resourceCard, styles.emergencyCard]}
            onPress={() => handleCall('102')}
          >
            <View style={styles.resourceHeader}>
              <Ionicons name="medical" size={28} color="#fff" />
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle}>Ambulance</Text>
                <Text style={styles.resourceSubtitle}>102</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Crisis Hotlines */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="call-outline" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Mental Health Helplines</Text>
          </View>

          <TouchableOpacity
            style={styles.resourceCard}
            onPress={() => handleCall('14416')}
          >
            <View style={styles.resourceHeader}>
              <Ionicons name="call" size={24} color={colors.primary} />
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle}>Tele-MANAS (National Helpline)</Text>
                <Text style={styles.resourceSubtitle}>14416 (24/7)</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resourceCard}
            onPress={() => handleCall('18602662345')}
          >
            <View style={styles.resourceHeader}>
              <Ionicons name="call" size={24} color={colors.primary} />
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle}>Vandrevala Foundation</Text>
                <Text style={styles.resourceSubtitle}>1860-2662-345 / 1800-2333-330 (24/7)</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resourceCard}
            onPress={() => handleCall('02225521111')}
          >
            <View style={styles.resourceHeader}>
              <Ionicons name="call" size={24} color={colors.primary} />
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle}>iCall (TISS)</Text>
                <Text style={styles.resourceSubtitle}>022-25521111 (Mon-Sat, 8 AM - 10 PM)</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resourceCard}
            onPress={() => handleCall('912227546669')}
          >
            <View style={styles.resourceHeader}>
              <Ionicons name="call" size={24} color={colors.primary} />
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle}>AASRA</Text>
                <Text style={styles.resourceSubtitle}>91-22-27546669 / 91-22-27546668 (24/7)</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resourceCard}
            onPress={() => handleCall('04424640050')}
          >
            <View style={styles.resourceHeader}>
              <Ionicons name="call" size={24} color={colors.primary} />
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle}>Sneha Foundation</Text>
                <Text style={styles.resourceSubtitle}>044-24640050 (24/7)</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Online Resources */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="globe-outline" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Online Resources</Text>
          </View>

          <TouchableOpacity
            style={styles.resourceCard}
            onPress={() => handleWebsite('https://www.vandrevalafoundation.com')}
          >
            <View style={styles.resourceHeader}>
              <Ionicons name="link" size={24} color={colors.primary} />
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle}>Vandrevala Foundation</Text>
                <Text style={styles.resourceSubtitle}>vandrevalafoundation.com</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resourceCard}
            onPress={() => handleWebsite('https://www.aasra.info')}
          >
            <View style={styles.resourceHeader}>
              <Ionicons name="link" size={24} color={colors.primary} />
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle}>AASRA</Text>
                <Text style={styles.resourceSubtitle}>aasra.info</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resourceCard}
            onPress={() => handleWebsite('https://icallhelpline.org')}
          >
            <View style={styles.resourceHeader}>
              <Ionicons name="link" size={24} color={colors.primary} />
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle}>iCall (TISS)</Text>
                <Text style={styles.resourceSubtitle}>icallhelpline.org</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Important Note */}
        <View style={styles.noteCard}>
          <Ionicons name="information-circle" size={24} color={colors.primary} />
          <Text style={styles.noteText}>
            Remember: You are not alone. Help is available 24/7. These resources are free, confidential, and available to anyone in crisis.
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    marginLeft: spacing.sm,
  },
  sectionDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emergencyCard: {
    backgroundColor: colors.crisis,
    borderColor: colors.crisis,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resourceInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  resourceTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  resourceSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: '#eef2ff',
    padding: spacing.md,
    borderRadius: 12,
    marginTop: spacing.md,
  },
  noteText: {
    ...typography.bodySmall,
    flex: 1,
    marginLeft: spacing.sm,
    color: colors.text,
  },
});

