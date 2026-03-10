import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import Text from '../../../../general/components/Text';

interface LegalParagraphProps {
  children: React.ReactNode;
}

export default function LegalParagraph({ children }: LegalParagraphProps) {
  const { colors } = useTheme();

  return (
    <Text variant="body" color={colors.text} style={styles.paragraph}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    marginBottom: 12,
    lineHeight: 22,
  },
});
