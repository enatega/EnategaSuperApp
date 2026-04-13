import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddressSelectionBottomSheet from '../../components/AddressSelectionBottomSheet';
import MultiVendorAddressHeader from '../../components/MultiVendorAddressHeader';
import type { ProfileAddress } from '../../account/api/profileService';
import useAddress from '../../hooks/useAddress';
import useAddressSelectionSheet from '../../hooks/useAddressSelectionSheet';
import useSavedAddresses from '../../hooks/useSavedAddresses';
import useSelectSavedAddress from '../../hooks/useSelectSavedAddress';
import type { DeliveriesStackParamList } from '../../navigation/types';
import { showToast } from '../../../../general/components/AppToast';
import { useTheme } from '../../../../general/theme/theme';
import ChainCategorySection from '../components/homeScreen/ChainCategorySection';
import ChainMenuTemplateDropdown from '../components/homeScreen/ChainMenuTemplateDropdown';
import type { ChainMenuTemplate } from '../api/types';
import useChainMenuTemplates from '../hooks/useChainMenuTemplates';

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
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
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
      setSelectedTemplateId(null);
      return;
    }

    if (
      selectedTemplateId &&
      menuTemplates.some((template) => template.id === selectedTemplateId)
    ) {
      return;
    }

    setSelectedTemplateId(menuTemplates[0].id);
  }, [menuTemplates, selectedTemplateId]);

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
    setSelectedTemplateId(template.id);
  }, []);

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
              selectedTemplateId={selectedTemplateId}
            />
          }
          showCartButton={false}
        />

        <ChainCategorySection
          isTemplatePending={isMenuTemplatesLoading}
          menuTemplateId={selectedTemplateId}
        />
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
