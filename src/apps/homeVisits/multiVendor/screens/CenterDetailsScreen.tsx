import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../../../../general/components/Icon';
import Image from '../../../../general/components/Image';
import Text from '../../../../general/components/Text';
import AppPopup from '../../../../general/components/AppPopup';
import { showToast } from '../../../../general/components/AppToast';
import { SearchInput } from '../../../../general/components/search';
import {
  DiscoveryResultsSkeleton,
  DiscoverySectionState,
} from '../../../../general/components/discovery';
import { useTheme } from '../../../../general/theme/theme';
import { useTranslations } from '../../../../general/localization/LocalizationProvider';
import useServiceCenterServices from '../../singleVendor/hooks/useServiceCenterServices';
import type { HomeVisitsSingleVendorServiceCenterListItem } from '../../singleVendor/api/types';
import useToggleFavoriteServiceCenter from '../hooks/useToggleFavoriteServiceCenter';
import type { MultiVendorStackParamList } from '../navigation/types';

type CenterDetailsRouteProp = RouteProp<
  MultiVendorStackParamList,
  'MultiVendorCenterDetails'
>;

const PLACEHOLDER_IMAGE = 'https://placehold.co/640x420.png';

function formatPrice(value?: number | null) {
  if (value == null || !Number.isFinite(value)) {
    return null;
  }

  return `$ ${value.toFixed(2)}`;
}

function resolveIsClosed(value?: boolean | string | number | null) {
  return value === true || value === 'true' || value === '1' || value === 1;
}

