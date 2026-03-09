import React, { useCallback } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import SwipeableBottomSheet from '../../../../general/components/SwipeableBottomSheet';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onConfirmCancel: () => void;
  expandedHeight?: number;
};

const DEFAULT_EXPANDED_HEIGHT = 280;

export default function CancelRideBottomSheet({
  isVisible,
  onClose,
  onConfirmCancel,
  expandedHeight = DEFAULT_EXPANDED_HEIGHT,
}: Props) {
  const { colors } = useTheme();

  const handleConfirmCancel = useCallback(() => {
    onConfirmCancel();
    onClose();
  }, [onConfirmCancel, onClose]);

  const renderHandle = useCallback(
    () => (
      <View style={[styles.handleContainer, { backgroundColor: colors.backgroundTertiary }]}>
        <View style={[styles.handleBar, { backgroundColor: colors.mutedText }]} />
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
        <View style={styles.closeButtonContainer}>
          <Pressable
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: colors.backgroundTertiary }]}
          >
            <Ionicons name="close" size={24} color={colors.mutedText} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text weight="semiBold" variant="subtitle" style={styles.title}>
            Are you sure?
          </Text>

          <Pressable
            onPress={handleConfirmCancel}
            style={({ pressed }) => [
              styles.cancelButton,
              { backgroundColor: colors.danger },
              pressed && styles.cancelButtonPressed,
            ]}
          >
            <Text weight="semiBold" style={styles.cancelButtonText}>
              Yes, cancel the ride
            </Text>
          </Pressable>

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.continueButton,
              { backgroundColor: colors.backgroundTertiary },
              pressed && styles.continueButtonPressed,
            ]}
          >
            <Text weight="semiBold" color={colors.text}>
              No, Continue the ride
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
    paddingTop: 16,
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  closeButtonContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 8,
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonPressed: {
    opacity: 0.9,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  continueButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonPressed: {
    opacity: 0.8,
  },
});
