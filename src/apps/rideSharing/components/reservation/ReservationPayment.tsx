import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  paymentMethod: 'cash' | 'card';
};

export default function ReservationPayment({ paymentMethod }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text variant="caption" color={colors.mutedText} style={styles.label}>
        {t('reservation_payment')}
      </Text>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.cardMint }]}>
          <Ionicons name="cash-outline" size={24} color={colors.success} />
        </View>
        <Text weight="semiBold" variant="subtitle" style={styles.method}>
          {paymentMethod === 'cash' ? t('reservation_cash') : t('reservation_card')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
  },
  label: {
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  method: {
    marginLeft: 8,
  },
});
