import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
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
  const stepCount = maxHours - minHours + 1;
  const progressRatio = stepCount <= 1 ? 0 : (hours - minHours) / (stepCount - 1);

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

      <View style={styles.sliderRow}>
        <View style={styles.trackWrap}>
          <View style={[styles.trackBase, { backgroundColor: colors.border }]} />
          <View
            style={[
              styles.trackActive,
              {
                backgroundColor: colors.warning,
                width: `${Math.max(0, Math.min(100, progressRatio * 100))}%`,
              },
            ]}
          />

          <View style={styles.steps}>
            {Array.from({ length: stepCount }).map((_, index) => {
              const value = minHours + index;
              const isActive = value <= hours;

              return (
                <Pressable
                  key={value}
                  onPress={() => onChangeHours(value)}
                  style={[
                    styles.stepDot,
                    {
                      backgroundColor: isActive ? colors.warning : colors.border,
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>

        <Text
          weight="medium"
          style={{
            color: colors.text,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
            minWidth: 62,
            textAlign: 'right',
          }}
        >
          {`${hours} ${hours === 1 ? 'Hour' : 'Hours'}`}
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
  sliderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingTop: 8,
  },
  stepDot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  steps: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trackActive: {
    borderRadius: 4,
    height: 4,
    left: 0,
    position: 'absolute',
    top: 4,
  },
  trackBase: {
    borderRadius: 4,
    height: 4,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 4,
  },
  trackWrap: {
    flex: 1,
    height: 12,
    justifyContent: 'center',
  },
});
