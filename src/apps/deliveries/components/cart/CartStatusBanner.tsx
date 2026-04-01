import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { CART_MINIMUM_SPEND, CART_SMALL_ORDER_FEE, formatCartPrice } from './cartUtils';

type Props = {
  onInfoPress: () => void;
  totalPrice: number;
};

export default function CartStatusBanner({ onInfoPress, totalPrice }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const progress = Math.min(totalPrice / CART_MINIMUM_SPEND, 1);

  return (
    <View style={styles.container}>
      <View style={styles.messageRow}>
        <Text
          style={{
            color: colors.mutedText,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.sm,
          }}
        >
          {t('cart_low_order_fee_applies_prefix')}
          <Text
            weight="semiBold"
            style={{
              color: colors.text,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.sm,
            }}
          >
            {formatCartPrice(CART_SMALL_ORDER_FEE)}
          </Text>
          {t('cart_low_order_fee_applies_suffix')}
        </Text>

        <Pressable
          accessibilityLabel={t('cart_info_label')}
          accessibilityRole="button"
          onPress={onInfoPress}
          style={styles.infoButton}
        >
          <Ionicons color={colors.text} name="information-circle-outline" size={20} />
        </Pressable>
      </View>

      <View style={styles.progressRow}>
        {[0, 1, 2].map((segmentIndex) => {
          const segmentStart = segmentIndex / 3;
          const segmentProgress = Math.min(Math.max((progress - segmentStart) * 3, 0), 1);

          return (
            <View
              key={segmentIndex}
              style={[styles.progressTrack, { backgroundColor: colors.blue100 }]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.primary,
                    width: `${segmentProgress * 100}%`,
                  },
                ]}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingBottom: 18,
    paddingHorizontal: 16,
  },
  infoButton: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  messageRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  progressFill: {
    borderRadius: 999,
    height: '100%',
  },
  progressRow: {
    flexDirection: 'row',
    gap: 8,
  },
  progressTrack: {
    borderRadius: 999,
    flex: 1,
    height: 3,
    overflow: 'hidden',
  },
});
