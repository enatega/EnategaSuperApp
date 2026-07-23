export const appointmentKeys = {
  all: ["appointments"] as const,
  bookings: () => [...appointmentKeys.all, "bookings"] as const,
  cart: () => [...appointmentKeys.all, "cart"] as const,
  cartCount: () => [...appointmentKeys.cart(), "count"] as const,
  discovery: () => [...appointmentKeys.all, "discovery"] as const,
  banners: (filters?: { limit?: number; offset?: number }) =>
    [...appointmentKeys.discovery(), "banners", filters] as const,
  shopTypes: (filters?: { limit?: number; search?: string }) =>
    [...appointmentKeys.discovery(), "shop-types", filters] as const,
  searchSuggestions: (filters?: { limit?: number; search?: string }) =>
    [...appointmentKeys.discovery(), "search-suggestions", filters] as const,
  categories: (filters?: {
    shopTypeId: string;
    limit?: number;
    search?: string;
  }) => [...appointmentKeys.discovery(), "categories", filters] as const,
  brands: (filters?: {
    limit?: number;
    search?: string;
    latitude?: number;
    longitude?: number;
  }) => [...appointmentKeys.discovery(), "brands", filters] as const,
  topBrands: (filters?: { limit?: number; search?: string }) =>
    [...appointmentKeys.discovery(), "top-brands", filters] as const,
  nearbyProviders: (filters?: {
    limit?: number;
    search?: string;
    category_id?: string;
    category_ids?: string[];
    shop_type_id?: string;
    subcategory_id?: string;
    stock?: string;
    price_tiers?: string | string[];
    sort_by?: string;
    latitude?: number;
    longitude?: number;
  }) => [...appointmentKeys.discovery(), "nearby-providers", filters] as const,
  orderAgain: (filters?: {
    limit?: number;
    search?: string;
    category_id?: string;
    category_ids?: string[];
    shop_type_id?: string;
    subcategory_id?: string;
  }) => [...appointmentKeys.discovery(), "order-again", filters] as const,
  storeView: (storeId: string) =>
    [...appointmentKeys.discovery(), "store-view", storeId] as const,
  storeServices: (
    storeId: string,
    filters?: {
      limit?: number;
      search?: string;
      categoryId?: string;
      subcategoryId?: string;
    },
  ) =>
    [
      ...appointmentKeys.discovery(),
      "store-services",
      storeId,
      filters,
    ] as const,
  scheduledBookings: () =>
    [...appointmentKeys.bookings(), "scheduled"] as const,
  scheduledBookingDetail: (orderId: string) =>
    [...appointmentKeys.scheduledBookings(), orderId] as const,
  pastBookings: (filters: { limit: number }) =>
    [...appointmentKeys.bookings(), "past", filters] as const,
};

export const appointmentFavouriteKeys = {
  all: [...appointmentKeys.all, "favourites"] as const,
  list: () => [...appointmentFavouriteKeys.all, "list"] as const,
};
