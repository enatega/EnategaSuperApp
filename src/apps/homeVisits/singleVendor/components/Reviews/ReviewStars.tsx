import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  rating: number;
  max?: number;
  size?: number;
};

function ReviewStars({ rating, max = 5, size = 20 }: Props) {
  const { colors } = useTheme();
  const filledCount = Math.max(0, Math.min(max, Math.round(rating)));

  return (
    <View style={styles.row}>
      {Array.from({ length: max }).map((_, index) => {
        const isFilled = index < filledCount;
        return (
          <MaterialCommunityIcons
            color={isFilled ? colors.warning : colors.border}
            key={`${index}-${isFilled ? 'filled' : 'empty'}`}
            name="star"
            size={size}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 2,
  },
});

export default React.memo(ReviewStars);
