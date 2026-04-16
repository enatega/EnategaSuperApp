import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Button from '../../components/Button';
import ScreenHeader from '../../components/ScreenHeader';
import { useTheme } from '../../theme/theme';
import { addressService } from '../../api/addressService';
import AddressDetailForm from '../../components/address/AddressDetailForm';
import type { AddressDetailFormHandle } from '../../components/address/AddressDetailForm';
import type { AddressFlowParamList } from '../../navigation/addressFlowTypes';
import type { AddressPayload, AddressType } from '../../api/addressService';

type AddressFlowHostParamList = AddressFlowParamList & {
  Chain: { screen: 'ChainTabs' } | undefined;
  MultiVendor: { screen: 'MultiVendorTabs' } | undefined;
  MyProfile: undefined;
  SingleVendor: { screen: 'SingleVendorTabs' } | undefined;
};

export default function AddressDetailScreen() {
  const nav =
    useNavigation<NativeStackNavigationProp<AddressFlowHostParamList>>();
  const route = useRoute<RouteProp<AddressFlowParamList, 'AddressDetail'>>();
  const { colors } = useTheme();
  const { t } = useTranslation('general');
  const insets = useSafeAreaInsets();
  const formRef = useRef<AddressDetailFormHandle>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const params = route.params;
  console.log("🚀 ~ AddressDetailScreen ~ params:", params)
  const isEditing = Boolean(params.editAddressId);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardOffset(event.endCoordinates.height - insets.bottom + 16);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOffset(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, [insets.bottom]);

  const handleSave = useCallback(
    async (data: AddressPayload) => {
      const payload = {
        ...data,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
      };

      try {
        if (isEditing && params.editAddressId) {
          await addressService.updateAddress(params?.appPrefix, params.editAddressId, payload);
          Toast.show({ type: 'success', text1: t('address_update_success') });
        } else {
          await addressService.addAddress(params?.appPrefix, payload);
          Toast.show({ type: 'success', text1: t('address_save_success') });
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

        nav.navigate('MyProfile');
      } catch {
        Toast.show({ type: 'error', text1: t('address_save_error') });
      }
    },
    [isEditing, nav, params.editAddressId, params.origin, t],
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            bottom: keyboardOffset,
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
