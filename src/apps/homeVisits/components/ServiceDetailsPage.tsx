import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { DiscoverySectionState } from '../../../general/components/discovery';
import ScreenHeader from '../../../general/components/ScreenHeader';
import { useTheme } from '../../../general/theme/theme';
import ServiceDetailsContent from './ServiceDetails/ServiceDetailsContent';
import ServiceDetailsSkeleton from './ServiceDetails/ServiceDetailsSkeleton';
import BookingReviewsModal from '../singleVendor/components/Reviews/BookingReviewsModal';
import useServiceDetailsBookingScreen from '../singleVendor/hooks/useServiceDetailsBookingScreen';
import useServiceReviews from '../singleVendor/hooks/useServiceReviews';
import type { HomeVisitsSingleVendorNavigationParamList } from '../singleVendor/navigation/types';

type ServiceDetailsRouteProp = RouteProp<
  HomeVisitsSingleVendorNavigationParamList,
  'ServiceDetailsPage'
>;

export default function ServiceDetailsPage() {
  const { colors } = useTheme();
  const { t } = useTranslation('homeVisits');
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeVisitsSingleVendorNavigationParamList>>();
  const route = useRoute<ServiceDetailsRouteProp>();
  const { serviceId } = route.params;
  const [isReviewsVisible, setIsReviewsVisible] = React.useState(false);
  const query = useServiceDetailsBookingScreen(serviceId);
  const serviceReviewsQuery = useServiceReviews(serviceId, {
    enabled: isReviewsVisible,
    serviceNameFallback: query.data?.serviceName ?? t('single_vendor_reviews_title'),
  });

  const handleGoBack = useCallback(() => {
    console.log('[ServiceDetailsPage] goBack pressed', { serviceId });
    navigation.goBack();
  }, [navigation, serviceId]);

  const handleBookService = useCallback(() => {
    console.log('[ServiceDetailsPage] book service pressed', {
      serviceId,
      basePrice: query.data?.basePrice,
      totalPrice: query.data?.pricingSummary?.totalPrice,
      serviceCount: query.data?.pricingSummary?.serviceCount,
      serviceTypeSections: query.data?.serviceTypeSections?.length,
      additionalServiceSections: query.data?.additionalServiceSections?.length,
    });
    // Booking flow will be added in a follow-up.
  }, [query.data, serviceId]);

  React.useEffect(() => {
    console.log('[ServiceDetailsPage] mounted', {
      serviceId,
      routeParams: route.params,
    });
  }, [route.params, serviceId]);

  React.useEffect(() => {
    console.log('[ServiceDetailsPage] query state', {
      serviceId,
      isPending: query.isPending,
      isFetching: query.isFetching,
      isError: query.isError,
      hasData: Boolean(query.data),
      errorMessage: query.error?.message,
    });
  }, [
    query.data,
    query.error?.message,
    query.isError,
    query.isFetching,
    query.isPending,
    serviceId,
  ]);

  React.useEffect(() => {
    if (!query.data) {
      return;
    }

    console.log('[ServiceDetailsPage] query data snapshot', {
      serviceId,
      title: query.data.title,
      basePrice: query.data.basePrice,
      rating: query.data.rating,
      totalPrice: query.data.pricingSummary?.totalPrice,
      serviceCount: query.data.pricingSummary?.serviceCount,
      estimatedDurationLabel: query.data.pricingSummary?.estimatedDurationLabel,
      serviceTypeSections: query.data.serviceTypeSections?.length,
      additionalServiceSections: query.data.additionalServiceSections?.length,
    });
  }, [query.data, serviceId]);

  if (query.isPending) {
    return <ServiceDetailsSkeleton />;
  }

  if (query.isError || !query.data) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScreenHeader
          title={t('details_title')}
          rightSlot={
            <Pressable
              accessibilityLabel="Close"
              accessibilityRole="button"
              onPress={handleGoBack}
              style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
            >
              <View
                style={[
                  styles.iconButton,
                  {
                    backgroundColor: colors.backgroundTertiary,
                  },
                ]}
              >
                <Ionicons name="close" size={20} color={colors.text} />
              </View>
            </Pressable>
          }
        />

        <View style={styles.errorWrap}>
          <DiscoverySectionState
            tone="error"
            title={t('single_vendor_home_section_error_title')}
            message={t('single_vendor_home_section_error_message')}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ServiceDetailsContent
        data={query.data}
        onBack={handleGoBack}
        onBookService={handleBookService}
        onClose={handleGoBack}
        onRatingPress={() => setIsReviewsVisible(true)}
      />
      <BookingReviewsModal
        hasNextPage={serviceReviewsQuery.hasNextPage}
        isFetchingNextPage={serviceReviewsQuery.isFetchingNextPage}
        isLoading={serviceReviewsQuery.isPending}
        onClose={() => setIsReviewsVisible(false)}
        onLoadMore={() => {
          if (!serviceReviewsQuery.hasNextPage || serviceReviewsQuery.isFetchingNextPage) {
            return;
          }

          void serviceReviewsQuery.fetchNextPage();
        }}
        reviews={serviceReviewsQuery.reviews}
        summary={serviceReviewsQuery.summary}
        visible={isReviewsVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  errorWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  screen: {
    flex: 1,
  },
});
