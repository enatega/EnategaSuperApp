// ---------------------------------------------------------------------------
// Query Key Factory  (qk-factory-pattern + qk-hierarchical-organization)
//
// ALL deliveries query keys live here.
// This is the single source of truth — do not create separate key files.
// Hierarchy: entity → scope → id / filters
// ---------------------------------------------------------------------------

export const deliveryKeys = {
    /** Root key – invalidating this clears ALL deliveries-related caches. */
    all: ['deliveries'] as const,

    // Discovery
    discovery: () => [...deliveryKeys.all, 'discovery'] as const,
    shopTypes: () => [...deliveryKeys.discovery(), 'shop-types'] as const,
    shopTypeProducts: (shopTypeId: string, offset = 0, limit = 10) =>
        [
            ...deliveryKeys.discovery(),
            'shop-type-products',
            shopTypeId,
            offset,
            limit,
        ] as const,
    topBrands: () => [...deliveryKeys.discovery(), 'top-brands'] as const,
    mobileBanners: () => [...deliveryKeys.discovery(), 'mobile-banners'] as const,
    nearbyStores: () => [...deliveryKeys.discovery(), 'nearby-stores'] as const,
    storeView: (storeId: string) =>
        [
            ...deliveryKeys.discovery(),
            'store-view',
            storeId,
        ] as const,
    storeProducts: (
        storeId: string,
        offset = 0,
        limit = 10,
        search?: string,
        selectedCategoryId?: string,
        selectedSubcategoryId?: string,
    ) =>
        [
            ...deliveryKeys.discovery(),
            'store-products',
            storeId,
            offset,
            limit,
            search,
            selectedCategoryId,
            selectedSubcategoryId,
        ] as const,
    deals: () => [...deliveryKeys.discovery(), 'deals'] as const,

    // Search
    search: () => [...deliveryKeys.all, 'search'] as const,
    recommendations: () => [...deliveryKeys.search(), 'recommendations'] as const,
    recentSearches: () => [...deliveryKeys.search(), 'recent-searches'] as const,
    productSearch: (keyword: string, latitude?: number, longitude?: number) =>
        [...deliveryKeys.search(), 'products', keyword, latitude, longitude] as const,
    storeSearch: (keyword: string, latitude?: number, longitude?: number) =>
        [...deliveryKeys.search(), 'stores', keyword, latitude, longitude] as const,
    orderAgain: () => [...deliveryKeys.discovery(), 'order-again'] as const,
};

export const addressKeys = {
    all: ['addresses'] as const,
    list: () => [...addressKeys.all, 'list'] as const,
    detail: (id: string) => [...addressKeys.all, id] as const,
};

export const favouriteKeys = {
    all: ['favourites'] as const,
    list: () => [...favouriteKeys.all, 'list'] as const,
};

/*
  Usage cheat-sheet:
  ──────────────────
  deliveryKeys.all         → ['deliveries']
  deliveryKeys.discovery() → ['deliveries', 'discovery']
  deliveryKeys.shopTypes() → ['deliveries', 'discovery', 'shop-types']
  deliveryKeys.topBrands() → ['deliveries', 'discovery', 'top-brands']
  deliveryKeys.mobileBanners() → ['deliveries', 'discovery', 'mobile-banners']

  addressKeys.all          → ['addresses']
  addressKeys.list()       → ['addresses', 'list']
  addressKeys.detail(id)   → ['addresses', id]

  Invalidation examples:
  ──────────────────────
  queryClient.invalidateQueries({ queryKey: deliveryKeys.all })         // all deliveries
  queryClient.invalidateQueries({ queryKey: deliveryKeys.discovery() }) // discovery endpoints
  queryClient.invalidateQueries({ queryKey: addressKeys.all })          // all addresses
  queryClient.invalidateQueries({ queryKey: addressKeys.list() })       // address list
  queryClient.invalidateQueries({ queryKey: deliveryKeys.shopTypes() }) // shop types
  queryClient.invalidateQueries({ queryKey: deliveryKeys.topBrands() }) // top brands
  queryClient.invalidateQueries({ queryKey: deliveryKeys.mobileBanners() }) // mobile banners
*/
