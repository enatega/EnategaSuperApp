import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../../../../general/theme/theme';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import SearchInput from '../../../../general/components/search/SearchInput';
import type { CachedAddress } from './types';
import {
  toCachedAddress,
  toRideAddressSelection,
} from '../../utils/rideAddress';
import { rideKeys } from '../../api/queryKeys';
import { rideService } from '../../api/rideService';
import CachedAddressList from './CachedAddressList';
import RideAddressSuggestionSkeletonList from '../../screens/rideSearch/components/RideAddressSuggestionSkeletonList';
import useRideAddressSuggestions from '../../hooks/useRideAddressSuggestions';

type Props = {
  onOpenSidebar: () => void;
  onSelectAddress: (address?: CachedAddress) => void;
};

export default function RideTopSearchPanel({ onOpenSidebar, onSelectAddress }: Props) {
  const { t } = useTranslation('rideSharing');
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isResolvingInlineAddress, setIsResolvingInlineAddress] = useState(false);
  const {
    refreshRecentAddresses,
    suggestionAddresses,
    isSearchMode,
    shouldShowSuggestionSkeleton,
    shouldShowRecentSkeleton,
  } = useRideAddressSuggestions({
    inputValue: searchValue,
    isInteractionActive: isSearchFocused,
    hasConfirmedSelection: false,
    debounceMs: 500,
  });

  const handleSelectInlineAddress = useCallback(async (address: CachedAddress) => {
    setIsResolvingInlineAddress(true);

    try {
      let nextAddress = address;

      if (!address.coordinates) {
        const details = await queryClient.fetchQuery({
          queryKey: rideKeys.placeDetails(address.placeId),
          queryFn: () => rideService.getPlaceDetails(address.placeId),
          staleTime: 5 * 60 * 1000,
        });
        const resolvedSelection = toRideAddressSelection(
          {
            description: address.description,
            place_id: address.placeId,
          },
          details,
        );

        nextAddress = toCachedAddress(resolvedSelection);
      }

      setSearchValue('');
      setIsSearchFocused(false);
      onSelectAddress(nextAddress);
    } catch (error) {
      console.warn('Unable to resolve inline searched address', error);
      onSelectAddress();
    } finally {
      setIsResolvingInlineAddress(false);
    }
  }, [onSelectAddress, queryClient]);

  const shouldShowInlineSearchLoader = shouldShowSuggestionSkeleton;
  const shouldShowRecentAddressesLoader = shouldShowRecentSkeleton;
  const inlineAddressEmptyStateLabel = isSearchMode
    ? t('ride_address_no_results_title')
    : t('ride_address_recent_empty_title');

  return (
    <View style={[styles.rideTopView, { backgroundColor: colors.background }]}>
      <View style={styles.searchRow}>
        <Pressable
          onPress={onOpenSidebar}
          style={[
            styles.menuButton,
            {
              borderColor: colors.border,
              backgroundColor: colors.surface,
              shadowColor: colors.shadowColor,
            },
          ]}
        >
          <Icon type="Feather" name="menu" size={18} color={colors.text} />
        </Pressable>

        <View
          style={styles.searchInputWrap}
        >
          <SearchInput
            value={searchValue}
            onChangeText={setSearchValue}
            onFocus={() => {
              setIsSearchFocused(true);
              void refreshRecentAddresses();
            }}
            onBlur={() => {
              setTimeout(() => {
                  setIsSearchFocused(false);
                }, 120);
            }}
            placeholder={t('ride_address_from_placeholder')}
            style={styles.searchInput}
          />
        </View>
      </View>

      {isSearchFocused ? (
        <View style={styles.inlineListSection}>
          {isResolvingInlineAddress || shouldShowInlineSearchLoader ? (
            <View style={styles.inlineLoaderWrap}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null}

          {shouldShowRecentAddressesLoader ? (
            <RideAddressSuggestionSkeletonList />
          ) : suggestionAddresses.length ? (
            <View style={styles.addressListWrap}>
              <CachedAddressList
                data={suggestionAddresses}
                onSelect={handleSelectInlineAddress}
                showsVerticalScrollIndicator
                contentContainerStyle={styles.inlineAddressListContent}
                itemContainerStyle={styles.inlineAddressItem}
              />
            </View>
          ) : (
            <View style={styles.emptyAddressState}>
              <Text style={[styles.emptyAddressStateText, { color: colors.mutedText }]}>
                {inlineAddressEmptyStateLabel}
              </Text>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  rideTopView: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    gap: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchInputWrap: {
    flex: 1,
  },
  searchInput: {
    width: '100%',
  },
  inlineListSection: {
    maxHeight: 420,
    minHeight: 180,
  },
  inlineLoaderWrap: {
    paddingTop: 10,
    alignItems: 'center',
  },
  addressListWrap: {
    flex: 1,
  },
  inlineAddressListContent: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  inlineAddressItem: {
    marginHorizontal: 0,
  },
  emptyAddressState: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  emptyAddressStateText: {
    fontSize: 13,
    lineHeight: 20,
  },
});
