import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  isVisible: boolean;
};

export default function FavouritesListFooter({ isVisible }: Props) {
  const { colors } = useTheme();
  if (!isVisible) return null;
  return (
    <View style={styles.footer}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
});
