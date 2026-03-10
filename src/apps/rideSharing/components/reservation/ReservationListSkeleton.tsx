import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import Skeleton from '../../../../general/components/Skeleton';
import ScreenHeader from '../../../../general/components/ScreenHeader';

export default function ReservationListSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Reservations" titleVariant="title" />
      <View style={styles.listContent}>
        {[1, 2, 3, 4, 5].map((key) => (
          <View key={key} style={[styles.cardContainer, { backgroundColor: colors.surface }]}>
            {/* Icon */}
            <Skeleton width={64} height={64} borderRadius={12} style={styles.iconSkeleton} />
            
            {/* Middle Content */}
            <View style={styles.content}>
              <Skeleton width={120} height={20} style={{ marginBottom: 6 }} />
              <Skeleton width={100} height={14} style={{ marginBottom: 6 }} />
              <Skeleton width={80} height={24} borderRadius={8} />
            </View>

            {/* Right Content */}
            <View style={styles.rightContent}>
              <Skeleton width={80} height={20} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  iconSkeleton: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
