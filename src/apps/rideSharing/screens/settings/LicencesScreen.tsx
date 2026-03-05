import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

export default function LicencesScreen() {
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
            {t('settings_licences')}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.backgroundTertiary }]}>
          <Text variant="title" weight="bold" color={colors.text} style={styles.sectionTitle}>
            Licenses
          </Text>
          <Text variant="caption" color={colors.mutedText} style={styles.lastUpdated}>
            Effective Date: 23 September 2025
          </Text>

          <Text variant="body" color={colors.text} style={styles.paragraph}>
            This License Agreement is a legal contract between you and LO Drive. By downloading or using the app, you agree to these terms.
          </Text>

          <Text variant="body" color={colors.text} style={styles.paragraph}>
            You are granted a limited, non-exclusive, non-transferable license to use LO Drive on your device for personal or internal business purposes. You may not copy, modify, distribute, or sell the app. You also may not attempt to reverse engineer, decompile, or interfere with its operation or security. All rights to the app, including its code, design, logos, and trademarks, remain the property of LO Drive.
          </Text>

          <Text variant="body" color={colors.text} style={styles.paragraph}>
            The content you upload remains yours. LO Drive only stores, processes, and transmits it to provide the service. You are responsible for ensuring that your content is lawful and does not infringe on the rights of others. Sharing your content with others is your choice and responsibility.
          </Text>

          <Text variant="body" color={colors.text} style={styles.paragraph}>
            From time to time we may provide updates or improvements. Some updates may be necessary for the app to function properly. These terms will continue to apply to all future versions unless stated otherwise.
          </Text>

          <Text variant="body" color={colors.text} style={styles.paragraph}>
            If you violate this agreement or misuse the service, your access may be suspended or terminated. Once terminated, you must stop using the app and delete it from your devices.
          </Text>

          <Text variant="body" color={colors.text} style={styles.paragraph}>
            LO Drive is provided on an "as is" basis without warranties of any kind. While we work to keep services reliable and secure, we do not guarantee uninterrupted availability, complete security, or error-free performance. To the maximum extent allowed by Qatari law, we are not responsible for indirect or consequential damages such as lost files, lost profits, or device issues caused by the use of the app.
          </Text>

          <Text variant="body" color={colors.text} style={styles.paragraph}>
            This Agreement is governed by the laws of Qatar. Any disputes will fall under the jurisdiction of the courts of Qatar.
          </Text>

          <Text variant="body" color={colors.text} style={styles.paragraph}>
            For questions regarding this Agreement, contact us at:
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
