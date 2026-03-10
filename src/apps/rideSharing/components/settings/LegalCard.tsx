import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import Text from '../../../../general/components/Text';

interface LegalCardProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalCard({ title, lastUpdated, children }: LegalCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.backgroundTertiary }]}>
      <Text variant="title" weight="bold" color={colors.text} style={styles.sectionTitle}>
        {title}
      </Text>
      <Text variant="caption" color={colors.mutedText} style={styles.lastUpdated}>
        {lastUpdated}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 4,
    fontSize: 20,
  },
  lastUpdated: {
    marginBottom: 16,
    fontStyle: 'italic',
  },
});
