import React, { memo, useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheetHandle from '../../../../general/components/BottomSheetHandle';
import Button from '../../../../general/components/Button';
import Icon from '../../../../general/components/Icon';
import SwipeableBottomSheet from '../../../../general/components/SwipeableBottomSheet';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  visible: boolean;
  title: string;
  helperText: string;
  addLabel: string;
  fieldLabel: string;
  onClose: () => void;
  onAdd: (teamSize: number) => void;
};

function CustomTeamSizeSheet({
  addLabel,
  fieldLabel,
  helperText,
  onAdd,
  onClose,
  title,
  visible,
}: Props) {
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const [rawValue, setRawValue] = useState('');

  useEffect(() => {
    if (!visible) {
      setRawValue('');
    }
  }, [visible]);

  const parsedValue = Number(rawValue);
  const isValid = Number.isInteger(parsedValue) && parsedValue >= 1 && parsedValue <= 12;

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <SwipeableBottomSheet
        modal
        collapsedHeight={0}
        expandedHeight={250 + Math.max(insets.bottom, 12)}
        handle={<BottomSheetHandle color={colors.border} />}
        onCollapsed={onClose}
        style={[
          styles.sheet,
          {
            backgroundColor: colors.surface,
            paddingBottom: Math.max(insets.bottom, 12),
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text
            weight="extraBold"
            style={{
              color: colors.text,
              flex: 1,
              fontSize: typography.size.lg,
              lineHeight: typography.lineHeight.md,
              textAlign: 'center',
            }}
          >
            {title}
          </Text>
          <Pressable
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: colors.backgroundTertiary }]}
          >
            <Icon type="Feather" name="x" size={18} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text
            weight="medium"
            style={{
              color: colors.iconMuted,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            }}
          >
            {helperText}
          </Text>

          <TextInput
            keyboardType="number-pad"
            onChangeText={(text) => setRawValue(text.replace(/[^0-9]/g, ''))}
            placeholder={fieldLabel}
            placeholderTextColor={colors.iconMuted}
            style={[
              styles.input,
              {
                borderColor: colors.border,
                color: colors.text,
                fontSize: typography.size.md,
                lineHeight: typography.lineHeight.md,
              },
            ]}
            value={rawValue}
          />
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Button
            disabled={!isValid}
            label={addLabel}
            onPress={() => {
              if (!isValid) {
                return;
              }
              onAdd(parsedValue);
              onClose();
            }}
          />
        </View>
      </SwipeableBottomSheet>
    </View>
  );
}

export default memo(CustomTeamSizeSheet);

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  content: {
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  footer: {
    borderTopWidth: 1,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerSpacer: {
    height: 32,
    width: 32,
  },
  input: {
    borderRadius: 6,
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 9, 11, 0.3)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
  },
});
