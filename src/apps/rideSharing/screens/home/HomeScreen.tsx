import React, { useEffect, useMemo } from 'react';
import { BackHandler, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../../general/theme/theme';
import HomeHeader from '../../../../screens/home/HomeHeader';
import RideOptionsSection from '../../components/RideOptionsSection';
import DeliveryServicesSection from '../../components/DeliveryServicesSection';

import RecommendedSection from '../../../../screens/home/RecommendedSection';
import HamburgerMenu from '../../components/HamburgerMenu';
import Sidebar, { type UserProfile } from '../../components/Sidebar';
import useInitializeRideState from '../../hooks/useInitializeRideState';
import useRideSocketSync from '../../hooks/useRideSocketSync';
import { useSidebarMenu } from '../../hooks/useSidebarMenu';
import { useProfile } from '../../hooks/useProfile';
import { useActiveRideStore } from '../../stores/useActiveRideStore';
import { useActiveRideRequestStore } from '../../stores/useActiveRideRequestStore';
import ActiveRideView from '../activeRide/components/ActiveRideView';
import CompletedRideFeedbackSheet from '../activeRide/components/CompletedRideFeedbackSheet';
import { useCompletedRideFeedbackController } from '../activeRide/hooks/useCompletedRideFeedbackController';
import FindingRideView from '../findingRide/components/FindingRideView';
import type { ActiveRidePayload, ActiveRideRequestPayload } from '../../api/types';

function hasActiveRideOverlay(activeRide: ActiveRidePayload | null) {
  return Boolean(
    activeRide
    && activeRide.ride_id
    && activeRide.pickup_location
    && activeRide.dropoff_location
    && activeRide.pickup?.lat !== undefined
    && activeRide.pickup?.lng !== undefined
    && activeRide.dropoff?.lat !== undefined
    && activeRide.dropoff?.lng !== undefined,
  );
}

function hasFindingRideOverlay(activeRideRequest: ActiveRideRequestPayload | null) {
  return Boolean(
    activeRideRequest
    && activeRideRequest.id
    && activeRideRequest.pickup_location
    && activeRideRequest.dropoff_location
    && activeRideRequest.pickup?.lat !== undefined
    && activeRideRequest.pickup?.lng !== undefined
    && activeRideRequest.dropoff?.lat !== undefined
    && activeRideRequest.dropoff?.lng !== undefined,
  );
}

export default function RideSharingHomeScreen() {
  const { colors } = useTheme();
  const { sidebarVisible, openSidebar, closeSidebar, menuItems, handleLogout, handleProfilePress } = useSidebarMenu();
  const activeRide = useActiveRideStore((state) => state.activeRide);
  const activeRideRequest = useActiveRideRequestStore((state) => state.activeRideRequest);
  const { hasCheckedRideState } = useInitializeRideState();
  const {
    feedbackRide: pendingFeedbackRide,
    isSubmitting: isFeedbackSubmitting,
    handleClose: handleCloseFeedback,
    handleSubmit: handleSubmitFeedback,
  } = useCompletedRideFeedbackController();

  useRideSocketSync({ enableActiveRideSync: hasCheckedRideState });

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
  const shouldShowActiveRide = hasActiveRideOverlay(activeRide);
  const shouldShowFindingRide = !shouldShowActiveRide && hasFindingRideOverlay(activeRideRequest);
  const shouldShowFeedback = Boolean(pendingFeedbackRide);
  const overlayView = useMemo(() => {
    if (shouldShowActiveRide && activeRide) {
      return <ActiveRideView activeRide={activeRide} />;
    }

    if (shouldShowFindingRide && activeRideRequest) {
      return <FindingRideView activeRideRequest={activeRideRequest} />;
    }

    return null;
  }, [activeRide, activeRideRequest, shouldShowActiveRide, shouldShowFindingRide]);

  const hasOverlay = shouldShowActiveRide || shouldShowFindingRide || shouldShowFeedback;

  useEffect(() => {
    if (!hasOverlay) {
      return undefined;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);

    return () => subscription.remove();
  }, [hasOverlay]);

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
          <RecommendedSection />
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

      {hasOverlay ? (
        <View pointerEvents="box-none" style={styles.findingRideOverlay}>
          {overlayView}
          {pendingFeedbackRide ? (
            <CompletedRideFeedbackSheet
              feedbackRide={pendingFeedbackRide}
              isSubmitting={isFeedbackSubmitting}
              onClose={handleCloseFeedback}
              onSubmit={handleSubmitFeedback}
            />
          ) : null}
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
