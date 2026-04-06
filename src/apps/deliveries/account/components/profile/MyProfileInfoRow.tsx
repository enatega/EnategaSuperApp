import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  label: string;
  value: string | null | undefined;
  isEditable?: boolean;
  editLabel?: string;
  onEdit?: () => void;
};

export default function MyProfileInfoRow({
  label,
  value,
  isEditable = false,
  editLabel,
  onEdit,
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.infoRow}>
      <View style={styles.infoRowHeader}>
        <Text weight="bold" style={styles.infoLabel}>
          {label}
        </Text>
        {isEditable && editLabel ? (
          <Pressable onPress={onEdit} accessibilityRole="button">
            <Text weight="medium" color={colors.text} style={styles.editText}>
              {editLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
      <Text weight="medium" color={colors.mutedText} style={styles.infoValue}>
        {value || '—'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  editText: {
    fontSize: 14,
    lineHeight: 22,
  },
  infoLabel: {
    fontSize: 14,
    lineHeight: 22,
  },
  infoRow: {
    gap: 4,
    height: 44,
    justifyContent: 'center',
  },
  infoRowHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoValue: {
    fontSize: 12,
    lineHeight: 18,
  },
});
