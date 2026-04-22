import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  children: React.ReactNode;
};

function ReviewSectionCard({ children }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { borderColor: colors.border }]}>
      {children}
    </View>
  );
}

export default memo(ReviewSectionCard);

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    marginHorizontal: 16,
    padding: 12,
  },
});
