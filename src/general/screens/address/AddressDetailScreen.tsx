import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { showToast } from '../../components/AppToast';
import Button from '../../components/Button';
import ScreenHeader from '../../components/ScreenHeader';
import { useTheme } from '../../theme/theme';
import { addressService } from '../../api/addressService';
import AddressDetailForm from '../../components/address/AddressDetailForm';
import type {
  AddressDetailFormHandle,
  AddressDetailFormSubmitData,
} from '../../components/address/AddressDetailForm';
import type { AddressFlowParamList } from '../../navigation/addressFlowTypes';
import type { AddressType } from '../../api/addressService';
import { createDeliveryAddressFromSavedAddress } from '../../utils/address';
import useAddress from '../../hooks/useAddress';
import type {
  AddressAdditionalFields,
  SavedAddress,
} from '../../api/addressService';

type AddressFlowHostParamList = AddressFlowParamList & {
  Checkout: undefined;
  Chain: { screen: 'ChainTabs' } | undefined;
  MultiVendor: { screen: 'MultiVendorTabs' } | undefined;
  MyProfile: undefined;
  SingleVendor: { screen: 'SingleVendorTabs' } | undefined;
};

function areAdditionalFieldsEqual(
  first: AddressAdditionalFields | undefined,
  second: AddressAdditionalFields | undefined,
) {
  const normalizedFirst = first ?? {};
  const normalizedSecond = second ?? {};
  const keys = Array.from(
    new Set([
      ...Object.keys(normalizedFirst),
      ...Object.keys(normalizedSecond),
    ]),
  ) as Array<keyof AddressAdditionalFields>;

  return keys.every((key) => normalizedFirst[key] === normalizedSecond[key]);
}

