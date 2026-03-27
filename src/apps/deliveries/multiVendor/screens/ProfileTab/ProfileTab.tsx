import React, { useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../../../general/theme/theme';
import useProfile from '../../hooks/useProfile';
import ProfileHeader from '../../components/profile/ProfileHeader';
import WalletCard from '../../components/profile/WalletCard';
import ProfileMenuSection from '../../components/profile/ProfileMenuSection';
import ProfileMenuItem from '../../components/profile/ProfileMenuItem';
import ProfileSkeleton from '../../components/profile/ProfileSkeleton';
import { authSession } from '../../../../../general/auth/authSession';
import { navigationRef } from '../../../../../general/navigation/rootNavigation';

const ICON_SIZE = 20;

export default function ProfileTab() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user, wallet, isLoading } = useProfile();

  const handleLogout = useCallback(async () => {
    await authSession.clearSession();
    if (navigationRef.isReady()) {
      navigationRef.resetRoot({
        index: 0,
        routes: [{ name: 'Main', params: { screen: 'Auth' } }],
      });
    }
  }, []);

  if (isLoading) {
    return (
      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingTop: insets.top }}
      >
        <ProfileSkeleton />
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
        subtitle={t('profile_personal_account')}
      />

      <WalletCard
        balance={wallet?.wallet_balance}
        balanceLabel={t('profile_wallet_balance')}
        buttonLabel={t('profile_view_wallet')}
      />

      <ProfileMenuSection>
        <ProfileMenuItem
          icon={<Ionicons name="person-outline" size={ICON_SIZE} color={iconColor} />}
          label={t('profile_menu_profile')}
          onPress={() => navigation.navigate('MyProfile' as never)}
        />
        <ProfileMenuItem
          icon={<Ionicons name="notifications-outline" size={ICON_SIZE} color={iconColor} />}
          label={t('profile_menu_notifications')}
        />
        <ProfileMenuItem
          icon={<Ionicons name="heart-outline" size={ICON_SIZE} color={iconColor} />}
          label={t('profile_menu_favorites')}
          onPress={() => navigation.navigate('Favourites' as never)}
        />
        <ProfileMenuItem
          icon={<Ionicons name="pricetag-outline" size={ICON_SIZE} color={iconColor} />}
          label={t('profile_menu_coupons')}
        />
        <ProfileMenuItem
          icon={<Ionicons name="settings-outline" size={ICON_SIZE} color={iconColor} />}
          label={t('profile_menu_settings')}
          onPress={() => navigation.navigate('Settings' as never)}
        />
      </ProfileMenuSection>

      <ProfileMenuSection>
        <ProfileMenuItem
          icon={<Ionicons name="help-buoy-outline" size={ICON_SIZE} color={iconColor} />}
          label={t('profile_menu_support')}
          onPress={() => navigation.navigate('Support' as never)}
        />
        <ProfileMenuItem
          icon={<Ionicons name="moon-outline" size={ICON_SIZE} color={iconColor} />}
          label={t('profile_menu_color_mode')}
          onPress={() => navigation.navigate('ColorMode' as never)}
        />
        <ProfileMenuItem
          icon={<Ionicons name="globe-outline" size={ICON_SIZE} color={iconColor} />}
          label={t('profile_menu_language')}
          onPress={() => navigation.navigate('Language' as never)}
        />
      </ProfileMenuSection>

      <ProfileMenuSection>
        <ProfileMenuItem
          icon={<Ionicons name="log-out-outline" size={ICON_SIZE} color={iconColor} />}
          label={t('profile_menu_logout')}
          onPress={() => { void handleLogout(); }}
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
