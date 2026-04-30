import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../Skeleton';

const ROW_COUNT = 3;

export default function NotificationsSkeleton() {
  return (
    <View style={styles.contentContainer}>
      <View style={styles.section}>
        <Skeleton height={22} width="28%" borderRadius={6} />
        <View style={styles.rows}>
          {Array.from({ length: ROW_COUNT }).map((_, index) => (
            <View key={`today-skeleton-${index}`} style={styles.row}>
              <Skeleton width={48} height={48} borderRadius={8} />
              <View style={styles.messageColumn}>
                <Skeleton height={16} width="88%" borderRadius={6} />
                <Skeleton height={12} width="68%" borderRadius={6} style={styles.subtitle} />
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Skeleton height={22} width="22%" borderRadius={6} />
        <View style={styles.rows}>
          {Array.from({ length: ROW_COUNT }).map((_, index) => (
            <View key={`past-skeleton-${index}`} style={styles.row}>
              <Skeleton width={48} height={48} borderRadius={8} />
              <View style={styles.messageColumn}>
                <Skeleton height={16} width="84%" borderRadius={6} />
                <Skeleton height={12} width="62%" borderRadius={6} style={styles.subtitle} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    gap: 16,
    paddingBottom: 28,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  messageColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  rows: {
    gap: 12,
    marginTop: 6,
  },
  section: {
    gap: 0,
  },
  subtitle: {
    marginTop: 4,
  },
});
