import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { showToast } from "../../../../general/components/AppToast";
import Image from "../../../../general/components/Image";
import Skeleton from "../../../../general/components/Skeleton";
import Text from "../../../../general/components/Text";
import SearchInput from "../../../../general/components/search/SearchInput";
import { useTheme } from "../../../../general/theme/theme";
import { appointmentKeys } from "../../api/queryKeys";
import type {
  AppointmentCategory,
  AppointmentOrderAgainItem,
  AppointmentProvider,
  AppointmentSeeAllSection,
  AppointmentShopType,
} from "../../api/types";
import {
  useAppointmentBrands,
  useAppointmentNearbyProviders,
  useAppointmentOrderAgain,
  useAppointmentShopTypeCategories,
  useAppointmentShopTypes,
} from "../../hooks/useDiscoveryQueries";
import { useToggleFavouriteMutation } from "../../hooks/useToggleFavouriteMutation";
import AppointmentsOrderAgainCard from "../../components/home/AppointmentsOrderAgainCard";
import AppointmentsProviderCard from "../../components/home/AppointmentsProviderCard";
import AppointmentsSectionEmptyState from "../../components/home/AppointmentsSectionEmptyState";
import type { MultiVendorStackParamList } from "../navigation/types";

type NavigationProp = NativeStackNavigationProp<
  MultiVendorStackParamList,
  "AppointmentsSeeAll"
>;

type RoutePropType = RouteProp<MultiVendorStackParamList, "AppointmentsSeeAll">;

type CategoryLikeItem = AppointmentShopType | AppointmentCategory;

function getSectionSubtitle(
  section: AppointmentSeeAllSection,
  t: (key: string) => string,
) {
  switch (section) {
    case "categories":
      return t("see_all_categories_subtitle");
    case "shopTypeCategories":
      return t("see_all_shop_type_categories_subtitle");
    case "topBrands":
      return t("see_all_top_brands_subtitle");
    case "nearbyProviders":
      return t("see_all_nearby_subtitle");
    case "mostPopular":
      return t("see_all_most_popular_subtitle");
    default:
      return "";
  }
}

function toProviderFromOrderAgainItem(
  item: AppointmentOrderAgainItem,
): AppointmentProvider {
  return {
    storeId: item.storeId,
    vendorId: item.storeId,
    name: item.storeName?.trim() || item.productName,
    logo: item.storeLogo ?? null,
    coverImage: item.storeImage ?? item.productImage ?? null,
    deal: item.deal ?? null,
    dealAmount: item.dealAmount ?? null,
    dealType: item.dealType ?? null,
  };
}

