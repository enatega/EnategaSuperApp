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
    shopTypes: (filters?: { limit?: number }) =>
        [...deliveryKeys.discovery(), 'shop-types', filters] as const,
    shopTypeProducts: (shopTypeId: string, offset = 0, limit = 10) =>
        [
            ...deliveryKeys.discovery(),
            'shop-type-products',
            shopTypeId,
            offset,
            limit,
        ] as const,
    shopTypeStores: (shopTypeId: string, offset = 0, limit = 10) =>
        [
            ...deliveryKeys.discovery(),
            'shop-type-stores',
            shopTypeId,
            offset,
            limit,
        ] as const,
    vendorStores: (vendorId: string, offset = 0, limit = 10) =>
        [
            ...deliveryKeys.discovery(),
            'vendor-stores',
            vendorId,
            offset,
            limit,
        ] as const,
    topBrands: (filters?: { limit?: number; search?: string }) =>
        [...deliveryKeys.discovery(), 'top-brands', filters] as const,
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
        filters?: {
            limit?: number;
            search?: string;
            selectedCategoryId?: string;
            selectedSubcategoryId?: string;
        },
    ) =>
        [
            ...deliveryKeys.discovery(),
            'store-products',
            storeId,
            filters,
        ] as const,
    deals: () => [...deliveryKeys.discovery(), 'deals'] as const,
    filterValues: (storeId?: string) =>
        [...deliveryKeys.discovery(), 'filter-values', storeId ?? 'all'] as const,

    // Search
    search: () => [...deliveryKeys.all, 'search'] as const,
    recommendations: () => [...deliveryKeys.search(), 'recommendations'] as const,
    recentSearches: () => [...deliveryKeys.search(), 'recent-searches'] as const,
    productInfo: (productId: string) =>
        [...deliveryKeys.all, 'product-info', productId] as const,
    productInfoCustomizations: (productId: string) =>
        [...deliveryKeys.all, 'product-info-customizations', productId] as const,
    cart: () => [...deliveryKeys.all, 'cart'] as const,
    cartCount: () => [...deliveryKeys.all, 'cart-count'] as const,
    checkoutPreview: (input: {
        storeId: string;
        bucketId: string;
        orderType: 'delivery' | 'pickup';
        addressId?: string;
        scheduledAt?: string;
        riderTip?: number;
    }) => [...deliveryKeys.all, 'checkout-preview', input] as const,
    productSearch: (keyword: string, latitude?: number, longitude?: number) =>
        [...deliveryKeys.search(), 'products', keyword, latitude, longitude] as const,
    storeSearch: (keyword: string, latitude?: number, longitude?: number) =>
        [...deliveryKeys.search(), 'stores', keyword, latitude, longitude] as const,
    orderAgain: () => [...deliveryKeys.discovery(), 'order-again'] as const,

    filterableListing: (scope: string) =>
        [...deliveryKeys.search(), 'filterable-listing', scope] as const,


    // Chat
    chat: () => [...deliveryKeys.all, 'chat'] as const,
    chatBoxes: (userId: string) => [...deliveryKeys.chat(), 'boxes', userId] as const,
    chatMessages: (chatBoxId: string) =>
        [...deliveryKeys.chat(), 'messages', chatBoxId] as const,
    supportChat: () => [...deliveryKeys.all, 'support-chat'] as const,
    supportChatBoxes: (filters: Record<string, unknown>) =>
        [...deliveryKeys.supportChat(), 'boxes', filters] as const,
    supportChatBoxesByUser: (userId: string, filters: Record<string, unknown>) =>
        [...deliveryKeys.supportChat(), 'boxes', 'user', userId, filters] as const,
    supportChatBox: (chatBoxId: string) =>
        [...deliveryKeys.supportChat(), 'box', chatBoxId] as const,
    supportChatMessages: (chatBoxId: string) =>
        [...deliveryKeys.supportChat(), 'messages', chatBoxId] as const,

    // Orders
    orders: () => [...deliveryKeys.all, 'orders'] as const,
    activeOrders: (filters: { limit: number; search?: string }) =>
        [...deliveryKeys.orders(), 'active', filters] as const,
    orderDetail: (orderId: string) =>
        [...deliveryKeys.orders(), 'detail', orderId] as const,
    pastOrders: (filters: { limit: number; search?: string }) =>
        [...deliveryKeys.orders(), 'past', filters] as const,
    scheduledOrders: (filters: { limit: number; search?: string }) =>
        [...deliveryKeys.orders(), 'scheduled', filters] as const,
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
