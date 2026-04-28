import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import StarRating from './StarRating';
import type { RatingBreakdown } from './types';

type Props = {
  averageRating: string;
  totalReviews: number;
  ratingBreakdown: RatingBreakdown[];
};

export default function RatingSummary({
  averageRating,
  totalReviews,
  ratingBreakdown,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('rideSharing');

  const rows = useMemo(() => {
    const byStar = new Map<number, number>();
    ratingBreakdown.forEach((item) => {
      byStar.set(item.star, item.count);
    });

    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: byStar.get(star) ?? 0,
    }));
  }, [ratingBreakdown]);

  const maxCount = Math.max(1, ...rows.map((item) => item.count));
  const roundedRating = Math.max(0, Math.min(5, Math.round(Number(averageRating) || 0)));
  const displayRating = Number(averageRating || 0).toFixed(1);

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text
          weight="extraBold"
          style={{
            color: colors.text,
            fontSize: typography.size.lg,
            lineHeight: typography.lineHeight.h5,
          }}
        >
          {t('driver_profile_top_reviews')}
        </Text>

        <View style={[styles.totalBadge, { backgroundColor: colors.gray100 }]}>
          <Text weight="medium" style={{ color: colors.text }}>
            {t('driver_profile_total_reviews', { count: totalReviews })}
          </Text>
        </View>
      </View>

      <View style={styles.overviewRow}>
        <View style={styles.bigScoreCol}>
          <Text
            weight="extraBold"
            style={{
              color: colors.text,
              fontSize: 42,
              lineHeight: 86,
              letterSpacing: -1.08,
            }}
          >
            {displayRating}
          </Text>
          <StarRating rating={roundedRating} size={16} />
          {/* <Text
            style={{
              color: colors.mutedText,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            }}
          >
            {t('driver_profile_reviews_based_on', { count: totalReviews })}
          </Text> */}
        </View>

        <View style={styles.barsCol}>
          {rows.map((item) => (
            <View key={item.star} style={styles.barRow}>
              <Text style={[styles.starLabel, { color: colors.mutedText }]} weight="medium">
                {item.star}
              </Text>
              <View style={[styles.track, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.fill,
                    {
                      backgroundColor: item.star >= 4
                        ? colors.yellow500
                        : item.star === 3
                          ? colors.warning
                          : colors.danger,
                      width: `${(item.count / maxCount) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.countLabel, { color: colors.mutedText }]} weight="medium">
                {item.count}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  barsCol: {
    flex: 1,
    gap: 4,
    paddingTop: 10,
  },
  bigScoreCol: {
    gap: 10,
    marginRight: 12,
    width: 94,
  },
  countLabel: {
    minWidth: 24,
    textAlign: 'right',
  },
  fill: {
    borderRadius: 4,
    height: '100%',
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  overviewRow: {
    flexDirection: 'row',
  },
  starLabel: {
    minWidth: 10,
    textAlign: 'right',
  },
  totalBadge: {
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  track: {
    borderRadius: 999,
    flex: 1,
    height: 8,
    overflow: 'hidden',
  },
  wrapper: {
    paddingHorizontal: 16,
  },
});
