import type { NavigationProp, RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { showToast } from '../../../../general/components/AppToast';
import Button from '../../../../general/components/Button';
import SupportHeader from '../../../../general/components/support/SupportHeader';
import SupportIssueDropdown from '../../../../general/components/support/SupportIssueDropdown';
import { type SupportIssueOption } from '../../../../general/components/support/SupportIssueDropdown';
import { useAuthSessionQuery } from '../../../../general/hooks/useAuthQueries';
import { useTheme } from '../../../../general/theme/theme';
import HomeVisitsSupportAttachmentDropzone from '../../components/support/HomeVisitsSupportAttachmentDropzone';
import HomeVisitsSupportLabeledField from '../../components/support/HomeVisitsSupportLabeledField';
import { useCreateSupportTicketMutation } from '../../hooks/useCreateSupportTicketMutation';
import { useSupportTicketOptionsQuery } from '../../hooks/useSupportTicketOptionsQuery';
import type { HomeVisitsStackParamList } from '../../navigation/types';
import { buildSupportOptions, orderSupportCategoryKeys } from '../../utils/supportFormOptions';

type SupportContactFormRouteProp = RouteProp<HomeVisitsStackParamList, 'SupportContactForm'>;

const BUSINESS_JOINING_ISSUE = 'joining_as_a_business';
const APPOINTMENT_SUPPORT_ISSUE = 'appointment_support';
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
  'Salon',
  'Spa',
  'Cleaning',
  'Handyman',
  'Electrical',
  'Plumbing',
  'Other Home Service',
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

export default function HomeVisitsSupportContactFormScreen() {
  const { colors, typography } = useTheme();
  const { t, i18n } = useTranslation(['homeVisits', 'general']);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<HomeVisitsStackParamList>>();
  const route = useRoute<SupportContactFormRouteProp>();
  const sessionQuery = useAuthSessionQuery();
  const supportTicketOptionsQuery = useSupportTicketOptionsQuery();
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
    onSuccess: () => {
      showToast.success(
        t('home_visits_support_form_submit_success_title'),
        t('home_visits_support_form_submit_success_message'),
      );
      navigation.goBack();
    },
    onError: (error) => {
      showToast.error(
        t('home_visits_support_form_submit_error_title'),
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
    const categories = supportTicketOptionsQuery.data?.categories;

    if (!categories?.length) {
      return FALLBACK_CATEGORY_REASONS;
    }

    return categories.reduce<Record<string, string[]>>((result, category) => {
      result[category.key] = category.reasons;
      return result;
    }, {});
  }, [supportTicketOptionsQuery.data?.categories]);

  const howCanWeHelpOptions = useMemo<SupportIssueOption[]>(() => {
    const categoryKeys = orderSupportCategoryKeys(
      supportTicketOptionsQuery.data?.categories.map((category) => category.key)
      ?? FALLBACK_CATEGORY_KEYS,
    );

    return buildSupportOptions(
      categoryKeys,
      'home_visits_support_issue_',
      t,
      (key, options) => i18n.exists(key, options),
    );
  }, [i18n, supportTicketOptionsQuery.data?.categories, t]);

  const reasonOptions = useMemo(
    () => buildSupportOptions(
      categoryReasonMap[issueValue] ?? [],
      'home_visits_support_form_reason_',
      t,
      (key, options) => i18n.exists(key, options),
    ),
    [categoryReasonMap, i18n, issueValue, t],
  );

  const countryRegionOptions = useMemo(
    () => [
      { value: 'united_states', label: t('home_visits_support_form_country_united_states') },
      { value: 'canada', label: t('home_visits_support_form_country_canada') },
      { value: 'united_kingdom', label: t('home_visits_support_form_country_united_kingdom') },
      { value: 'australia', label: t('home_visits_support_form_country_australia') },
      { value: 'france', label: t('home_visits_support_form_country_france') },
    ],
    [t],
  );

  const businessTypeOptions = useMemo(
    () => (supportTicketOptionsQuery.data?.businessTypes ?? FALLBACK_BUSINESS_TYPES).map((value) => ({
      value,
      label: value,
    })),
    [supportTicketOptionsQuery.data?.businessTypes],
  );

  const teamSizeOptions = useMemo(
    () => (supportTicketOptionsQuery.data?.teamSizes ?? FALLBACK_TEAM_SIZES).map((value) => ({
      value,
      label: value,
    })),
    [supportTicketOptionsQuery.data?.teamSizes],
  );

  const normalizedIssueValue = normalizeTextValue(issueValue);
  const isBusinessJoiningFlow = normalizedIssueValue === BUSINESS_JOINING_ISSUE;
  const isAppointmentSupportFlow = normalizedIssueValue === APPOINTMENT_SUPPORT_ISSUE;

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
        return;
      }

      createSupportTicketMutation.mutate({
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
        priority: 'low',
      });
      return;
    }

    if (!trimmedEmail || !trimmedIssueValue || !reasonValue || !trimmedDescription) {
      return;
    }

    createSupportTicketMutation.mutate({
      category: trimmedIssueValue,
      reason: reasonValue,
      email: trimmedEmail,
      fullName: sessionQuery.data?.user?.name?.trim() || undefined,
      mobileNumber: sessionQuery.data?.user?.phone?.trim() || undefined,
      description: trimmedDescription,
      attachmentUrls: [],
      priority: 'low',
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SupportHeader
        backAccessibilityLabel={t('home_visits_support_back_action')}
        onRightPress={() => navigation.goBack()}
        rightAccessibilityLabel={t('home_visits_support_close_action')}
        rightIconName="close-outline"
        title={t('profile_menu_support', { ns: 'general' })}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 16) + 24 }]}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <HomeVisitsSupportLabeledField label={t('home_visits_support_form_how_help_label')}>
          <SupportIssueDropdown
            onChange={setIssueValue}
            options={howCanWeHelpOptions}
            placeholder={t('home_visits_support_issue_placeholder')}
            sheetTitle={t('home_visits_support_issue_select_title')}
            value={issueValue}
          />
        </HomeVisitsSupportLabeledField>

        <HomeVisitsSupportLabeledField
          helperText={t('home_visits_support_form_email_helper')}
          isRequired
          label={t('home_visits_support_form_email_label')}
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
        </HomeVisitsSupportLabeledField>

        {isBusinessJoiningFlow ? (
          <>
            <HomeVisitsSupportLabeledField isRequired label={t('home_visits_support_form_full_name_label')}>
              <View style={[styles.inputField, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <TextInput
                  onChangeText={setFullName}
                  placeholder={t('home_visits_support_form_full_name_placeholder')}
                  placeholderTextColor={colors.mutedText}
                  style={[styles.input, { color: colors.text, fontSize: typography.size.md2 }]}
                  value={fullName}
                />
              </View>
            </HomeVisitsSupportLabeledField>

            <HomeVisitsSupportLabeledField isRequired label={t('home_visits_support_form_country_region_label')}>
              <SupportIssueDropdown
                onChange={setCountryRegion}
                options={countryRegionOptions}
                placeholder={t('home_visits_support_form_country_region_placeholder')}
                sheetTitle={t('home_visits_support_issue_select_title')}
                value={countryRegion}
              />
            </HomeVisitsSupportLabeledField>

            <HomeVisitsSupportLabeledField label={t('home_visits_support_form_mobile_number_label')}>
              <View style={[styles.inputField, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <TextInput
                  keyboardType="phone-pad"
                  onChangeText={setMobileNumber}
                  placeholder={t('home_visits_support_form_mobile_number_placeholder')}
                  placeholderTextColor={colors.mutedText}
                  style={[styles.input, { color: colors.text, fontSize: typography.size.md2 }]}
                  value={mobileNumber}
                />
              </View>
            </HomeVisitsSupportLabeledField>

            <HomeVisitsSupportLabeledField isRequired label={t('home_visits_support_form_business_name_label')}>
              <View style={[styles.inputField, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <TextInput
                  onChangeText={setBusinessName}
                  placeholder=" "
                  placeholderTextColor={colors.mutedText}
                  style={[styles.input, { color: colors.text, fontSize: typography.size.md2 }]}
                  value={businessName}
                />
              </View>
            </HomeVisitsSupportLabeledField>

            <HomeVisitsSupportLabeledField isRequired label={t('home_visits_support_form_business_type_label')}>
              <SupportIssueDropdown
                onChange={setBusinessType}
                options={businessTypeOptions}
                placeholder={t('home_visits_support_form_business_type_placeholder')}
                sheetTitle={t('home_visits_support_issue_select_title')}
                value={businessType}
              />
            </HomeVisitsSupportLabeledField>

            <HomeVisitsSupportLabeledField isRequired label={t('home_visits_support_form_team_size_label')}>
              <SupportIssueDropdown
                onChange={setTeamSize}
                options={teamSizeOptions}
                placeholder={t('home_visits_support_form_team_size_placeholder')}
                sheetTitle={t('home_visits_support_issue_select_title')}
                value={teamSize}
              />
            </HomeVisitsSupportLabeledField>
          </>
        ) : null}

        <HomeVisitsSupportLabeledField isRequired label={t('home_visits_support_form_reason_label')}>
          <SupportIssueDropdown
            onChange={setReasonValue}
            options={reasonOptions}
            placeholder={t('home_visits_support_form_reason_placeholder')}
            sheetTitle={t('home_visits_support_issue_select_title')}
            value={reasonValue}
          />
        </HomeVisitsSupportLabeledField>

        <HomeVisitsSupportLabeledField
          isRequired
          label={
            isBusinessJoiningFlow
              ? t('home_visits_support_form_business_description_label')
              : isAppointmentSupportFlow
                ? t('home_visits_support_form_appointment_description_label')
                : t('home_visits_support_form_description_label')
          }
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
                placeholder={t('home_visits_support_form_description_placeholder')}
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
        </HomeVisitsSupportLabeledField>

        {!isBusinessJoiningFlow ? <HomeVisitsSupportAttachmentDropzone /> : null}
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
          disabled={!isFormValid || createSupportTicketMutation.isPending}
          isLoading={createSupportTicketMutation.isPending}
          label={t('home_visits_support_form_send_email')}
          onPress={handleSubmit}
          style={styles.footerButton}
          variant={isFormValid ? 'primary' : 'secondary'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
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
