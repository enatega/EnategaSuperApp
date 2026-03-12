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

export type DeliveryBannersApiResponse =
    | ApiResponse<DeliveryBanner[]>
    | PaginatedDeliveryResponse<DeliveryBanner>
    | DeliveryBanner[];
