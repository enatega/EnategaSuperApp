import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  rideTitle: string;
  vehicleModel?: string;
  vehicleColor?: string;
  licensePlate?: string;
};

export default function ReservationRideInfo({
  rideTitle,
  vehicleModel,
  vehicleColor,
  licensePlate,
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <View>
          <Text weight="semiBold" variant="subtitle" style={styles.title}>
            {rideTitle}
          </Text>
          {vehicleModel && vehicleColor && (
            <Text variant="caption" color={colors.mutedText}>
              {vehicleModel}, {vehicleColor}
            </Text>
          )}
        </View>
        {licensePlate && (
          <Text weight="semiBold">{licensePlate}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginBottom: 4,
  },
});
