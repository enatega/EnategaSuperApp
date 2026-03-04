import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../general/theme/theme';
import HomeHeader from '../../../../screens/home/HomeHeader';
import RideOptionsSection from '../../components/RideOptionsSection';
import DeliveryServicesSection from '../../components/DeliveryServicesSection';
import RecommendedSection from '../../../../screens/home/RecommendedSection';
import HamburgerMenu from '../../components/HamburgerMenu';
import Sidebar, { type UserProfile } from '../../components/Sidebar';
import { useSidebarMenu } from '../../hooks/useSidebarMenu';

const recommendationImageOne = 'https://www.figma.com/api/mcp/asset/651c88ad-0287-4bc1-8f06-492da512be4b';
const recommendationImageTwo = 'https://www.figma.com/api/mcp/asset/498bbad1-818d-450a-ae02-e885a587ded5';

export default function RideSharingHomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const { sidebarVisible, openSidebar, closeSidebar, menuItems, handleLogout } = useSidebarMenu();
  const insets = useSafeAreaInsets();

  // User profile data (will be replaced with actual user data later)
  const userProfile: UserProfile = {
    name: 'Robert Watson',
    email: 'robert.watson141@test.com',
    rating: 4.89,
    reviewCount: 502,
  };

  const recommendations = [
    {
      id: 'rec-1',
      title: t('recommended_name'),
      rating: 4.1,
      reviews: 5000,
      price: 25,
      image: recommendationImageOne,
    },
    {
      id: 'rec-2',
      title: t('recommended_name_secondary'),
      rating: 4.1,
      reviews: 5000,
      price: 25,
      image: recommendationImageTwo,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <HamburgerMenu onPress={openSidebar} style={styles.hamburger} />
          <HomeHeader />
     
      </View>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <RideOptionsSection />
          <DeliveryServicesSection />
          <RecommendedSection items={recommendations} />
        </ScrollView>
      </SafeAreaView>

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
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    position: 'relative',
  },
  hamburger: {
    position: 'absolute',
    left: 16,
    top: 40,
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 24,
    paddingTop: 0,
  },
});

