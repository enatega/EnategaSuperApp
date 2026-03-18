import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../../general/theme/theme';
import Text from '../../../../../general/components/Text';
import Icon from '../../../../../general/components/Icon';

type Props = {
  rating?: number | null;
  reviewCount?: number | null;
  hours?: string | null;
  deliveryFee?: string | null;
  distance?: string | null;
  phone?: string | null;
  email?: string | null;
};

export default function StoreDetailInfoRow({
  rating,
  reviewCount,
  hours,
  deliveryFee,
  distance,
  phone,
  email,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const hasRating = typeof rating === 'number';
  const hasReviewCount = typeof reviewCount === 'number';
  const hasContact = Boolean(phone || email);

  return (
    <View style={styles.wrapper}>
      <View style={styles.metaRow}>
        {hasRating ? (
          <View style={styles.metaItem}>
            <Icon color={colors.yellow500} name="star" size={14} type="Ionicons" />
            <Text style={[styles.metaValue, { color: colors.text }]} weight="semiBold">
              {rating.toFixed(1)}
            </Text>
            {hasReviewCount ? (
              <Text style={[styles.metaText, { color: colors.mutedText }]}>({reviewCount})</Text>
            ) : null}
          </View>
        ) : null}

        {hasRating && hours ? <View style={[styles.dot, { backgroundColor: colors.border }]} /> : null}

        {hours ? <Text style={[styles.metaText, { color: colors.mutedText }]}>{hours}</Text> : null}

        {hours && deliveryFee ? (
          <View style={[styles.dot, { backgroundColor: colors.border }]} />
        ) : null}

        {deliveryFee ? (
          <View style={styles.metaItem}>
            <Icon color={colors.mutedText} name="bicycle-outline" size={14} type="Ionicons" />
            <Text style={[styles.metaText, { color: colors.mutedText }]}>{deliveryFee}</Text>
          </View>
        ) : null}

        {deliveryFee && distance ? (
          <View style={[styles.dot, { backgroundColor: colors.border }]} />
        ) : null}

        {distance ? (
          <View style={styles.metaItem}>
            <Icon color={colors.mutedText} name="location-outline" size={14} type="Ionicons" />
            <Text style={[styles.metaText, { color: colors.mutedText }]}>{distance}</Text>
          </View>
        ) : null}
      </View>

      {hasContact ? (
        <Text
          style={[
            styles.contactLine,
            { color: colors.mutedText, fontSize: typography.size.xs2, lineHeight: 18 },
          ]}
        >
          {phone ? (
            <>
              {t('store_details_call_label')}{' '}
              <Text style={[styles.contactHighlight, { color: colors.text }]} weight="medium">
                {phone}
              </Text>
            </>
          ) : null}
          {phone && email ? ` ${t('store_details_email_label')} ` : null}
          {email ? (
            <Text
              style={[styles.contactHighlight, styles.contactLink, { color: colors.text }]}
              weight="medium"
            >
              {email}
            </Text>
          ) : null}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  metaValue: {
    fontSize: 12,
    lineHeight: 18,
  },
  metaText: {
    fontSize: 12,
    lineHeight: 18,
  },
  dot: {
    borderRadius: 2,
    height: 4,
    width: 4,
  },
  contactLine: {
    textAlign: 'center',
  },
  contactHighlight: {
    fontSize: 12,
    lineHeight: 18,
  },
  contactLink: {
    textDecorationLine: 'underline',
  },
});
