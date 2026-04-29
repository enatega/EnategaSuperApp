import React, { memo, useEffect, useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  title: string;
  helperText: string;
  hours: number;
  onChangeHours: (nextHours: number) => void;
  minHours?: number;
  maxHours?: number;
};

function WorkingHoursSection({
  helperText,
  hours,
  maxHours = 12,
  minHours = 1,
  onChangeHours,
  title,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('homeVisits');
  const [hoursInput, setHoursInput] = useState(String(hours));

  useEffect(() => {
    setHoursInput(String(hours));
  }, [hours]);

  const hoursLabel = useMemo(
    () => `${hours} ${hours === 1 ? t('team_schedule_hour_singular') : t('team_schedule_hour_plural')}`,
    [hours, t],
  );

  const clampHours = (value: number) => Math.max(minHours, Math.min(maxHours, value));

  const handleChangeHoursText = (nextValue: string) => {
    const digitsOnly = nextValue.replace(/[^0-9]/g, '');
    setHoursInput(digitsOnly);
  };

  const commitHours = () => {
    if (!hoursInput) {
      setHoursInput(String(hours));
      return;
    }

    const parsedHours = Number(hoursInput);
    if (!Number.isFinite(parsedHours)) {
      setHoursInput(String(hours));
      return;
    }

    const clampedHours = clampHours(parsedHours);
    onChangeHours(clampedHours);
    setHoursInput(String(clampedHours));
  };

  return (
    <View style={styles.section}>
      <Text
        weight="extraBold"
        style={{
          color: colors.text,
          fontSize: typography.size.lg,
          lineHeight: typography.lineHeight.md,
        }}
      >
        {title}
      </Text>
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

      <View style={styles.inputRow}>
        <TextInput
          value={hoursInput}
          onChangeText={handleChangeHoursText}
          onBlur={commitHours}
          onSubmitEditing={commitHours}
          keyboardType="number-pad"
          maxLength={2}
          placeholder={t('team_schedule_working_hours_input_placeholder')}
          placeholderTextColor={colors.iconMuted}
          style={[
            styles.input,
            {
              borderColor: colors.border,
              color: colors.text,
              fontFamily: typography.fontFamily.medium,
            },
          ]}
        />
        <Text
          weight="medium"
          style={{
            color: colors.text,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
            minWidth: 72,
          }}
        >
          {hoursLabel}
        </Text>
      </View>
    </View>
  );
}

export default memo(WorkingHoursSection);

const styles = StyleSheet.create({
  section: {
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingTop: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    flex: 1,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14,
  },
});
