import React from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../../general/theme/theme';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import FullImagePreviewModal from '../../../../general/components/FullImagePreviewModal';
import { showToast } from '../../../../general/components/AppToast';

import ProfileHeroCard from '../../components/driverProfile/ProfileHeroCard';
import RatingSummary from '../../components/driverProfile/RatingSummary';
import ReviewCard from '../../components/driverProfile/ReviewCard';
import DriverProfileSkeleton from '../../components/driverProfile/DriverProfileSkeleton';
import { useDriverStats } from '../../hooks';
import type { DriverProfileStats } from '../../api/types';
import type { DriverProfileData } from '../../components/driverProfile/types';

// ---------------------------------------------------------------------------
// Navigation param type
// ---------------------------------------------------------------------------

type RideSharingParamList = {
  DriverProfile: { userId?: string };
};

type DriverProfileRouteProp = RouteProp<RideSharingParamList, 'DriverProfile'>;

// ---------------------------------------------------------------------------
// Adapter: DriverProfileStats → DriverProfileData
// (Components still use the local type; this keeps them isolated from the API)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Temporary fallback user ID (replace once auth context provides one)
// ---------------------------------------------------------------------------
const FALLBACK_USER_ID = 'f6280bea-39a4-4616-b462-59381289402e';

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function DriverProfileScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const [isImagePreviewVisible, setIsImagePreviewVisible] = React.useState(false);

  const route = useRoute<DriverProfileRouteProp>();
  const userId = route.params?.userId ?? FALLBACK_USER_ID;

  const { data, isLoading, isError, error, refetch } = useDriverStats(userId);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return <DriverProfileSkeleton />;
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (isError || !data) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScreenHeader />
        <View style={styles.errorContainer}>
          <Text variant="subtitle" weight="bold" style={styles.errorTitle}>
            Failed to load profile
          </Text>
          <Text
            variant="body"
            color={colors.mutedText}
            style={styles.errorMessage}
          >
            {error?.message ?? 'Something went wrong. Please try again.'}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => refetch()}
            accessibilityLabel="Retry loading driver profile"
          >
            <Text variant="body" weight="semiBold" color="#fff">
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Success ──────────────────────────────────────────────────────────────
  const profileData = toDriverProfileData(data);
  const profileImageUri = profileData.profile.profilePic?.trim() ?? '';

  const handleAvatarPress = () => {
    if (!profileImageUri) {
      showToast.error(t('error'), t('ride_profile_photo_unavailable'));
      return;
    }

    setIsImagePreviewVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeroCard data={profileData} onAvatarPress={handleAvatarPress} />

        <RatingSummary
          averageRating={profileData.averageRating}
          totalReviews={profileData.totalReviews}
          ratingBreakdown={profileData.ratingBreakdown}
        />

        <View style={styles.reviewsList}>
          {profileData.reviews.map((review, index) => (
            <ReviewCard
              key={`${review.reviewerId}-${review.createdAt}-${index}`}
              review={review}
            />
          ))}
        </View>
      </ScrollView>

      <FullImagePreviewModal
        visible={isImagePreviewVisible}
        imageUri={profileImageUri}
        onClose={() => setIsImagePreviewVisible(false)}
      />
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  errorTitle: {
    textAlign: 'center',
  },
  errorMessage: {
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
});
