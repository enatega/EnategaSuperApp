import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Button from '../../../general/components/Button';
import ModeSelectorHeader from '../../../general/components/ModeSelectorHeader';
import Text from '../../../general/components/Text';
import { useTheme } from '../../../general/theme/theme';
import { resetToSharedHome } from '../../../general/navigation/rootNavigation';
import {
  mapHomeVisitModeToRoute,
  setHomeVisitModePreference,
} from '../navigation/homeVisitModePreference';
import type { HomeVisitsMode } from '../navigation/types';

type HomeVisitsModeCard = {
  key: HomeVisitsMode;
  titleKey: 'single_vendor_title' | 'multi_vendor_title' | 'chain_title';
  descKey: 'single_vendor_desc' | 'multi_vendor_desc' | 'chain_desc';
  chipKey: 'single_vendor_chip' | 'multi_vendor_chip' | 'chain_chip';
  statLabelKey: 'single_vendor_stat' | 'multi_vendor_stat' | 'chain_stat';
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  accentColor: string;
  softColor: string;
  gradient: readonly [string, string];
};

export default function HomeVisitsHomeScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { t } = useTranslation('homeVisits');
  const insets = useSafeAreaInsets();

  const cards: HomeVisitsModeCard[] = [
    {
      key: 'singleVendor',
      titleKey: 'single_vendor_title',
      descKey: 'single_vendor_desc',
      chipKey: 'single_vendor_chip',
      statLabelKey: 'single_vendor_stat',
      icon: 'home-city-outline',
      accentColor: colors.primary,
      softColor: colors.blue50,
      gradient: [colors.bannerGradientStart, colors.bannerGradientEnd],
    },
    {
      key: 'multiVendor',
      titleKey: 'multi_vendor_title',
      descKey: 'multi_vendor_desc',
      chipKey: 'multi_vendor_chip',
      statLabelKey: 'multi_vendor_stat',
      icon: 'account-group-outline',
      accentColor: colors.success,
      softColor: colors.cardMint,
      gradient: [colors.success, colors.successText],
    },
    {
      key: 'chain',
      titleKey: 'chain_title',
      descKey: 'chain_desc',
      chipKey: 'chain_chip',
      statLabelKey: 'chain_stat',
      icon: 'office-building-cog-outline',
      accentColor: colors.secondary,
      softColor: colors.cardLavender,
      gradient: [colors.secondary, colors.primaryDark],
    },
  ];

  const handleSelect = React.useCallback(
    async (mode: HomeVisitsMode) => {
      await setHomeVisitModePreference(mode);
      navigation.reset({
        index: 0,
        routes: [{ name: mapHomeVisitModeToRoute(mode) }],
      });
    },
    [navigation],
  );

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + 16,
          paddingBottom: Math.max(insets.bottom, 24),
        },
      ]}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <ModeSelectorHeader
        backAccessibilityLabel={t('mode_selector_back_label')}
        onBack={resetToSharedHome}
        subtitle={t('header_subtitle')}
        title={t('section_title')}
      />

      <View style={styles.cardGroup}>
        {cards.map((card) => (
          <Pressable
            key={card.key}
            onPress={() => {
              void handleSelect(card.key);
            }}
            style={({ pressed }) => [
              styles.modeCardPressable,
              { opacity: pressed ? 0.96 : 1 },
            ]}
          >
            <View
              style={[
                styles.modeCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  shadowColor: colors.shadowColor,
                },
              ]}
            >
              <LinearGradient
                colors={card.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardAccent}
              />

              <View style={styles.cardHeaderRow}>
                <View
                  style={[styles.iconWrap, { backgroundColor: card.softColor }]}
                >
                  <MaterialCommunityIcons
                    name={card.icon}
                    size={28}
                    color={card.accentColor}
                  />
                </View>

                <View style={styles.cardHeaderContent}>
                  <View
                    style={[styles.chip, { backgroundColor: card.softColor }]}
                  >
                    <Text
                      variant="caption"
                      weight="semiBold"
                      color={card.accentColor}
                    >
                      {t(card.chipKey)}
                    </Text>
                  </View>
                  <Text variant="subtitle" weight="bold" style={styles.cardTitle}>
                    {t(card.titleKey)}
                  </Text>
                </View>
              </View>

              <Text
                variant="body"
                color={colors.mutedText}
                style={styles.cardDescription}
              >
                {t(card.descKey)}
              </Text>

              <View style={styles.metaRow}>
                <View
                  style={[
                    styles.metaBadge,
                    { backgroundColor: colors.backgroundTertiary },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="check-decagram-outline"
                    size={16}
                    color={card.accentColor}
                  />
                  <Text
                    variant="caption"
                    weight="semiBold"
                    color={colors.text}
                    style={styles.metaBadgeText}
                  >
                    {t(card.statLabelKey)}
                  </Text>
                </View>
              </View>

              <Button
                label={t('explore_button')}
                onPress={() => {
                  void handleSelect(card.key);
                }}
                style={[
                  styles.button,
                  {
                    backgroundColor: card.accentColor,
                    borderColor: card.accentColor,
                  },
                ]}
                icon={
                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={18}
                    color={colors.white}
                  />
                }
              />
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: 20,
    paddingHorizontal: 20,
  },
  cardGroup: {
    gap: 16,
  },
  modeCardPressable: {
    width: '100%',
  },
  modeCard: {
    borderRadius: 28,
    borderWidth: 1,
    gap: 18,
    overflow: 'hidden',
    padding: 20,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
  cardAccent: {
    borderRadius: 999,
    height: 6,
    width: 86,
  },
  cardHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 20,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  cardHeaderContent: {
    flex: 1,
    gap: 8,
  },
  chip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  cardTitle: {
    letterSpacing: -0.4,
  },
  cardDescription: {
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
  },
  metaBadge: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  metaBadgeText: {
    flexShrink: 1,
  },
  button: {
    marginTop: 2,
  },
});
