import React, { memo, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from '../../../../../general/components/Icon';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'long',
});

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

type CalendarCell = {
  date: Date;
  inCurrentMonth: boolean;
};

type Props = {
  visibleMonth: Date;
  selectedDates: Date[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (date: Date) => void;
};

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function buildMonthCells(visibleMonth: Date): CalendarCell[] {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startDay = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startDay);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);

    return {
      date,
      inCurrentMonth: date.getMonth() === month,
    };
  });
}

function DateSelectionCalendar({
  onNextMonth,
  onPrevMonth,
  onSelectDate,
  selectedDates,
  visibleMonth,
}: Props) {
  const { colors, typography } = useTheme();

  const selectedKeys = useMemo(
    () => new Set(selectedDates.map((date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`)),
    [selectedDates],
  );
  const cells = useMemo(() => buildMonthCells(visibleMonth), [visibleMonth]);

  return (
    <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <View style={styles.monthHeader}>
        <Pressable
          onPress={onPrevMonth}
          style={[styles.monthIconButton, { backgroundColor: colors.backgroundTertiary }]}
        >
          <Icon type="Feather" name="chevron-left" size={16} color={colors.text} />
        </Pressable>
        <Text
          weight="medium"
          style={{
            color: colors.text,
            flex: 1,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
            textAlign: 'center',
          }}
        >
          {MONTH_LABEL_FORMATTER.format(visibleMonth)}
        </Text>
        <Pressable
          onPress={onNextMonth}
          style={[styles.monthIconButton, { backgroundColor: colors.backgroundTertiary }]}
        >
          <Icon type="Feather" name="chevron-right" size={16} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.weekDaysRow}>
        {WEEK_DAYS.map((day) => (
          <View key={day} style={styles.dayCell}>
            <Text
              weight="regular"
              style={{
                color: colors.iconMuted,
                fontSize: typography.size.sm2,
                lineHeight: typography.lineHeight.md,
              }}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((cell) => {
          const key = `${cell.date.getFullYear()}-${cell.date.getMonth()}-${cell.date.getDate()}`;
          const isSelected = selectedKeys.has(key);
          const isToday = isSameDay(cell.date, new Date());

          return (
            <Pressable
              key={key}
              onPress={() => onSelectDate(cell.date)}
              style={styles.dayCell}
            >
              <View
                style={[
                  styles.dayPill,
                  isSelected ? { backgroundColor: colors.warning } : undefined,
                ]}
              >
                <Text
                  weight="regular"
                  style={{
                    color: isSelected
                      ? colors.text
                      : cell.inCurrentMonth
                        ? colors.text
                        : colors.iconMuted,
                    fontSize: typography.size.sm2,
                    lineHeight: typography.lineHeight.md,
                    opacity: cell.inCurrentMonth ? 1 : 0.7,
                    textDecorationLine: isToday && !isSelected ? 'underline' : 'none',
                  }}
                >
                  {String(cell.date.getDate())}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default memo(DateSelectionCalendar);

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    borderWidth: 1,
    gap: 10,
    padding: 12,
  },
  dayCell: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: '14.2857%',
  },
  dayPill: {
    alignItems: 'center',
    borderRadius: 6,
    height: 30,
    justifyContent: 'center',
    marginHorizontal: 1,
    width: '96%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  monthHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthIconButton: {
    alignItems: 'center',
    borderRadius: 6,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  weekDaysRow: {
    flexDirection: 'row',
  },
});
