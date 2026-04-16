import React, { useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import AddressChooseOnMap from '../../components/address/AddressChooseOnMap';
import type { MapAddressResult } from '../../components/address/AddressChooseOnMap';
import type { AddressFlowParamList } from '../../navigation/addressFlowTypes';

export default function AddressChooseOnMapScreen() {
  const nav = useNavigation<NativeStackNavigationProp<AddressFlowParamList>>();
  const route = useRoute();
  const { t } = useTranslation('general');
  const params =
    (route.params as AddressFlowParamList['AddressChooseOnMap']) ?? {};
  console.log("🚀 ~ AddressChooseOnMapScreen ~ params:", params)

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
      onBackPress={() => nav.goBack()}
      onConfirm={handleConfirm}
      confirmLabel={t('address_confirm_location')}
      locatingLabel={t('address_locating')}
      fallbackLabel={t('address_selected_location')}
    />
  );
}
