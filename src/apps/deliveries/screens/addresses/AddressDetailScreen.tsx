import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useTheme } from '../../../../general/theme/theme';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import AddressDetailForm from '../../components/addresses/AddressDetailForm';
import { addressService, AddressType } from '../../api/addressService';

type RouteParams = {
  address: string;
  latitude: number;
  longitude: number;
  editAddressId?: string;
  editType?: string;
  editLocationName?: string;
};

export default function AddressDetailScreen() {
  const nav = useNavigation<NativeStackNavigationProp<Record<string, object | undefined>>>();
  const route = useRoute();
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const params = route.params as RouteParams;
  const isEditing = Boolean(params.editAddressId);
  const lat = Number(params.latitude);
  const lng = Number(params.longitude);

  const handleSave = useCallback(async (data: {
    address: string; latitude: number; longitude: number;
    type: AddressType; location_name: string;
  }) => {
    const payload = { ...data, latitude: Number(data.latitude), longitude: Number(data.longitude) };
    try {
      if (isEditing && params.editAddressId) {
        await addressService.updateAddress(params.editAddressId, payload);
        Toast.show({ type: 'success', text1: t('address_update_success') });
      } else {
        await addressService.addAddress(payload);
        Toast.show({ type: 'success', text1: t('address_save_success') });
      }
      nav.navigate('MyProfile');
    } catch {
      Toast.show({ type: 'error', text1: t('address_save_error') });
    }
  }, [isEditing, params.editAddressId, nav, t]);

  const screenTitle = isEditing ? t('address_edit_title') : t('address_add_title');

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={screenTitle} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <AddressDetailForm
          address={params.address}
          latitude={lat}
          longitude={lng}
          initialLocationName={params.editLocationName}
          initialType={(params.editType as AddressType) ?? 'HOME'}
          isEditing={isEditing}
          onSave={handleSave}
          labels={{
            locationNamePlaceholder: t('address_location_name_placeholder'),
            home: t('address_type_home'),
            apartment: t('address_type_apartment'),
            office: t('address_type_office'),
            other: t('address_type_other'),
            save: t('address_save'),
            update: t('address_update'),
            noResults: t('address_no_results'),
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16, paddingBottom: 28, paddingTop: 16 },
  screen: { flex: 1 },
});
