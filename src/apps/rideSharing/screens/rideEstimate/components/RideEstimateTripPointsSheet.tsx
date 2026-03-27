import React, { memo } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SwipeableBottomSheet from '../../../../../general/components/SwipeableBottomSheet';
import Icon from '../../../../../general/components/Icon';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import type { RideAddressSelection } from '../../../api/types';

type Props = {
  visible: boolean;
  title: string;
  originLabel: string;
  stopLabel: (index: number) => string;
  destinationLabel: string;
  fromAddress: RideAddressSelection;
  stopAddresses?: RideAddressSelection[];
  toAddress: RideAddressSelection;
  onStopPress?: (index: number) => void;
  removeStopLabel?: (index: number) => string;
  onRemoveStop?: (index: number) => void;
  onClose: () => void;
};

function RideEstimateTripPointsSheet({
  visible,
  title,
  originLabel,
  stopLabel,
  destinationLabel,
  fromAddress,
  stopAddresses = [],
  toAddress,
  onStopPress,
  removeStopLabel,
  onRemoveStop,
  onClose,
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;

  if (!visible) {
    return null;
  }

  return (
    <SwipeableBottomSheet
      expandedHeight={Math.min(screenHeight * 0.52, 430)}
      collapsedHeight={0}
      initialState="expanded"
      modal
      style={[
        styles.sheet,
        {
          backgroundColor: colors.surface,
          paddingBottom: insets.bottom + 18,
          shadowColor: colors.shadowColor,
        },
      ]}
      handle={<View style={[styles.handle, { backgroundColor: colors.border }]} />}
      handleContainerStyle={styles.handleContainer}
      onCollapsed={onClose}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text weight="bold" style={styles.title}>
            {title}
          </Text>
          <Pressable onPress={onClose} hitSlop={8} accessibilityRole="button">
            <Icon type="Feather" name="x" size={20} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.pointsList}>
          <View style={styles.pointRow}>
            <View style={[styles.dot, { borderColor: '#6EE7B7' }]} />
            <View style={styles.pointTextWrap}>
              <Text color={colors.mutedText} style={styles.pointLabel}>
                {originLabel}
              </Text>
              <Text style={styles.pointValue}>{fromAddress.description}</Text>
            </View>
          </View>

          {stopAddresses.map((stopAddress, index) => (
            <View key={stopAddress.placeId} style={styles.pointRow}>
              <Pressable
                onPress={() => onStopPress?.(index)}
                style={styles.pointPressable}
                accessibilityRole="button"
              >
                <View style={[styles.dot, { borderColor: '#FBBF24' }]} />
                <View style={styles.pointTextWrap}>
                  <Text color={colors.mutedText} style={styles.pointLabel}>
                    {stopLabel(index + 1)}
                  </Text>
                  <Text style={styles.pointValue}>{stopAddress.description}</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => onRemoveStop?.(index)}
                hitSlop={8}
                style={styles.removeButton}
                accessibilityRole="button"
                accessibilityLabel={removeStopLabel?.(index + 1)}
              >
                <Icon type="Feather" name="trash-2" size={18} color={colors.mutedText} />
              </Pressable>
            </View>
          ))}

          <View style={styles.pointRow}>
            <View style={[styles.dot, { borderColor: '#F87171' }]} />
            <View style={styles.pointTextWrap}>
              <Text color={colors.mutedText} style={styles.pointLabel}>
                {destinationLabel}
              </Text>
              <Text style={styles.pointValue}>{toAddress.description}</Text>
            </View>
          </View>
        </View>
      </View>
    </SwipeableBottomSheet>
  );
}

export default memo(RideEstimateTripPointsSheet);

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 999,
  },
  content: {
    paddingHorizontal: 16,
    gap: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
  },
  pointsList: {
    gap: 14,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  pointPressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 4,
    marginTop: 3,
  },
  pointTextWrap: {
    flex: 1,
    gap: 2,
  },
  pointLabel: {
    fontSize: 12,
    lineHeight: 16,
  },
  pointValue: {
    fontSize: 14,
    lineHeight: 20,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
