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

export type DeliveryShopTypesApiResponse =
    | ApiResponse<DeliveryShopType[]>
    | DeliveryShopType[];
