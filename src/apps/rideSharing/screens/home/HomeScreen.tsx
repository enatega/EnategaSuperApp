import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../general/theme/theme';
import HomeHeader from '../../../../screens/home/HomeHeader';
import RideOptionsSection from '../../components/RideOptionsSection';
import DeliveryServicesSection from '../../components/DeliveryServicesSection';
import RecommendedSection from '../../../../screens/home/RecommendedSection';

const recommendationImageOne = 'https://www.figma.com/api/mcp/asset/651c88ad-0287-4bc1-8f06-492da512be4b';
const recommendationImageTwo = 'https://www.figma.com/api/mcp/asset/498bbad1-818d-450a-ae02-e885a587ded5';

export default function RideSharingHomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('general');

  const recommendations = [
    {
      id: 'rec-1',
      title: t('recommended_name'),
      rating: 4.1,
      reviews: 5000,
      price: 25,
      image: recommendationImageOne,
    },
    {
      id: 'rec-2',
      title: t('recommended_name_secondary'),
      rating: 4.1,
      reviews: 5000,
      price: 25,
      image: recommendationImageTwo,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HomeHeader  />
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <RideOptionsSection />
          <DeliveryServicesSection />
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
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 24,
    paddingTop: 0,
  },
});

