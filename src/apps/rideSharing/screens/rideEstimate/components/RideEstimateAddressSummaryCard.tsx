import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../../general/theme/theme';
import Text from '../../../../../general/components/Text';
import Icon from '../../../../../general/components/Icon';
import type { RideAddressSelection } from '../../../api/types';

type Props = {
  fromAddress: RideAddressSelection;
  toAddress: RideAddressSelection;
};

function RideEstimateAddressSummaryCard({ fromAddress, toAddress }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          top: insets.top + 8,
          backgroundColor: colors.surface,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={[styles.statusDot, { borderColor: '#6EE7B7' }]} />
        <Text numberOfLines={1} style={styles.addressText}>
          {fromAddress.description}
        </Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.statusDot, { borderColor: '#F87171' }]} />
        <Text numberOfLines={1} style={styles.addressText}>
          {toAddress.description}
        </Text>
        <Icon type="Feather" name="plus" size={20} color={colors.text} />
      </View>
    </View>
  );
}

export default memo(RideEstimateAddressSummaryCard);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: 24,
    padding: 12,
    gap: 14,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 4,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
  },
});
