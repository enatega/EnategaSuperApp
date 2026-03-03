import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { useTheme } from '../../../../general/theme/theme';
import Text from '../../../../general/components/Text';
import ScreenHeader from '../../../../general/components/ScreenHeader';

// ─── Types ───────────────────────────────────────────────────────────────────

type RatingBreakdown = { star: number; count: number };

type Review = {
  reviewerId: string;
  reviewerName: string;
  reviewerProfile: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type DriverProfileData = {
  type: string;
  riderId: string;
  joiningTime: string;
  vehicle: {
    vehicleName: string;
    vehicleNo: string;
    vehicleColor: string;
  };
  profile: {
    name: string;
    userId: string;
    profilePic: string;
  };
  totalRides: number;
  averageRating: string;
  totalReviews: number;
  ratingBreakdown: RatingBreakdown[];
  reviews: Review[];
};

// ─── Static Mock Data ─────────────────────────────────────────────────────────

const DRIVER_DATA: DriverProfileData = {
  type: 'rider',
  riderId: 'd6709455-b5ad-430b-85dc-2f7d8581b512',
  joiningTime: '2025-10-30T09:37:40.015Z',
  vehicle: {
    vehicleName: 'Honda Civic Nahoor Edition',
    vehicleNo: 'AWE 121',
    vehicleColor: 'Black',
  },
  profile: {
    name: 'Nahoor Paji',
    userId: '89501c4c-e522-470a-9dcf-3bf24137ec77',
    profilePic:
      'https://enatega-backend.s3.eu-north-1.amazonaws.com/4187a317-f060-4b11-ba72-775177f0519f-img_1059.heic',
  },
  totalRides: 121,
  averageRating: '4.20',
  totalReviews: 20,
  ratingBreakdown: [
    { star: 5, count: 10 },
    { star: 4, count: 6 },
    { star: 3, count: 3 },
    { star: 2, count: 0 },
    { star: 1, count: 1 },
  ],
  reviews: [
    {
      reviewerId: 'f6ad0c2d-337e-4e41-8ad9-ef2d9bf89f3d',
      reviewerName: 'Inshirah Nasir',
      reviewerProfile:
        'https://enatega-backend.s3.eu-north-1.amazonaws.com/c524d71c-447e-4ed8-a964-d9f63925e023-img_1134.png',
      rating: 5,
      comment: 'Great person to work with!',
      createdAt: '2025-11-26T11:22:44.249Z',
    },
    {
      reviewerId: 'f6ad0c2d-337e-4e41-8ad9-ef2d9bf89f3d',
      reviewerName: 'Inshirah Nasir',
      reviewerProfile:
        'https://enatega-backend.s3.eu-north-1.amazonaws.com/c524d71c-447e-4ed8-a964-d9f63925e023-img_1134.png',
      rating: 5,
      comment: 'Cool',
      createdAt: '2025-11-26T11:23:42.737Z',
    },
    {
      reviewerId: 'f6ad0c2d-337e-4e41-8ad9-ef2d9bf89f3d',
      reviewerName: 'Inshirah Nasir',
      reviewerProfile:
        'https://enatega-backend.s3.eu-north-1.amazonaws.com/c524d71c-447e-4ed8-a964-d9f63925e023-img_1134.png',
      rating: 5,
      comment: 'Cool',
      createdAt: '2025-12-10T18:16:49.510Z',
    },
    {
      reviewerId: '4fa1efd7-f002-4994-984c-95ecf637d8ae',
      reviewerName: 'Ifrah Fasihh',
      reviewerProfile:
        'https://lumistorageacc.blob.core.windows.net/lumi-ride-container/b200687a-d9ba-430d-a73a-d7444025a4c5-img_0697.png',
      rating: 1,
      comment: '',
      createdAt: '2025-12-11T04:15:45.223Z',
    },
    {
      reviewerId: '7f05858f-83b5-4033-a525-2740489936e4',
      reviewerName: 'Ifrah fasihh',
      reviewerProfile:
        'https://enatega-backend.s3.eu-north-1.amazonaws.com/6f018c47-9863-4dfb-8c87-b2a67adec5fc-9fa9ed3e-634a-43d5-aa7b-81fd3f07bc43.jpg',
      rating: 4,
      comment: '',
      createdAt: '2025-12-24T06:51:13.850Z',
    },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatJoinYear(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const years = now.getFullYear() - date.getFullYear();
  if (years < 1) {
    const months = now.getMonth() - date.getMonth() + 12 * years;
    if (months < 1) return '< 1 month';
    return `${months}mo`;
  }
  return `${years} yr${years > 1 ? 's' : ''}`;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRow({ filled }: { filled: boolean }) {
  return (
    <Text
      style={{ fontSize: 16, color: filled ? '#F59E0B' : '#D1D5DB' }}
    >
      ★
    </Text>
  );
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={{ fontSize: size, color: i <= rating ? '#F59E0B' : '#D1D5DB' }}>
          ★
        </Text>
      ))}
    </View>
  );
}

