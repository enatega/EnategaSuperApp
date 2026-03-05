import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import SettingsItem from '../../components/settings/SettingsItem';
import { useAppTheme, ThemeMode } from '../../../../general/theme/ThemeProvider';

export default function AppearanceScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const { themeMode, setThemeMode } = useAppTheme();

  const handleSelectMode = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader />
      <View style={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="title" weight="bold" color={colors.text}>
            {t('settings_theme')}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <SettingsItem
            title={t('settings_theme_system')}
            isSelected={themeMode === 'system'}
            onPress={() => handleSelectMode('system')}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsItem
            title={t('settings_theme_light')}
            isSelected={themeMode === 'light'}
            onPress={() => handleSelectMode('light')}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsItem
            title={t('settings_theme_dark')}
            isSelected={themeMode === 'dark'}
            onPress={() => handleSelectMode('dark')}
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
