import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '../../../../general/theme/theme';
import ScreenHeader from '../../../../general/components/ScreenHeader';

import { DRIVER_DATA } from '../../components/driverProfile/mockData';
import ProfileHeroCard from '../../components/driverProfile/ProfileHeroCard';
import RatingSummary from '../../components/driverProfile/RatingSummary';
import ReviewCard from '../../components/driverProfile/ReviewCard';
import DriverProfileSkeleton from '../../components/driverProfile/DriverProfileSkeleton';

export default function DriverProfileScreen() {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const data = DRIVER_DATA;

  useEffect(() => {
    // Simulate network delay to see the skeleton
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DriverProfileSkeleton />;
  }

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
