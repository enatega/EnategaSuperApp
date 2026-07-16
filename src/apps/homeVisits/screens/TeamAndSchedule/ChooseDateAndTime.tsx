import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../../../general/components/Button';
import Icon from '../../../../general/components/Icon';
import { showToast } from '../../../../general/components/AppToast';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import {
  getDateTimePickerHourOptions,
  getDateTimePickerMinuteOptions,
  getDateTimePickerMeridiemOptions,
  type DateTimePickerOption,
} from '../../../../general/utils/dateTimePicker';
import { formatMinutesToDurationLabel } from '../../components/ServiceCenterServicesList/serviceDuration';
import DateSelectionCalendar from '../../components/TeamAndSchedule/dateTimeFlow/DateSelectionCalendar';
import WheelPickerSheet from '../../components/TeamAndSchedule/dateTimeFlow/WheelPickerSheet';
import TeamAndScheduleHeader from '../../components/TeamAndSchedule/TeamAndScheduleHeader';
import type { HomeVisitsSingleVendorNavigationParamList } from '../../singleVendor/navigation/types';
import type { HomeVisitsScheduledSlot } from '../../types/teamSchedule';

type ChooseDateAndTimeRouteProp = RouteProp<
  HomeVisitsSingleVendorNavigationParamList,
  'ChooseDateAndTime'
>;

type Meridiem = 'AM' | 'PM';

type TimeState = {
  hourIndex: number;
  minuteIndex: number;
  meridiemIndex: number;
};

