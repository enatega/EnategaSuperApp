import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import BottomSheetHandle from "../../../../general/components/BottomSheetHandle";
import Button from "../../../../general/components/Button";
import Icon from "../../../../general/components/Icon";
import SwipeableBottomSheet from "../../../../general/components/SwipeableBottomSheet";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";
import type { AppointmentBookingAvailabilitySlot } from "../../api/types";
import { formatAppointmentDateKey } from "../../utils/appointmentBooking";

const DATE_RANGE_DAYS = 7;

type Props = {
  availableSlots: AppointmentBookingAvailabilitySlot[];
  isConfirming: boolean;
  isLoadingSlots: boolean;
  onClose: () => void;
  onConfirm: (slot: AppointmentBookingAvailabilitySlot) => void;
  onDateChange: (date: Date) => void;
  selectedDate: Date;
  visible: boolean;
  confirmLabel?: string;
};

function buildDateOptions() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  return Array.from({ length: DATE_RANGE_DAYS }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

export default function AppointmentAvailabilityBottomSheet({
  availableSlots,
  isConfirming,
  isLoadingSlots,
  onClose,
  onConfirm,
  onDateChange,
  selectedDate,
  visible,
  confirmLabel,
}: Props) {
  const { colors, typography } = useTheme();
  const { i18n, t } = useTranslation("appointments");
  const insets = useSafeAreaInsets();
  const dateOptions = useMemo(() => buildDateOptions(), [visible]);
  const weekdayFormatter = useMemo(
    () => new Intl.DateTimeFormat(i18n.language, { weekday: "short" }),
    [i18n.language],
  );
  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(i18n.language, { month: "short" }),
    [i18n.language],
  );
  const [selectedSlot, setSelectedSlot] =
    useState<AppointmentBookingAvailabilitySlot | null>(null);

  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedDate, visible]);

  useEffect(() => {
    if (
      selectedSlot &&
      !availableSlots.some((slot) => slot.startAt === selectedSlot.startAt)
    ) {
      setSelectedSlot(null);
    }
  }, [availableSlots, selectedSlot]);

  if (!visible) {
    return null;
  }

  const selectedDateKey = formatAppointmentDateKey(selectedDate);

  return (
    <View style={styles.overlay}>
      <Pressable onPress={onClose} style={styles.backdrop} />

      <SwipeableBottomSheet
        collapsedHeight={0}
        expandedHeight={500 + Math.max(insets.bottom, 16)}
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
          <Text
            style={{
              color: colors.text,
              fontSize: typography.size.lg,
              lineHeight: typography.lineHeight.lg,
            }}
            weight="extraBold"
          >
            {t("team_schedule_available_slots_title")}
          </Text>
          <Pressable
            hitSlop={12}
            onPress={onClose}
            style={[
              styles.closeButton,
              { backgroundColor: colors.backgroundTertiary },
            ]}
          >
            <Icon color={colors.text} name="x" size={18} type="Feather" />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          contentContainerStyle={styles.dateList}
          showsHorizontalScrollIndicator={false}
          style={styles.dateScroller}
        >
          {dateOptions.map((date, index) => {
            const dateKey = formatAppointmentDateKey(date);
            const isSelected = dateKey === selectedDateKey;
            const dayLabel =
              index === 0
                ? t("team_schedule_today").toLocaleUpperCase(i18n.language)
                : weekdayFormatter
                    .format(date)
                    .toLocaleUpperCase(i18n.language);
            const monthLabel = monthFormatter.format(date);

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                key={dateKey}
                disabled={isLoadingSlots || isConfirming}
                onPress={() => onDateChange(date)}
                style={[
                  styles.dateChip,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: isSelected ? colors.white : colors.mutedText,
                    fontSize: typography.size.xs2,
                    lineHeight: typography.lineHeight.sm,
                  }}
                  weight="semiBold"
                >
                  {dayLabel}
                </Text>
                <Text
                  style={{
                    color: isSelected ? colors.white : colors.text,
                    fontSize: typography.size.xl,
                    lineHeight: typography.lineHeight.xl,
                  }}
                  weight="semiBold"
                >
                  {date.getDate()}
                </Text>
                <Text
                  style={{
                    color: isSelected ? colors.white : colors.mutedText,
                    fontSize: typography.size.sm2,
                    lineHeight: typography.lineHeight.md,
                  }}
                >
                  {monthLabel}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.slotSection}>
          <Text
            style={{
              color: colors.text,
              fontSize: typography.size.md2,
              lineHeight: typography.lineHeight.md,
            }}
            weight="semiBold"
          >
            {t("team_schedule_available_times")}
          </Text>

          {isLoadingSlots ? (
            <View style={styles.centerState}>
              <ActivityIndicator color={colors.primary} />
              <Text
                style={{
                  color: colors.mutedText,
                  fontSize: typography.size.sm2,
                }}
              >
                {t("team_schedule_loading_slots")}
              </Text>
            </View>
          ) : availableSlots.length > 0 ? (
            <ScrollView contentContainerStyle={styles.slotList}>
              {availableSlots.map((slot) => {
                const isSelected = selectedSlot?.startAt === slot.startAt;
                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    disabled={isConfirming}
                    key={slot.startAt}
                    onPress={() => setSelectedSlot(slot)}
                    style={[
                      styles.slotChip,
                      {
                        backgroundColor: isSelected
                          ? colors.cardSoft
                          : colors.surface,
                        borderColor: isSelected
                          ? colors.primary
                          : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: isSelected ? colors.primary : colors.text,
                        fontSize: typography.size.sm2,
                        lineHeight: typography.lineHeight.md,
                        textAlign: "center",
                      }}
                      weight="semiBold"
                    >
                      {slot.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : (
            <View style={styles.centerState}>
              <Text
                style={{
                  color: colors.mutedText,
                  fontSize: typography.size.sm2,
                  lineHeight: typography.lineHeight.md,
                  textAlign: "center",
                }}
              >
                {t("team_schedule_no_slots")}
              </Text>
            </View>
          )}
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Button
            disabled={!selectedSlot || isLoadingSlots || isConfirming}
            isLoading={isConfirming}
            label={confirmLabel ?? t("team_schedule_picker_confirm")}
            onPress={() => selectedSlot && onConfirm(selectedSlot)}
            style={styles.confirmButton}
          />
        </View>
      </SwipeableBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  centerState: {
    alignItems: "center",
    flex: 1,
    gap: 10,
    justifyContent: "center",
    minHeight: 150,
    paddingHorizontal: 24,
  },
  closeButton: {
    alignItems: "center",
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  confirmButton: {
    borderRadius: 6,
    minHeight: 48,
    marginBottom: 10,
  },
  dateChip: {
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    gap: 2,
    height: 108,
    justifyContent: "center",
    paddingHorizontal: 8,
    width: 88,
  },
  dateList: {
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dateScroller: {
    flexGrow: 0,
    maxHeight: 124,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  headerSpacer: {
    height: 32,
    width: 32,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(9, 9, 11, 0.3)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
  },
  slotChip: {
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 50,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: "48%",
  },
  slotList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  slotSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});
