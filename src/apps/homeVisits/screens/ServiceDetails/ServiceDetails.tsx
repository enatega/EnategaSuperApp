import React, { useCallback } from 'react';
import { Pressable, Share, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { DiscoverySectionState } from '../../../../general/components/discovery';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import { useTheme } from '../../../../general/theme/theme';
import ServiceDetailsContent from '../../components/ServiceDetailsPage/ServiceDetailsContent';
import ServiceDetailsSkeleton from '../../components/ServiceDetailsPage/ServiceDetailsSkeleton';
import useServiceDetailsBookingScreen from '../../singleVendor/hooks/useServiceDetailsBookingScreen';
import type { HomeVisitsSingleVendorNavigationParamList } from '../../singleVendor/navigation/types';
import type { HomeVisitsServiceDetailsBookingSelectionPayload } from '../../types/serviceDetails';
import useToggleFavoriteService from '../../singleVendor/hooks/useToggleFavoriteService';

type ServiceDetailsRouteProp = RouteProp<
  HomeVisitsSingleVendorNavigationParamList,
  'ServiceDetails'
>;

export default function ServiceDetails() {
  const { colors } = useTheme();
  const { t } = useTranslation('homeVisits');
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeVisitsSingleVendorNavigationParamList>>();
  const route = useRoute<ServiceDetailsRouteProp>();
  const { serviceId } = route.params;
  const query = useServiceDetailsBookingScreen(serviceId);
  const toggleFavoriteMutation = useToggleFavoriteService();

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleBookService = useCallback(
    (selection: HomeVisitsServiceDetailsBookingSelectionPayload) => {
      navigation.push('ServiceDetailsBooking', {
        serviceId,
        serviceCenterId: query.data!.serviceCenterId,
        initialSelection: selection.selectionState,
      });
    },
    [navigation, query.data?.serviceCenterId, serviceId],
  );

  const handleFavoritePress = useCallback(async () => {
    if (!query.data?.serviceId || toggleFavoriteMutation.isPending) {
      return;
    }

    try {
      await toggleFavoriteMutation.mutateAsync(query.data.serviceId);
      await query.refetch();
    } catch (error) {
      console.error('service favorite toggle failed', error);
    }
  }, [query, toggleFavoriteMutation]);

  const handleSharePress = useCallback(async () => {
    await Share.share({
      title: t('details_title'),
      message: t('details_body'),
    });
  }, [t]);

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
    <ServiceDetailsContent
      data={query.data}
      isFavoritePending={toggleFavoriteMutation.isPending}
      onBack={handleGoBack}
      onFavorite={handleFavoritePress}
      onShare={handleSharePress}
      onBookService={handleBookService}
    />
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
