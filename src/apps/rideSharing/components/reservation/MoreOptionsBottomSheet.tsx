import React, { useCallback } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import BottomSheetHandle from '../../../../general/components/BottomSheetHandle';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import SwipeableBottomSheet from '../../../../general/components/SwipeableBottomSheet';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onCancelPress: () => void;
  expandedHeight?: number;
};

const DEFAULT_EXPANDED_HEIGHT = 220;

export default function MoreOptionsBottomSheet({
  isVisible,
  onClose,
  onCancelPress,
  expandedHeight = DEFAULT_EXPANDED_HEIGHT,
}: Props) {
  const { colors } = useTheme();

  const handleCancelPress = useCallback(() => {
    onCancelPress();
    onClose();
  }, [onCancelPress, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <SwipeableBottomSheet
      expandedHeight={expandedHeight}
      collapsedHeight={0}
      initialState="expanded"
      onStateChange={(state) => {
        if (state === 'collapsed') {
          onClose();
        }
      }}
      handle={<BottomSheetHandle color={colors.border} />}
      style={[
        styles.sheet,
        {
          backgroundColor: colors.background,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text weight="bold" variant="title" style={styles.title}>
            More options
          </Text>
        </View>

        <View style={styles.contentContainer}>
          <Pressable
            onPress={handleCancelPress}
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.cancelButtonPressed,
            ]}
            hitSlop={{ top: 4, bottom: 4, left: 8, right: 8 }}
          >
            <Text weight="semiBold" color={colors.danger} style={styles.cancelButtonText}>
              Cancel the ride
            </Text>
          </Pressable>
        </View>
      </View>
    </SwipeableBottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 32,
  },
  sheet: {
    paddingTop: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  handleContainer: {
    alignItems: 'center',
    paddingBottom: 12,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 999,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: '#EF4444',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  cancelButtonPressed: {
    backgroundColor: '#FEF2F2',
  },
  cancelButtonText: {
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
