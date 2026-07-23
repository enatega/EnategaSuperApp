import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../../../../general/components/Skeleton';
import { useTheme } from '../../../../general/theme/theme';

export default function AppointmentsBookingsListSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={styles.list}>
      {Array.from({ length: 3 }).map((_, index) => (
        <View
          key={`appointment-booking-card-skeleton-${index}`}
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              shadowColor: colors.shadowColor,
            },
          ]}
        >
          <Skeleton borderRadius={12} height={52} width={52} />

          <View style={styles.copy}>
            <View style={styles.titleRow}>
              <Skeleton borderRadius={6} height={20} width="48%" />
              <Skeleton borderRadius={999} height={24} width={72} />
            </View>
            <Skeleton borderRadius={5} height={16} width="38%" />
            <View style={styles.dateRow}>
              <Skeleton borderRadius={4} height={15} width={15} />
              <Skeleton borderRadius={5} height={16} width="58%" />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 100,
    padding: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 7,
  },
  copy: {
    flex: 1,
    gap: 5,
    marginLeft: 12,
    minWidth: 0,
  },
  dateRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  list: {
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
