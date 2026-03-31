import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  pickupAddress: string;
  dropoffAddress: string;
  stopAddresses?: string[];
};

export default function ReservationRoute({
  pickupAddress,
  dropoffAddress,
  stopAddresses = [],
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const routePoints = [
    { id: 'pickup', address: pickupAddress, color: colors.success },
    ...stopAddresses.map((address, index) => ({
      id: `stop-${index}-${address}`,
      address,
      color: '#F59E0B',
    })),
    { id: 'dropoff', address: dropoffAddress, color: colors.danger },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text weight="semiBold" variant="body" color={colors.mutedText} style={styles.label}>
        {t('reservation_route')}
      </Text>
      <View style={styles.content}>
        {routePoints.map((point, index) => (
          <React.Fragment key={point.id}>
            <View style={styles.routePoint}>
              <View style={[styles.dot, { backgroundColor: point.color }]} />
              <Text style={styles.address}>{point.address}</Text>
            </View>
            {index < routePoints.length - 1 ? <View style={styles.line} /> : null}
          </React.Fragment>
        ))}
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
