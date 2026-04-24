import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { showToast } from '../../../../general/components/AppToast';
import Button from '../../../../general/components/Button';
import SupportHeader from '../../../../general/components/support/SupportHeader';
import SupportIssueDropdown from '../../../../general/components/support/SupportIssueDropdown';
import Text from '../../../../general/components/Text';
import { useAuthSessionQuery } from '../../../../general/hooks/useAuthQueries';
import { useTheme } from '../../../../general/theme/theme';
import SupportAttachmentDropzone from '../../components/support/SupportAttachmentDropzone';
import { deliveryKeys } from '../../api/queryKeys';
import { supportTicketService } from '../../api/supportTicketService';
import SupportLabeledField from '../../components/support/SupportLabeledField';
import { useCreateSupportTicketMutation } from '../../hooks/useCreateSupportTicketMutation';
import { useSupportTicketFormConfigQuery } from '../../hooks/useSupportTicketFormConfigQuery';
import { SupportHomeNavigationProp, SupportNavigationParamList } from '../../navigation/supportNavigationTypes';
import { buildSupportOptions, orderSupportCategoryKeys } from '../../utils/supportFormOptions';
import { mapSupportTicketToListItem } from '../../utils/supportTicketMappers';

type SupportContactFormRouteProp = RouteProp<SupportNavigationParamList, 'SupportContactForm'>;
const BUSINESS_JOINING_ISSUE = 'joining_as_a_business';
const FALLBACK_CATEGORY_KEYS = [
  'business_support',
  'joining_as_a_business',
  'appointment_support',
];
const FALLBACK_CATEGORY_REASONS: Record<string, string[]> = {
  business_support: [
    'account_setup',
    'add_on_integrations',
    'using_the_app',
    'payments_and_payouts',
    'technical_issues',
    'other',
  ],
  joining_as_a_business: [
    'account_setup',
    'add_on_integrations',
    'using_the_app',
    'payments_and_payouts',
    'technical_issues',
    'other',
  ],
  appointment_support: [
    'my_orders',
    'payments_and_purchases',
    'reviews',
    'emails_and_notifications',
    'delete_my_account',
    'other',
  ],
};
const FALLBACK_BUSINESS_TYPES = [
  'Burger Joint',
  'Pizza Place',
  'Taco Stand',
  'Sandwich Shop',
  'Ice Cream Parlor',
  'Fried Chicken Spot',
  'Food Truck',
  'Hot Dog Stand',
  'Other Fast Food',
];
const FALLBACK_TEAM_SIZES = ['Just me', '2 - 5', '6 - 10'];

function normalizeTextValue(value: unknown) {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (value == null) {
    return '';
  }

  return String(value).trim();
}

function extractCreatedTicketId(response: {
  data?: {
    id?: string;
    _id?: string;
    ticketId?: string;
  };
  detail?: {
    id?: string;
  };
}) {
  const createdTicketId = response.data?.id
    ?? response.data?._id
    ?? response.data?.ticketId
    ?? response.detail?.id;

  return createdTicketId?.trim();
}

