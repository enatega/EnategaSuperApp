import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type RideStatus = 'scheduled' | 'completed' | 'cancelled' | 'in_progress';

type Props = {
  status: RideStatus;
};

const statusConfig: Record<RideStatus, { label: string; backgroundColor: string; textColor: string }> = {
  scheduled: {
    label: 'Scheduled',
    backgroundColor: '#FEF3C7',
    textColor: '#92400E',
  },
  completed: {
    label: 'Completed',
    backgroundColor: '#D1FAE5',
    textColor: '#065F46',
  },
  cancelled: {
    label: 'Cancelled',
    backgroundColor: '#FEE2E2',
    textColor: '#B91C1C',
  },
  in_progress: {
    label: 'In progress',
    backgroundColor: '#DBEAFE',
    textColor: '#1E40AF',
  },
};

export default function ReservationStatus({ status }: Props) {
  const { colors } = useTheme();
  const config = statusConfig[status] || statusConfig.scheduled;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text variant="caption" color={colors.mutedText} style={styles.label}>
        Ride status
      </Text>
      <View style={[styles.badge, { backgroundColor: config.backgroundColor }]}>
        <Text weight="semiBold" variant="caption" color={config.textColor}>
          {config.label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
  },
  label: {
    marginBottom: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
