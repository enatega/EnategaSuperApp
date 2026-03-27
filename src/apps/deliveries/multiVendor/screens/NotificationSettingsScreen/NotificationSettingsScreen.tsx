import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../../general/theme/theme';
import ScreenHeader from '../../../../../general/components/ScreenHeader';
import Text from '../../../../../general/components/Text';
import { showToast } from '../../../../../general/components/AppToast';
import { useNotificationSettingsQuery } from '../../../hooks/useNotificationSettingsQuery';
import { useUpdateNotificationSettingsMutation } from '../../../hooks/useUpdateNotificationSettingsMutation';
import type { UpdateNotificationSettingsPayload, NotificationSettings } from '../../../api/notificationSettingsService';
import NotificationToggleRow from '../../components/notificationSettings/NotificationToggleRow';

type SettingKey = keyof UpdateNotificationSettingsPayload;

export default function NotificationSettingsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');

  const { data, isLoading: isFetching } = useNotificationSettingsQuery();
  const settings = data?.data;

  const { mutate, isPending, variables } = useUpdateNotificationSettingsMutation({
    onError: (error) => {
      showToast.error(t('notif_settings_error_title'), error.message);
    },
  });

  const handleToggle = (key: SettingKey, value: boolean) => {
    mutate(
      { [key]: value },
      {
        onSuccess: () => {
          showToast.success(t('notif_settings_success_title'), t('notif_settings_success_message'));
        },
      },
    );
  };

  const getValue = (key: SettingKey): boolean => {
    if (isPending && variables && key in variables) {
      return variables[key] as boolean;
    }
    return (settings?.[key as keyof NotificationSettings] as boolean) ?? false;
  };

  const isRowLoading = (key: SettingKey): boolean =>
    isPending && variables != null && key in variables;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('notif_settings_title')} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Food Delivery */}
        <Text variant="body" weight="bold" style={styles.sectionHeading}>
          {t('notif_settings_food_delivery')}
        </Text>

        <NotificationToggleRow
          label={t('notif_settings_sms')}
          value={getValue('food_delivery_sms')}
          isLoading={isFetching || isRowLoading('food_delivery_sms')}
          onToggle={(v) => handleToggle('food_delivery_sms', v)}
        />
        <NotificationToggleRow
          label={t('notif_settings_email')}
          value={getValue('food_delivery_email')}
          isLoading={isFetching || isRowLoading('food_delivery_email')}
          onToggle={(v) => handleToggle('food_delivery_email', v)}
        />
        <NotificationToggleRow
          label={t('notif_settings_whatsapp')}
          value={getValue('food_delivery_whatsapp')}
          isLoading={isFetching || isRowLoading('food_delivery_whatsapp')}
          onToggle={(v) => handleToggle('food_delivery_whatsapp', v)}
        />

        {/* Marketing */}
        <Text variant="body" weight="bold" style={[styles.sectionHeading, styles.sectionHeadingSpaced]}>
          {t('notif_settings_marketing')}
        </Text>

        <NotificationToggleRow
          label={t('notif_settings_email')}
          value={getValue('marketing_email')}
          isLoading={isFetching || isRowLoading('marketing_email')}
          onToggle={(v) => handleToggle('marketing_email', v)}
        />
        <NotificationToggleRow
          label={t('notif_settings_sms')}
          value={getValue('marketing_sms')}
          isLoading={isFetching || isRowLoading('marketing_sms')}
          onToggle={(v) => handleToggle('marketing_sms', v)}
        />
        <NotificationToggleRow
          label={t('notif_settings_whatsapp')}
          value={getValue('marketing_whatsapp')}
          isLoading={isFetching || isRowLoading('marketing_whatsapp')}
          onToggle={(v) => handleToggle('marketing_whatsapp', v)}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  screen: { flex: 1 },
  scrollView: { flex: 1 },
  sectionHeading: {
    fontSize: 16,
    paddingBottom: 4,
    paddingTop: 16,
  },
  sectionHeadingSpaced: {
    marginTop: 16,
  },
});
