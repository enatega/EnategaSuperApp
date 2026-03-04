import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import ProfilePhoto from '../../components/profile/ProfilePhoto';
import ProfileInfoItem from '../../components/profile/ProfileInfoItem';
import { useProfile } from '../../hooks/useProfile';

export type ProfileStackParamList = {
  PersonalInfo: undefined;
  EditName: undefined;
  EditPhone: undefined;
  EditEmail: undefined;
};

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

export default function PersonalInfoScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const {
    userProfile,
    isEditingPhoto,
    openPhotoEdit,
    closePhotoEdit,
    updateProfilePhoto,
  } = useProfile();

  const fullName = `${userProfile.firstName} ${userProfile.lastName}`;
  const fullPhone = `${userProfile.countryCode} ${userProfile.phone}`;

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <ScreenHeader />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="title" weight="bold" color={colors.text}>
            {t('personal_info_title')}
          </Text>
          <Text variant="body" color={colors.mutedText}>
            {t('personal_info_subtitle')}
          </Text>
        </View>

        {/* Profile Photo */}
        <ProfilePhoto
          profilePhotoUri={userProfile.profilePhotoUri}
          onEditPress={openPhotoEdit}
          visible={isEditingPhoto}
          onClose={closePhotoEdit}
          onUpdatePhoto={() => updateProfilePhoto('dummy-uri')}
        />

        {/* Profile Info Items */}
        <View style={styles.infoContainer}>
          <ProfileInfoItem
            label={t('label_name')}
            value={fullName}
            onPress={() => navigation.navigate('EditName')}
          />

          <ProfileInfoItem
            label={t('label_phone')}
            value={fullPhone}
            verified={userProfile.phoneVerified}
            onPress={() => navigation.navigate('EditPhone')}
          />

          <ProfileInfoItem
            label={t('label_email')}
            value={userProfile.email}
            verified={userProfile.emailVerified}
            showChevron={false}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 32,
    gap: 4,
  },
  infoContainer: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
});
