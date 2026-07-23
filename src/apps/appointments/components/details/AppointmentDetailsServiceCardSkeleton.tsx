import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../../../../general/components/Skeleton';
import { useTheme } from '../../../../general/theme/theme';

export default function AppointmentDetailsServiceCardSkeleton() {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.content}>
        <Skeleton borderRadius={6} height={18} width="62%" />
        <Skeleton borderRadius={6} height={16} width="26%" />
        <Skeleton borderRadius={6} height={14} width="18%" />
      </View>
      <Skeleton borderRadius={12} height={42} width={76} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 8,
  },
  row: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
