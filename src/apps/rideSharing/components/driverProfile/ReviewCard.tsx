import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import Text from '../../../../general/components/Text';
import ProfileAvatar from './ProfileAvatar';
import StarRating from './StarRating';
import { formatDate } from './helpers';
import type { Review } from './types';

type Props = {
  review: Review;
};

export default function ReviewCard({ review }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.reviewCard, { backgroundColor: colors.surface }]}>
      {/* Header row */}
      <View style={styles.reviewHeader}>
        <ProfileAvatar
          uri={review.reviewerProfile}
          name={review.reviewerName}
          size={42}
        />
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

      {/* Comment — only rendered when non-empty */}
      {review.comment.trim().length > 0 && (
        <Text variant="body" color={colors.mutedText} style={styles.reviewComment}>
          {review.comment}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
