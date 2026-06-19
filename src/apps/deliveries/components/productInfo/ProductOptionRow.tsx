import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  label: string;
  description?: string | null;
  imageUrl?: string | null;
  priceLabel: string;
  isSelected: boolean;
  onPress: () => void;
  controlType?: 'radio' | 'checkbox';
};

export default function ProductOptionRow({
  label,
  description,
  imageUrl,
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
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.optionImage} />
        ) : null}
        <View style={styles.textContent}>
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
          {description ? (
            <Text
              color={colors.mutedText}
              style={[
                styles.description,
                {
                  fontSize: typography.size.xs,
                  lineHeight: typography.lineHeight.sm,
                },
              ]}
            >
              {description}
            </Text>
          ) : null}
        </View>
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
    alignItems: 'flex-start',
    flexDirection: 'row',
    flex: 1,
    gap: 12,
    paddingRight: 12,
  },
  description: {
    marginTop: 2,
  },
  label: {
    flex: 1,
  },
  optionImage: {
    borderRadius: 10,
    height: 40,
    width: 40,
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
  textContent: {
    flex: 1,
  },
});
