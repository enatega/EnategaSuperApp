import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import Text from '../../../../general/components/Text';
import StarRating from './StarRating';
import type { RatingBreakdown } from './types';

type Props = {
  averageRating: string;
  totalReviews: number;
  ratingBreakdown: RatingBreakdown[];
};

function RatingBar({
  star,
  count,
  max,
}: {
  star: number;
  count: number;
  max: number;
}) {
  const { colors } = useTheme();
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
            { width: `${fillRatio * 100}%`, backgroundColor: '#F59E0B' },
          ]}
        />
      </View>
      <Text
        variant="caption"
        style={[
          styles.ratingBarCount,
          { color: colors.mutedText, fontVariant: ['tabular-nums'] as any },
        ]}
      >
        {count}
      </Text>
    </View>
  );
}

export default function RatingSummary({
  averageRating,
  totalReviews,
  ratingBreakdown,
}: Props) {
  const { colors } = useTheme();
  const maxCount = Math.max(...ratingBreakdown.map((r) => r.count));

  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text variant="subtitle" weight="bold" style={styles.sectionTitle}>
        Top Reviews
      </Text>

      {/* Big rating + stars */}
      <View style={styles.ratingOverview}>
        <Text style={[styles.bigRating, { color: colors.text }]}>
          {averageRating}
        </Text>
        <View style={{ gap: 4 }}>
          <StarRating rating={Math.round(Number(averageRating))} size={22} />
          <Text variant="caption" color={colors.mutedText}>
            Based on {totalReviews} Reviews
          </Text>
        </View>
      </View>

      {/* Rating bars — 5 → 1 */}
      <View style={styles.ratingBars}>
        {[...ratingBreakdown]
          .sort((a, b) => b.star - a.star)
          .map((item) => (
            <RatingBar
              key={item.star}
              star={item.star}
              count={item.count}
              max={maxCount}
            />
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
