import React from 'react';
import { View } from 'react-native';
import Text from '../../../../general/components/Text';

type Props = {
  rating: number;
  size?: number;
};

/** Renders 5 star glyphs, filled (amber) up to `rating`, empty (grey) after. */
export default function StarRating({ rating, size = 16 }: Props) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text
          key={i}
          style={{ fontSize: size, color: i <= rating ? '#F59E0B' : '#D1D5DB' }}
        >
          ★
        </Text>
      ))}
    </View>
  );
}
