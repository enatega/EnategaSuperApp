import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  label: string;
  priceLabel: string;
  isSelected: boolean;
  onPress: () => void;
  controlType?: 'radio' | 'checkbox';
};

export default function ProductOptionRow({
  label,
  priceLabel,
  isSelected,
  onPress,
  controlType = 'radio',
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <Pressable
      accessibilityRole={controlType === 'checkbox' ? 'checkbox' : 'radio'}
      accessibilityState={
        controlType === 'checkbox'
          ? { checked: isSelected }
          : { selected: isSelected }
      }
      onPress={onPress}
      style={({ pressed }) => [styles.container, { opacity: pressed ? 0.72 : 1 }]}
    >
      <View style={styles.leftContent}>
        <View
          style={[
            controlType === 'checkbox' ? styles.checkboxOuter : styles.radioOuter,
            {
              borderColor: isSelected ? colors.primary : colors.border,
              backgroundColor: colors.background,
              shadowColor: colors.shadowColor,
            },
          ]}
        >
          {isSelected ? (
            <View
              style={[
                controlType === 'checkbox' ? styles.checkboxInner : styles.radioInner,
                { backgroundColor: colors.primary },
              ]}
            />
          ) : null}
        </View>
        <Text
          color={colors.text}
          weight="medium"
          style={[
            styles.label,
            {
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            },
          ]}
        >
          {label}
        </Text>
      </View>
      <Text
        color={colors.mutedText}
        weight="medium"
        style={{
          fontSize: typography.size.sm2,
          lineHeight: typography.lineHeight.md,
        }}
      >
        {priceLabel}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  checkboxInner: {
    borderRadius: 2,
    height: 8,
    width: 8,
  },
  checkboxOuter: {
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    height: 16,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    width: 16,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 22,
    width: '100%',
  },
  leftContent: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: 12,
    paddingRight: 12,
  },
  label: {
    flex: 1,
  },
  radioOuter: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 16,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    width: 16,
  },
  radioInner: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
});
