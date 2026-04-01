import React from 'react';
import { ImageSourcePropType, StyleSheet, View } from 'react-native';
import Text from '../../../../../general/components/Text';
import Image from '../../../../../general/components/Image';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  image: ImageSourcePropType;
  title: string;
};

export default function ShopTypeCard({ image, title }: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.imageWrap, { backgroundColor: colors.blue100 }]}>
        <Image source={image} style={styles.image} />
      </View>
      <Text
        weight="medium"
        numberOfLines={2}
        style={{
          fontSize: typography.size.xs2,
          lineHeight: typography.lineHeight.sm,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
    width: 72,
  },
  imageWrap: {
    alignItems: 'center',
    borderRadius: 8,
    height: 72,
    justifyContent: 'center',
    padding: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    width: 72,
  },
  image: {
    borderRadius: 4,
    height: 52,
    width: 52,
  },
});