export default function CenterDetailsScreen() {
  const route = useRoute<CenterDetailsRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<MultiVendorStackParamList>>();
  const { provider } = route.params;
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslations('homeVisits');
  const [searchValue, setSearchValue] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(resolveIsClosed(provider.isFavorite));
  const isClosed = resolveIsClosed(provider.isClosed);
  const toggleFavoriteMutation = useToggleFavoriteServiceCenter();

  const {
    data: services = [],
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useServiceCenterServices(provider.serviceCenterId, {
    limit: 100,
  });

  const coverImage =
    provider.coverImageUrl ||
    provider.imageUrl ||
    provider.logoUrl ||
    PLACEHOLDER_IMAGE;
  const logoImage = provider.logoUrl || provider.imageUrl || coverImage;
  const categories = useMemo(() => {
    const uniqueCategories = services.reduce<
      Array<{ id: string; name: string }>
    >((items, service) => {
      if (!items.some((item) => item.id === service.category.id)) {
        items.push(service.category);
      }

      return items;
    }, []);

    return uniqueCategories;
  }, [services]);
  const activeCategory = useMemo(
    () => categories.find((category) => category.id === activeCategoryId) ?? null,
    [activeCategoryId, categories],
  );
  const sectionTitle = activeCategory?.name ?? t('all_offered_items');

  const normalizedSearch = searchValue.trim().toLowerCase();
  const filteredServices = useMemo(
    () =>
      services.filter((service) => {
        const matchesCategory =
          activeCategoryId == null || service.category.id === activeCategoryId;
        const matchesSearch =
          !normalizedSearch ||
          service.name.toLowerCase().includes(normalizedSearch) ||
          service.category.name.toLowerCase().includes(normalizedSearch);

        return matchesCategory && matchesSearch;
      }),
    [activeCategoryId, normalizedSearch, services],
  );

  const handleShare = useCallback(() => {
    void Share.share({
      title: provider.name,
      message: provider.address
        ? `${provider.name}\n${provider.address}`
        : provider.name,
    });
  }, [provider.address, provider.name]);

  const handleInfoPress = useCallback(() => {
    setIsInfoModalVisible(true);
  }, []);

  const handleCloseInfoModal = useCallback(() => {
    setIsInfoModalVisible(false);
  }, []);

  const handleFavoritePress = useCallback(async () => {
    if (toggleFavoriteMutation.isPending) {
      return;
    }

    try {
      const result = await toggleFavoriteMutation.mutateAsync(provider.serviceCenterId);
      setIsFavorite(result.isFavorite);
      showToast.success(
        result.isFavorite
          ? t('multi_vendor_favorite_added')
          : t('multi_vendor_favorite_removed'),
      );
    } catch (error) {
      console.error('service center favorite toggle failed', error);
      showToast.error(t('multi_vendor_favorite_error'));
    }
  }, [provider.serviceCenterId, t, toggleFavoriteMutation]);

  const handleServicePress = useCallback(
    (service: HomeVisitsSingleVendorServiceCenterListItem) => {
      if (isClosed) {
        return;
      }

      navigation.navigate('ServiceDetails', {
        serviceId: service.id,
        bookingFlow: 'multiVendor',
      });
    },
    [isClosed, navigation],
  );

  const handleEndReached = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const distanceFromBottom =
        contentSize.height - (contentOffset.y + layoutMeasurement.height);

      if (distanceFromBottom < 180) {
        handleEndReached();
      }
    },
    [handleEndReached],
  );

  const infoDescription = useMemo(() => {
    const rows = [
      provider.categoryName
        ? `${t('multi_vendor_center_info_category')}: ${provider.categoryName}`
        : null,
      provider.availabilityLabel
        ? `${t('multi_vendor_center_info_availability')}: ${provider.availabilityLabel}`
        : null,
      provider.address
        ? `${t('multi_vendor_center_info_address')}: ${provider.address}`
        : null,
      provider.distanceLabel
        ? `${t('multi_vendor_center_info_distance')}: ${provider.distanceLabel}`
        : null,
      provider.averageRating != null
        ? `${t('multi_vendor_center_info_rating')}: ${provider.averageRating.toFixed(1)} (${provider.reviewCount ?? 0})`
        : null,
      provider.startingPrice != null
        ? `${t('multi_vendor_center_info_starting_price')}: ${formatPrice(provider.startingPrice)}`
        : null,
    ].filter(Boolean);

    return rows.length > 0
      ? rows.join('\n')
      : t('multi_vendor_center_info_fallback');
  }, [
    provider.address,
    provider.averageRating,
    provider.availabilityLabel,
    provider.categoryName,
    provider.distanceLabel,
    provider.reviewCount,
    provider.startingPrice,
    t,
  ]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom + 72, 96),
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Image source={{ uri: coverImage }} style={styles.heroImage} />
          <View style={styles.heroScrim} />
          {isClosed ? (
            <View style={styles.closedHeroOverlay}>
              <View style={[styles.closedBadge, { backgroundColor: colors.text }]}>
                <Text weight="semiBold" style={{ color: colors.surface, fontSize: 13 }}>
                  {provider.availabilityLabel || t('closed')}
                </Text>
              </View>
            </View>
          ) : null}
          <View
            style={[
              styles.heroActions,
              {
                paddingTop: insets.top + 12,
              },
            ]}
          >
            <CircleButton icon="arrow-back" label="Go back" onPress={() => navigation.goBack()} />
            <View style={styles.trailingActions}>
              <CircleButton
                icon="info"
                iconType="Feather"
                label="Center information"
                onPress={handleInfoPress}
              />
              <CircleButton
                icon={isFavorite ? 'favorite' : 'favorite-border'}
                iconColor={isFavorite ? colors.danger : colors.text}
                iconType="MaterialIcons"
                isLoading={toggleFavoriteMutation.isPending}
                label="Favorite center"
                onPress={handleFavoritePress}
              />
              <CircleButton
                icon="share-2"
                iconType="Feather"
                label="Share center"
                onPress={handleShare}
              />
            </View>
          </View>
        </View>

        <View style={styles.profileSection}>
          <View
            style={[
              styles.logoFrame,
              {
                backgroundColor: colors.surface,
                borderColor: colors.surfaceSoft,
                shadowColor: colors.shadowColor,
              },
            ]}
          >
            <Image source={{ uri: logoImage }} style={styles.logo} />
          </View>

          <Text
            weight="bold"
            numberOfLines={2}
            style={[
              styles.centerName,
              {
                color: colors.text,
                fontSize: typography.size.h5,
                lineHeight: typography.lineHeight.h5 + 2,
              },
            ]}
          >
            {provider.name}
          </Text>

          {provider.availabilityLabel || provider.categoryName ? (
            <Text
              numberOfLines={1}
              style={{
                color: isClosed ? colors.danger : colors.mutedText,
                fontSize: typography.size.sm,
                lineHeight: typography.lineHeight.md,
              }}
            >
              {provider.availabilityLabel || provider.categoryName}
            </Text>
          ) : null}

          {provider.address || provider.distanceLabel ? (
            <Text
              numberOfLines={2}
              style={[
                styles.contactText,
                {
                  color: colors.mutedText,
                  fontSize: typography.size.sm2,
                  lineHeight: typography.lineHeight.md,
                },
              ]}
            >
              {provider.address || provider.distanceLabel}
            </Text>
          ) : null}

          <SearchInput
            value={searchValue}
            onChangeText={setSearchValue}
            onClear={() => setSearchValue('')}
            placeholder={t('search')}
            style={styles.search}
          />
        </View>

        <View style={styles.filters}>
          {categories.length > 0 ? (
            <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
              <ScrollView
                horizontal
                contentContainerStyle={styles.tabsContent}
                showsHorizontalScrollIndicator={false}
              >
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setActiveCategoryId(null)}
                  style={[
                    styles.tab,
                    activeCategoryId == null && {
                      backgroundColor: colors.blue100,
                      borderBottomColor: colors.primary,
                    },
                  ]}
                >
                  <Text
                    weight="medium"
                    style={[
                      styles.tabLabel,
                      { color: activeCategoryId == null ? colors.primary : colors.mutedText },
                    ]}
                  >
                    {t('offers')}
                  </Text>
                </Pressable>

                {categories.map((category) => {
                  const isActive = category.id === activeCategoryId;

                  return (
                    <Pressable
                      key={category.id}
                      accessibilityRole="button"
                      onPress={() => setActiveCategoryId(category.id)}
                      style={[
                        styles.tab,
                        isActive && {
                          backgroundColor: colors.blue100,
                          borderBottomColor: colors.primary,
                        },
                      ]}
                    >
                      <Text
                        weight="medium"
                        numberOfLines={1}
                        style={[
                          styles.tabLabel,
                          { color: isActive ? colors.primary : colors.mutedText },
                        ]}
                      >
                        {category.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}
        </View>

        <View style={styles.servicesSection}>
          <Text
            weight="bold"
            style={{
              color: colors.text,
              fontSize: typography.size.xl,
              lineHeight: typography.lineHeight.xl,
            }}
          >
            {sectionTitle}
          </Text>

          {isPending ? (
            <DiscoveryResultsSkeleton />
          ) : isError ? (
            <DiscoverySectionState
              tone="error"
              title={t('single_vendor_home_section_error_title')}
              message={t('single_vendor_home_section_error_message')}
            />
          ) : filteredServices.length === 0 ? (
            <DiscoverySectionState
              title={t('single_vendor_home_section_empty_title')}
              message={t('single_vendor_home_section_empty_message')}
            />
          ) : (
            <View style={styles.serviceGrid}>
              {filteredServices.map((service) => (
                <ServiceTile
                  key={service.id}
                  service={service}
                  disabled={isClosed}
                  onPress={() => handleServicePress(service)}
                />
              ))}
            </View>
          )}

          {isFetchingNextPage ? (
            <ActivityIndicator color={colors.primary} style={styles.loader} />
          ) : null}
        </View>
      </ScrollView>
      <AppPopup
        description={infoDescription}
        dismissOnOverlayPress
        onRequestClose={handleCloseInfoModal}
        primaryAction={{
          label: t('address_selector_close'),
          onPress: handleCloseInfoModal,
        }}
        showPrimaryAction={false}
        title={t('multi_vendor_center_info_title')}
        visible={isInfoModalVisible}
      />
    </View>
  );
}

type CircleButtonProps = {
  icon: string;
  iconColor?: string;
  iconType?: 'Ionicons' | 'Feather' | 'MaterialIcons';
  isLoading?: boolean;
  label: string;
  onPress?: () => void;
};

function CircleButton({
  icon,
  iconColor,
  iconType = 'Ionicons',
  isLoading = false,
  label,
  onPress,
}: CircleButtonProps) {
  const { colors } = useTheme();
  const resolvedIconColor = iconColor ?? colors.text;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={10}
      disabled={!onPress || isLoading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.circleButton,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.82 : 1,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={resolvedIconColor} size="small" />
      ) : (
        <Icon name={icon} size={22} color={resolvedIconColor} type={iconType} />
      )}
    </Pressable>
  );
}

type ServiceTileProps = {
  disabled?: boolean;
  service: HomeVisitsSingleVendorServiceCenterListItem;
  onPress: () => void;
};

function ServiceTile({ disabled = false, service, onPress }: ServiceTileProps) {
  const { colors } = useTheme();
  const priceLabel = formatPrice(service.price);
  const imageUrl = service.imageUrl || PLACEHOLDER_IMAGE;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.serviceTile,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: disabled ? 0.62 : pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={styles.serviceImageWrap}>
        <Image source={{ uri: imageUrl }} style={styles.serviceImage} />
        {disabled ? (
          <View style={styles.closedTileOverlay}>
            <View style={[styles.closedBadge, { backgroundColor: colors.text }]}>
              <Text weight="semiBold" style={{ color: colors.surface, fontSize: 12 }}>
                Closed
              </Text>
            </View>
          </View>
        ) : null}
        <View style={[styles.addButton, { backgroundColor: colors.surface }]}>
          <Ionicons
            name={disabled ? 'lock-closed-outline' : 'add'}
            size={disabled ? 20 : 24}
            color={disabled ? colors.mutedText : colors.text}
          />
        </View>
      </View>
      <View style={styles.serviceContent}>
        {priceLabel ? (
          <Text
            weight="medium"
            numberOfLines={1}
            style={{ color: colors.primary, fontSize: 12, lineHeight: 18 }}
          >
            {priceLabel}
          </Text>
        ) : null}
        <Text
          numberOfLines={2}
          weight="medium"
          style={{
            color: colors.text,
            fontSize: 14,
            lineHeight: 22,
          }}
        >
          {service.name}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: 8,
    width: 40,
  },
  centerName: {
    letterSpacing: -0.4,
    marginTop: 14,
    textAlign: 'center',
  },
  closedBadge: {
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  closedHeroOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.32)',
    justifyContent: 'center',
    zIndex: 1,
  },
  closedTileOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.34)',
    justifyContent: 'center',
  },
  circleButton: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    elevation: 3,
    height: 40,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    width: 40,
  },
  contactText: {
    marginTop: 8,
    textAlign: 'center',
  },
  hero: {
    height: 270,
    position: 'relative',
  },
  heroActions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 16,
    position: 'absolute',
    right: 16,
    top: 0,
    zIndex: 2,
  },
  heroImage: {
    height: '100%',
    width: '100%',
  },
  heroScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.16)',
  },
  loader: {
    paddingVertical: 16,
  },
  logo: {
    height: '100%',
    width: '100%',
  },
  logoFrame: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    elevation: 4,
    height: 96,
    justifyContent: 'center',
    marginTop: -48,
    overflow: 'hidden',
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    width: 96,
  },
  profileSection: {
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
  },
  screen: {
    flex: 1,
  },
  search: {
    marginTop: 8,
    width: '100%',
  },
  serviceContent: {
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 4,
  },
  serviceImage: {
    height: '100%',
    width: '100%',
  },
  serviceImageWrap: {
    aspectRatio: 1.15,
    position: 'relative',
    width: '100%',
  },
  serviceTile: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    width: '48%',
  },
  servicesSection: {
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  tab: {
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    justifyContent: 'center',
    minWidth: 78,
    paddingHorizontal: 10,
    paddingVertical: 14,
  },
  tabLabel: {
    fontSize: 14,
    lineHeight: 22,
  },
  filters: {
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tabsContainer: {
    borderBottomWidth: 1,
  },
  tabsContent: {
    minWidth: '100%',
  },
  trailingActions: {
    flexDirection: 'row',
    gap: 12,
  },
});
