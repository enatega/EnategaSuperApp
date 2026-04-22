import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  rating: number;
  count: number;
  maxCount: number;
  isSelected: boolean;
  isDisabled?: boolean;
  onPress: (rating: number) => void;
};

function ReviewsFilterRow({
  rating,
  count,
  maxCount,
  isSelected,
  isDisabled = false,
  onPress,
}: Props) {
  const { colors, typography } = useTheme();
  const progressPercentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, selected: isSelected }}
      disabled={isDisabled}
      onPress={() => onPress(rating)}
      style={styles.row}
    >
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: isDisabled ? colors.backgroundTertiary : colors.background,
            borderColor: isDisabled ? colors.border : colors.border,
          },
        ]}
      >
        {isSelected ? (
          <MaterialCommunityIcons
            color={colors.primary}
            name="check"
            size={14}
          />
        ) : null}
      </View>

      <Text
        style={{
          color: colors.text,
          fontSize: typography.size.sm2,
          lineHeight: typography.lineHeight.md,
          width: 12,
        }}
        weight="medium"
      >
        {rating}
      </Text>

      <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: isDisabled ? colors.border : colors.iconColor,
              width: `${progressPercentage}%`,
            },
          ]}
        />
      </View>

      <Text
        style={{
          color: colors.iconMuted,
          fontSize: typography.size.sm2,
          lineHeight: typography.lineHeight.md,
          minWidth: 24,
          textAlign: 'right',
        }}
        weight="medium"
      >
        {count}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  progressFill: {
    borderRadius: 9999,
    height: 4,
  },
  progressTrack: {
    borderRadius: 9999,
    flex: 1,
    height: 4,
    overflow: 'hidden',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
});

export default React.memo(ReviewsFilterRow);
