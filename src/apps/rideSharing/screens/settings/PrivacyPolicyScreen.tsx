import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

export default function PrivacyPolicyScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text variant="title" weight="bold" color={colors.text}>
            {t('settings_privacy')}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.backgroundTertiary }]}>
          <Text variant="title" weight="bold" color={colors.text} style={styles.sectionTitle}>
            Privacy policy
          </Text>
          <Text variant="caption" color={colors.mutedText} style={styles.lastUpdated}>
            last updated 2 months ago
          </Text>

          <Text variant="body" color={colors.text} style={styles.paragraph}>
            At LO Drive, your privacy and trust are our top priority. This Privacy Policy explains how we handle your information when you use our app. By using LO Drive, you agree to the practices described below.
          </Text>

          <Text variant="subtitle" weight="bold" color={colors.text} style={styles.sectionHeader}>
            Information We Collect
          </Text>
          <Text variant="body" color={colors.text} style={styles.paragraph}>
            When you use LO Drive, we may collect the following types of information:
          </Text>
          <Text variant="body" color={colors.text} style={styles.listItem}>
            1. Account Information - When you create an account, we collect your name, email address, password, and any other details you provide during registration.
          </Text>
          <Text variant="body" color={colors.text} style={styles.listItem}>
            2. Files & Content - The documents, photos, videos, and other files you upload, store, or share through LO Drive.
          </Text>
          <Text variant="body" color={colors.text} style={styles.listItem}>
            3. Device & Technical Data — Device type, operating system, app version, IP address, log files, and usage Statistics that help us improve our services.
          </Text>
          <Text variant="body" color={colors.text} style={styles.listItem}>
            4. Support & Communication — Any messages, feedback, or support requests you send to us.
          </Text>
          <Text variant="body" color={colors.text} style={styles.listItem}>
            5. Optional Information — Preferences or settings you adjust within the app.
          </Text>

          <Text variant="subtitle" weight="bold" color={colors.text} style={styles.sectionHeader}>
            How We Use Your Information
          </Text>
          <Text variant="body" color={colors.text} style={styles.paragraph}>
            We use your information for purposes including, but not limited to:
          </Text>
          <Text variant="body" color={colors.text} style={styles.listItem}>
            • Service Delivery: To provide secure file storage, sharing, and related features.
          </Text>
          <Text variant="body" color={colors.text} style={styles.listItem}>
            • Account Management: To authenticate users, manage accounts, and provide customer support.
          </Text>
          <Text variant="body" color={colors.text} style={styles.listItem}>
            • Improvement & Personalization: To understand how LO Drive is used and enhance user experience.
          </Text>
          <Text variant="body" color={colors.text} style={styles.listItem}>
            • Security & Safety: To prevent fraud, unauthorized access, and abuse of our platform.
          </Text>
          <Text variant="body" color={colors.text} style={styles.listItem}>
            • Legal Compliance: To comply with applicable laws and regulations.
          </Text>
          <Text variant="body" color={colors.text} style={styles.listItem}>
            • Communication: To send you service-related updates, notifications, or responses to your inquiries.
          </Text>

          <Text variant="subtitle" weight="bold" color={colors.text} style={styles.sectionHeader}>
            How We Share Your Information
          </Text>
          <Text variant="body" color={colors.text} style={styles.paragraph}>
            We respect your privacy and do not sell your personal data. We may share your information only in the following cases:
          </Text>
          <Text variant="body" color={colors.text} style={styles.listItem}>
            • With Your Consent: When you choose to share files or invite collaborators.
          </Text>
          <Text variant="body" color={colors.text} style={styles.listItem}>
            • Service Providers: With trusted third parties that provide hosting, storage, analytics, or customer support.
          </Text>
          <Text variant="body" color={colors.text} style={styles.listItem}>
            • Legal Requirements: If required by law, regulation, or valid legal process.
          </Text>
          <Text variant="body" color={colors.text} style={styles.listItem}>
            • Protection: When necessary to protect the rights, safety, or property of LO Drive, our users, or the public.
          </Text>

          <Text variant="subtitle" weight="bold" color={colors.text} style={styles.sectionHeader}>
            Data Security
          </Text>
          <Text variant="body" color={colors.text} style={styles.paragraph}>
            We use industry-standard measures such as encryption, secure servers, and access controls to protect your data. While we take all reasonable steps to secure your information, no method of transmission or storage is completely secure. We encourage you to also use strong passwords and maintain your own device security.
          </Text>

          <Text variant="subtitle" weight="bold" color={colors.text} style={styles.sectionHeader}>
            Your Rights
          </Text>
          <Text variant="body" color={colors.text} style={styles.paragraph}>
            Depending on your location, you may have the following rights:
          </Text>
          <Text variant="body" color={colors.text} style={styles.listItem}>
            • Access: Request a copy of your personal data.
          </Text>
          <Text variant="body" color={colors.text} style={styles.listItem}>
            • Correction: Request updates or corrections to inaccurate information.
          </Text>
          <Text variant="body" color={colors.text} style={styles.listItem}>
            • Deletion: Request permanent deletion of your files and account.
          </Text>
          <Text variant="body" color={colors.text} style={styles.listItem}>
            • Restriction: Limit certain processing of your data.
          </Text>
          <Text variant="body" color={colors.text} style={styles.listItem}>
            • Portability: Request your data in a portable format.
          </Text>
          <Text variant="body" color={colors.text} style={styles.listItem}>
            • Opt-Out: Unsubscribe from marketing communications.
          </Text>

          <Text variant="subtitle" weight="bold" color={colors.text} style={styles.sectionHeader}>
            Changes to This Privacy Policy
          </Text>
          <Text variant="body" color={colors.text} style={styles.paragraph}>
            We may update this Privacy Policy from time to time. If we make material changes, we will notify you through the app, by email, or by posting a notice on our website prior to the changes taking effect. Please review this Policy regularly to stay informed.
          </Text>

          <Text variant="subtitle" weight="bold" color={colors.text} style={styles.sectionHeader}>
            Contact Us
          </Text>
          <Text variant="body" color={colors.text} style={styles.paragraph}>
            If you have any questions, concerns, or requests regarding this Privacy Policy, you can contact us at:
          </Text>
          <Text variant="body" color={colors.text} style={styles.listItem}>
            • Email: contact@lodrive.com
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 32,
    gap: 4,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    padding: 16,
  },
  textBlock: {
    lineHeight: 24,
  },
  sectionTitle: {
    marginBottom: 4,
    fontSize: 20,
  },
  lastUpdated: {
    marginBottom: 16,
    fontStyle: 'italic',
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
  },
  paragraph: {
    marginBottom: 12,
    lineHeight: 22,
  },
  listItem: {
    marginLeft: 8,
    marginBottom: 4,
    lineHeight: 22,
  },
});
