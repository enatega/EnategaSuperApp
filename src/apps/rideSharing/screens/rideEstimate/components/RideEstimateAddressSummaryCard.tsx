import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../../general/theme/theme';
import Text from '../../../../../general/components/Text';
import Icon from '../../../../../general/components/Icon';
import type { RideAddressSelection } from '../../../api/types';

type Props = {
  fromAddress: RideAddressSelection;
  stopAddresses?: RideAddressSelection[];
  toAddress: RideAddressSelection;
  onAddStopPress?: () => void;
  onStopPress?: (index: number) => void;
  onRemoveStopPress?: (index: number) => void;
  onViewStopsPress?: () => void;
  viewStopsLabel?: string;
  moreStopsLabel?: (count: number) => string;
  removeStopLabel?: (index: number) => string;
};

function RideEstimateAddressSummaryCard({
  fromAddress,
  stopAddresses = [],
  toAddress,
  onAddStopPress,
  onStopPress,
  onRemoveStopPress,
  onViewStopsPress,
  viewStopsLabel,
  moreStopsLabel,
  removeStopLabel,
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const visibleStop = stopAddresses[0];
  const hiddenStopsCount = Math.max(stopAddresses.length - 1, 0);

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

      {visibleStop ? (
        <Pressable onPress={() => onStopPress?.(0)} style={styles.row} accessibilityRole="button">
          <View style={[styles.statusDot, { borderColor: '#FBBF24' }]} />
          <Text numberOfLines={1} style={styles.addressText}>
            {visibleStop.description}
          </Text>
          <Pressable
            onPress={() => onRemoveStopPress?.(0)}
            hitSlop={8}
            style={styles.actionButton}
            accessibilityRole="button"
            accessibilityLabel={removeStopLabel?.(1)}
          >
            <Icon type="Feather" name="x" size={18} color={colors.mutedText} />
          </Pressable>
        </Pressable>
      ) : null}

      <View style={styles.row}>
        <View style={[styles.statusDot, { borderColor: '#F87171' }]} />
        <Text numberOfLines={1} style={styles.addressText}>
          {toAddress.description}
        </Text>
        <Pressable
          onPress={onAddStopPress}
          hitSlop={8}
          style={styles.actionButton}
          accessibilityRole="button"
        >
          <Icon type="Feather" name="plus" size={20} color={colors.text} />
        </Pressable>
      </View>

      {stopAddresses.length ? (
        <Pressable onPress={onViewStopsPress} style={styles.footerAction} accessibilityRole="button">
          <Text weight="medium" style={[styles.footerActionText, { color: colors.primary }]}>
            {hiddenStopsCount > 0 ? moreStopsLabel?.(hiddenStopsCount) : viewStopsLabel}
          </Text>
          <Icon type="Feather" name="chevron-right" size={16} color={colors.primary} />
        </Pressable>
      ) : null}
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
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  footerActionText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
