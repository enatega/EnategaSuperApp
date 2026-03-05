import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import SettingsItem from '../../components/settings/SettingsItem';
import { useLocalization } from '../../../../general/localization/LocalizationProvider';
import type { SupportedLanguage } from '../../../../general/localization/i18n';

export default function LanguageScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const { language, setLanguage } = useLocalization();

  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader />
      <View style={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="title" weight="bold" color={colors.text}>
            {t('settings_language')}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <SettingsItem
            title={t('settings_language_en')}
            isSelected={language === 'en'}
            onPress={() => handleSelectLanguage('en')}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsItem
            title={t('settings_language_fr')}
            isSelected={language === 'fr'}
            onPress={() => handleSelectLanguage('fr')}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  header: {
    marginBottom: 32,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    // paddingHorizontal: 16,
  },
  divider: {
    height: 1,
  },
});
