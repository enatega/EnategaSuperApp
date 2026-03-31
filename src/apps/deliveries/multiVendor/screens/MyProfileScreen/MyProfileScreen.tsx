import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenHeader from '../../../../../general/components/ScreenHeader';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import { showToast } from '../../../../../general/components/AppToast';
import useProfile from '../../hooks/useProfile';
import MyProfileInfoCard from '../../components/profile/MyProfileInfoCard';
import MyProfileSkeleton from '../../components/profile/MyProfileSkeleton';
import ProfilePhotoEditor from '../../components/profile/ProfilePhotoEditor';
import AddressOptionsBottomSheet from '../../components/profile/AddressOptionsBottomSheet';
import SavedAddressesList from '../../components/addressSelection/SavedAddressesList';
import { ProfileAddress } from '../../api/profileService';
import { addressService } from '../../../api/addressService';
import type { MultiVendorStackParamList } from '../../navigation/types';
import useAddress from '../../../hooks/useAddress';
import useSelectSavedAddress from '../../../hooks/useSelectSavedAddress';
import {
  formatDeliveryAddressLabel,
} from '../../../utils/address';

export default function MyProfileScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const navigation =
    useNavigation<NativeStackNavigationProp<MultiVendorStackParamList>>();
  const route = useRoute<RouteProp<MultiVendorStackParamList, 'MyProfile'>>();
  const { user, addresses, isLoading, refetch } = useProfile();
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);
  const [imageCacheKey, setImageCacheKey] = useState(0);
  const [addressMenuTarget, setAddressMenuTarget] =
    useState<ProfileAddress | null>(null);
  const {
    clearSelectedAddress,
    selectedAddress,
  } = useAddress();
  const { selectSavedAddress } = useSelectSavedAddress();
  const isSelectionMode = route.params?.selectionMode ?? false;

  const handleUploadComplete = () => {
    setImageCacheKey((prev) => prev + 1);
    refetch();
  };

  const displayName = user?.name || '—';

  const avatarUri = user?.image
    ? `${user.image}?cache=${imageCacheKey}`
    : undefined;

  const formattedDob = user?.date_of_birth
    ? new Date(user.date_of_birth).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const handleEditName = () => {
    navigation.navigate('EditProfile', {
      name: user?.name ?? '',
      dateOfBirth: user?.date_of_birth ?? null,
      gender: user?.gender ?? null,
    });
  };

  const handleAddAddress = useCallback(() => {
    navigation.navigate('AddressSearch', {
      origin: isSelectionMode ? 'home-header' : 'profile',
    });
  }, [isSelectionMode, navigation]);

  const handleEditAddress = useCallback(() => {
    if (!addressMenuTarget) return;
    navigation.navigate('AddressSearch', {
      editAddressId: addressMenuTarget.id,
      editType: addressMenuTarget.type,
      editLocationName: addressMenuTarget.location_name ?? '',
      origin: isSelectionMode ? 'home-header' : 'profile',
    });
  }, [addressMenuTarget, isSelectionMode, navigation]);

  const handleSelectAddress = useCallback(
    async (address: ProfileAddress) => {
      try {
        const isSelected = await selectSavedAddress(address.id);

        if (!isSelected) {
          return;
        }

        void refetch();

        if (isSelectionMode && navigation.canGoBack()) {
          navigation.goBack();
        }
      } catch {
        showToast.error(t('address_select_error'));
      }
    },
    [isSelectionMode, navigation, refetch, selectSavedAddress, t],
  );

  const handleDeleteAddress = useCallback(async () => {
    if (!addressMenuTarget) return;
    try {
      await addressService.deleteAddress(String(addressMenuTarget.id));

      if (selectedAddress?.id === addressMenuTarget.id) {
        clearSelectedAddress();
      }

      showToast.success(t('address_delete_success'));
      setAddressMenuTarget(null);
      refetch();
    } catch {
      showToast.error(t('address_delete_error'));
    }
  }, [addressMenuTarget, clearSelectedAddress, refetch, selectedAddress?.id, t]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('my_profile_title')} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <MyProfileSkeleton />
        ) : (
          <>
            <MyProfileInfoCard
              imageUri={avatarUri}
              displayName={displayName}
              fullName={displayName}
              dateOfBirth={formattedDob}
              phone={user?.phone}
              email={user?.email}
              editLabel={t('my_profile_edit')}
              nameLabel={t('my_profile_full_name')}
              dateOfBirthLabel={t('my_profile_date_of_birth')}
              phoneLabel={t('my_profile_mobile_number')}
              emailLabel={t('my_profile_email')}
              onEditAvatar={() => setIsPhotoModalVisible(true)}
              onEditName={handleEditName}
            />

            <ProfilePhotoEditor
              isVisible={isPhotoModalVisible}
              onClose={() => setIsPhotoModalVisible(false)}
              onUploadComplete={handleUploadComplete}
            />

            {/* Addresses section */}
            <View style={styles.addressesSection}>
              <View style={styles.sectionHeader}>
                <Text weight="bold" style={styles.sectionTitle}>
                  {t('my_profile_my_addresses')}
                </Text>
              </View>

              <SavedAddressesList
                addAddressLabel={t('my_profile_add_address')}
                addresses={addresses}
                onAddAddress={handleAddAddress}
                onAddressMenuPress={setAddressMenuTarget}
                onSelectAddress={handleSelectAddress}
                selectedAddressId={selectedAddress?.id}
              />
            </View>
          </>
        )}
      </ScrollView>

      <AddressOptionsBottomSheet
        isVisible={addressMenuTarget !== null}
        addressLabel={
          addressMenuTarget
            ? formatDeliveryAddressLabel({
                address: addressMenuTarget.address,
                locationName: addressMenuTarget.location_name,
              }) ?? ''
            : ''
        }
        onClose={() => setAddressMenuTarget(null)}
        onEdit={handleEditAddress}
        onDelete={handleDeleteAddress}
        editLabel={t('address_edit_title')}
        deleteLabel={t('address_delete')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  addressesSection: {
    gap: 12,
    paddingHorizontal: 16,
  },
  content: {
    gap: 24,
    paddingBottom: 28,
  },
  screen: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 24,
  },
});
