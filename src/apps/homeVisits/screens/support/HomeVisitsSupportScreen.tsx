import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import SupportAdminPickerBottomSheet from '../../../../general/components/support/SupportAdminPickerBottomSheet';
import SupportChatFooter from '../../../../general/components/support/SupportChatFooter';
import SupportHeader from '../../../../general/components/support/SupportHeader';
import SupportIssueDropdown, {
  type SupportIssueOption,
} from '../../../../general/components/support/SupportIssueDropdown';
import SupportTopicItem from '../../../../general/components/support/SupportTopicItem';
import Text from '../../../../general/components/Text';
import { useAuthSessionQuery } from '../../../../general/hooks/useAuthQueries';
import { useTheme } from '../../../../general/theme/theme';
import { useSupportAdmins } from '../../hooks/useSupportAdmins';
import { useSupportTicketOptionsQuery } from '../../hooks/useSupportTicketOptionsQuery';
import type { HomeVisitsStackParamList } from '../../navigation/types';
import { buildSupportOptions, orderSupportCategoryKeys } from '../../utils/supportFormOptions';

export default function HomeVisitsSupportScreen() {
  const { colors, typography } = useTheme();
  const { t, i18n } = useTranslation(['homeVisits', 'general']);
  const navigation = useNavigation<NavigationProp<HomeVisitsStackParamList>>();
  const sessionQuery = useAuthSessionQuery();
  const [isAdminPickerVisible, setIsAdminPickerVisible] = useState(false);
  const supportAdminsQuery = useSupportAdmins();
  const supportTicketOptionsQuery = useSupportTicketOptionsQuery();
  const admins = supportAdminsQuery.data?.admins ?? supportAdminsQuery.data?.data?.admins ?? [];
  const displayName = sessionQuery.data?.user?.name ?? t('home_visits_support_guest_name', { ns: 'homeVisits' });

  const issueOptions = useMemo<SupportIssueOption[]>(
    () => {
      const categoryKeys = orderSupportCategoryKeys(
        supportTicketOptionsQuery.data?.categories.map((category) => category.key) ?? [
          'business_support',
          'joining_as_a_business',
          'appointment_support',
        ],
      );

      return buildSupportOptions(
        categoryKeys,
        'home_visits_support_issue_',
        t,
        (key, options) => i18n.exists(key, options),
      );
    },
    [i18n, supportTicketOptionsQuery.data?.categories, t],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SupportHeader
        backAccessibilityLabel={t('home_visits_support_back_action', { ns: 'homeVisits' })}
        rightAccessibilityLabel={t('support_call_action', { ns: 'homeVisits' })}
        title={t('profile_menu_support', { ns: 'general' })}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <Text
          color={colors.mutedText}
          style={[styles.greeting, { fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }]}
          weight="medium"
        >
          {t('home_visits_support_greeting', { name: displayName, ns: 'homeVisits' })}
        </Text>

        <Text
          color={colors.text}
          style={[styles.headline, { fontSize: typography.size.h5, lineHeight: typography.lineHeight.h5 }]}
          weight="extraBold"
        >
          {t('home_visits_support_headline', { ns: 'homeVisits' })}
        </Text>

        <View style={styles.section}>
          <Text
            color={colors.text}
            style={[styles.sectionTitle, { fontSize: typography.size.lg, lineHeight: 22 }]}
            weight="extraBold"
          >
            {t('home_visits_support_browse_topics', { ns: 'homeVisits' })}
          </Text>

          <SupportTopicItem
            iconName="bag-outline"
            label={t('home_visits_support_topic_faq', { ns: 'homeVisits' })}
            onPress={() => navigation.navigate('SupportFaq')}
          />
          <SupportTopicItem
            iconName="chatbox-outline"
            label={t('home_visits_support_topic_conversations', { ns: 'homeVisits' })}
            onPress={() => navigation.navigate('SupportConversations')}
          />
          <SupportTopicItem
            iconName="alert-circle-outline"
            label={t('home_visits_support_topic_tickets', { ns: 'homeVisits' })}
            onPress={() => navigation.navigate('SupportTickets')}
          />
        </View>

        <View style={styles.section}>
          <Text
            color={colors.text}
            style={[styles.sectionTitle, { fontSize: typography.size.lg, lineHeight: 22 }]}
            weight="extraBold"
          >
            {t('home_visits_support_issue_prompt', { ns: 'homeVisits' })}
          </Text>
          <SupportIssueDropdown
            onChange={(nextValue) => {
              const selectedOption = issueOptions.find((option) => option.value === nextValue);

              if (!selectedOption) {
                return;
              }

              navigation.navigate('SupportContactForm', {
                issueLabel: selectedOption.label,
                issueValue: selectedOption.value,
              });
            }}
            options={issueOptions}
            placeholder={t('home_visits_support_issue_placeholder', { ns: 'homeVisits' })}
            sheetTitle={t('home_visits_support_issue_select_title', { ns: 'homeVisits' })}
            value={undefined}
          />
        </View>
      </ScrollView>

      <SupportChatFooter
        ctaLabel={t('home_visits_support_chat_cta', { ns: 'homeVisits' })}
        onPress={() => setIsAdminPickerVisible(true)}
      />

      <SupportAdminPickerBottomSheet
        admins={admins}
        emptyLabel={t('home_visits_support_admin_picker_empty', { ns: 'homeVisits' })}
        isLoading={supportAdminsQuery.isPending}
        isVisible={isAdminPickerVisible}
        loadingLabel={t('home_visits_support_admin_picker_loading', { ns: 'homeVisits' })}
        onClose={() => setIsAdminPickerVisible(false)}
        onSelectAdmin={(admin) => {
          setIsAdminPickerVisible(false);
          navigation.navigate('SupportChat', {
            agentName: admin.name,
            receiverId: admin.id,
          });
        }}
        rowSubtitle={t('home_visits_support_admin_picker_row_subtitle', { ns: 'homeVisits' })}
        subtitle={t('home_visits_support_admin_picker_subtitle', { ns: 'homeVisits' })}
        title={t('home_visits_support_admin_picker_title', { ns: 'homeVisits' })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  greeting: {
    marginBottom: 8,
  },
  headline: {
    marginBottom: 28,
    maxWidth: 320,
  },
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  section: {
    gap: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 4,
  },
});
