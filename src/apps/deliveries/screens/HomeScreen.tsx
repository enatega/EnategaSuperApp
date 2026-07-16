import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../../general/components/Button';
import Text from '../../../general/components/Text';
import { useTheme } from '../../../general/theme/theme';
import { useTranslation } from 'react-i18next';

type DeliveryMode = 'singleVendor' | 'multiVendor' | 'chain';

type Props = {
  onSelect: (type: DeliveryMode) => void;
};

type DeliveryModeCard = {
  key: DeliveryMode;
  titleKey: 'single_vendor_title' | 'multi_vendor_title' | 'chain_title';
  descKey: 'single_vendor_desc' | 'multi_vendor_desc' | 'chain_desc';
  chipKey: 'single_vendor_chip' | 'multi_vendor_chip' | 'chain_chip';
  statLabelKey: 'single_vendor_stat' | 'multi_vendor_stat' | 'chain_stat';
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  accentColor: string;
  softColor: string;
  gradient: readonly [string, string];
};

export default function DeliveriesHomeScreen({ onSelect }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const insets = useSafeAreaInsets();

  const cards: DeliveryModeCard[] = [
    {
      key: 'singleVendor',
      titleKey: 'single_vendor_title',
      descKey: 'single_vendor_desc',
      chipKey: 'single_vendor_chip',
      statLabelKey: 'single_vendor_stat',
      icon: 'storefront-outline',
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
      icon: 'basket-outline',
      accentColor: '#0F9D7A',
      softColor: colors.cardMint,
      gradient: ['#0F9D7A', '#18B28D'],
    },
    {
      key: 'chain',
      titleKey: 'chain_title',
      descKey: 'chain_desc',
      chipKey: 'chain_chip',
      statLabelKey: 'chain_stat',
      icon: 'office-building-outline',
      accentColor: '#8B5CF6',
      softColor: colors.cardLavender,
      gradient: ['#7C3AED', '#A855F7'],
    },
  ];

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: Math.max(insets.bottom, 24) },
      ]}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
     

      <View style={styles.sectionHeader}>
        <Text variant="subtitle" weight="bold">
          {t('section_title')}
        </Text>
        <Text variant="caption" color={colors.mutedText} style={styles.sectionSubtext}>
          {t('header_subtitle')}
        </Text>
      </View>

      <View style={styles.cardGroup}>
        {cards.map((card) => (
          <Pressable
            key={card.key}
            onPress={() => onSelect(card.key)}
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
                  style={[
                    styles.iconWrap,
                    { backgroundColor: card.softColor },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={card.icon}
                    size={28}
                    color={card.accentColor}
                  />
                </View>

                <View style={styles.cardHeaderContent}>
                  <View
                    style={[
                      styles.chip,
                      { backgroundColor: card.softColor },
                    ]}
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
                <View style={[styles.metaBadge, { backgroundColor: colors.backgroundTertiary }]}>
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
                onPress={() => onSelect(card.key)}
                style={[
                  styles.button,
                  { backgroundColor: card.accentColor, borderColor: card.accentColor },
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
  heroCard: {
    borderRadius: 28,
    borderWidth: 1,
    elevation: 4,
    gap: 14,
    overflow: 'hidden',
    padding: 22,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
  heroBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 8,
  },
  heroBadgeText: {
    letterSpacing: 0.2,
  },
  heroTitle: {
    letterSpacing: -1.2,
  },
  heroSubtitle: {
    maxWidth: '92%',
  },
  heroPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingTop: 2,
  },
  heroPill: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  heroPillText: {
    lineHeight: 16,
  },
  sectionHeader: {
    gap: 4,
    paddingHorizontal: 2,
  },
  sectionSubtext: {
    lineHeight: 20,
  },
  cardGroup: {
    gap: 16,
  },
  modeCardPressable: {
    borderRadius: 24,
  },
  modeCard: {
    borderRadius: 24,
    borderWidth: 1,
    elevation: 3,
    gap: 14,
    overflow: 'hidden',
    padding: 18,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
  },
  cardAccent: {
    borderRadius: 999,
    height: 6,
    width: 74,
  },
  cardHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 18,
    height: 64,
    justifyContent: 'center',
    width: 64,
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
    lineHeight: 28,
  },
  cardDescription: {
    lineHeight: 24,
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
    paddingVertical: 9,
  },
  metaBadgeText: {
    lineHeight: 16,
  },
  button: {
    borderRadius: 16,
    paddingVertical: 14,
  },
});
