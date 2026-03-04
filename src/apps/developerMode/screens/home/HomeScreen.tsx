import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../../general/components/Header';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { useTranslation } from 'react-i18next';
import Button from '../../../../general/components/Button';
import HamburgerMenu from '../../../rideSharing/components/HamburgerMenu';
import Sidebar, { type UserProfile } from '../../../rideSharing/components/Sidebar';
import { useSidebarMenu } from '../../../rideSharing/hooks/useSidebarMenu';

type RideSharingStackParamList = {
  RideSharingHome: undefined;
  RideDetails: undefined;
  DriverProfile: undefined;
};

type NavigationProp = NativeStackNavigationProp<RideSharingStackParamList, 'RideSharingHome'>;

export default function DeveloperModeHomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { sidebarVisible, openSidebar, closeSidebar, menuItems, handleLogout } = useSidebarMenu();

  // User profile data (will be replaced with actual user data later)
  const userProfile: UserProfile = {
    name: 'Robert Watson',
    email: 'robert.watson141@test.com',
    rating: 4.89,
    reviewCount: 502,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: Math.max(insets.top + 8, 20) }]}>
      {/* Header with Hamburger Menu */}
      <View style={styles.headerContainer}>
        <HamburgerMenu onPress={openSidebar} />
        <View style={styles.headerText}>
          <Text variant="title" weight="bold" color={colors.text}>
            {t('driver_profile_button')}
          </Text>
          <Text variant="caption" color={colors.mutedText}>
            System tools & diagnostics
          </Text>
        </View>
      </View>

      <Text variant="body" color={colors.mutedText}>
        Welcome to Developer Mode. Additional diagnostic tools will be available here soon.
      </Text>
      
      <Button
        label={t('driver_profile_button')}
        onPress={() => navigation.navigate('DriverProfile')}
        style={styles.button}
      />

      {/* Sidebar */}
      <Sidebar
        visible={sidebarVisible}
        onClose={closeSidebar}
        userProfile={userProfile}
        menuItems={menuItems}
        onLogout={handleLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  button: {
    marginTop: 8,
  },
});
