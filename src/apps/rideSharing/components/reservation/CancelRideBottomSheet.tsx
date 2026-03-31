import React, { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, View, Pressable } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import SwipeableBottomSheet from '../../../../general/components/SwipeableBottomSheet';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onConfirmCancel: () => void;
  expandedHeight?: number;
  title?: string;
  confirmLabel?: string;
  continueLabel?: string;
  isLoading?: boolean;
};

const DEFAULT_EXPANDED_HEIGHT = 280;

export default function CancelRideBottomSheet({
  isVisible,
  onClose,
  onConfirmCancel,
  expandedHeight = DEFAULT_EXPANDED_HEIGHT,
  title = 'Are you sure?',
  confirmLabel = 'Yes, cancel the ride',
  continueLabel = 'No, Continue the ride',
  isLoading = false,
}: Props) {
  const { colors } = useTheme();

  const handleConfirmCancel = useCallback(() => {
    if (isLoading) {
      return;
    }

    onConfirmCancel();
  }, [isLoading, onConfirmCancel]);

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
      handle={<View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />}
      handleContainerStyle={styles.handleContainer}
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
            {title}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            onPress={handleConfirmCancel}
            disabled={isLoading}
            style={({ pressed }) => [
              styles.cancelButton,
              { backgroundColor: colors.danger },
              pressed && styles.cancelButtonPressed,
              isLoading ? styles.disabledButton : null,
            ]}
            hitSlop={{ top: 4, bottom: 4, left: 8, right: 8 }}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text weight="semiBold" style={styles.cancelButtonText}>
                {confirmLabel}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={onClose}
            disabled={isLoading}
            style={({ pressed }) => [
              styles.continueButton,
              { backgroundColor: colors.gray100 },
              pressed && styles.continueButtonPressed,
              isLoading ? styles.disabledButton : null,
            ]}
            hitSlop={{ top: 4, bottom: 4, left: 8, right: 8 }}
          >
            <Text weight="semiBold" color={colors.text}>
              {continueLabel}
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
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  disabledButton: {
    opacity: 0.75,
  },
  cancelButton: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonPressed: {
    opacity: 0.85,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  continueButton: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonPressed: {
    opacity: 0.7,
  },
});
