import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import Text from '../../components/Text';
import { useTheme } from '../../theme/theme';
import { useAppTheme, type ThemeMode } from '../../theme/ThemeProvider';

type ColorModeOption = {
  value: ThemeMode;
  labelKey: string;
};

const COLOR_MODE_OPTIONS: ColorModeOption[] = [
  { value: 'system', labelKey: 'color_mode_system' },
  { value: 'light', labelKey: 'color_mode_light' },
  { value: 'dark', labelKey: 'color_mode_dark' },
];

export default function ColorModeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('general');
  const { themeMode, setThemeMode } = useAppTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('color_mode_title')} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="subtitle" weight="bold" color={colors.text} style={styles.sectionLabel}>
          {t('color_mode_section_label')}
        </Text>

        <View style={[styles.optionList, { borderColor: colors.border }]}>
          {COLOR_MODE_OPTIONS.map((option, index) => {
            const isSelected = themeMode === option.value;
            const isLast = index === COLOR_MODE_OPTIONS.length - 1;

            return (
              <Pressable
                key={option.value}
                onPress={() => { void setThemeMode(option.value); }}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={t(option.labelKey)}
                style={({ pressed }) => [
                  styles.option,
                  !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border },
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Text variant="body" color={colors.text}>
                  {t(option.labelKey)}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  optionList: {
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 12,
    overflow: 'hidden',
  },
  screen: { flex: 1 },
  scrollView: { flex: 1 },
  sectionLabel: {
    marginTop: 4,
  },
});
