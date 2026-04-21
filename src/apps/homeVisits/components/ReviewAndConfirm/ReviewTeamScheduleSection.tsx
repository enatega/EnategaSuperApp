import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import ReviewSectionCard from './ReviewSectionCard';

type Props = {
  title: string;
  teamLabel: string;
  hoursLabel: string;
  typeLabel: string;
  dateTimeLabel: string;
  teamSizeLabel: string;
  workingHoursLabel: string;
  serviceModeLabel: string;
  scheduleLabel: string;
};

function ReviewTeamScheduleSection({
  dateTimeLabel,
  hoursLabel,
  scheduleLabel,
  serviceModeLabel,
  teamSizeLabel,
  teamLabel,
  title,
  typeLabel,
  workingHoursLabel,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <ReviewSectionCard>
      <Text
        weight="bold"
        style={{
          color: colors.text,
          fontSize: typography.size.sm2,
          lineHeight: typography.lineHeight.md,
        }}
      >
        {title}
      </Text>

      <View style={styles.row}>
        <Text weight="medium" style={[styles.label, { color: colors.iconMuted }]}>
          {teamLabel}
        </Text>
        <Text weight="bold" style={[styles.value, { color: colors.text }]}>
          {teamSizeLabel}
        </Text>
      </View>

      <View style={styles.row}>
        <Text weight="medium" style={[styles.label, { color: colors.iconMuted }]}>
          {hoursLabel}
        </Text>
        <Text weight="bold" style={[styles.value, { color: colors.text }]}>
          {workingHoursLabel}
        </Text>
      </View>

      <View style={styles.row}>
        <Text weight="medium" style={[styles.label, { color: colors.iconMuted }]}>
          {typeLabel}
        </Text>
        <Text weight="bold" style={[styles.value, { color: colors.text }]}>
          {serviceModeLabel}
        </Text>
      </View>

      <View style={styles.row}>
        <Text weight="medium" style={[styles.label, { color: colors.iconMuted }]}>
          {dateTimeLabel}
        </Text>
        <Text weight="bold" style={[styles.value, { color: colors.text }]}>
          {scheduleLabel}
        </Text>
      </View>
    </ReviewSectionCard>
  );
}

export default memo(ReviewTeamScheduleSection);

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    lineHeight: 18,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  value: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'right',
  },
});
