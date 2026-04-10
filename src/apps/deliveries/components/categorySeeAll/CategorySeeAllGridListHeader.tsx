import React from 'react';
import { StyleSheet } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  title: string;
};

export default function CategorySeeAllGridListHeader({ title }: Props) {
  const { colors, typography } = useTheme();

  return (
    <Text
      weight="bold"
      style={[
        styles.title,
        {
          color: colors.text,
          fontSize: typography.size.h5,
          lineHeight: typography.lineHeight.h5,
        },
      ]}
    >
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 18,
  },
});
