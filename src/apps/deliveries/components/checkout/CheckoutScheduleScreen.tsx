import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Button from '../../../../general/components/Button';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { useCheckoutSchedule } from '../../hooks';
import ListStateView from '../filterablePaginatedList/ListStateView';
import CheckoutHeader from './CheckoutHeader';
import {
  buildCheckoutScheduleDayOptions,
  buildCheckoutScheduleSlots,
  findCheckoutScheduleDayKey,
  type CheckoutScheduleDayKey,
} from './checkoutScheduleUtils';

type Props = {
  onBackPress: () => void;
  onConfirm: (scheduledAt: string) => void;
  selectedScheduledAt?: string | null;
  storeId: string | null;
};

export default function CheckoutScheduleScreen({
  onBackPress,
  onConfirm,
  selectedScheduledAt,
  storeId,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const scheduleInput = React.useMemo(
    () => ({
      dateTime: new Date().toISOString(),
      days: 2,
      slotMinutes: 60,
    }),
    [selectedScheduledAt],
  );
  const {
    data: schedule,
    isError,
    isPending,
    refetch,
  } = useCheckoutSchedule(storeId, scheduleInput);
  const [selectedDayKey, setSelectedDayKey] = React.useState<CheckoutScheduleDayKey | null>(
    findCheckoutScheduleDayKey(schedule, selectedScheduledAt),
  );

  React.useEffect(() => {
    const nextDayKey = findCheckoutScheduleDayKey(schedule, selectedScheduledAt);

    setSelectedDayKey((currentValue) => {
      if (currentValue && schedule?.days.some((day) => day.date === currentValue)) {
        return currentValue;
      }

      return nextDayKey;
    });
  }, [schedule, selectedScheduledAt]);

  const dayOptions = React.useMemo(
    () => buildCheckoutScheduleDayOptions(schedule, {
      today: t('checkout_schedule_today'),
      tomorrow: t('checkout_schedule_tomorrow'),
    }),
    [schedule, t],
  );
  const slots = React.useMemo(
    () => selectedDayKey
      ? buildCheckoutScheduleSlots(schedule, selectedDayKey)
      : [],
    [schedule, selectedDayKey],
  );
  const [selectedScheduledSlot, setSelectedScheduledSlot] = React.useState<string | null>(
    selectedScheduledAt ?? null,
  );

  React.useEffect(() => {
    setSelectedScheduledSlot((currentValue) => {
      if (currentValue && slots.some((slot) => slot.scheduledAt === currentValue)) {
        return currentValue;
      }

      return slots[0]?.scheduledAt ?? null;
    });
  }, [slots]);

  const isConfirmDisabled = !selectedScheduledSlot || isPending || !schedule?.allowScheduleBooking;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <CheckoutHeader
        onBackPress={onBackPress}
        title={t('checkout_schedule_title')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isPending ? (
          <ListStateView
            containerStyle={styles.stateBlock}
            variant="loading"
          />
        ) : isError ? (
          <ListStateView
            actionLabel={t('generic_list_retry')}
            containerStyle={styles.stateBlock}
            description={t('checkout_schedule_error_message')}
            onActionPress={() => {
              void refetch();
            }}
            title={t('checkout_schedule_error_title')}
            variant="error"
          />
        ) : !schedule?.allowScheduleBooking || dayOptions.length === 0 ? (
          <ListStateView
            containerStyle={styles.stateBlock}
            description={t('checkout_schedule_empty_message')}
            title={t('checkout_schedule_empty_title')}
            variant="empty"
          />
        ) : (
          <>
            <View
              style={[
                styles.dayTabs,
                { backgroundColor: colors.backgroundTertiary },
              ]}
            >
              {dayOptions.map((option) => {
                const isSelected = option.key === selectedDayKey;

                return (
                  <Pressable
                    accessibilityRole="button"
                    disabled={!option.hasSlots}
                    key={option.key}
                    onPress={() => {
                      setSelectedDayKey(option.key);
                    }}
                    style={[
                      styles.dayTab,
                      isSelected && {
                        backgroundColor: colors.surface,
                        shadowColor: colors.shadowColor,
                      },
                    ]}
                  >
                    <Text
                      weight="medium"
                      style={{
                        color: isSelected ? colors.text : colors.mutedText,
                        fontSize: typography.size.sm2,
                        lineHeight: typography.lineHeight.md,
                        opacity: option.hasSlots ? 1 : 0.5,
                      }}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {slots.length === 0 ? (
              <ListStateView
                containerStyle={styles.stateBlock}
                description={t('checkout_schedule_empty_message')}
                title={t('checkout_schedule_empty_title')}
                variant="empty"
              />
            ) : (
              <View style={styles.slotList}>
                {slots.map((slot) => {
                  const isSelected = slot.scheduledAt === selectedScheduledSlot;

                  return (
                    <Pressable
                      accessibilityRole="button"
                      key={slot.id}
                      onPress={() => {
                        setSelectedScheduledSlot(slot.scheduledAt);
                      }}
                      style={[
                        styles.slotButton,
                        {
                          backgroundColor: isSelected ? colors.blue100 : colors.surface,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <Text
                        weight="medium"
                        style={{
                          color: isSelected ? colors.blue800 : colors.mutedText,
                          fontSize: typography.size.sm2,
                          lineHeight: typography.lineHeight.md,
                        }}
                      >
                        {slot.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.noteRow}>
          <Ionicons color={colors.mutedText} name="alert-circle-outline" size={18} />
          <Text
            color={colors.mutedText}
            style={{
              fontSize: typography.size.xs2,
              lineHeight: typography.lineHeight.sm,
            }}
          >
            {t('checkout_schedule_unavailable_note')}
          </Text>
        </View>

        <Button
          disabled={isConfirmDisabled}
          label={t('checkout_schedule_confirm')}
          onPress={() => {
            if (!selectedScheduledSlot) {
              return;
            }

            onConfirm(selectedScheduledSlot);
          }}
          style={styles.confirmButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  confirmButton: {
    minHeight: 44,
  },
  content: {
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  dayTab: {
    alignItems: 'center',
    borderRadius: 4,
    flex: 1,
    justifyContent: 'center',
    minHeight: 32,
    paddingHorizontal: 12,
    paddingVertical: 4,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dayTabs: {
    borderRadius: 6,
    flexDirection: 'row',
    padding: 4,
  },
  footer: {
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  noteRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    paddingBottom: 8,
  },
  screen: {
    flex: 1,
  },
  stateBlock: {
    minHeight: 240,
  },
  slotButton: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  slotList: {
    gap: 12,
  },
});
