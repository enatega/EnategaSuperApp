import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../general/theme/theme';
import { mockImages } from '../general/utils/mockImages';
import { serviceTypeIcons } from '../general/assets/images';
import HomeHeader from './home/HomeHeader';
import OurServicesSection from './home/OurServicesSection';
import ServiceTypeSection from './home/ServiceTypeSection';
import RecommendedSection from './home/RecommendedSection';
import { MiniAppId } from '../general/utils/constants';

type Props = {
  onSelectMiniApp?: (id: MiniAppId) => void;
};

export default function HomeScreen({ onSelectMiniApp }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('general');
  const { t: tDeliveries } = useTranslation('deliveries');

  const bannerItems = [
    {
      id: 'banner-1',
      title: t('special_title'),
      discountLabel: t('special_offer_label'),
      description: t('special_description'),
      percent: t('special_percent'),
    },
    {
      id: 'banner-2',
      title: t('special_title'),
      discountLabel: t('special_offer_label'),
      description: t('special_description'),
      percent: t('special_percent'),
    },
  ];

  const serviceTypes = [
    {
      id: 'single',
      title: tDeliveries('type_single_vendor_title'),
      description: tDeliveries('type_single_vendor_desc'),
      icon: serviceTypeIcons.singleStore,
    },
    {
      id: 'marketplace',
      title: tDeliveries('type_marketplace_title'),
      description: tDeliveries('type_marketplace_desc'),
      icon: serviceTypeIcons.multiStore,
    },
    {
      id: 'chain',
      title: tDeliveries('type_chain_title'),
      description: tDeliveries('type_chain_desc'),
      icon: serviceTypeIcons.chainStore,
    },
  ];

  const recommendations = [
    {
      id: 'rec-1',
      title: t('recommended_name'),
      rating: 4.1,
      reviews: 5000,
      price: 25,
      image: mockImages.recommendationOne,
    },
    {
      id: 'rec-2',
      title: t('recommended_name'),
      rating: 4.1,
      reviews: 5000,
      price: 25,
      image: mockImages.recommendationTwo,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.heroBackground, { backgroundColor: colors.homeHeaderBackground }]} />
      <SafeAreaView style={styles.safeArea}>
        <HomeHeader items={bannerItems} />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <OurServicesSection onSelectMiniApp={onSelectMiniApp} />
          <ServiceTypeSection items={serviceTypes} />
          <RecommendedSection items={recommendations} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 18,
    paddingTop: 8,
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 210,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
});
