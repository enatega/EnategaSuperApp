import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import AddressSelectionBottomSheet from '../../../../general/components/address/AddressSelectionBottomSheet';
import { showToast } from '../../../../general/components/AppToast';
import useAddress from '../../../../general/hooks/useAddress';
import useAddressSelectionSheet from '../../../../general/hooks/useAddressSelectionSheet';
import useSavedAddresses from '../../../../general/hooks/useSavedAddresses';
import useSelectSavedAddress from '../../../../general/hooks/useSelectSavedAddress';
import { resetToSharedHome } from '../../../../general/navigation/rootNavigation';
import { createSelectedDeliveryAddress } from '../../../../general/utils/address';
import { useTheme } from '../../../../general/theme/theme';
import HomeVisitsAddressHeader from '../../components/HomeVisitsAddressHeader';
import { homeVisitsKeys } from '../../api/queryKeys';
import ActiveServiceCard from '../../singleVendor/components/HomeScreen/ActiveServiceCard';
import ChainCategorySection from '../components/homeScreen/ChainCategorySection';
import ChainDealsSection from '../components/homeScreen/ChainDealsSection';
import ChainMenuTemplateDropdown from '../components/homeScreen/ChainMenuTemplateDropdown';
import ChainSpecialOffersBanner from '../components/homeScreen/ChainSpecialOffersBanner';
import useActiveBooking from '../../hooks/useActiveBooking';
import type { ChainMenuTemplate } from '../api/types';
import useChainMenuTemplates from '../hooks/useChainMenuTemplates';
import { useChainMenuStore } from '../stores/useChainMenuStore';
import type { ChainStackParamList } from '../navigation/types';

type Props = Record<string, never>;

export default function ChainHomeScreen({}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('homeVisits');
  const navigation = useNavigation<NativeStackNavigationProp<ChainStackParamList>>();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { selectedAddress } = useAddress();
  const { data: activeBooking } = useActiveBooking();
  const {
    addresses,
    isLoading: isAddressesLoading,
    refetch,
  } = useSavedAddresses('home-services');
  const { selectSavedAddress, selectingAddressId } =
    useSelectSavedAddress('home-services');
  const {
    isVisible: isAddressSheetVisible,
    open: handleOpenAddressSheet,
    close: handleCloseAddressSheet,
  } = useAddressSelectionSheet({
    addressesCount: addresses.length,
    isLoading: isAddressesLoading,
  });
  const {
    data: menuTemplates,
    isError: hasMenuTemplatesError,
    isLoading: isMenuTemplatesLoading,
  } = useChainMenuTemplates();
  const selectedMenuTemplateId = useChainMenuStore(
    (state) => state.selectedMenuTemplateId,
  );
  const setSelectedMenuTemplateId = useChainMenuStore(
    (state) => state.setSelectedMenuTemplateId,
  );
  const clearSelectedMenuTemplateId = useChainMenuStore(
    (state) => state.clearSelectedMenuTemplateId,
  );

  useEffect(() => {
    if (menuTemplates.length === 0) {
      clearSelectedMenuTemplateId();
      return;
    }

    if (
      selectedMenuTemplateId &&
      menuTemplates.some((template) => template.id === selectedMenuTemplateId)
    ) {
      return;
    }

    setSelectedMenuTemplateId(menuTemplates[0].id);
  }, [
    clearSelectedMenuTemplateId,
    menuTemplates,
    selectedMenuTemplateId,
    setSelectedMenuTemplateId,
  ]);

  const resolvedAddress = useMemo(
    () => createSelectedDeliveryAddress(addresses) ?? selectedAddress,
    [addresses, selectedAddress],
  );

  const handleTemplateSelect = useCallback(
    (template: ChainMenuTemplate) => {
      setSelectedMenuTemplateId(template.id);
    },
    [setSelectedMenuTemplateId],
  );

  const handleSelectAddress = useCallback(
    async (address: (typeof addresses)[number]) => {
      try {
        const isSelected = await selectSavedAddress(address.id);

        if (!isSelected) {
          return;
        }

        void refetch();
        handleCloseAddressSheet();
      } catch {
        showToast.error(t('address_select_error'));
      }
    },
    [handleCloseAddressSheet, refetch, selectSavedAddress, t],
  );

  const handleAddAddressPress = useCallback(() => {
    handleCloseAddressSheet();
    navigation.navigate('AddressSearch', {
      origin: 'chain-home',
      appPrefix: 'home-services',
    });
  }, [handleCloseAddressSheet, navigation]);

  const handleUseCurrentLocation = useCallback(() => {
    handleCloseAddressSheet();
    navigation.navigate('AddressChooseOnMap', {
      origin: 'chain-home',
      appPrefix: 'home-services',
    });
  }, [handleCloseAddressSheet, navigation]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);

    try {
      await Promise.all([
        refetch(),
        queryClient.refetchQueries({
          queryKey: homeVisitsKeys.discovery(),
          type: 'active',
        }),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient, refetch]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <HomeVisitsAddressHeader
        addressVariant="label"
        addresses={addresses}
        horizontalPadding={16}
        leftAccessory={(
          <Pressable
            accessibilityLabel="Back to home"
            accessibilityRole="button"
            onPress={resetToSharedHome}
            style={({ pressed }) => [
              styles.backButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: pressed ? 0.82 : 1,
                shadowColor: colors.shadowColor,
              },
            ]}
          >
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
        )}
        onAddAddressPress={handleOpenAddressSheet}
        onAddressPress={handleOpenAddressSheet}
        rightAccessory={(
          <ChainMenuTemplateDropdown
            hasError={hasMenuTemplatesError}
            isLoading={isMenuTemplatesLoading}
            items={menuTemplates}
            onSelectTemplate={handleTemplateSelect}
            selectedTemplateId={selectedMenuTemplateId}
          />
        )}
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: activeBooking ? 160 : 28 },
        ]}
        refreshControl={(
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              void handleRefresh();
            }}
            tintColor={colors.primary}
          />
        )}
        showsVerticalScrollIndicator={false}
      >
        <ChainSpecialOffersBanner />
        <ChainCategorySection isTemplatePending={isMenuTemplatesLoading} />
        <ChainDealsSection isTemplatePending={isMenuTemplatesLoading} />
      </ScrollView>

      {activeBooking ? (
        <View
          pointerEvents="box-none"
          style={[
            styles.activeCardFloatingContainer,
            { bottom: 10 },
          ]}
        >
          <ActiveServiceCard
            booking={activeBooking}
            onPress={() => {
              navigation.navigate('MultiVendorTrackWorker', {
                orderId: activeBooking.orderId,
                source: 'home_active_service',
              });
            }}
          />
        </View>
      ) : null}

      <AddressSelectionBottomSheet
        addresses={addresses}
        isLoading={isAddressesLoading}
        isVisible={isAddressSheetVisible}
        onAddAddress={handleAddAddressPress}
        onClose={handleCloseAddressSheet}
        onSelectAddress={handleSelectAddress}
        onUseCurrentLocation={handleUseCurrentLocation}
        selectingAddressId={selectingAddressId}
        selectedAddressId={resolvedAddress?.id ?? selectedAddress?.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 1,
    elevation: 2,
    height: 44,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    width: 44,
  },
  content: {
    gap: 16,
    paddingBottom: 28,
    paddingTop: 12,
  },
  activeCardFloatingContainer: {
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 20,
  },
  screen: {
    flex: 1,
  },
});