function SectionSkeleton({ section }: { section: AppointmentSeeAllSection }) {
  const isCategorySection =
    section === "categories" || section === "shopTypeCategories";

  if (isCategorySection) {
    return (
      <View style={styles.gridList}>
        {Array.from({ length: 6 }).map((_, index) => (
          <View
            key={`category-skeleton-${index}`}
            style={styles.skeletonGridCell}
          >
            <View style={styles.categorySkeletonCard}>
              <Skeleton borderRadius={18} height={98} width="100%" />
              <View style={styles.categorySkeletonCopy}>
                <Skeleton borderRadius={6} height={14} width="72%" />
                <Skeleton borderRadius={6} height={14} width="48%" />
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton
          key={`list-skeleton-${index}`}
          borderRadius={20}
          height={220}
          width="100%"
        />
      ))}
    </View>
  );
}

function getCategoryImage(item: CategoryLikeItem) {
  if ("image" in item) {
    return item.image ?? "";
  }

  return (item as AppointmentCategory).imageUrl ?? "";
}

export default function AppointmentsSeeAllScreen() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation("appointments");
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteOverrides, setFavoriteOverrides] = useState<
    Record<string, boolean>
  >({});
  const { section, title, shopTypeId, categoryId } = route.params;

  const isShopTypesSection = section === "categories";
  const isShopTypeCategoriesSection = section === "shopTypeCategories";
  const isCategorySection = isShopTypesSection || isShopTypeCategoriesSection;

  const {
    data: shopTypes = [],
    isPending: isShopTypesPending,
    isError: hasShopTypesError,
  } = useAppointmentShopTypes(
    { limit: 100, search: searchQuery.trim() || undefined },
    { enabled: isShopTypesSection },
  );
  const {
    data: shopTypeCategories = [],
    isPending: isShopTypeCategoriesPending,
    isError: hasShopTypeCategoriesError,
  } = useAppointmentShopTypeCategories(
    {
      shopTypeId: shopTypeId ?? "",
      limit: 100,
      search: searchQuery.trim() || undefined,
    },
    { enabled: isShopTypeCategoriesSection && Boolean(shopTypeId) },
  );
  const {
    data: brands = [],
    isPending: isBrandsPending,
    isError: hasBrandsError,
  } = useAppointmentBrands(
    { limit: 100, search: searchQuery.trim() || undefined },
    { enabled: section === "topBrands" },
  );
  const {
    data: nearbyProviders = [],
    isPending: isNearbyPending,
    isError: hasNearbyError,
  } = useAppointmentNearbyProviders(
    {
      limit: 100,
      search: searchQuery.trim() || undefined,
      shop_type_id: shopTypeId,
      category_id: categoryId,
    },
    { enabled: section === "nearbyProviders" },
  );
  const {
    data: mostPopularItems = [],
    isPending: isMostPopularPending,
    isError: hasMostPopularError,
  } = useAppointmentOrderAgain(
    {
      limit: 100,
      search: searchQuery.trim() || undefined,
      shop_type_id: shopTypeId,
      category_id: categoryId,
    },
    { enabled: section === "mostPopular" },
  );

  const data = useMemo<
    CategoryLikeItem[] | AppointmentProvider[] | AppointmentOrderAgainItem[]
  >(() => {
    if (isShopTypesSection) {
      return shopTypes;
    }

    if (isShopTypeCategoriesSection) {
      return shopTypeCategories;
    }

    if (section === "topBrands") {
      return brands;
    }

    if (section === "nearbyProviders") {
      return nearbyProviders;
    }

    return mostPopularItems;
  }, [
    brands,
    isShopTypeCategoriesSection,
    isShopTypesSection,
    mostPopularItems,
    nearbyProviders,
    section,
    shopTypeCategories,
    shopTypes,
  ]);

  const isPending =
    (isShopTypesSection && isShopTypesPending) ||
    (isShopTypeCategoriesSection && isShopTypeCategoriesPending) ||
    (section === "topBrands" && isBrandsPending) ||
    (section === "nearbyProviders" && isNearbyPending) ||
    (section === "mostPopular" && isMostPopularPending);

  const isError =
    (isShopTypesSection && hasShopTypesError) ||
    (isShopTypeCategoriesSection && hasShopTypeCategoriesError) ||
    (section === "topBrands" && hasBrandsError) ||
    (section === "nearbyProviders" && hasNearbyError) ||
    (section === "mostPopular" && hasMostPopularError);

  const subtitle = getSectionSubtitle(section, t);
  const {
    mutate: toggleFavourite,
    isPending: isTogglingFavourite,
    variables: toggleVariables,
  } = useToggleFavouriteMutation({
    onSuccess: (response, variables) => {
      setFavoriteOverrides((current) => ({
        ...current,
        [variables.storeId]: response.isFavorite,
      }));
      showToast.success(
        response.isFavorite
          ? t("favourites_toggle_added")
          : t("favourites_toggle_removed"),
      );
    },
    onError: () => {
      showToast.error(t("favourites_toggle_error"));
    },
  });

  const handleOpenDetails = useCallback(
    (provider: AppointmentProvider) => {
      navigation.navigate("MultiVendorDetails", {
        provider,
      });
    },
    [navigation],
  );

  const handleFavoritePress = useCallback(
    (item: AppointmentOrderAgainItem) => {
      const isFavorite =
        favoriteOverrides[item.storeId] ?? item.isFavorite ?? false;
      toggleFavourite({
        storeId: item.storeId,
        nextIsFavorite: !isFavorite,
      });
    },
    [favoriteOverrides, toggleFavourite],
  );

  const handleCategoryItemPress = useCallback(
    (item: CategoryLikeItem) => {
      if (isShopTypesSection) {
        navigation.push("AppointmentsSeeAll", {
          section: "shopTypeCategories",
          title: item.name,
          shopTypeId: item.id,
        });
        return;
      }

      navigation.push("AppointmentsSeeAll", {
        section: "nearbyProviders",
        title: item.name,
        shopTypeId: shopTypeId ?? undefined,
        categoryId: item.id,
      });
    },
    [isShopTypesSection, navigation, shopTypeId],
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);

    try {
      await queryClient.refetchQueries({
        queryKey: appointmentKeys.discovery(),
        type: "active",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient]);

  const keyExtractor = useCallback(
    (
      item: CategoryLikeItem | AppointmentProvider | AppointmentOrderAgainItem,
      index: number,
    ) => {
      if ("storeId" in item && "vendorId" in item) {
        return item.storeId;
      }

      if ("productId" in item) {
        return item.productId;
      }

      return `${item.id}-${index}`;
    },
    [],
  );

  const renderCategoryItem = useCallback(
    ({ item, index }: { item: CategoryLikeItem; index: number }) => (
      <View key={keyExtractor(item, index)} style={styles.gridCell}>
        <Pressable
          accessibilityRole="button"
          onPress={() => handleCategoryItemPress(item)}
          style={[
            styles.categoryCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.categoryImageWrap,
              { backgroundColor: colors.backgroundTertiary },
            ]}
          >
            <Image
              source={{ uri: getCategoryImage(item) }}
              style={styles.categoryImage}
              resizeMode="contain"
            />
          </View>
          <Text
            weight="bold"
            numberOfLines={2}
            style={[
              styles.categoryTitle,
              {
                fontSize: typography.size.sm2,
                lineHeight: typography.lineHeight.sm2,
              },
            ]}
          >
            {item.name}
          </Text>
        </Pressable>
      </View>
    ),
    [
      colors.backgroundTertiary,
      colors.border,
      colors.surface,
      handleCategoryItemPress,
      keyExtractor,
      typography.lineHeight.sm2,
      typography.size.sm2,
    ],
  );

  const renderListItem = useCallback(
    ({
      item,
      index,
    }: {
      item: AppointmentProvider | AppointmentOrderAgainItem;
      index: number;
    }) => {
      if ("productId" in item) {
        return (
          <Pressable
            key={keyExtractor(item, index)}
            accessibilityRole="button"
            onPress={() =>
              handleOpenDetails(toProviderFromOrderAgainItem(item))
            }
          >
            <AppointmentsOrderAgainCard
              item={item}
              isFullWidth
              isFavorite={
                favoriteOverrides[item.storeId] ?? item.isFavorite ?? false
              }
              isFavoritePending={
                isTogglingFavourite &&
                toggleVariables?.storeId === item.storeId
              }
              onFavoritePress={handleFavoritePress}
            />
          </Pressable>
        );
      }

      return (
        <Pressable
          key={keyExtractor(item, index)}
          accessibilityRole="button"
          onPress={() => handleOpenDetails(item)}
        >
          <AppointmentsProviderCard
            provider={item}
            isFullWidth
            variant="compact"
          />
        </Pressable>
      );
    },
    [
      favoriteOverrides,
      handleFavoritePress,
      handleOpenDetails,
      isTogglingFavourite,
      keyExtractor,
      toggleVariables?.storeId,
    ],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.headerWrap}>
          <View style={styles.headerRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.goBack()}
              style={[
                styles.iconButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <MaterialCommunityIcons
                color={colors.text}
                name="arrow-left"
                size={24}
              />
            </Pressable>

            <View style={styles.headerTitleWrap}>
              <Text
                weight="bold"
                numberOfLines={1}
                style={{
                  fontSize: typography.size.xl2,
                  lineHeight: typography.lineHeight.xl2,
                  textAlign: "center",
                }}
              >
                {title}
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.goBack()}
              style={[
                styles.iconButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <MaterialCommunityIcons
                color={colors.text}
                name="close"
                size={24}
              />
            </Pressable>
          </View>

          {!isCategorySection ? (
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search"
              style={styles.searchInput}
            />
          ) : null}

          {subtitle ? (
            <Text color={colors.mutedText} style={styles.subtitleText}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {isPending ? (
          <View style={styles.contentWrap}>
            <SectionSkeleton section={section} />
          </View>
        ) : isError ? (
          <View style={styles.contentWrap}>
            <AppointmentsSectionEmptyState
              title={t("multi_vendor_home_section_empty_title")}
              message={t("see_all_error_message")}
            />
          </View>
        ) : (
          <FlatList
            data={data}
            key={`appointments-see-all-${section}`}
            keyExtractor={keyExtractor}
            numColumns={isCategorySection ? 2 : 1}
            columnWrapperStyle={isCategorySection ? styles.gridRow : undefined}
            contentContainerStyle={styles.listContent}
            renderItem={
              isCategorySection
                ? ({ item, index }) =>
                  renderCategoryItem({
                    item: item as CategoryLikeItem,
                    index,
                  })
                : ({ item, index }) =>
                  renderListItem({
                    item: item as
                      | AppointmentProvider
                      | AppointmentOrderAgainItem,
                    index,
                  })
            }
            ListEmptyComponent={
              <AppointmentsSectionEmptyState
                title={t("multi_vendor_home_section_empty_title")}
                message={t("see_all_empty_message")}
              />
            }
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => {
                  void handleRefresh();
                }}
                tintColor={colors.primary}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  headerTitleWrap: {
    flex: 1,
    justifyContent: "center",
  },
  iconButton: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  categoryCard: {
    borderRadius: 20,
    borderWidth: 1,
    gap: 10,
    minHeight: 170,
    padding: 12,
  },
  categoryImage: {
    height: 76,
    width: 76,
  },
  categoryImageWrap: {
    alignItems: "center",
    borderRadius: 18,
    height: 98,
    justifyContent: "center",
  },
  categoryTitle: {
    textAlign: "center",
  },
  categorySkeletonCard: {
    borderRadius: 20,
    gap: 10,
    minHeight: 170,
    padding: 12,
  },
  categorySkeletonCopy: {
    alignItems: "center",
    gap: 7,
  },
  container: {
    flex: 1,
  },
  contentWrap: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  gridCell: {
    flex: 1,
  },
  gridList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  skeletonGridCell: {
    flexBasis: "47%",
    flexGrow: 1,
    maxWidth: "49%",
  },
  gridRow: {
    gap: 12,
  },
  headerWrap: {
    gap: 18,
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 6,
  },
  list: {
    gap: 12,
  },
  listContent: {
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 28,
    paddingTop: 8,
  },
  safeArea: {
    flex: 1,
  },
  searchInput: {
    marginTop: 2,
  },
  subtitleText: {
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 2,
  },
});
