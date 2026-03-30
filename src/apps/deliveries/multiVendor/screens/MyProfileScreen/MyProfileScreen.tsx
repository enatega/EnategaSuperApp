import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenHeader from '../../../../../general/components/ScreenHeader';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import { showToast } from '../../../../../general/components/AppToast';
import useProfile from '../../hooks/useProfile';
import MyProfileInfoCard from '../../components/profile/MyProfileInfoCard';
import MyProfileAddressCard from '../../components/profile/MyProfileAddressCard';
import MyProfileSkeleton from '../../components/profile/MyProfileSkeleton';
import ProfilePhotoEditor from '../../components/profile/ProfilePhotoEditor';
import AddressOptionsBottomSheet from '../../components/profile/AddressOptionsBottomSheet';
import { ProfileAddress } from '../../api/profileService';
import { addressService } from '../../../api/addressService';
import type { MultiVendorStackParamList } from '../../navigation/types';
import useAddress from '../../../hooks/useAddress';
import {
  createDeliveryAddressFromProfile,
  formatDeliveryAddressLabel,
} from '../../../utils/address';

const ADDRESS_ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  HOME: 'home-outline',
  APARTMENT: 'business-outline',
  OFFICE: 'briefcase-outline',
  OTHER: 'location-outline',
};

function getAddressIcon(type: string): keyof typeof Ionicons.glyphMap {
  return ADDRESS_ICON_MAP[type] ?? 'location-outline';
}

function getAddressTypeLabel(
  type: string,
  t: (key: string) => string,
): string {
  const labelMap: Record<string, string> = {
    HOME: t('my_profile_address_home'),
    APARTMENT: t('my_profile_address_apartment'),
    OFFICE: t('my_profile_address_work'),
    OTHER: t('my_profile_address_other'),
  };
  return labelMap[type] ?? type;
}

export default function MyProfileScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const navigation =
    useNavigation<NativeStackNavigationProp<MultiVendorStackParamList>>();
  const route = useRoute<RouteProp<MultiVendorStackParamList, 'MyProfile'>>();
  const { user, addresses, isLoading, refetch } = useProfile();
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);
  const [imageCacheKey, setImageCacheKey] = useState(0);
  const [addressMenuTarget, setAddressMenuTarget] = useState<ProfileAddress | null>(null);
  const {
    clearSelectedAddress,
    selectedAddress,
    setSelectedAddress,
  } = useAddress();
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
    (address: ProfileAddress) => {
      const nextAddress = createDeliveryAddressFromProfile(address);

      if (!nextAddress) {
        return;
      }

      setSelectedAddress(nextAddress);

      if (isSelectionMode && navigation.canGoBack()) {
        navigation.goBack();
      }
    },
    [isSelectionMode, navigation, setSelectedAddress],
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

              <View style={styles.addressList}>
                {addresses?.map((addr: ProfileAddress) => (
                  <MyProfileAddressCard
                    key={addr.id}
                    typeLabel={getAddressTypeLabel(addr.type, t)}
                    address={formatDeliveryAddressLabel({
                      address: addr.address,
                      locationName: addr.location_name,
                    })}
                    iconName={getAddressIcon(addr.type)}
                    isSelected={selectedAddress?.id === addr.id}
                    onPress={() => handleSelectAddress(addr)}
                    onMenuPress={() => setAddressMenuTarget(addr)}
                  />
                ))}

                {/* Add address button */}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('my_profile_add_address')}
                  onPress={() =>
                    navigation.navigate('AddressSearch', {
                      origin: isSelectionMode ? 'home-header' : 'profile',
                    })
                  }
                  style={({ pressed }) => [
                    styles.addButton,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                >
                  <Ionicons name="add" size={20} color={colors.text} />
                  <Text weight="medium" style={styles.addButtonText}>
                    {t('my_profile_add_address')}
                  </Text>
                </Pressable>
              </View>
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
  addButton: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonText: {
    fontSize: 14,
    lineHeight: 22,
  },
  addressList: {
    gap: 12,
  },
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
