import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  useNavigation,
  type NavigationProp,
} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import SettingsScreen, {
  type SettingsMenuItem,
} from '../../../../general/screens/settings/SettingsScreen';
import { useTheme } from '../../../../general/theme/theme';
import type { HomeVisitsStackParamList } from '../../navigation/types';

const ICON_SIZE = 20;

export default function HomeVisitsSettingsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('general');
  const navigation = useNavigation<NavigationProp<HomeVisitsStackParamList>>();
  const iconColor = colors.text;

  const menuSections: SettingsMenuItem[][] = [
    [
      {
        key: 'notifications',
        icon: (
          <Ionicons
            name="notifications-outline"
            size={ICON_SIZE}
            color={iconColor}
          />
        ),
        label: t('settings_notifications'),
        onPress: () => navigation.navigate('NotificationSettings'),
      },
      {
        key: 'change-password',
        icon: <Ionicons name="key-outline" size={ICON_SIZE} color={iconColor} />,
        label: t('settings_change_password'),
        onPress: () => navigation.navigate('ChangePassword'),
      },
      {
        key: 'privacy-policy',
        icon: <Ionicons name="shield-outline" size={ICON_SIZE} color={iconColor} />,
        label: t('settings_privacy_policy'),
        onPress: () => navigation.navigate('PrivacyPolicy'),
      },
      {
        key: 'terms-of-service',
        icon: (
          <Ionicons
            name="document-text-outline"
            size={ICON_SIZE}
            color={iconColor}
          />
        ),
        label: t('settings_terms_of_service'),
        onPress: () => navigation.navigate('TermsOfService'),
      },
      {
        key: 'terms-of-use',
        icon: <Ionicons name="document-outline" size={ICON_SIZE} color={iconColor} />,
        label: t('settings_terms_of_use'),
        onPress: () => navigation.navigate('TermsOfUse'),
      },
    ],
  ];

  return (
    <SettingsScreen
      deleteActionLabel={t('settings_delete_account')}
      menuSections={menuSections}
      onPressDeleteAccount={() => navigation.navigate('DeleteAccount')}
      versionLabel={t('settings_app_version')}
    />
  );
}
