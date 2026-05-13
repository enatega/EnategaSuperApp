import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import { useTranslation } from 'react-i18next';

type ServiceTab = {
  id: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  titleKey: string;
  subtitleKey: string;
};

const SERVICE_TABS: ServiceTab[] = [
  {
    id: 'ride',
    icon: 'car-outline',
    titleKey: 'multi_vendor_home_service_ride_title',
    subtitleKey: 'multi_vendor_home_service_ride_subtitle',
  },
  {
    id: 'deliveries',
    icon: 'basket-outline',
    titleKey: 'multi_vendor_home_service_deliveries_title',
    subtitleKey: 'multi_vendor_home_service_deliveries_subtitle',
  },
  {
    id: 'courier',
    icon: 'package-variant-closed',
    titleKey: 'multi_vendor_home_service_courier_title',
    subtitleKey: 'multi_vendor_home_service_courier_subtitle',
  },
];

export default function AllInOneHomeHero() {
  const { t } = useTranslation('deliveries');
  const { colors, typography } = useTheme();

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.greetingText, { color: colors.text, fontSize: typography.size.sm2 }]} weight="medium">
        {t('multi_vendor_home_greeting')}
      </Text>
      <Text style={[styles.headingText, { color: colors.text, fontSize: typography.size.h5 }]} weight="bold">
        {t('multi_vendor_home_heading')}
      </Text>

      <LinearGradient
        colors={[colors.bannerGradientStart, colors.bannerGradientEnd]}
        start={{ x: 0.1, y: 0.2 }}
        end={{ x: 0.9, y: 0.9 }}
        style={styles.promoBanner}
      >
        <View style={styles.promoHeaderRow}>
          <View style={styles.promoTitleGroup}>
            <Text style={[styles.promoDiscount, { color: colors.white }]} weight="semiBold">
              {t('multi_vendor_home_offer_label')}
            </Text>
            <Text style={[styles.promoTitle, { color: colors.white }]} weight="extraBold">
              {t('multi_vendor_home_offer_title')}
            </Text>
          </View>
          <Text style={[styles.promoPercent, { color: colors.white }]} weight="extraBold">
            {t('multi_vendor_home_offer_percent')}
          </Text>
        </View>
        <Text style={[styles.promoBody, { color: colors.white }]}>
          {t('multi_vendor_home_offer_body')}
        </Text>
      </LinearGradient>
      <View style={styles.pagerRow}>
        <View style={[styles.pagerActive, { backgroundColor: colors.iconMuted }]} />
        <View style={[styles.pagerDot, { backgroundColor: colors.iconDisabled }]} />
        <View style={[styles.pagerDot, { backgroundColor: colors.iconDisabled }]} />
      </View>

      <View style={styles.tabRow}>
        {SERVICE_TABS.map((tab) => (
          <View key={tab.id} style={[styles.tabCard, { backgroundColor: colors.blue50 }]}>
            <View style={[styles.tabIconWrap, { backgroundColor: colors.white }]}>
              <MaterialCommunityIcons name={tab.icon} size={30} color={colors.primary} />
            </View>
            <Text style={[styles.tabTitle, { color: colors.text }]} weight="semiBold">
              {t(tab.titleKey)}
            </Text>
            <Text style={[styles.tabSubtitle, { color: colors.mutedText }]} numberOfLines={2}>
              {t(tab.subtitleKey)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  greetingText: {
    fontSize: 14,
    lineHeight: 22,
  },
  headingText: {
    fontSize: 20,
    lineHeight: 32,
  },
  promoBanner: {
    borderRadius: 12,
    gap: 12,
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  promoHeaderRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  promoTitleGroup: {
    gap: 2,
  },
  promoDiscount: {
    fontSize: 12,
    lineHeight: 18,
  },
  promoTitle: {
    fontSize: 18,
    lineHeight: 22,
  },
  promoPercent: {
    fontSize: 24,
    lineHeight: 28,
  },
  promoBody: {
    fontSize: 14,
    lineHeight: 22,
    maxWidth: '85%',
  },
  pagerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    marginTop: -2,
  },
  pagerActive: {
    borderRadius: 50,
    height: 6,
    width: 18,
  },
  pagerDot: {
    borderRadius: 50,
    height: 6,
    width: 6,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tabCard: {
    alignItems: 'center',
    borderRadius: 16,
    flex: 1,
    gap: 6,
    minHeight: 128,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  tabIconWrap: {
    alignItems: 'center',
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    width: 64,
  },
  tabTitle: {
    fontSize: 16,
    lineHeight: 16,
  },
  tabSubtitle: {
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
  },
});
