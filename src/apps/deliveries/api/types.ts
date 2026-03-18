// ---------------------------------------------------------------------------
// Shared API types
// ---------------------------------------------------------------------------

/** Standard single-resource response wrapper. */
export interface ApiResponse<T> {
    data: T;
    message?: string;
}

// ---------------------------------------------------------------------------
// Discovery
// ---------------------------------------------------------------------------

export interface DeliveryShopType {
    id: string;
    name: string;
    slug?: string;
    description?: string | null;
    image?: string | null;
    icon?: string | null;
    isActive?: boolean;
    [key: string]: unknown;
}

export interface PaginatedDeliveryResponse<T> {
    items: T[];
    offset: number;
    limit: number;
    total: number;
    isEnd: boolean;
    nextOffset: number | null;
}

export interface DeliveryShopTypesParams {
    offset?: number;
    limit?: number;
}

export interface DeliveryShopTypeProduct {
    productId: string;
    storeId: string;
    productName: string;
    storeName?: string | null;
    productImage?: string | null;
    storeLogo?: string | null;
    storeImage?: string | null;
    price?: number | null;
    deal?: string | null;
    dealType?: string | null;
    dealAmount?: number | null;
}

export interface DeliveryShopTypeProductsParams {
    shopTypeId: string;
    offset?: number;
    limit?: number;
}

export interface DeliveryTopBrand {
    name: string;
    logo?: string | null;
    deal?: string | null;
    dealType?: string | null;
    dealAmount?: number | null;
}

export interface DeliveryTopBrandsParams {
    offset?: number;
    limit?: number;
}

export interface DeliveryNearbyStore {
    storeId: string;
    vendorId: string;
    name: string;
    logo?: string | null;
    coverImage?: string | null;
    address?: string | null;
    shopTypeId?: string | null;
    shopTypeName?: string | null;
    averageRating?: number | null;
    reviewCount?: number | null;
    deliveryTime?: number | string | null;
    minimumOrder?: number | null;
    baseFee?: number | null;
    distanceKm?: number | null;
    isAvailable?: boolean;
    deal?: string | null;
    dealType?: string | null;
    dealAmount?: number | null;
    isFavorite?: boolean;
}

export interface DeliveryNearbyStoresParams {
    offset?: number;
    limit?: number;
    latitude?: number;
    longitude?: number;
}

export interface DeliveryStoreDetailsParams {
    offset?: number;
    limit?: number;
    search?: string;
    selectedCategoryId?: string;
    selectedSubcategoryId?: string;
}

export interface DeliveryStoreTimingSlot {
    open: string;
    close: string;
}

export interface DeliveryStoreTimingDay {
    slots: DeliveryStoreTimingSlot[];
    is_active: boolean;
}

export type DeliveryStoreTimings = Record<string, DeliveryStoreTimingDay>;

export interface DeliveryStoreContact {
    email?: string | null;
    phone?: string | null;
}

export interface DeliveryStoreDetailsStore {
    id: string;
    name: string;
    address?: string | null;
    logo?: string | null;
    coverImage?: string | null;
    averageRating?: number | null;
    reviewCount?: number | null;
    deliveryTime?: number | string | null;
    minimumOrder?: number | null;
    baseFee?: number | null;
    shopTypeId?: string | null;
    shopTypeName?: string | null;
    deal?: string | null;
    dealType?: string | null;
    dealAmount?: number | null;
    tagLine?: string | null;
    description?: string | null;
    storeTimings?: DeliveryStoreTimings | null;
    isAvailable?: boolean;
    contact?: DeliveryStoreContact | null;
}

export interface DeliveryStoreDetailsFilterItem {
    id: string;
    name: string;
    [key: string]: unknown;
}

export interface DeliveryStoreDetailsFilters {
    selectedCategoryId: string | null;
    selectedSubcategoryId: string | null;
    categories: DeliveryStoreDetailsFilterItem[];
    subcategories: DeliveryStoreDetailsFilterItem[];
}

export interface DeliveryStoreDetailsProduct {
    productId: string;
    name: string;
    productImage?: string | null;
    price?: number | null;
    deal?: string | null;
    dealType?: string | null;
    dealAmount?: number | null;
    categoryId?: string | null;
    subcategoryId?: string | null;
    [key: string]: unknown;
}

export interface DeliveryStoreDetailsResponse {
    store: DeliveryStoreDetailsStore;
    filters: DeliveryStoreDetailsFilters;
    products: PaginatedDeliveryResponse<DeliveryStoreDetailsProduct>;
}

export interface DeliveryDealsParams {
    offset?: number;
    limit?: number;
}

export interface DeliveryOrderAgainItem {
    productId: string;
    storeId: string;
    productName: string;
    storeName?: string | null;
    productImage?: string | null;
    storeLogo?: string | null;
    storeImage?: string | null;
    price?: number | null;
    deal?: string | null;
    dealType?: string | null;
    dealAmount?: number | null;
}

export interface DeliveryOrderAgainParams {
    offset?: number;
    limit?: number;
}

export interface DeliveryBannerStore {
    id: string;
    address?: string | null;
    storeImage?: string | null;
    coverImage?: string | null;
}

export interface DeliveryBanner {
    id: string;
    title: string;
    description?: string | null;
    bannerVideoLink?: string | null;
    bannerImageLink?: string | null;
    relatedStore?: string | null;
    store?: DeliveryBannerStore | null;
}

export interface DeliveryBannersParams {
    offset?: number;
    limit?: number;
}

export type DeliveryShopTypesApiResponse =
    | ApiResponse<DeliveryShopType[]>
    | PaginatedDeliveryResponse<DeliveryShopType>
    | DeliveryShopType[];

export type DeliveryTopBrandsApiResponse =
    | ApiResponse<DeliveryTopBrand[]>
    | PaginatedDeliveryResponse<DeliveryTopBrand>
    | DeliveryTopBrand[];

export type DeliveryShopTypeProductsApiResponse =
    | ApiResponse<DeliveryShopTypeProduct[]>
    | PaginatedDeliveryResponse<DeliveryShopTypeProduct>
    | DeliveryShopTypeProduct[];

export type DeliveryNearbyStoresApiResponse =
    | ApiResponse<DeliveryNearbyStore[]>
    | PaginatedDeliveryResponse<DeliveryNearbyStore>
    | DeliveryNearbyStore[];

export type DeliveryStoreDetailsApiResponse = DeliveryStoreDetailsResponse;

export type DeliveryDealsApiResponse =
    | ApiResponse<DeliveryNearbyStore[]>
    | PaginatedDeliveryResponse<DeliveryNearbyStore>
    | DeliveryNearbyStore[];

export type DeliveryOrderAgainApiResponse =
    | ApiResponse<DeliveryOrderAgainItem[]>
    | PaginatedDeliveryResponse<DeliveryOrderAgainItem>
    | DeliveryOrderAgainItem[];

export type DeliveryBannersApiResponse =
    | ApiResponse<DeliveryBanner[]>
    | PaginatedDeliveryResponse<DeliveryBanner>
    | DeliveryBanner[];
