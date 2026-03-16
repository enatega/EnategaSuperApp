import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useTheme } from '../../../../general/theme/theme';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Button from '../../../../general/components/Button';
import AddressDetailForm from '../../components/addresses/AddressDetailForm';
import type { AddressDetailFormHandle } from '../../components/addresses/AddressDetailForm';
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
  const insets = useSafeAreaInsets();
  const formRef = useRef<AddressDetailFormHandle>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const params = route.params as RouteParams;
  const isEditing = Boolean(params.editAddressId);
  const lat = Number(params.latitude);
  const lng = Number(params.longitude);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardOffset(e.endCoordinates.height - insets.bottom + 16);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOffset(0);
    });
    return () => { show.remove(); hide.remove(); };
  }, [insets.bottom]);

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

  const handleButtonPress = useCallback(async () => {
    if (!formRef.current) return;
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AddressDetailForm
          ref={formRef}
          address={params.address}
          latitude={lat}
          longitude={lng}
          initialLocationName={params.editLocationName}
          initialType={(params.editType as AddressType) ?? 'HOME'}
          onSave={handleSave}
          labels={{
            locationNamePlaceholder: t('address_location_name_placeholder'),
            addressDetailsLabel: t('address_details_label'),
            locationTypeLabel: t('address_location_type_label'),
            home: t('address_type_home'),
            apartment: t('address_type_apartment'),
            office: t('address_type_office'),
            other: t('address_type_other'),
          }}
        />
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            borderTopColor: colors.border,
            backgroundColor: colors.background,
            paddingBottom: insets.bottom + 12,
            bottom: keyboardOffset,
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
  scrollContent: { gap: 16, paddingBottom: 100, paddingTop: 16 },
  scrollView: { flex: 1 },
});
