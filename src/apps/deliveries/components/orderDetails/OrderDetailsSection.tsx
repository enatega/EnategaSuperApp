import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  title: string;
  subtitle?: string | null;
  children: React.ReactNode;
};

export default function OrderDetailsSection({
  title,
  subtitle,
  children,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.wrapper}>
      <Text
        style={[
          styles.title,
          {
            color: colors.text,
            fontSize: typography.size.xl,
            lineHeight: typography.lineHeight.h5,
          },
        ]}
        weight="bold"
      >
        {title}
      </Text>

      {subtitle ? (
        <Text
          style={[
            styles.subtitle,
            {
              color: colors.mutedText,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            },
          ]}
          weight="medium"
        >
          {subtitle}
        </Text>
      ) : null}

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
  },
  subtitle: {
    letterSpacing: 0,
  },
  title: {
    letterSpacing: -0.36,
  },
  wrapper: {
    gap: 10,
    paddingVertical: 20,
  },
});
