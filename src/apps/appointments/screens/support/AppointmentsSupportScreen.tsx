import React, { useMemo } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import SupportChatFooter from '../../../../general/components/support/SupportChatFooter';
import SupportHeader from '../../../../general/components/support/SupportHeader';
import SupportIssueDropdown, { type SupportIssueOption } from '../../../../general/components/support/SupportIssueDropdown';
import SupportTopicItem from '../../../../general/components/support/SupportTopicItem';
import Text from '../../../../general/components/Text';
import { showToast } from '../../../../general/components/AppToast';
import { useAuthSessionQuery } from '../../../../general/hooks/useAuthQueries';
import { useTheme } from '../../../../general/theme/theme';
import type { AppointmentsStackParamList } from '../../navigation/types';

const SUPPORT_PHONE_NUMBER = '+13077768999';

export default function AppointmentsSupportScreen() {
  const { colors, typography } = useTheme();
  const navigation = useNavigation<NavigationProp<AppointmentsStackParamList>>();
  const sessionQuery = useAuthSessionQuery();
  const displayName = sessionQuery.data?.user?.name ?? 'there';
  const issueOptions = useMemo<SupportIssueOption[]>(() => [
    { value: 'appointment_support', label: 'Appointment support' },
    { value: 'business_support', label: 'Business support' },
    { value: 'joining_as_a_business', label: 'Joining as a business' },
    { value: 'payments_and_refunds', label: 'Payments and refunds' },
    { value: 'technical_issue', label: 'Technical issue' },
  ], []);

  const handleCallSupport = async () => {
    try {
      await Linking.openURL(`tel:${SUPPORT_PHONE_NUMBER}`);
    } catch {
      showToast.error('Unable to open the phone app');
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SupportHeader
        backAccessibilityLabel="Go back"
        onRightPress={() => void handleCallSupport()}
        rightAccessibilityLabel="Call support"
        title="Support"
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text color={colors.mutedText} weight="medium" style={[styles.greeting, { fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }]}>
          Hi {displayName}!
        </Text>
        <Text color={colors.text} weight="extraBold" style={[styles.headline, { fontSize: typography.size.h5, lineHeight: typography.lineHeight.h5 }]}>
          What do you need help with today?
        </Text>

        <View style={styles.section}>
          <Text color={colors.text} weight="extraBold" style={[styles.sectionTitle, { fontSize: typography.size.lg, lineHeight: 22 }]}>
            Browse help topics
          </Text>
          <SupportTopicItem iconName="bag-outline" label="Frequently asked questions" onPress={() => navigation.navigate('SupportFaq')} />
          <SupportTopicItem iconName="chatbox-outline" label="My conversations" onPress={() => navigation.navigate('SupportConversations')} />
          <SupportTopicItem iconName="alert-circle-outline" label="My tickets" onPress={() => navigation.navigate('SupportTickets')} />
        </View>

        <View style={styles.section}>
          <Text color={colors.text} weight="extraBold" style={[styles.sectionTitle, { fontSize: typography.size.lg, lineHeight: 22 }]}>
            Didn’t find what you need?
          </Text>
          <SupportIssueDropdown
            options={issueOptions}
            placeholder="Select an issue"
            sheetTitle="How can we help?"
            value={undefined}
            onChange={(nextValue) => {
              const option = issueOptions.find((item) => item.value === nextValue);
              if (option) navigation.navigate('SupportContactForm', { issueLabel: option.label, issueValue: option.value });
            }}
          />
        </View>
      </ScrollView>

      <SupportChatFooter ctaLabel="Chat with us" onPress={() => navigation.navigate('SupportChat')} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 24, paddingHorizontal: 16, paddingTop: 12 },
  greeting: { marginBottom: 8 },
  headline: { marginBottom: 28, maxWidth: 320 },
  screen: { flex: 1 }, scroll: { flex: 1 },
  section: { gap: 12, marginBottom: 24 }, sectionTitle: { marginBottom: 4 },
});
