import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import Text from '../../components/Text';
import { showToast } from '../../components/AppToast';
import { useNotificationSettingsQuery } from '../../hooks/useNotificationSettingsQuery';
import { useUpdateNotificationSettingsMutation } from '../../hooks/useUpdateNotificationSettingsMutation';
import type { UpdateNotificationSettingsPayload } from '../../api/settingsService';
import NotificationToggleRow from '../../components/settings/NotificationToggleRow';
import type { SettingsAppPrefix } from '../../api/settingsService';

type SettingKey = keyof UpdateNotificationSettingsPayload;

type Props = {
  appPrefix: SettingsAppPrefix;
};

export default function NotificationSettingsScreen({ appPrefix }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('general');

  const { data, isLoading: isFetching } = useNotificationSettingsQuery(appPrefix);
  const settings = data?.data;

  const { mutate, isPending, variables } = useUpdateNotificationSettingsMutation(
    appPrefix,
    {
      onError: (error) => {
        showToast.error(t('notif_settings_error_title'), error.message);
      },
    },
  );

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
    return (settings?.[key as keyof typeof settings] as boolean) ?? false;
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
