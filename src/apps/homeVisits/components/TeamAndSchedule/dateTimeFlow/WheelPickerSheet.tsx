import React, { memo, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheetHandle from '../../../../../general/components/BottomSheetHandle';
import Button from '../../../../../general/components/Button';
import Icon from '../../../../../general/components/Icon';
import Text from '../../../../../general/components/Text';
import SwipeableBottomSheet from '../../../../../general/components/SwipeableBottomSheet';
import DateTimePickerWheelColumn from '../../../../../general/components/dateTimePicker/DateTimePickerWheelColumn';
import {
  DATE_TIME_PICKER_ROW_HEIGHT,
  type DateTimePickerOption,
} from '../../../../../general/utils/dateTimePicker';
import { useTheme } from '../../../../../general/theme/theme';

type PickerColumn<TValue extends string | number> = {
  options: DateTimePickerOption<TValue>[];
  width: number;
  align?: 'left' | 'center' | 'right';
};

type Props = {
  visible: boolean;
  title: string;
  subtitle?: string;
  confirmLabel: string;
  columns: [PickerColumn<any>, ...PickerColumn<any>[]];
  initialIndices: number[];
  onClose: () => void;
  onConfirm: (indices: number[]) => void;
};

function WheelPickerSheet({
  columns,
  confirmLabel,
  initialIndices,
  onClose,
  onConfirm,
  subtitle,
  title,
  visible,
}: Props) {
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const [indices, setIndices] = useState<number[]>(initialIndices);

  const horizontalPadding = Math.max(16, Math.min(28, Math.round(screenWidth * 0.05)));
  const columnsGap = 10;
  const columnCount = columns.length;
  const computedColumnWidth = Math.floor(
    (screenWidth - (horizontalPadding * 2) - (columnsGap * (columnCount - 1))) / columnCount,
  );
  useEffect(() => {
    if (!visible) {
      return;
    }

    setIndices(initialIndices);
  }, [initialIndices, visible]);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <SwipeableBottomSheet
        collapsedHeight={0}
        expandedHeight={390 + Math.max(insets.bottom, 16)}
        handle={<BottomSheetHandle color={colors.border} />}
        modal
        onCollapsed={onClose}
        style={[
          styles.sheet,
          {
            backgroundColor: colors.surface,
            paddingBottom: Math.max(insets.bottom, 16),
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <View style={styles.headerTitleWrap}>
            <Text
              style={{
                color: colors.text,
                fontSize: typography.size.lg,
                lineHeight: typography.lineHeight.md,
                textAlign: 'center',
              }}
              weight="extraBold"
            >
              {title}
            </Text>
            {subtitle ? (
              <Text
                style={{
                  color: colors.iconMuted,
                  fontSize: typography.size.xs2,
                  lineHeight: typography.lineHeight.sm,
                  textAlign: 'center',
                }}
                weight="medium"
              >
                {subtitle}
              </Text>
            ) : null}
          </View>
          <Pressable
            hitSlop={10}
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: colors.backgroundTertiary }]}
          >
            <Icon type="Feather" name="x" size={18} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.pickerWrap}>
          <View style={styles.columnsWrap}>
            <View
              pointerEvents="none"
              style={[
                styles.selectionOverlay,
                {
                  backgroundColor: colors.backgroundTertiary,
                  height: DATE_TIME_PICKER_ROW_HEIGHT,
                  top: DATE_TIME_PICKER_ROW_HEIGHT * 2,
                  left: horizontalPadding,
                  right: horizontalPadding,
                },
              ]}
            />

            <View style={[styles.columns, { gap: columnsGap }]}>
              {columns.map((column, columnIndex) => (
                <DateTimePickerWheelColumn
                  key={String(columnIndex)}
                  align={column.align}
                  onChange={(nextIndex) => {
                    setIndices((previous) => {
                      const next = [...previous];
                      next[columnIndex] = nextIndex;
                      return next;
                    });
                  }}
                  options={column.options}
                  selectedIndex={indices[columnIndex] ?? 0}
                  width={Math.max(72, computedColumnWidth)}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}> 
          <Button
            label={confirmLabel}
            onPress={() => onConfirm(indices)}
            style={[styles.confirmButton, { backgroundColor: colors.warning, borderColor: colors.warning }]}
          />
        </View>
      </SwipeableBottomSheet>
    </View>
  );
}

export default memo(WheelPickerSheet);

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
  columns: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  columnsWrap: {
    width: '100%',
  },
  confirmButton: {
    borderRadius: 6,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 2,
    paddingHorizontal: 16,
  },
  headerTitleWrap: {
    flex: 1,
    gap: 2,
  },
  headerSpacer: {
    height: 32,
    width: 32,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 9, 11, 0.3)',
    justifyContent: 'flex-end',
  },
  pickerWrap: {
    marginBottom: 8,
    position: 'relative',
  },
  selectionOverlay: {
    borderRadius: 8,
    position: 'absolute',
    zIndex: -1,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
  },
});
