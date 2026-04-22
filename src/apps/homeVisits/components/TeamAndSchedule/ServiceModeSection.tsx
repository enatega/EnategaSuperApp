import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { HomeVisitsTeamScheduleMode } from '../../types/teamSchedule';

type ServiceModeOption = {
  id: HomeVisitsTeamScheduleMode;
  title: string;
  description: string;
};

type Props = {
  title: string;
  options: ServiceModeOption[];
  selectedMode: HomeVisitsTeamScheduleMode;
  onSelect: (mode: HomeVisitsTeamScheduleMode) => void;
};

function ServiceModeSection({
  onSelect,
  options,
  selectedMode,
  title,
}: Props) {
  const { colors, typography } = useTheme();

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

      <View style={styles.optionsWrap}>
        {options.map((option) => {
          const isSelected = selectedMode === option.id;

          return (
            <Pressable
              key={option.id}
              onPress={() => onSelect(option.id)}
              style={[
                styles.optionCard,
                {
                  borderColor: isSelected ? colors.warning : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
            >
              <View style={styles.optionRow}>
                <View
                  style={[
                    styles.radioOuter,
                    {
                      borderColor: isSelected ? colors.warning : colors.border,
                    },
                  ]}
                >
                  {isSelected ? <View style={[styles.radioInner, { backgroundColor: colors.warning }]} /> : null}
                </View>
                <Text
                  weight="medium"
                  style={{
                    color: colors.text,
                    flex: 1,
                    fontSize: typography.size.sm2,
                    lineHeight: typography.lineHeight.md,
                  }}
                >
                  {option.title}
                </Text>
              </View>

              <Text
                weight="medium"
                style={{
                  color: colors.iconMuted,
                  fontSize: typography.size.xs2,
                  lineHeight: typography.lineHeight.sm,
                  paddingLeft: 24,
                }}
              >
                {option.description}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default memo(ServiceModeSection);

const styles = StyleSheet.create({
  optionCard: {
    borderRadius: 6,
    gap: 2,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  optionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  optionsWrap: {
    gap: 10,
  },
  radioInner: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  radioOuter: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 16,
    justifyContent: 'center',
    width: 16,
  },
  section: {
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