function AvatarFallback({ name, size }: { name: string; size: number }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#E8E7FF',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: size * 0.38, fontWeight: '600', color: '#2346E8' }}>
        {initials}
      </Text>
    </View>
  );
}

function ProfileAvatar({
  uri,
  name,
  size,
}: {
  uri: string;
  name: string;
  size: number;
}) {
  const [error, setError] = React.useState(false);

  if (error) {
    return <AvatarFallback name={name} size={size} />;
  }

  return (
    <Image
      source={{ uri }}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      onError={() => setError(true)}
    />
  );
}

function StatCard({
  value,
  label,
  colors,
}: {
  value: string | number;
  label: string;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
      <Text
        variant="subtitle"
        weight="bold"
        style={{ fontVariant: ['tabular-nums'] as any }}
      >
        {value}
      </Text>
      <Text variant="caption" color={colors.mutedText}>
        {label}
      </Text>
    </View>
  );
}

function RatingBar({
  star,
  count,
  max,
  colors,
}: {
  star: number;
  count: number;
  max: number;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  const fillRatio = max > 0 ? count / max : 0;
  return (
    <View style={styles.ratingBarRow}>
      <Text variant="caption" color={colors.mutedText} style={styles.ratingBarLabel}>
        {star} star
      </Text>
      <View style={[styles.ratingBarTrack, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.ratingBarFill,
            {
              width: `${fillRatio * 100}%`,
              backgroundColor: '#F59E0B',
            },
          ]}
        />
      </View>
      <Text
        variant="caption"
        style={[styles.ratingBarCount, { color: colors.mutedText, fontVariant: ['tabular-nums'] as any }]}
      >
        {count}
      </Text>
    </View>
  );
}

function ReviewCard({
  review,
  colors,
}: {
  review: Review;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={[styles.reviewCard, { backgroundColor: colors.surface }]}>
      {/* Header row */}
      <View style={styles.reviewHeader}>
        <ProfileAvatar uri={review.reviewerProfile} name={review.reviewerName} size={42} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={styles.reviewNameRow}>
            <Text variant="body" weight="semiBold" style={{ flex: 1 }}>
              {review.reviewerName}
            </Text>
            <Text variant="caption" color={colors.mutedText}>
              {formatDate(review.createdAt)}
            </Text>
          </View>
          <StarRating rating={review.rating} size={14} />
        </View>
      </View>
      {/* Comment */}
      {review.comment.trim().length > 0 && (
        <Text variant="body" color={colors.mutedText} style={styles.reviewComment}>
          {review.comment}
        </Text>
      )}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function DriverProfileScreen() {
  const { colors } = useTheme();
  const data = DRIVER_DATA;
  const maxCount = Math.max(...data.ratingBreakdown.map((r) => r.count));
  const joinedLabel = formatJoinYear(data.joiningTime);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
      {/* ── Profile Hero ── */}
      <View style={[styles.heroCard, { backgroundColor: colors.surface }]}>
        <View style={styles.avatarWrapper}>
          <ProfileAvatar uri={data.profile.profilePic} name={data.profile.name} size={90} />
        </View>
        <Text variant="subtitle" weight="bold" style={styles.driverName}>
          {data.profile.name}
        </Text>

        {/* Vehicle pill */}
        <View style={[styles.vehiclePill, { backgroundColor: colors.cardSoft }]}>
          <Text variant="caption" weight="medium" color={colors.primary}>
            🚗  {data.vehicle.vehicleName}
          </Text>
          <View style={[styles.vehicleDivider, { backgroundColor: colors.border }]} />
          <Text variant="caption" weight="medium" color={colors.mutedText}>
            {data.vehicle.vehicleNo}  ·  {data.vehicle.vehicleColor}
          </Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatCard value={data.totalRides} label="Rides" colors={colors} />
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <StatCard value={joinedLabel} label="Joined" colors={colors} />
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 16, color: '#F59E0B' }}>★</Text>
              <Text variant="subtitle" weight="bold" style={{ fontVariant: ['tabular-nums'] as any }}>
                {data.averageRating}
              </Text>
            </View>
            <Text variant="caption" color={colors.mutedText}>
              Rating
            </Text>
          </View>
        </View>
      </View>

      {/* ── Top Reviews ── */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text variant="subtitle" weight="bold" style={styles.sectionTitle}>
          Top Reviews
        </Text>

        {/* Big rating + stars */}
        <View style={styles.ratingOverview}>
          <Text style={[styles.bigRating, { color: colors.text }]}>
            {data.averageRating}
          </Text>
          <View style={{ gap: 4 }}>
            <StarRating rating={Math.round(Number(data.averageRating))} size={22} />
            <Text variant="caption" color={colors.mutedText}>
              Based on {data.totalReviews} Reviews
            </Text>
          </View>
        </View>

        {/* Rating bars — descending 5→1 */}
        <View style={styles.ratingBars}>
          {[...data.ratingBreakdown]
            .sort((a, b) => b.star - a.star)
            .map((item) => (
              <RatingBar
                key={item.star}
                star={item.star}
                count={item.count}
                max={maxCount}
                colors={colors}
              />
            ))}
        </View>
      </View>

      {/* ── Reviews List ── */}
      <View style={styles.reviewsList}>
        {data.reviews.map((review, index) => (
          <ReviewCard
            key={`${review.reviewerId}-${review.createdAt}-${index}`}
            review={review}
            colors={colors}
          />
        ))}
      </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
    gap: 12,
  },

  // Hero
  heroCard: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    gap: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  } as any,
  avatarWrapper: {
    borderRadius: 50,
    padding: 3,
    borderWidth: 3,
    borderColor: '#F59E0B',
  },
  driverName: {
    marginTop: 4,
  },
  vehiclePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 10,
  },
  vehicleDivider: {
    width: 1,
    height: 14,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
    paddingHorizontal: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    marginHorizontal: 12,
  },

  // Top Reviews section
  section: {
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  } as any,
  sectionTitle: {
    marginBottom: 16,
  },
  ratingOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  bigRating: {
    fontSize: 52,
    fontWeight: '700',
    lineHeight: 56,
  },
  ratingBars: {
    gap: 10,
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingBarLabel: {
    width: 42,
    textAlign: 'right',
  },
  ratingBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  ratingBarCount: {
    width: 24,
    textAlign: 'right',
  },

  // Reviews list
  reviewsList: {
    gap: 10,
    paddingHorizontal: 16,
  },
  reviewCard: {
    borderRadius: 16,
    padding: 16,
    gap: 10,
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  } as any,
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  reviewNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 8,
  },
  reviewComment: {
    lineHeight: 20,
  },
});
