import React, { memo, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import SwipeableBottomSheet from '../../../../../general/components/SwipeableBottomSheet';
import Button from '../../../../../general/components/Button';
import Icon from '../../../../../general/components/Icon';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import {
  buildScheduledDate,
  getInitialScheduledDate,
  getScheduleDayOptions,
  getScheduleHourOptions,
  getScheduleMeridiemOptions,
  getScheduleMinuteOptions,
  getScheduleWheelState,
  isScheduledDateValid,
  SCHEDULE_ROW_HEIGHT,
} from '../../../utils/rideSchedule';
import RideScheduleWheelColumn from './RideScheduleWheelColumn';

type Props = {
  visible: boolean;
  value: Date | null;
  onClose: () => void;
  onConfirm: (date: Date) => void;
};

function RideScheduleBottomSheet({
  visible,
  value,
  onClose,
  onConfirm,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('rideSharing');
  const insets = useSafeAreaInsets();
  const referenceNow = useMemo(() => new Date(), [visible]);
  const initialDate = useMemo(
    () => value ?? getInitialScheduledDate(referenceNow),
    [referenceNow, value],
  );
  const initialWheelState = useMemo(
    () => getScheduleWheelState(initialDate, referenceNow),
    [initialDate, referenceNow],
  );
  const [dayIndex, setDayIndex] = useState(initialWheelState.dayIndex);
  const [hourIndex, setHourIndex] = useState(initialWheelState.hourIndex);
  const [minuteIndex, setMinuteIndex] = useState(initialWheelState.minuteIndex);
  const [meridiemIndex, setMeridiemIndex] = useState(initialWheelState.meridiemIndex);

  const dayOptions = useMemo(() => getScheduleDayOptions(referenceNow), [referenceNow]);
  const hourOptions = useMemo(() => getScheduleHourOptions(), []);
  const minuteOptions = useMemo(() => getScheduleMinuteOptions(), []);
  const meridiemOptions = useMemo(() => getScheduleMeridiemOptions(), []);

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
    () => buildScheduledDate({
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
  const isSelectionValid = isScheduledDateValid(selectedDate, referenceNow);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <SwipeableBottomSheet
        modal
        expandedHeight={382 + Math.max(insets.bottom, 16)}
        collapsedHeight={0}
        onCollapsed={onClose}
        style={[
          styles.sheet,
          {
            backgroundColor: colors.surface,
            paddingBottom: Math.max(insets.bottom, 16),
            shadowColor: colors.shadowColor,
          },
        ]}
        handle={<View style={[styles.handle, { backgroundColor: colors.border }]} />}
        handleContainerStyle={styles.handleContainer}
      >
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text
            weight="extraBold"
            style={[
              styles.headerTitle,
              {
                fontSize: typography.size.h5,
                lineHeight: typography.lineHeight.h5,
              },
            ]}
          >
            {t('ride_schedule_label')}
          </Text>
          <Pressable
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
                top: SCHEDULE_ROW_HEIGHT * 2,
                height: SCHEDULE_ROW_HEIGHT,
              },
            ]}
          />

          <View style={styles.columns}>
            <RideScheduleWheelColumn
              options={dayOptions}
              selectedIndex={dayIndex}
              onChange={setDayIndex}
              width={126}
              align="right"
            />
            <RideScheduleWheelColumn
              options={hourOptions}
              selectedIndex={hourIndex}
              onChange={setHourIndex}
              width={34}
            />
            <RideScheduleWheelColumn
              options={minuteOptions}
              selectedIndex={minuteIndex}
              onChange={setMinuteIndex}
              width={42}
            />
            <RideScheduleWheelColumn
              options={meridiemOptions}
              selectedIndex={meridiemIndex}
              onChange={setMeridiemIndex}
              width={52}
              align="left"
            />
          </View>
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Button
            label={t('ride_schedule_set_pickup_time')}
            onPress={() => onConfirm(selectedDate)}
            disabled={!isSelectionValid}
            style={styles.confirmButton}
          />
        </View>
      </SwipeableBottomSheet>
    </View>
  );
}

export default memo(RideScheduleBottomSheet);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(9, 9, 11, 0.3)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 999,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  headerSpacer: {
    width: 32,
    height: 32,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerWrap: {
    position: 'relative',
    marginBottom: 16,
  },
  selectionOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  columns: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  footer: {
    borderTopWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  confirmButton: {
    borderRadius: 6,
    backgroundColor: '#1691BF',
    borderColor: '#1691BF',
  },
});
