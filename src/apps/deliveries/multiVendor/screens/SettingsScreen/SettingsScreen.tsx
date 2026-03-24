import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../../../general/theme/theme';
import ScreenHeader from '../../../../../general/components/ScreenHeader';
import Text from '../../../../../general/components/Text';
import Button from '../../../../../general/components/Button';
import ProfileMenuSection from '../../components/profile/ProfileMenuSection';
import ProfileMenuItem from '../../components/profile/ProfileMenuItem';

const ICON_SIZE = 20;

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const iconColor = colors.text;

  const handleDeleteAccount = () => {
    // TODO: implement delete account confirmation
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('settings_title')} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileMenuSection>
          <ProfileMenuItem
            icon={<Ionicons name="notifications-outline" size={ICON_SIZE} color={iconColor} />}
            label={t('settings_notifications')}
            onPress={() => navigation.navigate('NotificationSettings' as never)}
          />
          <ProfileMenuItem
            icon={<Ionicons name="key-outline" size={ICON_SIZE} color={iconColor} />}
            label={t('settings_change_password')}
          />
          <ProfileMenuItem
            icon={<Ionicons name="shield-outline" size={ICON_SIZE} color={iconColor} />}
            label={t('settings_privacy_policy')}
            onPress={() => navigation.navigate('PrivacyPolicy' as never)}
          />
          <ProfileMenuItem
            icon={<Ionicons name="document-text-outline" size={ICON_SIZE} color={iconColor} />}
            label={t('settings_terms_of_service')}
            onPress={() => navigation.navigate('TermsOfService' as never)}
          />
          <ProfileMenuItem
            icon={<Ionicons name="document-outline" size={ICON_SIZE} color={iconColor} />}
            label={t('settings_terms_of_use')}
            onPress={() => navigation.navigate('TermsOfUse' as never)}
          />
        </ProfileMenuSection>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: insets.bottom + 12,
          },
        ]}
      >
        <Button
          label={t('settings_delete_account')}
          onPress={handleDeleteAccount}
          variant="danger"
        />
        <Text variant="caption" color={colors.mutedText} style={styles.version}>
          {t('settings_app_version')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  footer: {
    borderTopWidth: 1,
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  screen: { flex: 1 },
  scrollView: { flex: 1 },
  version: {
    textAlign: 'center',
  },
});
