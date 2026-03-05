import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

export default function TermsAndConditionsScreen() {
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
            {t('settings_terms_conditions')}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text variant="title" weight="bold" color={colors.text} style={styles.sectionTitle}>
            Terms of use
          </Text>
          <Text variant="caption" color={colors.mutedText} style={styles.lastUpdated}>
            last updated 2 months ago
          </Text>
          
          <Text variant="body" color={colors.text} style={styles.paragraph}>
            These Terms of Use ("Terms") govern your access to and use of LO Drive. By creating an account or using the app, you agree to follow these Terms. If you do not agree, please do not use LO Drive.
          </Text>

          <Text variant="subtitle" weight="bold" color={colors.text} style={styles.sectionHeader}>
            Use of Service
          </Text>
          <Text variant="body" color={colors.text} style={styles.paragraph}>
            LO Drive provides secure storage and file management services. You may use the app for personal or business purposes as long as you follow these Terms and all applicable laws. You must keep your login credentials safe and are responsible for all activities under your account.
          </Text>
          <Text variant="body" color={colors.text} style={styles.paragraph}>
            You may not misuse LO Drive by attempting to hack, disrupt, copy, or resell our services. Any attempt to bypass security, overload servers, or use the service for illegal activity is strictly prohibited.
          </Text>

          <Text variant="subtitle" weight="bold" color={colors.text} style={styles.sectionHeader}>
            User Content
          </Text>
          <Text variant="body" color={colors.text} style={styles.paragraph}>
            You remain the owner of the files, documents, and content you upload to LO Drive. By uploading, you grant us a limited right to store, process, and transmit that content solely for the purpose of providing the service.
          </Text>
          <Text variant="body" color={colors.text} style={styles.paragraph}>
            You are responsible for ensuring that your content is legal and does not violate intellectual property rights, privacy rights, or any applicable law. LO Drive does not actively monitor user content but reserves the right to remove or disable access to content that appears unlawful or harmful.
          </Text>

          <Text variant="subtitle" weight="bold" color={colors.text} style={styles.sectionHeader}>
            Service Availability and Updates
          </Text>
          <Text variant="body" color={colors.text} style={styles.paragraph}>
            We aim to keep LO Drive reliable and available at all times, but we cannot guarantee uninterrupted service. Occasional downtime may occur due to maintenance, updates, or technical issues.
          </Text>
          <Text variant="body" color={colors.text} style={styles.paragraph}>
            We may provide updates or new features to improve functionality. Some updates may be required for continued use of the app, and these Terms apply to all updated versions unless stated otherwise.
          </Text>

          <Text variant="subtitle" weight="bold" color={colors.text} style={styles.sectionHeader}>
            Limitation of Liability
          </Text>
          <Text variant="body" color={colors.text} style={styles.paragraph}>
            LO Drive is provided "as is" and "as available." While we work to protect your files and data, we cannot guarantee absolute security or uninterrupted access. To the maximum extent allowed by the laws of Qatar, LO Drive will not be responsible for indirect or consequential damages, such as lost data, lost profits, or business interruptions.
          </Text>

          <Text variant="subtitle" weight="bold" color={colors.text} style={styles.sectionHeader}>
            Governing Law
          </Text>
          <Text variant="body" color={colors.text} style={styles.paragraph}>
            These Terms are governed by the laws of Qatar. Any dispute arising from the use of LO Drive will be handled exclusively in the courts of Qatar.
          </Text>

          <Text variant="subtitle" weight="bold" color={colors.text} style={styles.sectionHeader}>
            Contact Us
          </Text>
          <Text variant="body" color={colors.text} style={styles.paragraph}>
            If you have questions about these Terms, please contact us:
          </Text>
          <Text variant="body" color={colors.text} style={styles.listItem}>
            • Email: contact@lodrive.com
          </Text>
          <Text variant="body" color={colors.text} style={styles.listItem}>
            • Address: Doha, Qatar
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
