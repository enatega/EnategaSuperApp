import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Button from '../../../../general/components/Button';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import SupportAttachmentDropzone from '../../components/support/SupportAttachmentDropzone';
import SupportHeader from '../../components/support/SupportHeader';
import SupportIssueDropdown from '../../components/support/SupportIssueDropdown';
import SupportLabeledField from '../../components/support/SupportLabeledField';
import { SupportHomeNavigationProp, SupportNavigationParamList } from '../../navigation/supportNavigationTypes';

type SupportContactFormRouteProp = RouteProp<SupportNavigationParamList, 'SupportContactForm'>;

export default function SupportContactFormScreen() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation<SupportHomeNavigationProp>();
  const route = useRoute<SupportContactFormRouteProp>();
  const [email, setEmail] = useState('');
  const [issueValue, setIssueValue] = useState(route.params.issueValue);
  const [reasonValue, setReasonValue] = useState<string>();
  const [description, setDescription] = useState('');

  const howCanWeHelpOptions = useMemo(
    () => [
      { value: 'order', label: t('support_issue_order') },
      { value: 'payment', label: t('support_issue_payment') },
      { value: 'delivery', label: t('support_issue_delivery') },
      { value: 'account', label: t('support_issue_account') },
    ],
    [t],
  );

  const reasonOptions = useMemo(
    () => [
      { value: 'login', label: t('support_form_reason_login') },
      { value: 'billing', label: t('support_form_reason_billing') },
      { value: 'other', label: t('support_form_reason_other') },
    ],
    [t],
  );

  const selectedIssueLabel =
    howCanWeHelpOptions.find((option) => option.value === issueValue)?.label ?? route.params.issueLabel;

  const isFormValid = Boolean(email.trim() && reasonValue && description.trim());

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SupportHeader
        title={t('support_title')}
        rightAccessibilityLabel={t('support_close_action')}
        rightIconName="close-outline"
        onRightPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SupportLabeledField label={t('support_form_how_help_label')}>
          <SupportIssueDropdown
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

        <SupportLabeledField label={t('support_form_reason_label')} isRequired>
          <SupportIssueDropdown
            options={reasonOptions}
            placeholder={t('support_form_reason_placeholder')}
            value={reasonValue}
            onChange={setReasonValue}
          />
        </SupportLabeledField>

        <SupportLabeledField label={t('support_form_description_label')} isRequired>
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

        <SupportAttachmentDropzone />
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <Button
          label={t('support_form_send_email')}
          disabled={!isFormValid}
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
    paddingBottom: 12,
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
