import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../../../../general/components/Skeleton';

export default function AppointmentServicesSkeleton() {
  return (
    <View style={styles.list}>
      {Array.from({ length: 6 }).map((_, index) => (
        <View key={`services-skeleton-${index}`} style={styles.row}>
          <View style={styles.content}>
            <Skeleton borderRadius={6} height={22} width="64%" />
            <Skeleton borderRadius={6} height={18} width="38%" />
          </View>
          <Skeleton borderRadius={12} height={42} width={42} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 10,
    paddingRight: 12,
  },
  list: {
    gap: 4,
    paddingTop: 18,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 88,
  },
});
