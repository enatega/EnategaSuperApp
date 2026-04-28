import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Skeleton from '../../../../general/components/Skeleton';
import ProfilePhoto from '../../components/profile/ProfilePhoto';
import Icon from '../../../../general/components/Icon';
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
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={[styles.scrollContent, { paddingTop: 20 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Skeleton */}
          <View style={styles.header}>
            <Skeleton width={150} height={32} style={{ marginBottom: 8 }} />
            <Skeleton width={200} height={20} />
          </View>

          {/* Profile Photo Skeleton */}
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <Skeleton width={100} height={100} borderRadius={50} />
          </View>

          {/* Profile Info Items Skeleton */}
          <View style={[styles.infoContainer, { backgroundColor: colors.surface }]}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={{ paddingVertical: 16, paddingHorizontal: 12 }}>
                <Skeleton width={80} height={20} style={{ marginBottom: 8 }} />
                <Skeleton width={160} height={16} />
              </View>
            ))}
          </View>
        </ScrollView>
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
  const emailValue = userProfile.email || '—';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.scrollContent, { paddingTop: 8 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text weight="bold" color={colors.text} style={styles.title}>
            {t('personal_info_title')}
          </Text>
          <Text color={colors.mutedText} style={styles.subtitle}>
            {t('personal_info_subtitle')}
          </Text>
        </View>

        <View style={styles.avatarWrap}>
          <View style={styles.avatarContainer}>
            {userProfile.profilePhotoUri ? (
              <Image source={{ uri: userProfile.profilePhotoUri }} style={styles.avatar} resizeMode="cover" />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.surface }]}>
                <Icon type="Ionicons" name="person" size={52} color={colors.mutedText} />
              </View>
            )}
            <Pressable
              onPress={openPhotoEdit}
              style={[styles.editBadge, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadowColor }]}
              accessibilityLabel={t('update_photo_button')}
            >
              <Icon type="Feather" name="edit-2" size={18} color={colors.text} />
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={() => navigation.navigate('EditName')}
          style={[styles.infoCard, { backgroundColor: colors.surfaceSoft, borderColor: colors.border }]}
        >
          <View style={[styles.leadingIcon, { backgroundColor: '#E0F2FE' }]}>
            <Icon type="Feather" name="user" size={20} color="#0EA5E9" />
          </View>
          <View style={styles.textCol}>
            <Text weight="medium" style={[styles.label, { color: colors.text }]}>{t('label_name_short')}</Text>
            <Text style={[styles.value, { color: colors.mutedText }]}>{fullName}</Text>
          </View>
          <Icon type="Feather" name="chevron-right" size={22} color={colors.iconMuted} />
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('EditPhone')}
          style={[styles.infoCard, { backgroundColor: colors.surfaceSoft, borderColor: colors.border }]}
        >
          <View style={[styles.leadingIcon, { backgroundColor: '#D1FAE5' }]}>
            <Icon type="Feather" name="phone" size={20} color="#10B981" />
          </View>
          <View style={styles.textCol}>
            <Text weight="medium" style={[styles.label, { color: colors.text }]}>{t('label_phone')}</Text>
            <View style={styles.valueRow}>
              <Text style={[styles.value, { color: colors.mutedText }]}>{fullPhone}</Text>
              {userProfile.phoneVerified ? (
                <Icon type="Ionicons" name="checkmark-circle" size={16} color={colors.success} />
              ) : null}
            </View>
          </View>
          <Icon type="Feather" name="chevron-right" size={22} color={colors.iconMuted} />
        </Pressable>

        <View style={[styles.infoCard, { backgroundColor: colors.surfaceSoft, borderColor: colors.border }]}>
          <View style={[styles.leadingIcon, { backgroundColor: '#EDE9FE' }]}>
            <Icon type="Feather" name="mail" size={20} color="#8B5CF6" />
          </View>
          <View style={styles.textCol}>
            <Text weight="medium" style={[styles.label, { color: colors.text }]}>{t('label_email')}</Text>
            <View style={styles.valueRow}>
              <Text style={[styles.value, { color: colors.mutedText }]} numberOfLines={1}>{emailValue}</Text>
              {userProfile.emailVerified ? (
                <Icon type="Ionicons" name="checkmark-circle" size={16} color={colors.success} />
              ) : null}
            </View>
          </View>
          <Icon type="Feather" name="chevron-right" size={22} color={colors.iconMuted} />
        </View>

        <ProfilePhoto
          profilePhotoUri={userProfile.profilePhotoUri}
          onEditPress={openPhotoEdit}
          visible={isEditingPhoto}
          onClose={closePhotoEdit}
          showAvatar={false}
        />
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
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.48,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
  },
  header: {
    marginBottom: 14,
    gap: 6,
  },
  avatarWrap: {
    alignItems: 'center',
    marginBottom: 18,
  },
  avatarContainer: {
    height: 120,
    position: 'relative',
    width: 120,
  },
  avatar: {
    borderRadius: 60,
    height: 120,
    width: 120,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    borderRadius: 60,
    height: 120,
    justifyContent: 'center',
    width: 120,
  },
  editBadge: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    bottom: -2,
    elevation: 2,
    height: 40,
    justifyContent: 'center',
    position: 'absolute',
    right: -2,
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: 40,
  },
  infoCard: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    minHeight: 70,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  leadingIcon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
  },
  value: {
    fontSize: 14,
    lineHeight: 22,
  },
  valueRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
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
  infoContainer: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
});
