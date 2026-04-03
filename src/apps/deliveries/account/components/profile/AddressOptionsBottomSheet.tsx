import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheetHandle from '../../../../../general/components/BottomSheetHandle';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import SwipeableBottomSheet from '../../../../../general/components/SwipeableBottomSheet';

type Props = {
  isVisible: boolean;
  addressLabel: string;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  editLabel: string;
  deleteLabel: string;
};

const EXPANDED_HEIGHT = 220;

export default function AddressOptionsBottomSheet({
  isVisible,
  addressLabel,
  onClose,
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
}: Props) {
  const { colors } = useTheme();

  const handleEdit = useCallback(() => {
    onClose();
    onEdit();
  }, [onClose, onEdit]);

  const handleDelete = useCallback(() => {
    onClose();
    onDelete();
  }, [onClose, onDelete]);

  if (!isVisible) return null;

  return (
    <SwipeableBottomSheet
      expandedHeight={EXPANDED_HEIGHT}
      collapsedHeight={0}
      initialState="expanded"
      modal
      onStateChange={(state) => {
        if (state === 'collapsed') onClose();
      }}
      handle={<BottomSheetHandle color={colors.border} />}
      style={[
        styles.sheet,
        { backgroundColor: colors.background, shadowColor: colors.shadowColor },
      ]}
    >
      <View style={styles.container}>
        <Text
          weight="semiBold"
          numberOfLines={1}
          style={styles.title}
          color={colors.mutedText}
        >
          {addressLabel}
        </Text>

        <View style={styles.options}>
          <Pressable
            onPress={handleEdit}
            accessibilityRole="button"
            accessibilityLabel={editLabel}
            style={({ pressed }) => [
              styles.option,
              { backgroundColor: pressed ? colors.gray100 : 'transparent' },
            ]}
          >
            <Ionicons name="create-outline" size={20} color={colors.text} />
            <Text weight="medium" style={styles.optionText}>{editLabel}</Text>
          </Pressable>

          <Pressable
            onPress={handleDelete}
            accessibilityRole="button"
            accessibilityLabel={deleteLabel}
            style={({ pressed }) => [
              styles.option,
              { backgroundColor: pressed ? colors.gray100 : 'transparent' },
            ]}
          >
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
            <Text weight="medium" color={colors.danger} style={styles.optionText}>
              {deleteLabel}
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
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  handle: {
    borderRadius: 999,
    height: 4,
    width: 40,
  },
  handleContainer: {
    alignItems: 'center',
    paddingBottom: 12,
  },
  option: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  optionText: {
    fontSize: 15,
  },
  options: {
    gap: 4,
    marginTop: 12,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    paddingTop: 16,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
  },
  title: {
    fontSize: 13,
    textAlign: 'center',
  },
});
