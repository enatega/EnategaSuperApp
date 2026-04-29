import React, { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../general/theme/theme';
import Button from '../general/components/Button';
import Text from '../general/components/Text';
import { MiniAppId } from '../general/utils/constants';
import { authSession } from '../general/auth/authSession';
import { LinearGradient } from 'expo-linear-gradient';
import { homeVisitOnboardingImages } from '../general/assets/images';
import { NavigatorScreenParams } from '@react-navigation/native';
import { RideSharingStackParamList } from '../apps/rideSharing/navigation/RideSharingNavigator';

type Props = {
  onSelectMiniApp?: (
    id: MiniAppId,
    params?: NavigatorScreenParams<RideSharingStackParamList>,
  ) => void;
};

type Slide = {
  title: string;
  image: number;
};

const ONBOARDING_SLIDES: Slide[] = [
  {
    title: 'Connect with Trusted Home Cleaning Services at Your Fingertips',
    image: homeVisitOnboardingImages.cleanUp,
  },
  {
    title: 'Discover Reliable Plumbing Services Near You with a Click',
    image: homeVisitOnboardingImages.maintenance,
  },
  {
    title: 'Access Professional Landscaping Services to Transform Your Home',
    image: homeVisitOnboardingImages.maintenance,
  },
];

export default function HomeScreen({ onSelectMiniApp }: Props) {
  const { colors } = useTheme();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [stepIndex, setStepIndex] = useState(-1);
  const currentSlide = useMemo(() => ONBOARDING_SLIDES[stepIndex] ?? null, [stepIndex]);

  useEffect(() => {
    let isMounted = true;

    const checkAuthAndRedirect = async () => {
      try {
        const token = await authSession.getAccessToken();

        if (token) {
          onSelectMiniApp?.('homeVisits');
          return;
        }
      } catch (error) {
        console.warn('Unable to read auth session', error);
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    void checkAuthAndRedirect();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleSignIn() {
    onSelectMiniApp?.('homeVisits');
  }

  function handleSkip() {
    setStepIndex(ONBOARDING_SLIDES.length - 1);
  }

  function handleNext() {
    setStepIndex((current) => Math.min(current + 1, ONBOARDING_SLIDES.length - 1));
  }

  if (isCheckingSession) {
    return <View style={[styles.container, { backgroundColor: colors.background }]} />;
  }

  const isWelcomeStep = stepIndex < 0;
  const isLastSlide = stepIndex === ONBOARDING_SLIDES.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isWelcomeStep ? (
        <View style={styles.welcomeBackdrop}>
          <Image source={homeVisitOnboardingImages.welcomeScreen} style={styles.welcomeBackgroundImage} />
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.2)', 'rgba(9, 9, 11, 0.3)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.welcomeOverlay}
          />
        </View>
      ) : null}

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        {isWelcomeStep ? (
          <View style={styles.welcomeContent}>
            <View style={styles.welcomeCopy}>
              <Text color={colors.white} style={styles.welcomeEyebrow} weight="semiBold">
                Welcome to
              </Text>
              <Text color={colors.white} style={styles.welcomeTitle} weight="extraBold">
                Home-Visit
              </Text>
              <Text color={colors.white} style={styles.welcomeDescription}>
                Book trusted plumbers or schedule appliance repairs from the comfort of your home.
              </Text>
            </View>
            <Button label="Continue" onPress={handleNext} />
          </View>
        ) : (
          <View style={styles.onboardingContent}>
            <View style={styles.heroIconWrap}>
              <Image source={currentSlide?.image} resizeMode="contain" style={styles.slideImage} />
            </View>

            <Text style={styles.slideTitle} weight="extraBold">
              {currentSlide?.title}
            </Text>

            <View style={styles.pagination}>
              {ONBOARDING_SLIDES.map((_, index) => {
                const isActive = stepIndex === index;
                return (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      {
                        width: isActive ? 24 : 8,
                        backgroundColor: isActive ? colors.primary : '#D4D4D8',
                      },
                    ]}
                  />
                );
              })}
            </View>

            {isLastSlide ? (
              <Button label="Sign in" onPress={handleSignIn} style={styles.singleActionButton} />
            ) : (
              <View style={styles.rowActions}>
                <Button label="Skip" onPress={handleSkip} style={styles.rowButton} variant="secondary" />
                <Button label="Next" onPress={handleNext} style={styles.rowButton} />
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
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
  welcomeBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  welcomeBackgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  welcomeOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 28,
    gap: 24,
  },
  welcomeCopy: {
    gap: 8,
    width: 290,
  },
  welcomeEyebrow: {
    fontSize: 18,
    lineHeight: 28,
  },
  welcomeTitle: {
    fontSize: 44,
    lineHeight: 50,
    letterSpacing: -0.6,
  },
  welcomeDescription: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 24,
  },
  onboardingContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 72,
    paddingBottom: 28,
  },
  heroIconWrap: {
    height: 250,
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: {
    width: 200,
    height: 200,
  },
  slideTitle: {
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: -0.27,
    maxWidth: '100%',
  },
  pagination: {
    marginTop: 52,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 50,
  },
  rowActions: {
    marginTop: 'auto',
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  rowButton: {
    flex: 1,
    height: 48,
    borderRadius: 6,
  },
  singleActionButton: {
    marginTop: 'auto',
    width: '100%',
    height: 48,
    borderRadius: 6,
  },
});
