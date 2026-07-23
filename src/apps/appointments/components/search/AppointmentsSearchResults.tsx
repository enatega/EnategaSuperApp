import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import Skeleton from '../../../../general/components/Skeleton';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { AppointmentProvider } from '../../api/types';
import AppointmentsProviderCard from '../home/AppointmentsProviderCard';
import AppointmentsSectionEmptyState from '../home/AppointmentsSectionEmptyState';

type Props = {
  emptyMessage: string;
  emptyTitle: string;
  errorMessage: string;
  isError: boolean;
  isLoading: boolean;
  onProviderPress: (provider: AppointmentProvider) => void;
  providers: AppointmentProvider[];
  resultsTitle: string;
};

export default function AppointmentsSearchResults({
  emptyMessage,
  emptyTitle,
  errorMessage,
  isError,
  isLoading,
  onProviderPress,
  providers,
  resultsTitle,
}: Props) {
  const { colors, typography } = useTheme();

  if (isLoading) {
    return (
      <View style={styles.loadingList}>
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton borderRadius={22} height={106} key={`search-result-${index}`} width="100%" />
        ))}
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.listContent}
      data={isError ? [] : providers}
      keyboardShouldPersistTaps="handled"
      keyExtractor={(provider) => provider.storeId}
      ListEmptyComponent={(
        <AppointmentsSectionEmptyState
          message={isError ? errorMessage : emptyMessage}
          title={emptyTitle}
        />
      )}
      ListHeaderComponent={
        providers.length > 0 && !isError ? (
          <Text
            style={{ color: colors.text, fontSize: typography.size.lg }}
            weight="bold"
          >
            {resultsTitle}
          </Text>
        ) : null
      }
      renderItem={({ item }) => (
        <Pressable accessibilityRole="button" onPress={() => onProviderPress(item)}>
          <AppointmentsProviderCard
            isFullWidth
            provider={item}
            variant="compact"
          />
        </Pressable>
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    gap: 12,
    paddingBottom: 24,
    paddingTop: 22,
  },
  loadingList: {
    gap: 12,
    paddingTop: 22,
  },
});
