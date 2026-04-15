import React, { useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddressSelectionBottomSheet from '../../../../general/components/address/AddressSelectionBottomSheet';
import MultiVendorAddressHeader from '../../components/MultiVendorAddressHeader';
import type { ProfileAddress } from '../../account/api/profileService';
import { useAddress } from '../../hooks';
import useAddressSelectionSheet from '../../../../general/hooks/useAddressSelectionSheet';
import useSavedAddresses from '../../../../general/hooks/useSavedAddresses';
import useSelectSavedAddress from '../../../../general/hooks/useSelectSavedAddress';
import type { DeliveriesStackParamList } from '../../navigation/types';
import { showToast } from '../../../../general/components/AppToast';
import { useTheme } from '../../../../general/theme/theme';
import ChainCategorySection from '../components/homeScreen/ChainCategorySection';
import ChainDealsSection from '../components/homeScreen/ChainDealsSection';
import ChainMenuTemplateDropdown from '../components/homeScreen/ChainMenuTemplateDropdown';
import ChainSpecialOffersBanner from '../components/homeScreen/ChainSpecialOffersBanner';
import type { ChainMenuTemplate } from '../api/types';
import useChainMenuTemplates from '../hooks/useChainMenuTemplates';
import { useChainMenuStore } from '../stores/useChainMenuStore';

type Props = Record<string, never>;

export default function HomeScreen({}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<DeliveriesStackParamList>>();
  const {
    addresses,
    isLoading: isAddressesLoading,
    refetch,
  } = useSavedAddresses();
  const { selectedAddress } = useAddress();
  const { selectSavedAddress, selectingAddressId } = useSelectSavedAddress();
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
  const {
    isVisible: isAddressSheetVisible,
    open: handleOpenAddressSheet,
    close: handleCloseAddressSheet,
  } = useAddressSelectionSheet({
    addressesCount: addresses.length,
    isLoading: isAddressesLoading,
  });

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

  const handleSelectAddress = useCallback(
    async (address: ProfileAddress) => {
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
    navigation.navigate('AddressSearch', { origin: 'chain-home' });
  }, [handleCloseAddressSheet, navigation]);

  const handleUseCurrentLocation = useCallback(() => {
    handleCloseAddressSheet();
    navigation.navigate('AddressChooseOnMap', { origin: 'chain-home' });
  }, [handleCloseAddressSheet, navigation]);

  const handleTemplateSelect = useCallback((template: ChainMenuTemplate) => {
    setSelectedMenuTemplateId(template.id);
  }, [setSelectedMenuTemplateId]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: insets.bottom + 28,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <MultiVendorAddressHeader
          addressVariant="label"
          addresses={addresses}
          onAddAddressPress={handleOpenAddressSheet}
          onAddressPress={handleOpenAddressSheet}
          rightAccessory={
            <ChainMenuTemplateDropdown
              hasError={hasMenuTemplatesError}
              isLoading={isMenuTemplatesLoading}
              items={menuTemplates}
              onSelectTemplate={handleTemplateSelect}
              selectedTemplateId={selectedMenuTemplateId}
            />
          }
          showCartButton={false}
        />

        <ChainSpecialOffersBanner />
        <ChainCategorySection isTemplatePending={isMenuTemplatesLoading} />
        <ChainDealsSection isTemplatePending={isMenuTemplatesLoading} />
      </ScrollView>

      <AddressSelectionBottomSheet
        addresses={addresses}
        isLoading={isAddressesLoading}
        isVisible={isAddressSheetVisible}
        onAddAddress={handleAddAddressPress}
        onClose={handleCloseAddressSheet}
        onSelectAddress={handleSelectAddress}
        onUseCurrentLocation={handleUseCurrentLocation}
        selectingAddressId={selectingAddressId}
        selectedAddressId={selectedAddress?.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    gap: 20,
  },
});
