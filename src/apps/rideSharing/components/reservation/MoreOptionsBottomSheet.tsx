import React, { useCallback } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import SwipeableBottomSheet from '../../../../general/components/SwipeableBottomSheet';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onCancelPress: () => void;
  expandedHeight?: number;
};

const DEFAULT_EXPANDED_HEIGHT = 280;

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

  const renderHandle = useCallback(
    () => (
      <View style={[styles.handleContainer, { backgroundColor: colors.backgroundTertiary }]}>
        <View style={[styles.handleBar, { backgroundColor: colors.iconDisabled }]} />
      </View>
    ),
    [colors],
  );

  if (!isVisible) {
    return null;
  }

  return (
    <SwipeableBottomSheet
      expandedHeight={expandedHeight}
      collapsedHeight={0}
      initialState="expanded"
      onStateChange={(state: 'expanded' | 'collapsed') => {
        if (state === 'collapsed') {
          onClose();
        }
      }}
      handle={renderHandle()}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text weight="bold" variant="title" style={styles.title}>
            More options
          </Text>
          <Pressable
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: colors.gray100 }]}
          >
            <Ionicons name="close" size={20} color={colors.mutedText} />
          </Pressable>
        </View>

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
    </SwipeableBottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 32,
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
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
});
