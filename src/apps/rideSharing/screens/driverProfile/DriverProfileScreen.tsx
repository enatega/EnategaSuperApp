import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { DriverProfileStats } from '../../api/types';
import DriverInformationSection from '../../components/driverProfile/DriverInformationSection';
import DriverProfileSkeleton from '../../components/driverProfile/DriverProfileSkeleton';
import DriverProfileTabs from '../../components/driverProfile/DriverProfileTabs';
import ProfileHeroCard from '../../components/driverProfile/ProfileHeroCard';
import RatingSummary from '../../components/driverProfile/RatingSummary';
import ReviewCard from '../../components/driverProfile/ReviewCard';
import type { DriverProfileData } from '../../components/driverProfile/types';
import { useDriverStats, useRiderVehicleInfo } from '../../hooks';

type RideSharingParamList = {
  DriverProfile: { userId?: string };
};

type DriverProfileRouteProp = RouteProp<RideSharingParamList, 'DriverProfile'>;

type DriverProfileTab = 'reviews' | 'info';

function toDriverProfileData(stats: DriverProfileStats): DriverProfileData {
  return {
    type: stats.type,
    riderId: stats.riderId,
    joiningTime: stats.joiningTime,
    vehicle: {
      vehicleName: stats.vehicle.vehicleName ?? '',
      vehicleNo: stats.vehicle.vehicleNo ?? '',
      vehicleColor: stats.vehicle.vehicleColor ?? '',
    },
    profile: stats.profile,
    totalRides: stats.totalRides,
    averageRating: stats.averageRating,
    totalReviews: stats.totalReviews,
    ratingBreakdown: stats.ratingBreakdown,
    reviews: stats.reviews,
  };
}

const FALLBACK_USER_ID = '918430de-31cd-41f7-bb13-8297f90c4f5d';

export default function DriverProfileScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const route = useRoute<DriverProfileRouteProp>();
  const [activeTab, setActiveTab] = useState<DriverProfileTab>('reviews');

  const userId = route.params?.userId ?? FALLBACK_USER_ID;
  const { data, isLoading, isError, error, refetch } = useDriverStats(userId);
  const riderId = data?.riderId;
  const riderVehicleInfoQuery = useRiderVehicleInfo(riderId);

  console.log('my userId of driver is :', userId);
  console.log('DriverProfile riderId from stats:', riderId);
  console.log('DriverProfile vehicle-info response:', riderVehicleInfoQuery.data);

  if (isLoading) {
    return <DriverProfileSkeleton />;
  }

  if (isError || !data) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.backgroundTertiary }]}>
        <ScreenHeader style={{ backgroundColor: colors.backgroundTertiary }} />
        <View style={styles.errorContainer}>
          <Text weight="extraBold" style={styles.errorTitle}>
            {t('driver_profile_error_title')}
          </Text>
          <Text style={[styles.errorMessage, { color: colors.mutedText }]}>
            {error?.message ?? t('driver_profile_error_message')}
          </Text>
          <Pressable
            style={[styles.retryButton, { backgroundColor: colors.findingRidePrimary }]}
            onPress={() => {
              void refetch();
            }}
          >
            <Text weight="semiBold" style={{ color: colors.white }}>
              {t('driver_profile_retry')}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const profileData = toDriverProfileData(data);
  const profileDataWithVehicle: DriverProfileData = {
    ...profileData,
    vehicle: {
      vehicleName: riderVehicleInfoQuery.data?.vehicleName ?? profileData.vehicle.vehicleName,
      vehicleNo: riderVehicleInfoQuery.data?.vehicleNo ?? profileData.vehicle.vehicleNo,
      vehicleColor: riderVehicleInfoQuery.data?.vehicleColor ?? profileData.vehicle.vehicleColor,
    },
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.backgroundTertiary }]}>
      <ScreenHeader style={{ backgroundColor: colors.backgroundTertiary }} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileHeroCard data={profileDataWithVehicle} />

        <DriverProfileTabs
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          reviewsLabel={t('driver_profile_tab_reviews')}
          infoLabel={t('driver_profile_tab_info')}
        />

        {activeTab === 'reviews' ? (
          <View style={styles.reviewsContent}>
            <RatingSummary
              averageRating={profileData.averageRating}
              totalReviews={profileData.totalReviews}
              ratingBreakdown={profileData.ratingBreakdown}
            />

            <View style={[styles.reviewsList, { borderTopColor: colors.border }]}>
              {profileDataWithVehicle.reviews.map((review, index) => (
                <ReviewCard
                  key={`${review.reviewerId}-${review.createdAt}-${index}`}
                  review={review}
                />
              ))}
            </View>

            <Pressable style={[styles.viewAllButton, { backgroundColor: colors.backgroundTertiary }]}>
              <Text weight="medium" style={{ color: colors.text }}>
                {t('driver_profile_view_all_reviews', { count: profileData.totalReviews })}
              </Text>
            </Pressable>
          </View>
        ) : (
          <DriverInformationSection data={profileDataWithVehicle} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
    paddingBottom: 40,
  },
  errorContainer: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorMessage: {
    textAlign: 'center',
  },
  errorTitle: {
    textAlign: 'center',
  },
  retryButton: {
    borderRadius: 10,
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  reviewsContent: {
    gap: 20,
  },
  reviewsList: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
  },
  screen: {
    flex: 1,
  },
  viewAllButton: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 6,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});
