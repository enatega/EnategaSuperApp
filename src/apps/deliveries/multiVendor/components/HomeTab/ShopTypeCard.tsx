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
          fontSize: typography.size.md2,
          lineHeight: typography.lineHeight.md2,
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
    gap: 10,
    width: 96,
  },
  imageWrap: {
    alignItems: 'center',
    borderRadius: 12,
    height: 96,
    justifyContent: 'center',
    padding: 10,
    width: 96,
  },
  image: {
    borderRadius: 10,
    height: 66,
    width: 66,
  },
});
