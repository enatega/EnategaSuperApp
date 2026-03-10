import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import type { PaymentMethodId } from './paymentTypes';

type Props = {
  paymentMethodId: PaymentMethodId;
  size?: 'sm' | 'md';
};

function PaymentMethodBadge({ paymentMethodId, size = 'sm' }: Props) {
  const { colors, typography } = useTheme();
  const isSmall = size === 'sm';

  if (paymentMethodId === 'wallet') {
    return (
      <View
        style={[
          styles.walletWrap,
          isSmall ? styles.walletWrapSm : styles.walletWrapMd,
          { borderColor: colors.border, backgroundColor: colors.surface },
        ]}
      >
        <Icon type="Feather" name="credit-card" size={isSmall ? 14 : 16} color={colors.text} />
      </View>
    );
  }

  if (paymentMethodId === 'visa') {
    return (
      <View
        style={[
          styles.visaWrap,
          isSmall ? styles.visaWrapSm : styles.visaWrapMd,
          { borderColor: colors.border, backgroundColor: colors.surface },
        ]}
      >
        <Text
          weight="bold"
          style={[
            styles.visaText,
            { color: colors.primary, fontSize: isSmall ? typography.size.xs2 : typography.size.sm2 },
          ]}
        >
          VISA
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.cashWrap,
        isSmall ? styles.cashWrapSm : styles.cashWrapMd,
      ]}
    >
      <View style={styles.cashBody}>
        <Icon type="Feather" name="dollar-sign" size={isSmall ? 12 : 14} color="#0F7A43" />
      </View>
    </View>
  );
}

export default memo(PaymentMethodBadge);

const styles = StyleSheet.create({
  walletWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 6,
  },
  walletWrapSm: {
    width: 34,
    height: 24,
  },
  walletWrapMd: {
    width: 40,
    height: 28,
  },
  visaWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 4,
  },
  visaWrapSm: {
    width: 34,
    height: 24,
  },
  visaWrapMd: {
    width: 40,
    height: 28,
  },
  visaText: {
    letterSpacing: -0.3,
  },
  cashWrap: {
    borderRadius: 4,
    backgroundColor: '#B7F0C4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cashWrapSm: {
    width: 34,
    height: 24,
  },
  cashWrapMd: {
    width: 40,
    height: 28,
  },
  cashBody: {
    width: '78%',
    height: '62%',
    borderRadius: 3,
    backgroundColor: '#76D392',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