function toTimestamp(value: string | undefined) {
  const timestamp = value ? Date.parse(value) : Number.NaN;
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function getNewestAddress(addresses: SavedAddress[]) {
  return [...addresses].sort(
    (first, second) =>
      toTimestamp(second.updatedAt ?? second.createdAt)
      - toTimestamp(first.updatedAt ?? first.createdAt),
  )[0];
}

function findSavedAddressToSelect(
  addresses: SavedAddress[],
  params: {
    address: string;
    additionalFields?: AddressAdditionalFields;
    locationName?: string;
    type: AddressType;
  },
) {
  const exactMatches = addresses.filter((address) =>
    address.address === params.address
    && address.type === params.type
    && (address.location_name ?? undefined) === params.locationName
    && areAdditionalFieldsEqual(address.additional_fields, params.additionalFields));

  if (exactMatches.length > 0) {
    return getNewestAddress(exactMatches);
  }

  const partialMatches = addresses.filter((address) =>
    address.address === params.address
    && address.type === params.type);

  if (partialMatches.length > 0) {
    return getNewestAddress(partialMatches);
  }

  return getNewestAddress(addresses);
}

export default function AddressDetailScreen() {
  const nav =
    useNavigation<NativeStackNavigationProp<AddressFlowHostParamList>>();
  const route = useRoute<RouteProp<AddressFlowParamList, 'AddressDetail'>>();
  const { colors } = useTheme();
  const { t } = useTranslation('general');
  const insets = useSafeAreaInsets();
  const formRef = useRef<AddressDetailFormHandle>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const params = route.params;
  const { setSelectedAddress } = useAddress();
  const isEditing = Boolean(params.editAddressId);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (event) => {
      setIsKeyboardVisible(true);
      setKeyboardOffset(event.endCoordinates.height - insets.bottom + 16);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
      setKeyboardOffset(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, [insets.bottom]);

  const handleSave = useCallback(
    async (data: AddressDetailFormSubmitData) => {
      const payload = {
        address: data.address,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        type: data.type,
        ...(data.location_name ? { location_name: data.location_name } : {}),
        ...(data.additional_fields
          ? { additional_fields: data.additional_fields }
          : {}),
      };

      try {
        if (isEditing && params.editAddressId) {
          await addressService.updateAddress(params?.appPrefix, params.editAddressId, payload);
          showToast.success(t('address_update_success'));
        } else {
          await addressService.addAddress(params?.appPrefix, payload);
          showToast.success(t('address_save_success'));
        }

        // Keep the just-saved address selected so users don't need to reselect it.
        if (data.shouldSetDefault) {
          const savedAddresses = await addressService.getSavedAddresses(
            params.appPrefix,
          );
          const savedAddressToSelect = isEditing
            ? savedAddresses.find((address) => address.id === params.editAddressId)
            : findSavedAddressToSelect(savedAddresses, {
              address: payload.address,
              additionalFields: data.additional_fields,
              locationName: data.location_name,
              type: payload.type,
            });

          if (savedAddressToSelect) {
            const selectedResponse = await addressService.selectAddress(
              params.appPrefix,
              savedAddressToSelect.id,
            );
            const nextAddress = createDeliveryAddressFromSavedAddress(
              selectedResponse.data,
            );

            if (nextAddress) {
              setSelectedAddress(nextAddress);
            }
          }
        }

        if (params.origin === 'multi-vendor-home') {
          nav.navigate('MultiVendor', { screen: 'MultiVendorTabs' });
          return;
        }

        if (params.origin === 'single-vendor-home') {
          nav.navigate('SingleVendor', { screen: 'SingleVendorTabs' });
          return;
        }

        if (params.origin === 'chain-home') {
          nav.navigate('Chain', { screen: 'ChainTabs' });
          return;
        }

        if (params.origin === 'checkout') {
          nav.navigate('Checkout');
          return;
        }

        nav.navigate('MyProfile');
      } catch {
        showToast.error(t('address_save_error'));
      }
    },
    [isEditing, nav, params.appPrefix, params.editAddressId, params.origin, setSelectedAddress, t],
  );

  const handleButtonPress = useCallback(async () => {
    if (!formRef.current) {
      return;
    }

    setIsSaving(true);
    try {
      await formRef.current.submit();
    } finally {
      setIsSaving(false);
    }
  }, []);

  const screenTitle = isEditing ? t('address_edit_title') : t('address_add_title');
  const buttonLabel = isEditing ? t('address_update') : t('address_save');

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={screenTitle} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: isKeyboardVisible
              ? keyboardOffset + 24
              : 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <AddressDetailForm
          ref={formRef}
          address={params.address}
          latitude={Number(params.latitude)}
          longitude={Number(params.longitude)}
          initialLocationName={params.editLocationName}
          initialType={(params.editType as AddressType) ?? 'HOME'}
          onSave={handleSave}
          labels={{
            apartmentDetailsTitle: t('address_apartment_details_title'),
            apartmentFloorTowerLabel: t('address_field_floor_tower_optional'),
            apartmentFloorTowerPlaceholder: t('address_detail_floor_placeholder'),
            apartmentLandmarkLabel: t('address_field_landmark_optional'),
            apartmentLandmarkPlaceholder: t('address_detail_landmark_placeholder'),
            apartmentSocietyBuildingNameLabel: t('address_field_society_building_name'),
            apartmentSocietyBuildingNamePlaceholder: t('address_detail_society_placeholder'),
            apartmentUnitLabel: t('address_field_apartment_flat'),
            apartmentUnitPlaceholder: t('address_detail_apartment_placeholder'),
            locationNamePlaceholder: t('address_location_name_placeholder'),
            addressDetailsLabel: t('address_details_label'),
            locationTypeLabel: t('address_location_type_label'),
            homeAreaStreetLabel: t('address_field_area_street'),
            homeAreaStreetPlaceholder: t('address_detail_area_placeholder'),
            homeDetailsTitle: t('address_home_details_title'),
            homeHouseFlatNumberLabel: t('address_field_house_flat_number'),
            homeHouseFlatNumberPlaceholder: t('address_detail_house_placeholder'),
            homeLandmarkLabel: t('address_field_landmark_optional'),
            homeLandmarkPlaceholder: t('address_detail_landmark_placeholder'),
            home: t('address_type_home'),
            apartment: t('address_type_apartment'),
            office: t('address_type_office'),
            officeCompanyBuildingNameLabel: t('address_field_company_building_name'),
            officeCompanyBuildingNamePlaceholder: t('address_detail_company_building_placeholder'),
            officeDepartmentLabel: t('address_field_department_optional'),
            officeDepartmentPlaceholder: t('address_detail_department_placeholder'),
            officeDetailsTitle: t('address_office_details_title'),
            officeFloorSuiteUnitLabel: t('address_field_floor_suite_unit_optional'),
            officeFloorSuiteUnitPlaceholder: t('address_detail_floor_suite_unit_placeholder'),
            officeLandmarkLabel: t('address_field_landmark_optional'),
            officeLandmarkPlaceholder: t('address_detail_landmark_placeholder'),
            other: t('address_type_other'),
            setAsDefaultAddress: t('address_set_as_default'),
          }}
        />
      </ScrollView>

      {isKeyboardVisible ? null : (
        <View
          style={[
            styles.footer,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              bottom: 0,
              paddingBottom: insets.bottom + 12,
            },
          ]}
        >
          <Button
            label={buttonLabel}
            onPress={handleButtonPress}
            isLoading={isSaving}
            disabled={isSaving}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    position: 'absolute',
    right: 0,
  },
  screen: { flex: 1 },
  scrollContent: { gap: 16, paddingTop: 16 },
  scrollView: { flex: 1 },
});
