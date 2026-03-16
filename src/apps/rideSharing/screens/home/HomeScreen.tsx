import React, { useEffect, useMemo } from 'react';
import { BackHandler, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../general/theme/theme';
import HomeHeader from '../../../../screens/home/HomeHeader';
import RideOptionsSection from '../../components/RideOptionsSection';
import DeliveryServicesSection from '../../components/DeliveryServicesSection';
import RecommendedSection from '../../../../screens/home/RecommendedSection';
import HamburgerMenu from '../../components/HamburgerMenu';
import Sidebar, { type UserProfile } from '../../components/Sidebar';
import ActiveRideNotice from '../../components/ActiveRideNotice';
import useBootstrapActiveRide from '../../hooks/useBootstrapActiveRide';
import { useSidebarMenu } from '../../hooks/useSidebarMenu';
import { useProfile } from '../../hooks/useProfile';
import { useActiveRideRequestStore } from '../../stores/useActiveRideRequestStore';
import { mapActiveRideRequestToFindingRideViewData } from '../../utils/activeRideRequestMapper';
import FindingRideView from '../findingRide/components/FindingRideView';

const recommendationImageOne = 'https://www.figma.com/api/mcp/asset/651c88ad-0287-4bc1-8f06-492da512be4b';
const recommendationImageTwo = 'https://www.figma.com/api/mcp/asset/498bbad1-818d-450a-ae02-e885a587ded5';

export default function RideSharingHomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const { sidebarVisible, openSidebar, closeSidebar, menuItems, handleLogout, handleProfilePress } = useSidebarMenu();
  const activeRideRequest = useActiveRideRequestStore((state) => state.activeRideRequest);

  useBootstrapActiveRide();

  // Real user data from the API
  const { userProfile: apiProfile } = useProfile();

  const userProfile = useMemo<UserProfile | undefined>(() => {
    if (!apiProfile) return undefined;
    return {
      name: apiProfile.name,
      email: apiProfile.email,
      avatarUri: apiProfile.profilePhotoUri,
    };
  }, [apiProfile]);

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

  const findingRideViewData = useMemo(
    () => (activeRideRequest ? mapActiveRideRequestToFindingRideViewData(activeRideRequest) : null),
    [activeRideRequest],
  );

  useEffect(() => {
    if (!findingRideViewData) {
      return undefined;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);

    return () => subscription.remove();
  }, [findingRideViewData]);

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
          <ActiveRideNotice />
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
        onProfilePress={handleProfilePress}
      />

      {findingRideViewData ? (
        <View style={styles.findingRideOverlay}>
          <FindingRideView {...findingRideViewData} />
        </View>
      ) : null}
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
    right: 16,
    top: 65,
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 24,
    paddingTop: 0,
  },
  findingRideOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    elevation: 12,
  },
});
