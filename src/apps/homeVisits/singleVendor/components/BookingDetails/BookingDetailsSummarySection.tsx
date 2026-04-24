import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  isCancelled: boolean;
  statusLabel: string;
  scheduledLabel: string;
  statusMessage: string;
  reviewLabel: string;
  onOpenReviews: () => void;
};

export default function BookingDetailsSummarySection({
  isCancelled,
  onOpenReviews,
  reviewLabel,
  scheduledLabel,
  statusLabel,
  statusMessage,
}: Props) {
  const { t } = useTranslation('homeVisits');
  const { colors, typography } = useTheme();

  return (
    <>
      <View
        style={[
          styles.badge,
          {
            backgroundColor: isCancelled ? colors.danger : colors.success,
          },
        ]}
      >
        <MaterialCommunityIcons
          color={colors.white}
          name={isCancelled ? 'close-circle-outline' : 'check-circle-outline'}
          size={14}
        />
        <Text
          color={colors.white}
          style={styles.badgeText}
          weight="medium"
        >
          {statusLabel}
        </Text>
      </View>

      <Text
        style={{
          color: colors.text,
          fontSize: typography.size.lg,
          lineHeight: typography.lineHeight.lg2,
          marginBottom: 4,
        }}
        weight="bold"
      >
        {scheduledLabel}
      </Text>
      <Text
        style={{
          color: colors.mutedText,
          fontSize: typography.size.sm2,
          lineHeight: typography.lineHeight.md,
        }}
        weight="medium"
      >
        {statusMessage}
      </Text>

      <Pressable
        onPress={onOpenReviews}
        style={[styles.ratingRow, { borderColor: colors.border }]}
      >
        <View style={styles.ratingValue}>
          <MaterialCommunityIcons
            color={colors.warning}
            name="star"
            size={18}
          />
          <Text
            style={{
              color: colors.text,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            }}
            weight="semiBold"
          >
            {reviewLabel}
          </Text>
        </View>
        <View style={styles.ratingCta}>
          <Text
            style={{
              color: colors.mutedText,
              fontSize: typography.size.xs2,
              lineHeight: typography.lineHeight.sm,
            }}
            weight="medium"
          >
            {t('single_vendor_booking_open_reviews')}
          </Text>
          <MaterialCommunityIcons
            color={colors.iconMuted}
            name="chevron-right"
            size={18}
          />
        </View>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 6,
    flexDirection: 'row',
    gap: 4,
    marginBottom: 10,
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 14,
    lineHeight: 22,
  },
  ratingCta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  ratingRow: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  ratingValue: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
});
