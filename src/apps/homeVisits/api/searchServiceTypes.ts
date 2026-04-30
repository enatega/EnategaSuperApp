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
// Service Search
// ---------------------------------------------------------------------------

export type SearchServiceItem = {
  productId: string;
  serviceCenterId: string;
  productName: string;
  storeName: string;
  productImage?: string | null;
  storeLogo?: string | null;
  storeImage?: string | null;
  price?: number | null;
  averageRating?: number | null;
  reviewCount?: number | null;
  priceTier?: string | null;
  deal?: string | null;
  dealType?: string | null;
  dealAmount?: number | null;
  latitude?: number | null;
  longitude?: number | null;
};

export type SearchServicesResponse = {
  items: SearchServiceItem[];
  offset: number;
  limit: number;
  total: number;
  isEnd: boolean;
  nextOffset: number | null;
};

export type SearchServicesParams = {
  keyword: string;
  offset: number;
  limit: number;
  categoryId?: string;
  latitude?: number;
  longitude?: number;
  sort_by?: 'best_match' | 'top_rated' | 'nearest';
  ratings?: number;
  availability?: 'standard' | 'emergency';
};

// ---------------------------------------------------------------------------
// Service Center Search
// ---------------------------------------------------------------------------

export type SearchServiceCenterItem = {
  serviceCenterId: string;
  vendorId: string;
  name: string;
  logo?: string | null;
  coverImage?: string | null;
  address?: string | null;
  shopTypeId: string;
  shopTypeName: string;
  averageRating?: number | null;
  reviewCount?: number | null;
  deliveryTime?: string | null;
  minimumOrder?: number | null;
  baseFee?: number | null;
  distanceKm?: number | null;
  isAvailable: boolean;
  deal?: string | null;
  dealType?: string | null;
  dealAmount?: number | null;
  isFavorite: boolean;
};

export type SearchServiceCentersResponse = {
  items: SearchServiceCenterItem[];
  offset: number;
  limit: number;
  total: number;
  isEnd: boolean;
  nextOffset: number | null;
};

export type SearchServiceCentersParams = {
  keyword: string;
  offset: number;
  limit: number;
  categoryId?: string;
  latitude?: number;
  longitude?: number;
  sort_by?: 'best_match' | 'top_rated' | 'nearest';
  ratings?: number;
  availability?: 'standard' | 'emergency';
};