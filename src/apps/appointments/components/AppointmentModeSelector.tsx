import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import ModeSelectorHeader from '../../../general/components/ModeSelectorHeader';
import Text from '../../../general/components/Text';
import { useTheme } from '../../../general/theme/theme';
import type { AppointmentsMode } from '../stores/useAppointmentsConfigStore';

type Props = {
  onBack: () => void;
  onSelect: (mode: AppointmentsMode) => void;
};

type ModeCard = {
  mode: AppointmentsMode;
  titleKey: 'single_vendor_label' | 'multi_vendor_label' | 'chain_label';
  descriptionKey:
    | 'single_vendor_mode_description'
    | 'multi_vendor_mode_description'
    | 'chain_mode_description';
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  accent: 'primary' | 'success' | 'secondary';
  background: 'blue50' | 'cardMint' | 'cardLavender';
};

const MODE_CARDS: ModeCard[] = [
  {
    mode: 'singleVendor',
    titleKey: 'single_vendor_label',
    descriptionKey: 'single_vendor_mode_description',
    icon: 'storefront-outline',
    accent: 'primary',
    background: 'blue50',
  },
  {
    mode: 'multiVendor',
    titleKey: 'multi_vendor_label',
    descriptionKey: 'multi_vendor_mode_description',
    icon: 'account-group-outline',
    accent: 'success',
    background: 'cardMint',
  },
  {
    mode: 'chain',
    titleKey: 'chain_label',
    descriptionKey: 'chain_mode_description',
    icon: 'office-building-outline',
    accent: 'secondary',
    background: 'cardLavender',
  },
];

export default function AppointmentModeSelector({ onBack, onSelect }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('appointments');
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + 20,
          paddingBottom: Math.max(insets.bottom, 24),
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <ModeSelectorHeader
        backAccessibilityLabel={t('mode_selector_back_label')}
        onBack={onBack}
        subtitle={t('mode_selector_subtitle')}
        title={t('mode_selector_title')}
      />

      <View style={styles.cards}>
        {MODE_CARDS.map((card) => {
          const accentColor = colors[card.accent];
          const softColor = colors[card.background];

          return (
            <Pressable
              key={card.mode}
              accessibilityRole="button"
              accessibilityLabel={t(card.titleKey)}
              onPress={() => onSelect(card.mode)}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: pressed ? accentColor : colors.border,
                  opacity: pressed ? 0.92 : 1,
                  shadowColor: colors.shadowColor,
                },
              ]}
            >
              <View style={[styles.icon, { backgroundColor: softColor }]}>
                <MaterialCommunityIcons
                  name={card.icon}
                  size={30}
                  color={accentColor}
                />
              </View>

              <View style={styles.cardCopy}>
                <Text variant="subtitle" weight="bold">
                  {t(card.titleKey)}
                </Text>
                <Text variant="caption" color={colors.mutedText}>
                  {t(card.descriptionKey)}
                </Text>
              </View>

              <MaterialCommunityIcons
                name="chevron-right"
                size={26}
                color={accentColor}
              />
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: 28,
    paddingHorizontal: 20,
  },
  cards: {
    gap: 16,
  },
  card: {
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 1,
    elevation: 2,
    flexDirection: 'row',
    gap: 16,
    minHeight: 116,
    padding: 18,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  icon: {
    alignItems: 'center',
    borderRadius: 18,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  cardCopy: {
    flex: 1,
    gap: 6,
  },
});
