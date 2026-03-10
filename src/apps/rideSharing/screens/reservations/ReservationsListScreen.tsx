import React, { useCallback } from 'react';
import { StyleSheet, View, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import ReservationCard from '../../components/reservation/ReservationCard';
import { useCustomerRides } from '../../hooks/useRideQueries';
import { mapCustomerRideToReservation } from '../../utils/rideMapper';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Reservation } from '../../types/reservation';

type NavigationProp = NativeStackNavigationProp<RideSharingStackParamList>;

export default function ReservationsListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const { data, isLoading, error } = useCustomerRides();

  const reservations = data?.data.map(mapCustomerRideToReservation) || [];

  const handleReservationPress = useCallback((id: string) => {
    navigation.navigate('ReservationDetail', { reservationId: id });
  }, [navigation]);

  const renderReservation = useCallback(
    ({ item }: { item: Reservation }) => (
      <ReservationCard
        reservation={item}
        onPress={handleReservationPress}
      />
    ),
    [handleReservationPress],
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text variant="subtitle" color={colors.danger} style={{ textAlign: 'center' }}>
          {error.message || 'Failed to load reservations'}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Reservations" />
      {reservations.length === 0 ? (
        <ScrollView contentContainerStyle={styles.emptyContainer}>
          <View style={[styles.emptyIconContainer, { backgroundColor: colors.backgroundTertiary }]}>
            <Ionicons name="calendar-outline" size={48} color={colors.primary} />
          </View>
          <Text variant="title" weight="bold" style={styles.emptyTitle}>
            {t('reservations_empty')}
          </Text>
          <Text variant="body" color={colors.mutedText} style={styles.emptyText}>
            {t('sidebar_reservations_subtitle')}
          </Text>
        </ScrollView>
      ) : (
        <FlatList
          data={reservations}
          renderItem={renderReservation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: '30%',
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    maxWidth: 240,
  },
});
