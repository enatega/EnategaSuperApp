import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../components/ScreenHeader';
import Text from '../../components/Text';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import { useTheme } from '../../theme/theme';
import { addressService } from '../../api/addressService';
import AddressSearchInput from '../../components/address/AddressSearchInput';
import AddressSuggestionItem from '../../components/address/AddressSuggestionItem';
import AddressSuggestionSkeleton from '../../components/address/AddressSuggestionSkeleton';
import useAddressPredictions from '../../hooks/useAddressPredictions';
import type { AddressFlowParamList } from '../../navigation/addressFlowTypes';
import {
  getRecentAddressSearches,
  saveRecentAddressSearch,
} from '../../utils/recentAddressSearches';
import type { RecentAddressSearch } from '../../api/addressService';

export default function AddressSearchScreen() {
  const nav = useNavigation<NativeStackNavigationProp<AddressFlowParamList>>();
  const route = useRoute();
  const { colors } = useTheme();
  const { t } = useTranslation('general');
  const params = (route.params as AddressFlowParamList['AddressSearch']) ?? {};

  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<RecentAddressSearch[]>([]);

  const debouncedQuery = useDebouncedValue(query.trim(), 800);
  const isSearching = query.trim().length > 0;
  const predictionsQuery = useAddressPredictions(
    debouncedQuery,
    debouncedQuery.length > 0,
  );
  const isWaiting = isSearching && query.trim() !== debouncedQuery;
  const isShowingSkeleton =
    isSearching && (isWaiting || predictionsQuery.isFetching);

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        setRecentSearches(await getRecentAddressSearches());
      })();
    }, []),
  );

  const editParams = params.editAddressId
    ? {
        editAddressId: params.editAddressId,
        editType: params.editType,
        editLocationName: params.editLocationName,
        origin: params.origin,
      }
    : { origin: params.origin };

  const handleSelectPrediction = useCallback(
    async (placeId: string, description: string) => {
      try {
        const coords = await addressService.getPlaceDetails(placeId);
        const lat = Number(coords.lat);
        const lng = Number(coords.lng);
        const parts = description.split(',');
        const mainText = parts[0]?.trim() ?? description;
        const secondaryText = parts.slice(1).join(',').trim() || undefined;

        await saveRecentAddressSearch({
          placeId,
          description,
          mainText,
          secondaryText,
          latitude: lat,
          longitude: lng,
        });

        nav.navigate('AddressDetail', {
          address: description,
          latitude: lat,
          longitude: lng,
          ...editParams,
        });
      } catch {
        // Keep the user on the screen so they can retry.
      }
    },
    [editParams, nav],
  );

  const handleSelectRecent = useCallback(
    (item: RecentAddressSearch) => {
      nav.navigate('AddressDetail', {
        address: item.description,
        latitude: item.latitude,
        longitude: item.longitude,
        ...editParams,
      });
    },
    [editParams, nav],
  );

  const handleChooseOnMap = useCallback(() => {
    nav.navigate('AddressChooseOnMap', editParams);
  }, [editParams, nav]);

  const suggestions = predictionsQuery.data ?? [];
  const showRecent = !isSearching && recentSearches.length > 0;
  const showNoResults =
    isSearching &&
    !isShowingSkeleton &&
    suggestions.length === 0 &&
    !predictionsQuery.isPending;
  const screenTitle = params.editAddressId
    ? t('address_edit_title')
    : t('address_add_title');

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={screenTitle} />
      <AddressSearchInput
        value={query}
        onChangeText={setQuery}
        placeholder={t('address_search_placeholder')}
        chooseOnMapLabel={t('address_choose_on_map')}
        onChooseOnMap={handleChooseOnMap}
        isLoading={isShowingSkeleton}
      />

      {isShowingSkeleton ? (
        <View style={styles.listWrap}>
          <AddressSuggestionSkeleton />
        </View>
      ) : showNoResults ? (
        <View style={styles.emptyWrap}>
          <Text variant="caption" color={colors.mutedText}>
            {t('address_no_results')}
          </Text>
        </View>
      ) : showRecent ? (
        <View style={styles.listWrap}>
          <Text
            variant="caption"
            weight="semiBold"
            color={colors.mutedText}
            style={styles.sectionLabel}
          >
            {t('address_recent_searches')}
          </Text>
          <FlatList
            data={recentSearches}
            keyExtractor={(item) => item.placeId}
            renderItem={({ item }) => (
              <AddressSuggestionItem
                description={item.description}
                onPress={() => handleSelectRecent(item)}
                isRecent
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.place_id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <AddressSuggestionItem
              description={item.description}
              onPress={() =>
                handleSelectPrediction(item.place_id, item.description)
              }
            />
          )}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyWrap: { alignItems: 'center', paddingTop: 40 },
  listContent: { paddingTop: 8 },
  listWrap: { flex: 1, paddingTop: 16 },
  screen: { flex: 1 },
  sectionLabel: { paddingBottom: 4, paddingHorizontal: 16 },
});
