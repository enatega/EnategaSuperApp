import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { HomeVisitsSingleVendorServiceBookingScreenSection } from '../../types/serviceDetails';

type Props = {
  section: HomeVisitsSingleVendorServiceBookingScreenSection;
  titleFallback: string;
  variant: 'radio' | 'checkbox';
  selectedOptionIds: string[];
  onOptionPress: (optionId: string) => void;
};

function formatOptionPrice(value: number) {
  return `${value >= 0 ? '+' : '-'}$${Math.abs(value).toLocaleString()}`;
}

export default function ServiceDetailsOptionsSection({
  section,
  titleFallback,
  variant,
  selectedOptionIds,
  onOptionPress,
}: Props) {
  const { colors, typography } = useTheme();
  const selectedSet = new Set(selectedOptionIds);

  return (
    <View style={styles.optionsSection}>
      <View style={styles.sectionHeader}>
        <Text
          weight="extraBold"
          style={{
            color: colors.text,
            fontSize: typography.size.lg,
            lineHeight: typography.lineHeight.md,
          }}
        >
          {section.title || titleFallback}
        </Text>

        {section.helperText ? (
          <Text
            weight="medium"
            style={{
              color: colors.iconDisabled,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            }}
          >
            {section.helperText}
          </Text>
        ) : null}
      </View>

      {section.options.map((option) => {
        const isSelected = selectedSet.has(option.optionId);

        return (
          <Pressable
            key={option.optionId}
            accessibilityRole="button"
            onPress={() => onOptionPress(option.optionId)}
            style={({ pressed }) => [
              styles.optionRow,
              pressed ? styles.optionRowPressed : null,
            ]}
          >
            <View style={styles.optionTitleRow}>
              {variant === 'radio' ? (
                <View
                  style={[
                    styles.radioOuter,
                    {
                      borderColor: isSelected ? colors.warning : colors.border,
                    },
                  ]}
                >
                  {isSelected ? (
                    <View
                      style={[
                        styles.radioInner,
                        {
                          backgroundColor: colors.warning,
                        },
                      ]}
                    />
                  ) : null}
                </View>
              ) : (
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: isSelected ? colors.warning : colors.border,
                      backgroundColor: isSelected ? colors.warning : colors.background,
                    },
                  ]}
                >
                  {isSelected ? (
                    <Ionicons name="checkmark" size={12} color={colors.text} />
                  ) : null}
                </View>
              )}

              <Text
                weight="medium"
                style={{
                  color: colors.text,
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
                fontSize: typography.size.sm2,
                lineHeight: typography.lineHeight.md,
              }}
            >
              {formatOptionPrice(option.price)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    height: 16,
    justifyContent: 'center',
    width: 16,
  },
  optionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionRowPressed: {
    opacity: 0.75,
  },
  optionsSection: {
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    minWidth: 0,
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
  sectionHeader: {
    gap: 2,
  },
});
