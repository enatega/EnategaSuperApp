import { useCallback, useMemo, useState } from 'react';
import { Linking, Platform, Share } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../../general/components/AppToast';
import type { AppointmentProvider, AppointmentStoreService, AppointmentTopBrand } from '../api/types';
import {
  buildAdditionalInfoItems,
  buildTeamMembers,
  formatOpeningDays,
  formatRating,
  getTodayStoreHours,
  isStoreClosed,
} from '../components/details/detailHelpers';
import { useAppointmentStoreView, useFlattenedAppointmentStoreServices } from './useDiscoveryQueries';
import { useToggleFavouriteMutation } from './useToggleFavouriteMutation';
import type { MultiVendorStackParamList } from '../multiVendor/navigation/types';

type DetailListItem = { type: 'service'; item: AppointmentStoreService } | { type: 'footer' };

const INITIAL_VISIBLE_SERVICES = 4;
const PLACEHOLDER_IMAGE = 'https://placehold.co/1200x800.png';

type Params = {
  brand?: AppointmentTopBrand;
  navigation: NativeStackNavigationProp<MultiVendorStackParamList>;
  provider?: AppointmentProvider;
};

export function useAppointmentDetailsScreen({ brand, navigation, provider }: Params) {
  const { t } = useTranslation('appointments');
  const storeId = provider?.storeId ?? '';
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [isClosedStoreModalVisible, setIsClosedStoreModalVisible] = useState(false);
  const [optimisticFav, setOptimisticFav] = useState<boolean | null>(null);

  const storeQuery = useAppointmentStoreView(storeId, { enabled: Boolean(storeId) });
  const servicesQuery = useFlattenedAppointmentStoreServices(
    {
      storeId,
      limit: 20,
      categoryId: selectedCategoryId ?? undefined,
      subcategoryId: selectedSubcategoryId ?? undefined,
    },
    { enabled: Boolean(storeId) },
  );

  const storeView = storeQuery.data;
  const services = servicesQuery.data ?? [];
  const toggleFavouriteMutation = useToggleFavouriteMutation({
    storeId,
    onSuccess: (data) => {
      setOptimisticFav(data.isFavorite);
      showToast.success(
        data.isFavorite ? t('favourites_toggle_added') : t('favourites_toggle_removed'),
      );
    },
    onError: () => {
      setOptimisticFav(null);
      showToast.error(t('favourites_toggle_error'));
    },
  });

  const handleBackPress = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('MultiVendorTabs');
  }, [navigation]);

  const handleSharePress = useCallback(async () => {
    const title = storeView?.name ?? provider?.name ?? brand?.name ?? t('details_title');
    try {
      await Share.share({ title, message: title });
    } catch {
      // Ignore canceled share actions.
    }
  }, [brand?.name, provider?.name, storeView?.name, t]);

  const handleFavouritePress = useCallback(() => {
    const current = optimisticFav ?? storeView?.isFavorite ?? provider?.isFavorite ?? false;
    setOptimisticFav(!current);
    toggleFavouriteMutation.mutate({ storeId, nextIsFavorite: !current });
  }, [optimisticFav, provider?.isFavorite, storeId, storeView?.isFavorite, toggleFavouriteMutation]);

  const handleRefresh = useCallback(async () => {
    await Promise.all([storeQuery.refetch(), servicesQuery.refetch()]);
  }, [servicesQuery, storeQuery]);

  const handleOpenDirections = useCallback(async () => {
    const destinationAddress = storeView?.address ?? provider?.address ?? '';
    const latitude = storeView?.latitude ?? provider?.latitude ?? null;
    const longitude = storeView?.longitude ?? provider?.longitude ?? null;

    if (latitude === null && longitude === null && !destinationAddress.trim()) {
      showToast.error(t('details_load_error'));
      return;
    }

    const encodedAddress = encodeURIComponent(destinationAddress.trim());
    const hasCoordinates =
      typeof latitude === 'number' &&
      Number.isFinite(latitude) &&
      typeof longitude === 'number' &&
      Number.isFinite(longitude);
    const coordinateQuery = hasCoordinates ? `${latitude},${longitude}` : null;

    try {
      if (Platform.OS === 'ios') {
        const appleMapsUrl = `http://maps.apple.com/?daddr=${coordinateQuery ?? encodedAddress}&dirflg=d`;
        if (await Linking.canOpenURL(appleMapsUrl)) {
          await Linking.openURL(appleMapsUrl);
          return;
        }
      } else {
        const geoUrl = hasCoordinates
          ? `geo:${latitude},${longitude}?q=${latitude},${longitude}`
          : `geo:0,0?q=${encodedAddress}`;
        if (await Linking.canOpenURL(geoUrl)) {
          await Linking.openURL(geoUrl);
          return;
        }

        const googleNavigationUrl = `google.navigation:q=${coordinateQuery ?? encodedAddress}&mode=d`;
        if (await Linking.canOpenURL(googleNavigationUrl)) {
          await Linking.openURL(googleNavigationUrl);
          return;
        }
      }

      const webUrl = hasCoordinates
        ? `https://www.google.com/maps?q=${latitude},${longitude}`
        : `https://www.google.com/maps?q=${encodedAddress}`;
      if (!(await Linking.canOpenURL(webUrl))) {
        showToast.error(t('details_load_error'));
        return;
      }
      await Linking.openURL(webUrl);
    } catch {
      showToast.error(t('details_load_error'));
    }
  }, [
    provider?.address,
    provider?.latitude,
    provider?.longitude,
    storeView?.address,
    storeView?.latitude,
    storeView?.longitude,
    t,
  ]);

  const title = storeView?.name ?? provider?.name ?? brand?.name ?? t('details_title');
  const subtitle =
    storeView?.tagLine ??
    storeView?.address ??
    provider?.address ??
    provider?.shopTypeName ??
    brand?.deal ??
    t('details_body');

  const handleOpenServices = useCallback(
    (params?: {
      categoryId?: string | null;
      subcategoryId?: string | null;
      serviceId?: string | null;
    }) => {
      if (!storeId) {
        return;
      }

      navigation.navigate('Services', {
        storeId,
        title,
        initialCategoryId: params?.categoryId ?? selectedCategoryId,
        initialSubcategoryId: params?.subcategoryId ?? selectedSubcategoryId,
        initialServiceId: params?.serviceId ?? null,
      });
    },
    [navigation, selectedCategoryId, selectedSubcategoryId, storeId, title],
  );

  const handleBookingAttempt = useCallback(() => {
    if (isStoreClosed(storeView)) {
      setIsClosedStoreModalVisible(true);
      return;
    }
    handleOpenServices();
  }, [handleOpenServices, storeView]);

  const handleServicePress = useCallback(
    (service: AppointmentStoreService) => {
      if (isStoreClosed(storeView)) {
        setIsClosedStoreModalVisible(true);
        return;
      }

      handleOpenServices({
        categoryId: service.categoryId ?? selectedCategoryId,
        subcategoryId: service.subcategoryId ?? selectedSubcategoryId,
        serviceId: service.id,
      });
    },
    [handleOpenServices, selectedCategoryId, selectedSubcategoryId, storeView],
  );

  const address = storeView?.address ?? provider?.address ?? subtitle;
  const hours = getTodayStoreHours(storeView?.storeTimings);
  const openUntilLabel = useMemo(() => {
    if (!hours) {
      return t('details_meta_hours_fallback');
    }
    const [, close] = hours.split('-').map((value) => value.trim());
    return close ? t('details_open_until', { time: close }) : hours;
  }, [hours, t]);
  const storeClosed = isStoreClosed(storeView);
  const reviewCount = storeView?.reviewCount ?? provider?.reviewCount ?? 0;
  const rating = formatRating(storeView?.averageRating ?? provider?.averageRating ?? null);
  const ratingLabel = rating
    ? t('details_rating_with_count', { rating, count: reviewCount.toLocaleString() })
    : t('details_reviews_count', { count: reviewCount.toLocaleString() });
  const coverImageUrl =
    storeView?.coverImage ?? provider?.coverImage ?? provider?.logo ?? brand?.logo ?? PLACEHOLDER_IMAGE;
  const visibleSubcategories = useMemo(
    () =>
      selectedCategoryId
        ? storeView?.subcategories?.filter((subcategory) =>
            services.some(
              (service) =>
                service.categoryId === selectedCategoryId &&
                service.subcategoryId === subcategory.id,
            ),
          ) ?? []
        : [],
    [selectedCategoryId, services, storeView?.subcategories],
  );
  const infoDescription = storeView?.description?.trim() || subtitle;
  const openingDays = useMemo(
    () => formatOpeningDays(storeView?.storeTimings, t('details_timing_closed')),
    [storeView?.storeTimings, t],
  );
  const teamMembers = useMemo(
    () => buildTeamMembers(storeView?.team ?? [], t('details_team_role_fallback')),
    [storeView?.team, t],
  );
  const additionalInfoItems = useMemo(
    () =>
      buildAdditionalInfoItems(storeView, {
        phone: t('details_info_phone'),
        email: t('details_info_email'),
        booking: t('details_info_online_booking'),
        available: t('details_info_available_today'),
      }),
    [storeView, t],
  );
  const isFavourite = optimisticFav ?? storeView?.isFavorite ?? provider?.isFavorite ?? false;
  const canShowSeeAllServices = services.length > INITIAL_VISIBLE_SERVICES;
  const bookNowDisabled = services.length === 0;
  const visibleServices = services.slice(0, INITIAL_VISIBLE_SERVICES);
  const isServicesSectionLoading =
    servicesQuery.isPending || (servicesQuery.isRefetching && servicesQuery.isFetched);
  const shouldShowServiceSkeletons =
    (servicesQuery.isPending && !servicesQuery.isFetched) ||
    (!servicesQuery.isFetched && !servicesQuery.error);
  const listData: DetailListItem[] = [
    ...visibleServices.map((item) => ({ type: 'service', item }) as DetailListItem),
    { type: 'footer' },
  ];

  return {
    additionalInfoItems,
    address,
    bookNowDisabled,
    brand,
    canShowSeeAllServices,
    coverImageUrl,
    handleBackPress,
    handleBookingAttempt,
    handleFavouritePress,
    handleOpenDirections,
    handleOpenServices,
    handleRefresh,
    handleServicePress,
    handleSharePress,
    hours,
    infoDescription,
    isClosedStoreModalVisible,
    isFavourite,
    isInfoModalVisible,
    isServicesSectionLoading,
    listData,
    openingDays,
    openUntilLabel,
    provider,
    rating,
    ratingLabel,
    reviewCount,
    selectedCategoryId,
    selectedSubcategoryId,
    services,
    servicesQuery,
    setIsClosedStoreModalVisible,
    setIsInfoModalVisible,
    setSelectedCategoryId,
    setSelectedSubcategoryId,
    shouldShowServiceSkeletons,
    storeClosed,
    storeError: Boolean(storeQuery.error),
    storeId,
    storeQuery,
    storeView,
    teamMembers,
    title,
    visibleSubcategories,
  };
}
