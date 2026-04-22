import React, { memo, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheetHandle from '../../../../general/components/BottomSheetHandle';
import Button from '../../../../general/components/Button';
import Icon from '../../../../general/components/Icon';
import SwipeableBottomSheet from '../../../../general/components/SwipeableBottomSheet';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

const PRESET_DAYS = [7, 15, 30] as const;

type Props = {
  visible: boolean;
  title: string;
  helperText: string;
  addLabel: string;
  customLabel: string;
  customPlaceholder: string;
  formatDaysLabel: (days: number) => string;
  initialDays: number;
  onClose: () => void;
  onAdd: (days: number) => void;
};

function ContractTimeRangeSheet({
  addLabel,
  customLabel,
  customPlaceholder,
  formatDaysLabel,
  helperText,
  initialDays,
  onAdd,
  onClose,
  title,
  visible,
}: Props) {
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedPreset, setSelectedPreset] = useState<number | 'custom'>(30);
  const [customDaysRaw, setCustomDaysRaw] = useState('');

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (PRESET_DAYS.includes(initialDays as (typeof PRESET_DAYS)[number])) {
      setSelectedPreset(initialDays);
      setCustomDaysRaw('');
      return;
    }

    setSelectedPreset('custom');
    setCustomDaysRaw(String(initialDays));
  }, [initialDays, visible]);

  const parsedCustomDays = Number(customDaysRaw);
  const resolvedDays = selectedPreset === 'custom' ? parsedCustomDays : selectedPreset;
  const isValidDays =
    Number.isInteger(resolvedDays) &&
    resolvedDays >= 1 &&
    resolvedDays <= 365;

  const displayOptions = useMemo(
    () => [
      ...PRESET_DAYS.map((days) => ({
        id: days,
        label: formatDaysLabel(days),
      })),
      {
        id: 'custom' as const,
        label: customLabel,
      },
    ],
    [customLabel, formatDaysLabel],
  );

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <SwipeableBottomSheet
        modal
        collapsedHeight={0}
        expandedHeight={300 + Math.max(insets.bottom, 12)}
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
              fontSize: typography.size.xs2,
              lineHeight: typography.lineHeight.sm,
            }}
          >
            {helperText}
          </Text>

          <View style={styles.toggleWrap}>
            {displayOptions.map((option) => {
              const isSelected = selectedPreset === option.id;

              return (
                <Pressable
                  key={String(option.id)}
                  onPress={() => setSelectedPreset(option.id)}
                  style={[
                    styles.toggle,
                    {
                      backgroundColor: isSelected ? colors.warningSoft : colors.background,
                      borderColor: isSelected ? colors.warning : colors.border,
                    },
                  ]}
                >
                  {isSelected ? (
                    <Icon type="Feather" name="check" size={14} color={colors.text} />
                  ) : option.id === 'custom' ? (
                    <Icon type="Feather" name="plus" size={14} color={colors.text} />
                  ) : null}

                  <Text
                    weight="medium"
                    style={{
                      color: colors.text,
                      fontSize: typography.size.sm2,
                      lineHeight: typography.lineHeight.md,
                    }}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {selectedPreset === 'custom' ? (
            <TextInput
              keyboardType="number-pad"
              onChangeText={(text) => setCustomDaysRaw(text.replace(/[^0-9]/g, ''))}
              placeholder={customPlaceholder}
              placeholderTextColor={colors.iconMuted}
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  fontSize: typography.size.md2,
                  lineHeight: typography.lineHeight.md2,
                },
              ]}
              value={customDaysRaw}
            />
          ) : null}
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Button
            disabled={!isValidDays}
            label={addLabel}
            onPress={() => {
              if (!isValidDays) {
                return;
              }

              onAdd(resolvedDays);
              onClose();
            }}
            style={!isValidDays ? { backgroundColor: colors.backgroundTertiary, borderColor: colors.backgroundTertiary } : undefined}
          />
        </View>
      </SwipeableBottomSheet>
    </View>
  );
}

export default memo(ContractTimeRangeSheet);

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
  toggle: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  toggleWrap: {
    flexDirection: 'row',
    gap: 10,
  },
});
