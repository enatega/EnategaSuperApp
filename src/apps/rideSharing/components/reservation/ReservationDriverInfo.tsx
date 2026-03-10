import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import ProfileAvatar from '../driverProfile/ProfileAvatar';

type Props = {
  driver: {
    name: string;
    rating: number;
    rideCount: number;
    image?: string;
  };
  vehicleInfo?: {
    model: string;
    color: string;
  };
  licensePlate?: string;
  onPress?: () => void;
};

export default function ReservationDriverInfo({
  driver,
  vehicleInfo,
  licensePlate,
  onPress,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text weight="semiBold" variant="body" color={colors.mutedText} style={styles.label}>
        {t('reservation_driver_details')}
      </Text>
      
      <Pressable onPress={onPress} style={styles.content}>
        <View style={styles.avatarContainer}>
          <ProfileAvatar 
            uri={driver.image || ''} 
            name={driver.name} 
            size={48} 
          />
        </View>
        
        <View style={styles.infoContainer}>
          <Text weight="semiBold" variant="body">
            {driver.name}
          </Text>
          <View style={styles.ratingContainer}>
             <Ionicons name="star" size={14} color="#F59E0B" />
             <Text weight="medium" style={styles.ratingText}>
               {driver.rating.toFixed(2)}
             </Text>
             <Text variant="caption" color={colors.mutedText}>
               ({driver.rideCount} {t('reservation_rides')})
             </Text>
          </View>
          {(vehicleInfo || licensePlate) && (
             <Text variant="caption" color={colors.mutedText} style={styles.vehicleInfo}>
               {vehicleInfo?.model}
               {vehicleInfo?.color ? ` • ${vehicleInfo.color}` : ''}
               {licensePlate ? ` • ${licensePlate}` : ''}
             </Text>
          )}
        </View>
        
        <Ionicons name="chevron-forward" size={20} color={colors.mutedText} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
  },
  label: {
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
  },
  vehicleInfo: {
    marginTop: 2,
  },
});
