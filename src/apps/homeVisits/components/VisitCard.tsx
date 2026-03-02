import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../general/components/Text';
import { useTheme } from '../../../general/theme/theme';

type Props = {
  title?: string;
};

export default function VisitCard({ title }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}> 
      <Text weight="semiBold">{title ?? ''}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 12,
  },
});
