import React, { memo, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheetHandle from '../BottomSheetHandle';
import Button from '../Button';
import Icon from '../Icon';
import Text from '../Text';
import SwipeableBottomSheet from '../SwipeableBottomSheet';
import { useTheme } from '../../theme/theme';
import {
  buildDateTimePickerDate,
  DATE_TIME_PICKER_DEFAULT_DAY_RANGE,
  DATE_TIME_PICKER_DEFAULT_MIN_LEAD_MINUTES,
  DATE_TIME_PICKER_DEFAULT_MINUTE_INTERVAL,
  DATE_TIME_PICKER_ROW_HEIGHT,
  getDateTimePickerDayOptions,
  getDateTimePickerHourOptions,
  getDateTimePickerMeridiemOptions,
  getDateTimePickerMinuteOptions,
  getDateTimePickerWheelState,
  getInitialDateTimePickerDate,
  isDateTimePickerDateValid,
} from '../../utils/dateTimePicker';
import DateTimePickerWheelColumn from './DateTimePickerWheelColumn';

type Props = {
  visible: boolean;
  value: Date | null;
  title: string;
  confirmLabel: string;
  todayLabel?: string;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  isConfirmLoading?: boolean;
  minLeadMinutes?: number;
  minuteInterval?: number;
  dayRange?: number;
};

function DateTimePickerBottomSheet({
  confirmLabel,
  dayRange = DATE_TIME_PICKER_DEFAULT_DAY_RANGE,
  minLeadMinutes = DATE_TIME_PICKER_DEFAULT_MIN_LEAD_MINUTES,
  minuteInterval = DATE_TIME_PICKER_DEFAULT_MINUTE_INTERVAL,
  onClose,
  onConfirm,
  isConfirmLoading = false,
  title,
  todayLabel,
  value,
  visible,
}: Props) {
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const referenceNow = useMemo(() => new Date(), [visible]);
  const initialDate = useMemo(
    () => value ?? getInitialDateTimePickerDate({ now: referenceNow, minLeadMinutes, minuteInterval }),
    [minLeadMinutes, minuteInterval, referenceNow, value],
  );
  const initialWheelState = useMemo(
    () =>
      getDateTimePickerWheelState(initialDate, {
        now: referenceNow,
        dayRange,
        minuteInterval,
      }),
    [dayRange, initialDate, minuteInterval, referenceNow],
  );
  const [dayIndex, setDayIndex] = useState(initialWheelState.dayIndex);
  const [hourIndex, setHourIndex] = useState(initialWheelState.hourIndex);
  const [minuteIndex, setMinuteIndex] = useState(initialWheelState.minuteIndex);
  const [meridiemIndex, setMeridiemIndex] = useState(initialWheelState.meridiemIndex);

  const dayOptions = useMemo(
    () => getDateTimePickerDayOptions({ now: referenceNow, dayRange, todayLabel }),
    [dayRange, referenceNow, todayLabel],
  );
  const hourOptions = useMemo(() => getDateTimePickerHourOptions(), []);
  const minuteOptions = useMemo(
    () => getDateTimePickerMinuteOptions(minuteInterval),
    [minuteInterval],
  );
  const meridiemOptions = useMemo(() => getDateTimePickerMeridiemOptions(), []);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setDayIndex(initialWheelState.dayIndex);
    setHourIndex(initialWheelState.hourIndex);
    setMinuteIndex(initialWheelState.minuteIndex);
    setMeridiemIndex(initialWheelState.meridiemIndex);
  }, [initialWheelState, visible]);

  const selectedDate = useMemo(
    () =>
      buildDateTimePickerDate({
        dayOffset: dayOptions[dayIndex]?.value ?? 0,
        hour: hourOptions[hourIndex]?.value ?? 12,
        minute: minuteOptions[minuteIndex]?.value ?? 0,
        meridiem: meridiemOptions[meridiemIndex]?.value ?? 'AM',
        now: referenceNow,
      }),
    [
      dayIndex,
      dayOptions,
      hourIndex,
      hourOptions,
      meridiemIndex,
      meridiemOptions,
      minuteIndex,
      minuteOptions,
      referenceNow,
    ],
  );
  const isSelectionValid = isDateTimePickerDateValid(selectedDate, {
    now: referenceNow,
    minLeadMinutes,
    minuteInterval,
  });

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <SwipeableBottomSheet
        modal
        collapsedHeight={0}
        expandedHeight={382 + Math.max(insets.bottom, 16)}
        handle={<BottomSheetHandle color={colors.border} />}
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
          <Text
            style={[
              styles.headerTitle,
              {
                color: colors.text,
                fontSize: typography.size.lg,
                lineHeight: typography.lineHeight.md,
              },
            ]}
            weight="extraBold"
          >
            {title}
          </Text>
          <Pressable
            hitSlop={12}
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: colors.backgroundTertiary }]}
          >
            <Icon type="Feather" name="x" size={18} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.pickerWrap}>
          <View
            pointerEvents="none"
            style={[
              styles.selectionOverlay,
              {
                backgroundColor: colors.backgroundTertiary,
                top: DATE_TIME_PICKER_ROW_HEIGHT * 2,
                height: DATE_TIME_PICKER_ROW_HEIGHT,
              },
            ]}
          />

          <View style={styles.columns}>
            <DateTimePickerWheelColumn
              align="right"
              onChange={setDayIndex}
              options={dayOptions}
              selectedIndex={dayIndex}
              width={126}
            />
            <DateTimePickerWheelColumn
              onChange={setHourIndex}
              options={hourOptions}
              selectedIndex={hourIndex}
              width={34}
            />
            <DateTimePickerWheelColumn
              onChange={setMinuteIndex}
              options={minuteOptions}
              selectedIndex={minuteIndex}
              width={42}
            />
            <DateTimePickerWheelColumn
              align="left"
              onChange={setMeridiemIndex}
              options={meridiemOptions}
              selectedIndex={meridiemIndex}
              width={52}
            />
          </View>
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Button
            disabled={!isSelectionValid || isConfirmLoading}
            isLoading={isConfirmLoading}
            label={confirmLabel}
            onPress={() => onConfirm(selectedDate)}
            style={styles.confirmButton}
          />
        </View>
      </SwipeableBottomSheet>
    </View>
  );
}

export default memo(DateTimePickerBottomSheet);

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
    gap: 24,
    justifyContent: 'center',
  },
  confirmButton: {
    borderRadius: 6,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  headerSpacer: {
    height: 32,
    width: 32,
  },
  headerTitle: {
    flex: 1,
    marginHorizontal: 12,
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 9, 11, 0.3)',
    justifyContent: 'flex-end',
  },
  pickerWrap: {
    marginBottom: 16,
    position: 'relative',
  },
  selectionOverlay: {
    left: 0,
    position: 'absolute',
    right: 0,
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
