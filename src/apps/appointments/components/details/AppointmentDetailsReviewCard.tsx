import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { ReviewPreview } from './detailTypes';

type Props = {
  item: ReviewPreview;
};

export default function AppointmentDetailsReviewCard({ item }: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.card}>
      <View style={styles.authorRow}>
        <View style={[styles.avatar, { backgroundColor: colors.blue100 }]}>
          <Text style={{ color: colors.primary, fontSize: typography.size.sm }} weight="bold">
            {item.author.charAt(0)}
          </Text>
        </View>

        <View style={styles.authorContent}>
          <Text style={{ color: colors.text, fontSize: typography.size.sm }} weight="semiBold">
            {item.author}
          </Text>
          <Text style={{ color: colors.mutedText, fontSize: typography.size.xs }}>
            {item.date}
          </Text>
        </View>
      </View>

      <View style={styles.starsRow}>
        {Array.from({ length: item.rating }).map((_, index) => (
          <Icon key={`${item.id}-star-${index}`} color={colors.warning} name="star" size={16} />
        ))}
      </View>

      <Text
        style={{
          color: colors.text,
          fontSize: typography.size.sm,
          lineHeight: typography.lineHeight.md,
        }}
      >
        {item.body}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  authorContent: {
    gap: 2,
  },
  authorRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  avatar: {
    alignItems: 'center',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  card: {
    gap: 10,
    paddingTop: 16,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
  },
});
