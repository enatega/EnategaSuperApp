import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenHeader from '../../../../../general/components/ScreenHeader';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import useProfile from '../../hooks/useProfile';
import MyProfileInfoCard from '../../components/profile/MyProfileInfoCard';
import MyProfileAddressCard from '../../components/profile/MyProfileAddressCard';
import MyProfileSkeleton from '../../components/profile/MyProfileSkeleton';
import ProfilePhotoEditor from '../../components/profile/ProfilePhotoEditor';
import { ProfileAddress } from '../../api/profileService';

const ADDRESS_ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  HOME: 'home-outline',
  APARTMENT: 'business-outline',
  WORK: 'briefcase-outline',
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
    WORK: t('my_profile_address_work'),
    OTHER: t('my_profile_address_other'),
  };
  return labelMap[type] ?? type;
}

export default function MyProfileScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation();
  const { user, addresses, isLoading, refetch } = useProfile();
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);
  const [imageCacheKey, setImageCacheKey] = useState(0);

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
    (navigation as { navigate: (screen: string, params: Record<string, unknown>) => void }).navigate('EditProfile', {
      name: user?.name ?? '',
      dateOfBirth: user?.date_of_birth ?? null,
      gender: user?.gender ?? null,
    });
  };

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
                    address={
                      addr.location_name
                        ? `${addr.location_name} - ${addr.address}`
                        : addr.address
                    }
                    iconName={getAddressIcon(addr.type)}
                  />
                ))}

                {/* Add address button */}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('my_profile_add_address')}
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
