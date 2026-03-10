import React from 'react';
import { StyleSheet, View, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { Reservation } from '../../types/reservation';

type Props = {
  reservation: Reservation;
  onPress: (id: string) => void;
};

const getStatusConfig = (status: Reservation['status']) => {
  switch (status) {
    case 'scheduled':
      return {
        label: 'Scheduled',
        backgroundColor: '#FEF3C7',
        textColor: '#92400E',
      };
    case 'completed':
      return {
        label: 'Completed',
        backgroundColor: '#D1FAE5',
        textColor: '#065F46',
      };
    case 'cancelled':
      return {
        label: 'Cancelled by you',
        backgroundColor: '#FEE2E2',
        textColor: '#B91C1C',
      };
    case 'in_progress':
      return {
        label: 'In progress',
        backgroundColor: '#DBEAFE',
        textColor: '#1E40AF',
      };
    default:
      return {
        label: status,
        backgroundColor: '#F3F4F6',
        textColor: '#374151',
      };
  }
};

const getRideIconConfig = (rideType: Reservation['rideType']) => {
  switch (rideType) {
    case 'women_ride':
      return { name: 'car' as const, color: '#EC4899' };
    case 'premium_ride':
      return { name: 'car-sport' as const, color: '#1F2937' };
    default:
      return { name: 'car' as const, color: '#6B7280' };
  }
};

export default function ReservationCard({ reservation, onPress }: Props) {
  const { colors } = useTheme();
  const statusConfig = getStatusConfig(reservation.status);
  const iconConfig = getRideIconConfig(reservation.rideType);

  const formatDate = (dateTime: string) => {
    const date = new Date(dateTime);
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const time = date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return { date: `${month} ${day}`, time };
  };

  const { date, time } = formatDate(reservation.dateTime);

  return (
    <Pressable
      onPress={() => onPress(reservation.id)}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: colors.surface },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.gray100 }]}>
        {reservation.imageUrl ? (
          <Image
            source={{ uri: reservation.imageUrl }}
            style={styles.rideIcon}
            resizeMode="contain"
          />
        ) : (
          <Ionicons name={iconConfig.name} size={40} color={iconConfig.color} />
        )}
      </View>
      <View style={styles.content}>
        <Text weight="semiBold" variant="subtitle" style={styles.title}>
          {reservation.rideTitle}
        </Text>
        <Text variant="caption" color={colors.mutedText}>
          {date}. {time}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusConfig.backgroundColor },
          ]}
        >
          <Text
            weight="semiBold"
            variant="caption"
            color={statusConfig.textColor}
          >
            {statusConfig.label}
          </Text>
        </View>
      </View>
      <View style={styles.rightContent}>
        <Text weight="semiBold" variant="subtitle">
          {reservation.currency} {reservation.price.toFixed(2)}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={colors.mutedText}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rideIcon: {
    width: 56,
    height: 40,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    marginBottom: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
