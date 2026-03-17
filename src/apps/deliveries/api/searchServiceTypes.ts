// ---------------------------------------------------------------------------
// Search Types
// ---------------------------------------------------------------------------

export type SearchRecommendation = {
  id: string;
  name: string;
  imageUrl: string;
};

export type SearchRecommendationsResponse = SearchRecommendation[];

// ---------------------------------------------------------------------------
// Recent Searches
// ---------------------------------------------------------------------------

export type RecentSearchItem = {
  id: string;
  term: string;
  normalizedTerm: string;
  createdAt: string;
  updatedAt: string;
};

export type RecentSearchesResponse = {
  items: RecentSearchItem[];
  offset: number;
  limit: number;
  total: number;
  isEnd: boolean;
  nextOffset: number | null;
};

export type SaveRecentSearchPayload = {
  term: string;
};

export type DeleteRecentSearchResponse = {
  deleted: boolean;
};

export type ClearRecentSearchesResponse = {
  cleared: boolean;
};

// ---------------------------------------------------------------------------
// Product Search
// ---------------------------------------------------------------------------

export type SearchProductItem = {
  productId: string;
  storeId: string;
  productName: string;
  storeName: string;
  productImage: string;
  storeLogo: string;
  storeImage: string;
  price: number;
  deal: string | null;
  dealType: string | null;
  dealAmount: number | null;
};

export type SearchProductsResponse = {
  items: SearchProductItem[];
  offset: number;
  limit: number;
  total: number;
  isEnd: boolean;
  nextOffset: number | null;
};

export type SearchProductsParams = {
  keyword: string;
  offset: number;
  limit: number;
  latitude?: number;
  longitude?: number;
};

// ---------------------------------------------------------------------------
// Store Search
// ---------------------------------------------------------------------------

export type SearchStoreItem = {
  storeId: string;
  vendorId: string;
  name: string;
  logo: string;
  coverImage: string;
  address: string;
  shopTypeId: string;
  shopTypeName: string;
  averageRating: number;
  reviewCount: number;
  deliveryTime: string;
  minimumOrder: number;
  baseFee: number;
  distanceKm: number;
  isAvailable: boolean;
  deal: string | null;
  dealType: string | null;
  dealAmount: number | null;
  isFavorite: boolean;
};

export type SearchStoresResponse = {
  items: SearchStoreItem[];
  offset: number;
  limit: number;
  total: number;
  isEnd: boolean;
  nextOffset: number | null;
};

export type SearchStoresParams = {
  keyword: string;
  offset: number;
  limit: number;
  latitude?: number;
  longitude?: number;
};
