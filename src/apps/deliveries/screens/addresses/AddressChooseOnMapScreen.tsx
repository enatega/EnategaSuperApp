import React, { useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import AddressChooseOnMap from '../../components/addresses/AddressChooseOnMap';
import type { MapAddressResult } from '../../components/addresses/AddressChooseOnMap';
import type { MultiVendorStackParamList } from '../../multiVendor/navigation/types';

export default function AddressChooseOnMapScreen() {
  const nav =
    useNavigation<NativeStackNavigationProp<MultiVendorStackParamList>>();
  const route = useRoute();
  const { t } = useTranslation('deliveries');
  const params =
    (route.params as MultiVendorStackParamList['AddressChooseOnMap']) ?? {};

  const handleConfirm = useCallback(
    (result: MapAddressResult) => {
      nav.navigate('AddressDetail', {
        address: result.description,
        latitude: result.latitude,
        longitude: result.longitude,
        ...(params.editAddressId
          ? {
              editAddressId: params.editAddressId,
              editType: params.editType,
              editLocationName: params.editLocationName,
              origin: params.origin,
            }
          : {}),
      });
    },
    [nav, params],
  );

  return (
    <AddressChooseOnMap
      onBackPress={() => nav.goBack()}
      onConfirm={handleConfirm}
      confirmLabel={t('address_confirm_location')}
      locatingLabel={t('address_locating')}
      fallbackLabel={t('address_selected_location')}
    />
  );
}
