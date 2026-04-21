import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import ReviewDetailRow from './ReviewDetailRow';
import type { ReviewPaymentMethod } from './ReviewPaymentMethodBottomSheet';

type Props = {
  title: string;
  paymentTitle: string;
  paymentSubtitle: string;
  discountTitle: string;
  discountSubtitle: string;
  paymentMethod: ReviewPaymentMethod;
  onPaymentPress: () => void;
  onDiscountPress: () => void;
};

function ReviewPaymentSection({
  discountSubtitle,
  discountTitle,
  onDiscountPress,
  onPaymentPress,
  paymentMethod,
  paymentSubtitle,
  paymentTitle,
  title,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.section}>
      <Text
        weight="bold"
        style={{
          color: colors.text,
          fontSize: typography.size.lg,
          lineHeight: typography.lineHeight.lg,
        }}
      >
        {title}
      </Text>

      <ReviewDetailRow
        icon={paymentMethod === 'cash' ? 'cash-outline' : 'card-outline'}
        onPress={onPaymentPress}
        subtitle={paymentSubtitle}
        title={paymentTitle}
      />

      <ReviewDetailRow
        icon="ticket-outline"
        onPress={onDiscountPress}
        subtitle={discountSubtitle}
        title={discountTitle}
      />
    </View>
  );
}

export default memo(ReviewPaymentSection);

const styles = StyleSheet.create({
  section: {
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});
