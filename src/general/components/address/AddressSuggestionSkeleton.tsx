import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../../components/Skeleton';

export default function AddressSuggestionSkeleton() {
  return (
    <View style={styles.container}>
      {Array.from({ length: 4 }).map((_, i) => (
        <View key={i} style={styles.row}>
          <Skeleton width={36} height={36} borderRadius={18} />
          <View style={styles.textWrap}>
            <Skeleton width="70%" height={14} borderRadius={4} />
            <Skeleton width="50%" height={12} borderRadius={4} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 4 },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  textWrap: { flex: 1, gap: 6 },
});
