import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import ScreenHeader from '../../../../../general/components/ScreenHeader';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import i18n, { type SupportedLanguage } from '../../../../../general/localization/i18n';

const LANGUAGE_STORAGE_KEY = 'super_app_language';

type LanguageOption = {
  code: SupportedLanguage;
  labelKey: string;
};

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', labelKey: 'language_english' },
  { code: 'fr', labelKey: 'language_french' },
];

export default function LanguageScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const [selected, setSelected] = useState<SupportedLanguage>(
    (i18n.language as SupportedLanguage) ?? 'en',
  );

  const handleSelect = useCallback(async (code: SupportedLanguage) => {
    setSelected(code);
    await i18n.changeLanguage(code);
    await SecureStore.setItemAsync(LANGUAGE_STORAGE_KEY, code);
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('language_title')} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="subtitle" weight="bold" color={colors.text} style={styles.sectionLabel}>
          {t('language_section_label')}
        </Text>

        <View style={[styles.optionList, { borderColor: colors.border }]}>
          {LANGUAGE_OPTIONS.map((option, index) => {
            const isSelected = selected === option.code;
            const isLast = index === LANGUAGE_OPTIONS.length - 1;

            return (
              <Pressable
                key={option.code}
                onPress={() => { void handleSelect(option.code); }}
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
