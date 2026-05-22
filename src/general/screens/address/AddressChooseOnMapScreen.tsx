import React, { useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import AddressChooseOnMap from '../../components/address/AddressChooseOnMap';
import type { MapAddressResult } from '../../components/address/AddressChooseOnMap';
import useAddress from '../../hooks/useAddress';
import type { AddressFlowParamList } from '../../navigation/addressFlowTypes';

export default function AddressChooseOnMapScreen() {
  const nav = useNavigation<NativeStackNavigationProp<AddressFlowParamList>>();
  const route = useRoute();
  const { t } = useTranslation('general');
  const { selectedAddress } = useAddress();
  const params =
    (route.params as AddressFlowParamList['AddressChooseOnMap']) ?? {};
  const initialCoordinate = (
    typeof params.latitude === 'number' &&
    typeof params.longitude === 'number'
  )
    ? { latitude: params.latitude, longitude: params.longitude }
    : (
      typeof selectedAddress?.latitude === 'number' &&
      typeof selectedAddress?.longitude === 'number'
    )
      ? {
        latitude: selectedAddress.latitude,
        longitude: selectedAddress.longitude,
      }
      : null;

  const handleConfirm = useCallback(
    (result: MapAddressResult) => {
      nav.navigate('AddressDetail', {
        address: result.description,
        latitude: result.latitude,
        longitude: result.longitude,
        ...(params.editAddressId
          ? {
            appPrefix: params.appPrefix,
            editAddressId: params.editAddressId,
            editType: params.editType,
            editLocationName: params.editLocationName,
            origin: params.origin,
          }
          : { appPrefix: params.appPrefix, origin: params.origin }),
      });
    },
    [nav, params],
  );

  return (
    <AddressChooseOnMap
      initialCoordinate={
        typeof params.initialLatitude === 'number' &&
          typeof params.initialLongitude === 'number'
          ? {
            latitude: params.initialLatitude,
            longitude: params.initialLongitude,
          }
          : null
      }
      onBackPress={() => nav.goBack()}
      onConfirm={handleConfirm}
      confirmLabel={t('address_confirm_location')}
      locatingLabel={t('address_locating')}
      fallbackLabel={t('address_selected_location')}
    />
  );
}
