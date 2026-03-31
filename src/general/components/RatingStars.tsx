import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/theme';

type Props = {
  value: number;
  onChange: (rating: number) => void;
  maxStars?: number;
  size?: number;
  gap?: number;
  filledColor?: string;
  emptyColor?: string;
  style?: StyleProp<ViewStyle>;
};

export default function RatingStars({
  value,
  onChange,
  maxStars = 5,
  size = 40,
  gap = 8,
  filledColor,
  emptyColor,
  style,
}: Props) {
  const { colors } = useTheme();
  const stars = Array.from({ length: maxStars }, (_, index) => index + 1);
  const resolvedFilledColor = filledColor ?? colors.yellow500;
  const resolvedEmptyColor = emptyColor ?? colors.border;

  return (
    <View style={[styles.row, { gap }, style]}>
      {stars.map((star) => (
        <Pressable
          key={star}
          onPress={() => onChange(star)}
          accessibilityRole="button"
          accessibilityLabel={`Rate ${star} star${star > 1 ? 's' : ''}`}
          hitSlop={8}
        >
          <Ionicons
            name={star <= value ? 'star' : 'star-outline'}
            size={size}
            color={star <= value ? resolvedFilledColor : resolvedEmptyColor}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
