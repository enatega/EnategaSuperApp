import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import Text from '../../../../general/components/Text';

interface LegalListItemProps {
  children: React.ReactNode;
}

export default function LegalListItem({ children }: LegalListItemProps) {
  const { colors } = useTheme();

  return (
    <Text variant="body" color={colors.text} style={styles.listItem}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  listItem: {
    marginLeft: 8,
    marginBottom: 4,
    lineHeight: 22,
  },
});
