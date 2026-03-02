import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Text from './Text';
import { useTheme } from '../theme/theme';

type Props = {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
};

export default function Header({ title, subtitle, style }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Text variant="title" weight="bold" style={styles.title}>
        {title}
      </Text>
      {subtitle ? (
        <Text variant="caption" color={colors.mutedText}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  title: {
    letterSpacing: -0.4,
  },
});
