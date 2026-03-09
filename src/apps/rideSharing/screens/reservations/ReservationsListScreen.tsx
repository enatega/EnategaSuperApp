import React, { useCallback } from 'react';
import { StyleSheet, View, FlatList, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import ReservationCard from '../../components/reservation/ReservationCard';
import { MOCK_RESERVATIONS } from '../../data/reservationMockData';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<RideSharingStackParamList>;

export default function ReservationsListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const handleReservationPress = useCallback((id: string) => {
    navigation.navigate('ReservationDetail', { reservationId: id });
  }, [navigation]);

  const renderReservation = useCallback(
    ({ item }: { item: typeof MOCK_RESERVATIONS[0] }) => (
      <ReservationCard
        reservation={item}
        onPress={handleReservationPress}
      />
    ),
    [handleReservationPress],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Reservations" />
      {MOCK_RESERVATIONS.length === 0 ? (
        <ScrollView contentContainerStyle={styles.emptyContainer}>
          <Text variant="subtitle" color={colors.mutedText} style={styles.emptyText}>
            No reservations yet
          </Text>
        </ScrollView>
      ) : (
        <FlatList
          data={MOCK_RESERVATIONS}
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
  },
  emptyText: {
    textAlign: 'center',
  },
});
