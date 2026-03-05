import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import SettingsItem from '../../components/settings/SettingsItem';
import { useLocalization } from '../../../../general/localization/LocalizationProvider';
import { useAppTheme } from '../../../../general/theme/ThemeProvider';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';

type NavigationProp = NativeStackNavigationProp<RideSharingStackParamList, 'Settings'>;

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const navigation = useNavigation<NavigationProp>();
  
  const { language } = useLocalization();
  const { themeMode } = useAppTheme();

  // Helper strings to map values nicely
  const languageLabel = language === 'fr' ? t('settings_language_fr') : t('settings_language_en');
  
  let modeLabel = t('settings_theme_system');
  if (themeMode === 'light') modeLabel = t('settings_theme_light');
  if (themeMode === 'dark') modeLabel = t('settings_theme_dark');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text variant="title" weight="bold" color={colors.text}>
            {t('settings_title')}
          </Text>
          <Text variant="body" color={colors.mutedText} style={styles.description}>
            {t('settings_subtitle')}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.backgroundTertiary }]}>
          <SettingsItem
            icon="key-outline"
            title={t('settings_update_password')}
            onPress={() => navigation.navigate('UpdatePassword')}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsItem
            icon="globe-outline"
            title={t('settings_language')}
            value={languageLabel}
            onPress={() => navigation.navigate('Language')}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsItem
            icon="moon-outline"
            title={t('settings_theme')}
            value={modeLabel}
            onPress={() => navigation.navigate('Appearance')}
          />
        </View>

        <View style={{ height: 8 }} />

        <View style={[styles.card, { backgroundColor: colors.backgroundTertiary, marginBottom: 0 }]}>
          <SettingsItem
            icon="document-text-outline"
            title={t('settings_terms')}
            onPress={() => navigation.navigate('RulesAndTerms')}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsItem
            icon="shield-checkmark-outline"
            title={t('settings_privacy')}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          />
        </View>
        
        <View style={styles.versionContainer}>
          <Text variant="caption" color={colors.mutedText} style={styles.versionText}>
            App version
          </Text>
          <Text variant="caption" color={colors.mutedText} style={styles.versionText}>
            2.234.5.3 (3214)
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 24,
    gap: 4,
  },
  description: {
    opacity: 0.7,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  divider: {
    height: 1,
  },
  versionContainer: {
    marginTop: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  versionText: {
    textAlign: 'center',
  },
});
