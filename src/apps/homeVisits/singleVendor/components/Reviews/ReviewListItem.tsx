import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import type { BookingReviewItem } from './types';
import ReviewStars from './ReviewStars';

type Props = {
  item: BookingReviewItem;
};

const AVATAR_FALLBACK = 'https://placehold.co/96x96/png';

function ReviewListItem({ item }: Props) {
  const { colors, typography } = useTheme();
  const dateValue = new Date(item.date);
  const safeDate = Number.isNaN(dateValue.getTime()) ? item.date : new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(dateValue);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: item.avatarUrl ?? AVATAR_FALLBACK }}
          style={styles.avatar}
        />
        <View style={styles.meta}>
          <Text
            style={{
              color: colors.text,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            }}
            weight="semiBold"
          >
            {item.serviceName}
          </Text>
          <Text
            style={{
              color: colors.iconMuted,
              fontSize: typography.size.xs2,
              lineHeight: typography.lineHeight.sm,
            }}
            weight="medium"
          >
            {safeDate}
          </Text>
        </View>
      </View>

      <View style={styles.ratingBlock}>
        <ReviewStars
          rating={item.rating}
          size={20}
        />
        <Text
          style={{
            color: colors.text,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
          }}
          weight="medium"
        >
          {item.comment}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 9999,
    height: 48,
    width: 48,
  },
  container: {
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  ratingBlock: {
    gap: 8,
  },
});

export default React.memo(ReviewListItem);
