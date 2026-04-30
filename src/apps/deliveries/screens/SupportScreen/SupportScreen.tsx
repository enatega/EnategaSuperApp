import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import SupportChatFooter from '../../../../general/components/support/SupportChatFooter';
import SupportIssueDropdown from '../../../../general/components/support/SupportIssueDropdown';
import SupportHeader from '../../../../general/components/support/SupportHeader';
import SupportTopicItem from '../../../../general/components/support/SupportTopicItem';
import Text from '../../../../general/components/Text';
import { useAuthSessionQuery } from '../../../../general/hooks/useAuthQueries';
import { useTheme } from '../../../../general/theme/theme';
import SupportAdminPickerBottomSheet from '../../components/support/SupportAdminPickerBottomSheet';
import { useSupportAdmins } from '../../hooks/useSupportChatQueries';
import { useSupportTicketFormConfigQuery } from '../../hooks/useSupportTicketFormConfigQuery';
import { SupportHomeNavigationProp } from '../../navigation/supportNavigationTypes';
import { buildSupportOptions, orderSupportCategoryKeys } from '../../utils/supportFormOptions';

export default function SupportScreen() {
  const { colors, typography } = useTheme();
  const { t, i18n } = useTranslation('deliveries');
  const navigation = useNavigation<SupportHomeNavigationProp>();
  const sessionQuery = useAuthSessionQuery();
  const supportAdminsQuery = useSupportAdmins();
  const supportTicketFormConfigQuery = useSupportTicketFormConfigQuery();
  const [isAdminPickerVisible, setIsAdminPickerVisible] = useState(false);
  const displayName = sessionQuery.data?.user?.name ?? t('support_guest_name');
  const issueOptions = useMemo(
    () => {
      const categoryKeys = orderSupportCategoryKeys(
        supportTicketFormConfigQuery.data?.categories.map((category) => category.key) ?? [
          'business_support',
          'joining_as_a_business',
          'appointment_support',
        ],
      );

      return buildSupportOptions(
        categoryKeys,
        'support_issue_',
        t,
        (key) => i18n.exists(key, { ns: 'deliveries' }),
      );
    },
    [i18n, supportTicketFormConfigQuery.data?.categories, t],
  );

  const handleOpenAdminPicker = () => {
    setIsAdminPickerVisible(true);
  };

  const handleCloseAdminPicker = () => {
    setIsAdminPickerVisible(false);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SupportHeader
        backAccessibilityLabel={t('support_back_action')}
        rightAccessibilityLabel={t('support_call_action')}
        title={t('support_title')}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text
          color={colors.mutedText}
          weight="medium"
          style={[styles.greeting, { fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }]}
        >
          {t('support_greeting', { name: displayName })}
        </Text>

        <Text
          color={colors.text}
          weight="extraBold"
          style={[styles.headline, { fontSize: typography.size.h5, lineHeight: typography.lineHeight.h5 }]}
        >
          {t('support_headline')}
        </Text>

        <View style={styles.section}>
          <Text
            color={colors.text}
            weight="extraBold"
            style={[styles.sectionTitle, { fontSize: typography.size.lg, lineHeight: 22 }]}
          >
            {t('support_browse_topics')}
          </Text>

          <SupportTopicItem
            iconName="bag-outline"
            label={t('support_topic_faq')}
            onPress={() => navigation.navigate('SupportFaq')}
          />
          <SupportTopicItem
            iconName="chatbox-outline"
            label={t('support_topic_conversations')}
            onPress={() => navigation.navigate('SupportConversations')}
          />
          <SupportTopicItem
            iconName="alert-circle-outline"
            label={t('support_topic_tickets')}
            onPress={() => navigation.navigate('SupportTickets')}
          />
        </View>

        <View style={styles.section}>
          <Text
            color={colors.text}
            weight="extraBold"
            style={[styles.sectionTitle, { fontSize: typography.size.lg, lineHeight: 22 }]}
          >
            {t('support_issue_prompt')}
          </Text>

          <SupportIssueDropdown
            options={issueOptions}
            placeholder={t('support_issue_placeholder')}
            sheetTitle={t('support_issue_select_title')}
            value={undefined}
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
          />
        </View>
      </ScrollView>

      <SupportChatFooter
        ctaLabel={t('support_chat_cta')}
        onPress={handleOpenAdminPicker}
      />

      <SupportAdminPickerBottomSheet
        admins={supportAdminsQuery.data?.admins ?? []}
        emptyLabel={t('support_admin_picker_empty')}
        isLoading={supportAdminsQuery.isPending}
        isVisible={isAdminPickerVisible}
        loadingLabel={t('support_admin_picker_loading')}
        onClose={handleCloseAdminPicker}
        onSelectAdmin={(admin) => {
          handleCloseAdminPicker();
          navigation.navigate('SupportChat', {
            agentName: admin.name,
            receiverId: admin.id,
          });
        }}
        rowSubtitle={t('support_admin_picker_row_subtitle')}
        subtitle={t('support_admin_picker_subtitle')}
        title={t('support_admin_picker_title')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
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