export default function SupportContactFormScreen() {
  const { colors, typography } = useTheme();
  const { t, i18n } = useTranslation('deliveries');
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<SupportHomeNavigationProp>();
  const queryClient = useQueryClient();
  const route = useRoute<SupportContactFormRouteProp>();
  const sessionQuery = useAuthSessionQuery();
  const supportTicketFormConfigQuery = useSupportTicketFormConfigQuery();
  const [email, setEmail] = useState(sessionQuery.data?.user?.email ?? '');
  const [issueValue, setIssueValue] = useState(route.params.issueValue);
  const [reasonValue, setReasonValue] = useState<string>();
  const [description, setDescription] = useState('');
  const [fullName, setFullName] = useState(sessionQuery.data?.user?.name ?? '');
  const [countryRegion, setCountryRegion] = useState<string>();
  const [mobileNumber, setMobileNumber] = useState(sessionQuery.data?.user?.phone ?? '');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState<string>();
  const [teamSize, setTeamSize] = useState<string>();
  const createSupportTicketMutation = useCreateSupportTicketMutation({
    onSuccess: async (response) => {
      console.log('[SupportContactForm] ticket submit success:', response);
      showToast.success(
        t('support_form_submit_success_title'),
        t('support_form_submit_success_message'),
      );

      const createdTicketId = extractCreatedTicketId(response);

      try {
        const supportMyTickets = await supportTicketService.getMyTickets();
        const createdTicket = createdTicketId
          ? supportMyTickets.tickets.find((ticket) => ticket.id === createdTicketId)
          : undefined;
        const fallbackLatestTicket = supportMyTickets.tickets[0];
        const targetTicket = createdTicket ?? fallbackLatestTicket;

        if (targetTicket) {
          queryClient.setQueryData(deliveryKeys.supportMyTickets(), supportMyTickets);
          navigation.navigate('SupportTicketDetail', {
            openMode: 'fresh',
            ticket: mapSupportTicketToListItem(
              targetTicket,
              (orderId) => t('support_tickets_order_id', { orderId }),
            ),
          });
          return;
        }

        navigation.navigate('SupportTickets');
        return;
      } catch {
        // Fall back to previous behavior if fetching my tickets fails.
      }

      navigation.goBack();
    },
    onError: (error) => {
      console.log('[SupportContactForm] ticket submit error:', {
        message: error.message,
        error,
      });
      showToast.error(
        t('support_form_submit_error_title'),
        error.message,
      );
    },
  });

  useEffect(() => {
    if (!email && sessionQuery.data?.user?.email) {
      setEmail(sessionQuery.data.user.email);
    }
  }, [email, sessionQuery.data?.user?.email]);

  useEffect(() => {
    if (!fullName && sessionQuery.data?.user?.name) {
      setFullName(sessionQuery.data.user.name);
    }
  }, [fullName, sessionQuery.data?.user?.name]);

  useEffect(() => {
    if (!mobileNumber && sessionQuery.data?.user?.phone) {
      setMobileNumber(sessionQuery.data.user.phone);
    }
  }, [mobileNumber, sessionQuery.data?.user?.phone]);

  const categoryReasonMap = useMemo(() => {
    const categories = supportTicketFormConfigQuery.data?.categories;

    if (!categories?.length) {
      return FALLBACK_CATEGORY_REASONS;
    }

    return categories.reduce<Record<string, string[]>>((result, category) => {
      result[category.key] = category.reasons;
      return result;
    }, {});
  }, [supportTicketFormConfigQuery.data?.categories]);

  const howCanWeHelpOptions = useMemo(
    () => {
      const categoryKeys = orderSupportCategoryKeys(
        supportTicketFormConfigQuery.data?.categories.map((category) => category.key)
          ?? FALLBACK_CATEGORY_KEYS,
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

  const reasonOptions = useMemo(
    () => buildSupportOptions(
      categoryReasonMap[issueValue] ?? [],
      'support_form_reason_',
      t,
      (key) => i18n.exists(key, { ns: 'deliveries' }),
    ),
    [categoryReasonMap, i18n, issueValue, t],
  );

  const countryRegionOptions = useMemo(
    () => [
      { value: 'united_states', label: t('support_form_country_united_states') },
      { value: 'canada', label: t('support_form_country_canada') },
      { value: 'united_kingdom', label: t('support_form_country_united_kingdom') },
      { value: 'australia', label: t('support_form_country_australia') },
      { value: 'france', label: t('support_form_country_france') },
    ],
    [t],
  );

  const businessTypeOptions = useMemo(
    () => (supportTicketFormConfigQuery.data?.businessTypes ?? FALLBACK_BUSINESS_TYPES).map((value) => ({
      value,
      label: value,
    })),
    [supportTicketFormConfigQuery.data?.businessTypes],
  );

  const teamSizeOptions = useMemo(
    () => (supportTicketFormConfigQuery.data?.teamSizes ?? FALLBACK_TEAM_SIZES).map((value) => ({
      value,
      label: value,
    })),
    [supportTicketFormConfigQuery.data?.teamSizes],
  );

  const normalizedIssueValue = normalizeTextValue(issueValue);
  const isBusinessJoiningFlow = normalizedIssueValue === BUSINESS_JOINING_ISSUE;

  useEffect(() => {
    const validIssueValues = howCanWeHelpOptions.map((option) => option.value);

    if (!validIssueValues.length || validIssueValues.includes(issueValue)) {
      return;
    }

    setIssueValue(validIssueValues[0]);
  }, [howCanWeHelpOptions, issueValue]);

  useEffect(() => {
    const validReasonValues = reasonOptions.map((option) => option.value);

    if (!reasonValue || validReasonValues.includes(reasonValue)) {
      return;
    }

    setReasonValue(undefined);
  }, [reasonOptions, reasonValue]);

  useEffect(() => {
    if (isBusinessJoiningFlow) {
      return;
    }

    setCountryRegion(undefined);
    setBusinessName('');
    setBusinessType(undefined);
    setTeamSize(undefined);
  }, [isBusinessJoiningFlow]);

  const isStandardFormValid = Boolean(
    email.trim() && normalizedIssueValue && reasonValue && description.trim(),
  );
  const isBusinessFormValid = Boolean(
    email.trim()
    && normalizedIssueValue
    && fullName.trim()
    && normalizeTextValue(countryRegion)
    && normalizeTextValue(businessName)
    && normalizeTextValue(businessType)
    && normalizeTextValue(teamSize)
    && reasonValue
    && description.trim(),
  );
  const isFormValid = isBusinessJoiningFlow ? isBusinessFormValid : isStandardFormValid;

  const handleSubmit = () => {
    const trimmedEmail = email.trim();
    const trimmedDescription = description.trim();
    const trimmedIssueValue = normalizedIssueValue;
    const trimmedFullName = fullName.trim();
    const trimmedMobileNumber = mobileNumber.trim();
    const normalizedCountryRegion = normalizeTextValue(countryRegion);
    const trimmedBusinessName = normalizeTextValue(businessName);
    const normalizedBusinessType = normalizeTextValue(businessType);
    const normalizedTeamSize = normalizeTextValue(teamSize);

    console.log('[SupportContactForm] submit pressed:', {
      isBusinessJoiningFlow,
      issueValue: normalizedIssueValue,
      reasonValue,
      email: trimmedEmail,
      fullName: trimmedFullName,
      countryRegion: normalizedCountryRegion,
      countryRegionType: typeof countryRegion,
      mobileNumber: trimmedMobileNumber,
      businessName: trimmedBusinessName,
      businessNameType: typeof businessName,
      businessType: normalizedBusinessType,
      businessTypeType: typeof businessType,
      teamSize: normalizedTeamSize,
      teamSizeType: typeof teamSize,
      description: trimmedDescription,
    });

    if (isBusinessJoiningFlow) {
      if (
        !trimmedEmail
        || !trimmedIssueValue
        || !trimmedFullName
        || !normalizedCountryRegion
        || !trimmedBusinessName
        || !normalizedBusinessType
        || !normalizedTeamSize
        || !reasonValue
        || !trimmedDescription
      ) {
        console.log('[SupportContactForm] business submit blocked by validation:', {
          hasEmail: Boolean(trimmedEmail),
          hasIssueValue: Boolean(trimmedIssueValue),
          hasFullName: Boolean(trimmedFullName),
          hasCountryRegion: Boolean(normalizedCountryRegion),
          hasBusinessName: Boolean(trimmedBusinessName),
          hasBusinessType: Boolean(normalizedBusinessType),
          hasTeamSize: Boolean(normalizedTeamSize),
          hasReasonValue: Boolean(reasonValue),
          hasDescription: Boolean(trimmedDescription),
        });
        return;
      }

      const payload = {
        category: trimmedIssueValue,
        reason: reasonValue,
        email: trimmedEmail,
        fullName: trimmedFullName,
        countryRegion: normalizedCountryRegion,
        mobileNumber: trimmedMobileNumber || undefined,
        businessName: trimmedBusinessName,
        businessType: normalizedBusinessType,
        teamSize: normalizedTeamSize,
        description: trimmedDescription,
        attachmentUrls: [],
        priority: 'low' as const,
      };

      console.log('[SupportContactForm] business payload:', payload);
      createSupportTicketMutation.mutate(payload);
      return;
    }

    if (!trimmedEmail || !trimmedIssueValue || !reasonValue || !trimmedDescription) {
      console.log('[SupportContactForm] standard submit blocked by validation:', {
        hasEmail: Boolean(trimmedEmail),
        hasIssueValue: Boolean(trimmedIssueValue),
        hasReasonValue: Boolean(reasonValue),
        hasDescription: Boolean(trimmedDescription),
      });
      return;
    }

    const payload = {
      category: trimmedIssueValue,
      reason: reasonValue,
      email: trimmedEmail,
      fullName: sessionQuery.data?.user?.name?.trim() || undefined,
      mobileNumber: sessionQuery.data?.user?.phone?.trim() || undefined,
      description: trimmedDescription,
      attachmentUrls: [],
      priority: 'low' as const,
    };

    console.log('[SupportContactForm] standard payload:', payload);
    createSupportTicketMutation.mutate(payload);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SupportHeader
        backAccessibilityLabel={t('support_back_action')}
        rightAccessibilityLabel={t('support_close_action')}
        rightIconName="close-outline"
        title={t('support_title')}
        onRightPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 16) + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <SupportLabeledField label={t('support_form_how_help_label')}>
          <SupportIssueDropdown
            sheetTitle={t('support_issue_select_title')}
            options={howCanWeHelpOptions}
            placeholder={t('support_issue_placeholder')}
            value={issueValue}
            onChange={setIssueValue}
          />
        </SupportLabeledField>

        <SupportLabeledField
          label={t('support_form_email_label')}
          helperText={t('support_form_email_helper')}
          isRequired
        >
          <View style={[styles.inputField, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder=" "
              placeholderTextColor={colors.mutedText}
              style={[styles.input, { color: colors.text, fontSize: typography.size.md2 }]}
              value={email}
            />
          </View>
        </SupportLabeledField>

        {isBusinessJoiningFlow ? (
          <>
            <SupportLabeledField label={t('support_form_full_name_label')} isRequired>
              <View style={[styles.inputField, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <TextInput
                  onChangeText={setFullName}
                  placeholder={t('support_form_full_name_placeholder')}
                  placeholderTextColor={colors.mutedText}
                  style={[styles.input, { color: colors.text, fontSize: typography.size.md2 }]}
                  value={fullName}
                />
              </View>
            </SupportLabeledField>

            <SupportLabeledField label={t('support_form_country_region_label')} isRequired>
              <SupportIssueDropdown
                sheetTitle={t('support_issue_select_title')}
                options={countryRegionOptions}
                placeholder={t('support_form_country_region_placeholder')}
                value={countryRegion}
                onChange={setCountryRegion}
              />
            </SupportLabeledField>

            <SupportLabeledField label={t('support_form_mobile_number_label')}>
              <View style={[styles.inputField, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <TextInput
                  keyboardType="phone-pad"
                  onChangeText={setMobileNumber}
                  placeholder={t('support_form_mobile_number_placeholder')}
                  placeholderTextColor={colors.mutedText}
                  style={[styles.input, { color: colors.text, fontSize: typography.size.md2 }]}
                  value={mobileNumber}
                />
              </View>
            </SupportLabeledField>

            <SupportLabeledField label={t('support_form_business_name_label')} isRequired>
              <View style={[styles.inputField, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <TextInput
                  onChangeText={setBusinessName}
                  placeholder=" "
                  placeholderTextColor={colors.mutedText}
                  style={[styles.input, { color: colors.text, fontSize: typography.size.md2 }]}
                  value={businessName}
                />
              </View>
            </SupportLabeledField>

            <SupportLabeledField label={t('support_form_business_type_label')} isRequired>
              <SupportIssueDropdown
                sheetTitle={t('support_issue_select_title')}
                options={businessTypeOptions}
                placeholder={t('support_form_business_type_placeholder')}
                value={businessType}
                onChange={setBusinessType}
              />
            </SupportLabeledField>

            <SupportLabeledField label={t('support_form_team_size_label')} isRequired>
              <SupportIssueDropdown
                sheetTitle={t('support_issue_select_title')}
                options={teamSizeOptions}
                placeholder={t('support_form_team_size_placeholder')}
                value={teamSize}
                onChange={setTeamSize}
              />
            </SupportLabeledField>

            <SupportLabeledField label={t('support_form_reason_label')} isRequired>
              <SupportIssueDropdown
                sheetTitle={t('support_issue_select_title')}
                options={reasonOptions}
                placeholder={t('support_form_reason_placeholder')}
                value={reasonValue}
                onChange={setReasonValue}
              />
            </SupportLabeledField>
          </>
        ) : (
          <SupportLabeledField label={t('support_form_reason_label')} isRequired>
            <SupportIssueDropdown
              sheetTitle={t('support_issue_select_title')}
              options={reasonOptions}
              placeholder={t('support_form_reason_placeholder')}
              value={reasonValue}
              onChange={setReasonValue}
            />
          </SupportLabeledField>
        )}

        <SupportLabeledField
          label={isBusinessJoiningFlow
            ? t('support_form_business_description_label')
            : t('support_form_description_label')}
          isRequired
        >
          <Pressable>
            <View
              style={[
                styles.textAreaWrap,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}
            >
              <TextInput
                multiline
                onChangeText={setDescription}
                placeholder={t('support_form_description_placeholder')}
                placeholderTextColor={colors.mutedText}
                style={[
                  styles.textArea,
                  {
                    color: colors.text,
                    fontSize: typography.size.md2,
                    lineHeight: typography.lineHeight.md2,
                  },
                ]}
                textAlignVertical="top"
                value={description}
              />
            </View>
          </Pressable>
        </SupportLabeledField>

        {!isBusinessJoiningFlow ? <SupportAttachmentDropzone /> : null}
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        <Button
          label={t('support_form_send_email')}
          onPress={handleSubmit}
          disabled={!isFormValid || createSupportTicketMutation.isPending}
          isLoading={createSupportTicketMutation.isPending}
          variant={isFormValid ? 'primary' : 'secondary'}
          style={styles.footerButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  footerButton: {
    minHeight: 48,
  },
  input: {
    flex: 1,
    minHeight: 24,
    padding: 0,
  },
  inputField: {
    borderRadius: 6,
    borderWidth: 1,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  textArea: {
    flex: 1,
    padding: 0,
  },
  textAreaWrap: {
    borderRadius: 6,
    borderWidth: 1,
    height: 140,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
});
