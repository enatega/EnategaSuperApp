import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import ProfileAvatar from './ProfileAvatar';
import StarRating from './StarRating';
import { formatDate } from './helpers';
import type { Review } from './types';

type Props = {
  review: Review;
};

export default function ReviewCard({ review }: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <View style={styles.topRow}>
        <View style={styles.userRow}>
          <ProfileAvatar
            uri={review.reviewerProfile}
            name={review.reviewerName}
            size={40}
          />

          <Text
            weight="medium"
            style={{
              color: colors.text,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            }}
          >
            {review.reviewerName}
          </Text>
        </View>

        <Text
          weight="medium"
          style={{
            color: colors.mutedText,
            fontSize: typography.size.xs2,
            lineHeight: typography.lineHeight.sm,
          }}
        >
          {formatDate(review.createdAt)}
        </Text>
      </View>

      <StarRating rating={review.rating} size={16} />

      {review.comment?.trim() ? (
        <Text
          style={{
            color: colors.mutedText,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
          }}
        >
          {review.comment}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    gap: 5,
    paddingBottom: 20,
    paddingTop: 8,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
});
