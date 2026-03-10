import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import Text from '../../../../general/components/Text';

interface LegalSectionProps {
  title: string;
}

export default function LegalSection({ title }: LegalSectionProps) {
  const { colors } = useTheme();

  return (
    <Text variant="subtitle" weight="bold" color={colors.text} style={styles.sectionHeader}>
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
  },
});
