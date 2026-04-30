import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  title: string;
  body: string;
};

function ReviewCancellationSection({ body, title }: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.section}>
      <Text
        weight="bold"
        style={{
          color: colors.text,
          fontSize: typography.size.lg,
          lineHeight: typography.lineHeight.lg,
        }}
      >
        {title}
      </Text>
      <Text
        weight="medium"
        style={{
          color: colors.iconMuted,
          fontSize: typography.size.sm,
          lineHeight: typography.lineHeight.md,
        }}
      >
        {body}
      </Text>
    </View>
  );
}

export default memo(ReviewCancellationSection);

const styles = StyleSheet.create({
  section: {
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
