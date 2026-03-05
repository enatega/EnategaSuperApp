import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
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

  const {
    userProfile,
    isLoading,
    isError,
    error,
    refetch,
    isEditingPhoto,
    openPhotoEdit,
    closePhotoEdit,
  } = useProfile();

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScreenHeader />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (isError || !userProfile) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScreenHeader />
        <View style={styles.centered}>
          <Text variant="subtitle" weight="bold" style={styles.errorTitle}>
            Failed to load profile
          </Text>
          <Text
            variant="body"
            color={colors.mutedText}
            style={styles.errorMessage}
          >
            {error?.message ?? 'Something went wrong. Please try again.'}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => refetch()}
            accessibilityLabel="Retry loading profile"
          >
            <Text variant="body" weight="semiBold" color="#fff">
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────
  const fullName = userProfile.name || '—';
  const fullPhone =
    [userProfile.countryCode, userProfile.phone].filter(Boolean).join(' ') || '—';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.scrollContent, { paddingTop: 20 }]}
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
        />

        {/* Profile Info Items */}
        <View style={[styles.infoContainer, { backgroundColor: colors.surface }]}>
          <ProfileInfoItem
            label={t('label_name')}
            value={fullName}
            onPress={() => navigation.navigate('EditName')}
          />

          <ProfileInfoItem
            label={t('label_phone')}
            value={fullPhone}
            verified={userProfile.phoneVerified}
            // onPress={() => navigation.navigate('EditPhone')}
            showChevron={false}
          />

          <ProfileInfoItem
            label={t('label_email')}
            value={userProfile.email || '—'}
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
    paddingHorizontal: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  errorTitle: {
    textAlign: 'center',
  },
  errorMessage: {
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
});
