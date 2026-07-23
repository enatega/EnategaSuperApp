import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddressSelectionBottomSheet from '../../../../general/components/address/AddressSelectionBottomSheet';
import { useTheme } from '../../../../general/theme/theme';
import AppointmentsSearchHeader from '../../components/search/AppointmentsSearchHeader';
import AppointmentsSearchResults from '../../components/search/AppointmentsSearchResults';
import AppointmentsSearchSuggestions from '../../components/search/AppointmentsSearchSuggestions';
import useAppointmentSearchFlow from '../../hooks/useAppointmentSearchFlow';

export default function MultiVendorSearchScreen() {
  const { colors } = useTheme();
  const search = useAppointmentSearchFlow();

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.container}>
        <AppointmentsSearchHeader
          onBackPress={search.handleBack}
          onChangeText={search.setSearchQuery}
          placeholder={search.t('search_placeholder')}
          value={search.searchQuery}
        />

        {search.isSearchActive ? (
          <AppointmentsSearchResults
            emptyMessage={search.t('search_empty_message')}
            emptyTitle={search.t('search_empty_title')}
            errorMessage={search.t('search_error_message')}
            isError={search.isSearchError}
            isLoading={search.isSearchLoading}
            onProviderPress={search.handleProviderPress}
            providers={search.providers}
            resultsTitle={search.t('search_results_title')}
          />
        ) : (
          <ScrollView
            contentContainerStyle={styles.suggestionsContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <AppointmentsSearchSuggestions
              addressFallback={search.t('search_location_fallback')}
              addressPrefix={search.t('searching_near')}
              isLoading={search.isSuggestionsLoading}
              onAddressPress={search.handleOpenAddressSheet}
              onSuggestionPress={(suggestion) =>
                search.setSearchQuery(suggestion.name)
              }
              selectedAddressLabel={search.selectedAddressLabel ?? undefined}
              suggestions={search.suggestions}
            />
          </ScrollView>
        )}
      </View>

      <AddressSelectionBottomSheet
        addresses={search.addresses}
        isLoading={search.isAddressesLoading}
        isVisible={search.isAddressSheetVisible}
        onAddAddress={search.handleAddAddress}
        onClose={search.handleCloseAddressSheet}
        onSelectAddress={search.handleSelectAddress}
        onUseCurrentLocation={search.handleUseCurrentLocation}
        selectingAddressId={search.selectingAddressId}
        selectedAddressId={search.selectedAddressId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 12,
  },
  safeArea: {
    flex: 1,
  },
  suggestionsContent: {
    paddingBottom: 24,
  },
});