const DAY_LABEL_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});
function stripTime(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function buildDateRange(start: Date, end: Date) {
  const safeStart = stripTime(start);
  const safeEnd = stripTime(end);
  const range: Date[] = [];
  const cursor = new Date(safeStart);

  while (cursor.getTime() <= safeEnd.getTime()) {
    range.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return range;
}

function to24Hour(hour: number, meridiem: Meridiem) {
  if (meridiem === 'AM') {
    return hour === 12 ? 0 : hour;
  }

  return hour === 12 ? 12 : hour + 12;
}

function toMinutesOfDay(hour: number, minute: number, meridiem: Meridiem) {
  return (to24Hour(hour, meridiem) * 60) + minute;
}

function getTimeLabel(params: {
  state: TimeState;
  hourOptions: DateTimePickerOption<number>[];
  minuteOptions: DateTimePickerOption<number>[];
  meridiemOptions: DateTimePickerOption<Meridiem>[];
}) {
  const { hourOptions, meridiemOptions, minuteOptions, state } = params;
  const hour = hourOptions[state.hourIndex]?.label ?? '00';
  const minute = minuteOptions[state.minuteIndex]?.label ?? '00';
  const meridiem = meridiemOptions[state.meridiemIndex]?.label ?? 'AM';

  return `${hour}:${minute} ${meridiem}`;
}

function buildTimeStateFromDate(params: {
  date: Date;
  hourOptions: DateTimePickerOption<number>[];
  minuteOptions: DateTimePickerOption<number>[];
  meridiemOptions: DateTimePickerOption<Meridiem>[];
}): TimeState {
  const { date, hourOptions, minuteOptions, meridiemOptions } = params;
  const hour24 = date.getHours();
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const minuteStep = 5;
  const roundedMinute = Math.ceil(date.getMinutes() / minuteStep) * minuteStep;
  const minute = roundedMinute === 60 ? 0 : roundedMinute;
  const normalizedHour24 = roundedMinute === 60 ? (hour24 + 1) % 24 : hour24;
  const normalizedHour12 = normalizedHour24 % 12 === 0 ? 12 : normalizedHour24 % 12;
  const meridiem: Meridiem = normalizedHour24 >= 12 ? 'PM' : 'AM';

  return {
    hourIndex: Math.max(0, hourOptions.findIndex((option) => option.value === normalizedHour12 || option.value === hour12)),
    minuteIndex: Math.max(0, minuteOptions.findIndex((option) => option.value === minute)),
    meridiemIndex: Math.max(0, meridiemOptions.findIndex((option) => option.value === meridiem)),
  };
}

function buildDateFromTimeSelection(params: {
  selectedDate: Date;
  state: TimeState;
  hourOptions: DateTimePickerOption<number>[];
  minuteOptions: DateTimePickerOption<number>[];
  meridiemOptions: DateTimePickerOption<Meridiem>[];
}) {
  const { hourOptions, meridiemOptions, minuteOptions, selectedDate, state } = params;
  const hour = hourOptions[state.hourIndex]?.value ?? 12;
  const minute = minuteOptions[state.minuteIndex]?.value ?? 0;
  const meridiem = meridiemOptions[state.meridiemIndex]?.value ?? 'AM';
  const date = new Date(selectedDate);
  date.setHours(to24Hour(hour, meridiem), minute, 0, 0);
  return date;
}

function buildScheduledSlot(startDate: Date, endDate: Date): HomeVisitsScheduledSlot {
  const startTime = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`;
  const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

  return {
    startTime,
    endTime,
  };
}

function buildContractOccurrences(params: {
  startDate: Date;
  weeklyDays: number[];
  contractType: 'monthly' | 'yearly';
}) {
  const {
    contractType,
    startDate,
    weeklyDays,
  } = params;

  const start = stripTime(startDate);
  const today = stripTime(new Date());
  const safeStart = start.getTime() < today.getTime() ? today : start;
  const rangeEnd = stripTime(new Date(safeStart));
  if (contractType === 'yearly') {
    rangeEnd.setFullYear(rangeEnd.getFullYear() + 1);
  } else {
    rangeEnd.setMonth(rangeEnd.getMonth() + 1);
  }
  const results: Date[] = [];

  if (weeklyDays.length === 0) {
    return [];
  }

  const daySet = new Set(weeklyDays);
  const cursor = new Date(safeStart);
  const hardLimit = contractType === 'yearly' ? 380 : 60;
  for (let i = 0; i < hardLimit; i += 1) {
    const date = stripTime(cursor);
    if (date.getTime() >= rangeEnd.getTime()) {
      break;
    }
    if (daySet.has(date.getDay())) {
      results.push(date);
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return results;
}

export default function ChooseDateAndTime() {
  const { colors, typography } = useTheme();
  const { t, i18n } = useTranslation('homeVisits');
  const insets = useSafeAreaInsets();
  const route = useRoute<ChooseDateAndTimeRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeVisitsSingleVendorNavigationParamList>>();

  const {
    initialSelection,
    jobDescription,
    selectedServiceIds,
    selectedServices,
    serviceCenterId,
    serviceId,
    serviceMode,
    summary,
    teamSize,
    workerType,
    workingHours,
    contractType: initialContractType,
  } = route.params;

  const [visibleMonth, setVisibleMonth] = useState(() => stripTime(new Date()));
  const [selectedDates, setSelectedDates] = useState<Date[]>(() => {
    if (serviceMode === 'contract') {
      return [stripTime(new Date())];
    }

    return [stripTime(new Date())];
  });
  const [contractType, setContractType] = useState<'monthly' | 'yearly'>(
    initialContractType === 'yearly' ? 'yearly' : 'monthly',
  );
  const [weeklyDays, setWeeklyDays] = useState<number[]>(() => [new Date().getDay()]);
  const [timePickerTarget, setTimePickerTarget] = useState<'start' | null>(null);
  const [startTimeState, setStartTimeState] = useState<TimeState>({ hourIndex: 0, minuteIndex: 0, meridiemIndex: 0 });
  const [contractWorkingHours, setContractWorkingHours] = useState(() =>
    Math.max(1, Math.min(12, workingHours)),
  );

  const hourOptions = useMemo(() => getDateTimePickerHourOptions(), []);
  const minuteOptions = useMemo(() => getDateTimePickerMinuteOptions(5), []);
  const meridiemOptions = useMemo(() => getDateTimePickerMeridiemOptions(), []);
  const weekdayLabels = useMemo(
    () => Array.from({ length: 7 }, (_, index) => {
      const date = new Date(2024, 0, 7 + index);
      return new Intl.DateTimeFormat(i18n.language, { weekday: 'short' }).format(date);
    }),
    [i18n.language],
  );
  const selectedDate = selectedDates[0] ?? stripTime(new Date());
  const generatedContractDates = useMemo(() => {
    if (serviceMode !== 'contract') {
      return selectedDates;
    }

    return buildContractOccurrences({
      contractType,
      startDate: selectedDate,
      weeklyDays,
    });
  }, [
    contractType,
    selectedDate,
    selectedDates,
    serviceMode,
    weeklyDays,
  ]);
  const effectiveContractDates = serviceMode === 'contract' ? generatedContractDates : selectedDates;
  const startDateTime = buildDateFromTimeSelection({
    selectedDate,
    state: startTimeState,
    hourOptions,
    minuteOptions,
    meridiemOptions,
  });
  const endDateTime = new Date(
    startDateTime.getTime()
    + ((serviceMode === 'one-time' ? workingHours : contractWorkingHours) * 60 * 60 * 1000),
  );

  const startMinutes = toMinutesOfDay(
    hourOptions[startTimeState.hourIndex]?.value ?? 12,
    minuteOptions[startTimeState.minuteIndex]?.value ?? 0,
    meridiemOptions[startTimeState.meridiemIndex]?.value ?? 'AM',
  );
  const endMinutes = startMinutes + ((serviceMode === 'one-time' ? workingHours : contractWorkingHours) * 60);
  const effectiveWorkingHours = serviceMode === 'one-time'
    ? workingHours
    : contractWorkingHours;

  const canSubmit = selectedDates.length > 0
    && (serviceMode === 'one-time' || weeklyDays.length > 0);

  const onSelectCalendarDate = (pickedDate: Date) => {
    const maxDays = serviceMode === 'one-time' ? 1 : 365;
    const normalizedPicked = stripTime(pickedDate);
    const today = stripTime(new Date());

    if (normalizedPicked.getTime() < today.getTime()) {
      showToast.error(t('team_schedule_start_date_future_error'));
      return;
    }

    if (selectedDates.length <= 1) {
      const rangeStart = stripTime(selectedDates[0] ?? normalizedPicked);

      if (normalizedPicked.getTime() < rangeStart.getTime()) {
        setSelectedDates([normalizedPicked]);
        return;
      }

      if (serviceMode === 'contract') {
        setSelectedDates([normalizedPicked]);
        if (normalizedPicked.getTime() === today.getTime()) {
          const minAllowed = new Date();
          minAllowed.setMinutes(minAllowed.getMinutes() + 30);
          setStartTimeState(
            buildTimeStateFromDate({
              date: minAllowed,
              hourOptions,
              minuteOptions,
              meridiemOptions,
            }),
          );
        }
        return;
      }

      if (serviceMode === 'one-time') {
        setSelectedDates([normalizedPicked]);
        if (normalizedPicked.getTime() === today.getTime()) {
          const minAllowed = new Date();
          minAllowed.setMinutes(minAllowed.getMinutes() + 30);
          setStartTimeState(
            buildTimeStateFromDate({
              date: minAllowed,
              hourOptions,
              minuteOptions,
              meridiemOptions,
            }),
          );
        }
        return;
      }

      const range = buildDateRange(rangeStart, normalizedPicked);
      setSelectedDates(range.slice(0, maxDays));
      return;
    }

    setSelectedDates([normalizedPicked]);
  };

  const handleConfirm = () => {
    if (!canSubmit) {
      return;
    }

    if (serviceMode === 'contract') {
      if (weeklyDays.length === 0) {
        showToast.error(t('team_schedule_weekly_select_day_error'));
        return;
      }
      if (generatedContractDates.length === 0) {
        showToast.error(t('team_schedule_no_upcoming_visits_error'));
        return;
      }
    }

    const scheduledAtIso = startDateTime.toISOString();
    const minAllowedStart = new Date();
    minAllowedStart.setMinutes(minAllowedStart.getMinutes() + 30);
    if (startDateTime.getTime() < minAllowedStart.getTime()) {
      showToast.error(t('team_schedule_start_time_future_error'));
      return;
    }
    const oldExtraCost = Math.max(teamSize - 1, 0) * 12 * workingHours;
    const newExtraCost = Math.max(teamSize - 1, 0) * 12 * effectiveWorkingHours;
    const oldExtraDuration = workingHours * 60;
    const newExtraDuration = effectiveWorkingHours * 60;
    const totalPrice = summary.totalPrice - oldExtraCost + newExtraCost;
    const durationMinutes = summary.durationMinutes - oldExtraDuration + newExtraDuration;

    navigation.push('ReviewAndConfirm', {
      contractDays: serviceMode === 'contract'
        ? effectiveContractDates.length
        : undefined,
      contractType: serviceMode === 'contract' ? contractType : undefined,
      initialSelection,
      jobDescription,
      selectedWeekdays: serviceMode === 'contract' ? weeklyDays : undefined,
      repeatEnabled: serviceMode === 'contract',
      contractEndDateUnix:
        serviceMode === 'contract' && effectiveContractDates.length > 0
          ? stripTime(effectiveContractDates[effectiveContractDates.length - 1]).getTime()
          : undefined,
      repeatEndDateUnix:
        serviceMode === 'contract' && effectiveContractDates.length > 0
          ? stripTime(effectiveContractDates[effectiveContractDates.length - 1]).getTime()
          : undefined,
      scheduledAtIso,
      scheduledSlot: buildScheduledSlot(startDateTime, endDateTime),
      selectedDateUnix: selectedDate.getTime(),
      selectedDateUnixList: effectiveContractDates
        .map((date) => stripTime(date).getTime()),
      selectedServiceIds,
      selectedServices,
      serviceCenterId,
      serviceId,
      serviceMode,
      startTimeUnix: startDateTime.getTime(),
      endTimeUnix: serviceMode === 'one-time' ? undefined : endDateTime.getTime(),
      summary: {
        ...summary,
        totalPrice,
        durationMinutes,
        durationLabel: formatMinutesToDurationLabel(durationMinutes) ?? summary.durationLabel,
      },
      teamSize,
      workerType,
      workingHours: effectiveWorkingHours,
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}> 
      <TeamAndScheduleHeader
        onBack={() => navigation.goBack()}
        onClose={() => navigation.popToTop()}
        title={t('team_schedule_date_time_title')}
        topInset={insets.top}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text weight="extraBold" style={{ color: colors.text, fontSize: typography.size.lg, lineHeight: typography.lineHeight.md }}>
            {t('team_schedule_select_date_title')}
          </Text>

          <DateSelectionCalendar
            onNextMonth={() => setVisibleMonth((previous) => new Date(previous.getFullYear(), previous.getMonth() + 1, 1))}
            onPrevMonth={() => setVisibleMonth((previous) => new Date(previous.getFullYear(), previous.getMonth() - 1, 1))}
            onSelectDate={onSelectCalendarDate}
            selectedDates={selectedDates}
            visibleMonth={visibleMonth}
          />

          {serviceMode === 'contract' ? (
            <View style={styles.fieldWrap}>
              <Text weight="medium" style={{ color: colors.iconMuted, fontSize: typography.size.xs2, lineHeight: typography.lineHeight.sm }}>
                {`Start date: ${DAY_LABEL_FORMATTER.format(selectedDate)}`}
              </Text>
              <Text weight="medium" style={{ color: colors.blue500, fontSize: typography.size.xs2, lineHeight: typography.lineHeight.sm }}>
                Weekly visits will be created from this start date for the selected contract term.
              </Text>
            </View>
          ) : null}
        </View>

        {serviceMode === 'contract' ? (
          <View style={styles.section}>
            <Text weight="extraBold" style={{ color: colors.text, fontSize: typography.size.lg, lineHeight: typography.lineHeight.md }}>
              {t('team_schedule_contract_section_title')}
            </Text>

            <View style={styles.contractTypeRow}>
              {(['monthly', 'yearly'] as const).map((option) => {
                const selected = contractType === option;
                return (
                  <Pressable
                    key={option}
                    onPress={() => setContractType(option)}
                    style={[
                      styles.contractTypeChip,
                      {
                        borderColor: selected ? colors.warning : colors.border,
                        backgroundColor: selected ? colors.warningSoft : colors.background,
                      },
                    ]}
                  >
                    <Text style={{ color: selected ? colors.warning : colors.text }}>
                      {t(
                        option === 'yearly'
                          ? 'team_schedule_contract_type_yearly'
                          : 'team_schedule_contract_type_monthly',
                      )}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.fieldWrap}>
              <Text weight="medium" style={{ color: colors.text, fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }}>
                {t('team_schedule_repeat_weekdays_label')}
              </Text>
              <View style={styles.weekdayWrap}>
                {weekdayLabels.map((label, index) => {
                  const selected = weeklyDays.includes(index);
                  return (
                    <Pressable
                      key={label}
                      onPress={() => {
                        setWeeklyDays((previous) => (
                          previous.includes(index)
                            ? previous.filter((item) => item !== index)
                            : [...previous, index].sort((a, b) => a - b)
                        ));
                      }}
                      style={[
                        styles.weekdayChip,
                        {
                          borderColor: selected ? colors.warning : colors.border,
                          backgroundColor: selected ? colors.warningSoft : colors.background,
                        },
                      ]}
                    >
                      <Text style={{ color: selected ? colors.warning : colors.text }}>{label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.fieldWrap}>
              <Text weight="medium" style={{ color: colors.text, fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }}>
                Daily working hours
              </Text>
              <View style={[styles.hoursStepper, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <Pressable
                  onPress={() => setContractWorkingHours((current) => Math.max(1, current - 1))}
                  style={[styles.hoursAction, { borderColor: colors.border }]}
                >
                  <Text style={{ color: colors.text }}>-</Text>
                </Pressable>
                <Text weight="bold" style={{ color: colors.text }}>
                  {contractWorkingHours} hr
                </Text>
                <Pressable
                  onPress={() => setContractWorkingHours((current) => Math.min(12, current + 1))}
                  style={[styles.hoursAction, { borderColor: colors.border }]}
                >
                  <Text style={{ color: colors.text }}>+</Text>
                </Pressable>
              </View>
            </View>

            <View style={[styles.summaryCard, { borderColor: colors.border, backgroundColor: colors.backgroundTertiary }]}>
              <Text weight="medium" style={{ color: colors.text }}>
                {t('team_schedule_summary_weekly_days', { count: weeklyDays.length })}
              </Text>
              <Text style={{ color: colors.iconMuted, marginTop: 6 }}>
                {generatedContractDates.length} visit(s) will be created for this {contractType} contract.
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text weight="extraBold" style={{ color: colors.text, fontSize: typography.size.lg, lineHeight: typography.lineHeight.md }}>
            {serviceMode === 'contract' ? t('team_schedule_time_selected_days_title') : t('team_schedule_time_selected_day_title')}
          </Text>

          <View style={styles.timeRow}>
            <View style={styles.timeField}>
              <Text weight="medium" style={{ color: colors.text }}>
                {t('team_schedule_start_time_label')} <Text style={{ color: colors.dangerText }}>*</Text>
              </Text>
              <Pressable
                onPress={() => setTimePickerTarget('start')}
                style={[styles.inputLike, { borderColor: colors.border, backgroundColor: colors.background }]}
              >
                <Text style={{ color: colors.iconMuted, flex: 1 }}>
                  {getTimeLabel({ state: startTimeState, hourOptions, minuteOptions, meridiemOptions })}
                </Text>
                <Icon type="Feather" name="clock" size={16} color={colors.iconMuted} />
              </Pressable>
              {serviceMode === 'one-time' ? (
                <Text
                  weight="medium"
                  style={{
                    color: colors.iconMuted,
                    fontSize: typography.size.xs2,
                    lineHeight: typography.lineHeight.sm,
                  }}
                >
                  {t('team_schedule_one_time_start_hint')}
                </Text>
              ) : null}
            </View>

            {serviceMode === 'contract' ? (
              <View style={styles.timeField}>
                <Text weight="medium" style={{ color: colors.text }}>
                  {t('team_schedule_end_time_label')}
                </Text>
                <View style={[styles.inputLike, { borderColor: colors.border, backgroundColor: colors.background }]}>
                  <Text style={{ color: colors.text, flex: 1 }}>
                    {getTimeLabel({
                      state: buildTimeStateFromDate({
                        date: endDateTime,
                        hourOptions,
                        minuteOptions,
                        meridiemOptions,
                      }),
                      hourOptions,
                      minuteOptions,
                      meridiemOptions,
                    })}
                  </Text>
                  <Icon type="Feather" name="clock" size={16} color={colors.iconMuted} />
                </View>
              </View>
            ) : null}
          </View>

          <View style={[styles.infoCard, { backgroundColor: colors.blue50, borderColor: colors.blue100 }]}> 
            <Icon type="Feather" name="info" size={16} color={colors.blue500} />
            <Text style={{ color: colors.blue500, flex: 1, fontSize: typography.size.xs2, lineHeight: typography.lineHeight.sm }}>
              {serviceMode === 'contract'
                ? t('team_schedule_contract_info', {
                  contractType: t(
                    contractType === 'yearly'
                      ? 'team_schedule_contract_type_yearly'
                      : 'team_schedule_contract_type_monthly',
                  ).toLowerCase(),
                })
                : t('team_schedule_one_time_info')}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: Math.max(insets.bottom, 10),
          },
        ]}
      >
        <Button
          disabled={!canSubmit}
          label={t('team_schedule_date_time_confirm')}
          onPress={handleConfirm}
          style={{ backgroundColor: colors.warning, borderColor: colors.warning }}
        />
      </View>

      <WheelPickerSheet
        columns={[
          { options: hourOptions, width: 88, align: 'center' },
          { options: minuteOptions, width: 88, align: 'center' },
          { options: meridiemOptions, width: 88, align: 'center' },
        ]}
        confirmLabel={t('team_schedule_picker_confirm')}
        initialIndices={[
          startTimeState.hourIndex,
          startTimeState.minuteIndex,
          startTimeState.meridiemIndex,
        ]}
        onClose={() => setTimePickerTarget(null)}
        onConfirm={(indices) => {
          const nextState: TimeState = {
            hourIndex: indices[0] ?? 0,
            minuteIndex: indices[1] ?? 0,
            meridiemIndex: indices[2] ?? 0,
          };

          setStartTimeState(nextState);

          setTimePickerTarget(null);
        }}
        title={t('team_schedule_start_time_picker_title')}
        visible={timePickerTarget !== null}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  contractTypeChip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contractTypeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  fieldWrap: {
    gap: 4,
  },
  footer: {
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    position: 'absolute',
    right: 0,
  },
  infoCard: {
    alignItems: 'flex-start',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    padding: 10,
  },
  inputLike: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  hoursAction: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hoursStepper: {
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 52,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weekdayChip: {
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 44,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  weekdayWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  screen: {
    flex: 1,
  },
  summaryCard: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  section: {
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  timeField: {
    flex: 1,
    gap: 4,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 16,
  },
});
