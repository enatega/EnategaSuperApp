import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  label: string;
};

export default function SupportConversationSectionTitle({ label }: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <Text
        color={colors.text}
        weight="bold"
        style={{ fontSize: typography.size.lg, lineHeight: 28 }}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
    width: '100%',
  },
});
