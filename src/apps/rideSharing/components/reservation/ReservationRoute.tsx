import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  pickupAddress: string;
  dropoffAddress: string;
};

export default function ReservationRoute({ pickupAddress, dropoffAddress }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text variant="caption" color={colors.mutedText} style={styles.label}>
        {t('reservation_route')}
      </Text>
      <View style={styles.content}>
        <View style={styles.routePoint}>
          <View style={[styles.dot, { backgroundColor: colors.success }]} />
          <Text style={styles.address}>{pickupAddress}</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.routePoint}>
          <View style={[styles.dot, { backgroundColor: colors.danger }]} />
          <Text style={styles.address}>{dropoffAddress}</Text>
        </View>
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
    gap: 8,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    flexShrink: 0,
  },
  line: {
    width: 2,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginLeft: 5,
  },
  address: {
    flex: 1,
    fontSize: 15,
  },
});
