import React, { useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useNavigation,
  type NavigationProp,
} from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/theme';
import { useAppLogout } from '../../hooks/useAppLogout';
import type {
  ProfileUser,
  WalletResponse,
} from '../../api/profileService';
import type { ProfileTabNavigationParamList } from '../../navigation/profileTypes';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileMenuItem from '../../components/profile/ProfileMenuItem';
import ProfileMenuSection from '../../components/profile/ProfileMenuSection';
import ProfileSkeleton from '../../components/profile/ProfileSkeleton';
import WalletCard from '../../components/profile/WalletCard';

const ICON_SIZE = 20;

type Props = {
  favoritesEnabled?: boolean;
  couponsEnabled?: boolean;
  isLoading: boolean;
  onOpenCoupons?: () => void;
  onOpenFavourites?: () => void;
  onOpenNotifications?: () => void;
  subtitle?: string;
  user: ProfileUser | null;
  wallet: WalletResponse['data'] | null;
};

export default function ProfileTabScreen({
  favoritesEnabled = false,
  couponsEnabled = true,
  isLoading,
  onOpenCoupons,
  onOpenFavourites,
  onOpenNotifications,
  subtitle,
  user,
  wallet,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('general');
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NavigationProp<ProfileTabNavigationParamList>>();
  const logoutMutation = useAppLogout();

  const handleLogout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  if (isLoading) {
    return (
      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingTop: insets.top }}
      >
        <ProfileSkeleton hasFeatureCard />
      </ScrollView>
    );
  }

  const iconColor = colors.text;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      <ProfileHeader
        name={user?.name}
        imageUri={user?.image}
        subtitle={subtitle ?? t('profile_personal_account')}
      />

      <WalletCard
        balance={wallet?.wallet_balance}
        balanceLabel={t('profile_wallet_balance')}
        buttonLabel={t('profile_view_wallet')}
        onPressWallet={() => navigation.navigate('Wallet')}
      />

      <ProfileMenuSection>
        <ProfileMenuItem
          icon={<Ionicons name="person-outline" size={ICON_SIZE} color={iconColor} />}
          label={t('profile_menu_profile')}
          onPress={() => navigation.navigate('MyProfile')}
        />
        <ProfileMenuItem
          icon={<Ionicons name="notifications-outline" size={ICON_SIZE} color={iconColor} />}
          label={t('profile_menu_notifications')}
          onPress={onOpenNotifications}
        />
        <ProfileMenuItem
          icon={<Ionicons name="heart-outline" size={ICON_SIZE} color={iconColor} />}
          label={t('profile_menu_favorites')}
          onPress={favoritesEnabled ? onOpenFavourites : undefined}
        />
        {couponsEnabled && (
        <ProfileMenuItem
          icon={<Ionicons name="pricetag-outline" size={ICON_SIZE} color={iconColor} />}
          label={t('profile_menu_coupons')}
          onPress={onOpenCoupons}
        />
        )}
        <ProfileMenuItem
          icon={<Ionicons name="settings-outline" size={ICON_SIZE} color={iconColor} />}
          label={t('profile_menu_settings')}
          onPress={() => navigation.navigate('Settings')}
        />
      </ProfileMenuSection>

      <ProfileMenuSection>
        <ProfileMenuItem
          icon={<Ionicons name="help-buoy-outline" size={ICON_SIZE} color={iconColor} />}
          label={t('profile_menu_support')}
          onPress={() => navigation.navigate('Support')}
        />
        <ProfileMenuItem
          icon={<Ionicons name="moon-outline" size={ICON_SIZE} color={iconColor} />}
          label={t('profile_menu_color_mode')}
          onPress={() => navigation.navigate('ColorMode')}
        />
        <ProfileMenuItem
          icon={<Ionicons name="globe-outline" size={ICON_SIZE} color={iconColor} />}
          label={t('profile_menu_language')}
          onPress={() => navigation.navigate('Language')}
        />
      </ProfileMenuSection>

      <ProfileMenuSection>
        <ProfileMenuItem
          icon={<Ionicons name="log-out-outline" size={ICON_SIZE} color={iconColor} />}
          label={t('profile_menu_logout')}
          onPress={() => {
            void handleLogout();
          }}
        />
      </ProfileMenuSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingBottom: 28,
  },
  scroll: {
    flex: 1,
  },
});
