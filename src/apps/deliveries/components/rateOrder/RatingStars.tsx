import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  value: number;
  onChange: (rating: number) => void;
};

const STARS = [1, 2, 3, 4, 5];

export default function RatingStars({ value, onChange }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {STARS.map((star) => (
        <Pressable
          key={star}
          onPress={() => onChange(star)}
          accessibilityRole="button"
          accessibilityLabel={`Rate ${star} star${star > 1 ? 's' : ''}`}
          hitSlop={8}
        >
          <Ionicons
            name={star <= value ? 'star' : 'star-outline'}
            size={40}
            color={star <= value ? colors.yellow500 : colors.border}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
});
