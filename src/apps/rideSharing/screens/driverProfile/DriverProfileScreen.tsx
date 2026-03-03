import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '../../../../general/theme/theme';
import ScreenHeader from '../../../../general/components/ScreenHeader';

import { DRIVER_DATA } from '../../components/driverProfile/mockData';
import ProfileHeroCard from '../../components/driverProfile/ProfileHeroCard';
import RatingSummary from '../../components/driverProfile/RatingSummary';
import ReviewCard from '../../components/driverProfile/ReviewCard';

export default function DriverProfileScreen() {
  const { colors } = useTheme();
  const data = DRIVER_DATA;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeroCard data={data} />

        <RatingSummary
          averageRating={data.averageRating}
          totalReviews={data.totalReviews}
          ratingBreakdown={data.ratingBreakdown}
        />

        <View style={styles.reviewsList}>
          {data.reviews.map((review, index) => (
            <ReviewCard
              key={`${review.reviewerId}-${review.createdAt}-${index}`}
              review={review}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
    gap: 12,
  },
  reviewsList: {
    gap: 10,
    paddingHorizontal: 16,
  },
});
