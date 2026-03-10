import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { serviceIcons } from '../../../../general/assets/images';

type Props = {
  rideTitle: string;
  price: number;
  currency: string;
  imageUrl?: string;
};

export default function ReservationRideInfo({
  rideTitle,
  price,
  currency,
  imageUrl,
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.content}>
        <View style={styles.leftContent}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.carImage} resizeMode="contain" />
          ) : (
            <Image source={serviceIcons.rideSharing} style={styles.carImage} resizeMode="contain" />
          )}
          <Text weight="semiBold" variant="subtitle" style={styles.title}>
            {rideTitle}
          </Text>
        </View>
        <Text weight="semiBold" variant="subtitle">
          {currency} {price.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  carImage: {
    width: 80,
    height: 48,
  },
  title: {
    marginLeft: 4,
  },
});
