import type { DiscoveryCategoryItem } from '../../../../general/components/discovery';

export interface PaginatedHomeVisitsResponse<T> {
  items: T[];
  offset: number;
  limit: number;
  total: number;
  isEnd: boolean;
  nextOffset: number | null;
}

export type HomeVisitsSingleVendorCategory = DiscoveryCategoryItem;

export interface HomeVisitsSingleVendorCategoriesParams {
  offset?: number;
  limit?: number;
}

export interface HomeVisitsSingleVendorCategoryService {
  productId: string;
  serviceCenterId: string;
  productName: string;
  storeName?: string | null;
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
  latitude?: number | string | null;
  longitude?: number | string | null;
}

export interface HomeVisitsSingleVendorCategoryServicesParams {
  categoryId: string;
  offset?: number;
  limit?: number;
  stock?: string;
  sort_by?: string;
}

export type HomeVisitsSingleVendorCategoriesApiResponse =
  PaginatedHomeVisitsResponse<HomeVisitsSingleVendorCategory>;

export type HomeVisitsSingleVendorCategoryServicesApiResponse =
  PaginatedHomeVisitsResponse<HomeVisitsSingleVendorCategoryService>;

export interface HomeVisitsSingleVendorBannerStore {
  id: string;
  address?: string | null;
  storeImage?: string | null;
  coverImage?: string | null;
}

export interface HomeVisitsSingleVendorBanner {
  id: string;
  title: string;
  description?: string | null;
  bannerVideoLink?: string | null;
  bannerImageLink?: string | null;
  relatedStore?: string | null;
  store?: HomeVisitsSingleVendorBannerStore | null;
}

export interface HomeVisitsSingleVendorBannersParams {
  offset?: number;
  limit?: number;
}

export type HomeVisitsSingleVendorBannersApiResponse =
  PaginatedHomeVisitsResponse<HomeVisitsSingleVendorBanner>;

export interface HomeVisitsSingleVendorNearbyService {
  productId: string;
  serviceCenterId: string;
  productName: string;
  storeName?: string | null;
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
  latitude?: number | string | null;
  longitude?: number | string | null;
}

export interface HomeVisitsSingleVendorNearbyServicesParams {
  offset?: number;
  limit?: number;
  latitude: number;
  longitude: number;
}

export type HomeVisitsSingleVendorNearbyServicesApiResponse =
  PaginatedHomeVisitsResponse<HomeVisitsSingleVendorNearbyService>;

export interface HomeVisitsSingleVendorMostPopularService {
  productId: string;
  serviceCenterId: string;
  productName: string;
  storeName?: string | null;
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
  latitude?: number | string | null;
  longitude?: number | string | null;
}

export interface HomeVisitsSingleVendorMostPopularServicesParams {
  offset?: number;
  limit?: number;
}

export type HomeVisitsSingleVendorMostPopularServicesApiResponse =
  PaginatedHomeVisitsResponse<HomeVisitsSingleVendorMostPopularService>;

export interface HomeVisitsSingleVendorDeal {
  productId: string;
  serviceCenterId: string;
  productName: string;
  storeName?: string | null;
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
  latitude?: number | string | null;
  longitude?: number | string | null;
}

export interface HomeVisitsSingleVendorDealsParams {
  offset?: number;
  limit?: number;
  tab?: string;
}

export type HomeVisitsSingleVendorDealsApiResponse =
  PaginatedHomeVisitsResponse<HomeVisitsSingleVendorDeal>;

export interface HomeVisitsSingleVendorServiceBookingScreenRating {
  average: number | null;
  count: number | null;
}

export interface HomeVisitsSingleVendorServiceBookingScreenOption {
  optionId: string;
  title: string;
  description: string | null;
  price: number;
  duration: number | null;
  durationUnit: string | null;
  isDefaultSelected: boolean;
}

export interface HomeVisitsSingleVendorServiceBookingScreenSection {
  groupId: string;
  title: string;
  helperText: string | null;
  required: boolean;
  options: HomeVisitsSingleVendorServiceBookingScreenOption[];
}

export interface HomeVisitsSingleVendorServiceBookingScreenPricingSummary {
  basePrice: number;
  defaultServiceTypePrice: number;
  defaultAdditionalServicesPrice: number;
  totalPrice: number;
  serviceCount: number;
  estimatedDurationMinutes: number | null;
  estimatedDurationLabel: string | null;
}

export interface HomeVisitsSingleVendorServiceBookingScreenResponse {
  serviceId: string;
  serviceName: string;
  imageUrl: string | null;
  description: string | null;
  basePrice: number;
  rating: HomeVisitsSingleVendorServiceBookingScreenRating | null;
  serviceTypeSections: HomeVisitsSingleVendorServiceBookingScreenSection[];
  additionalServiceSections: HomeVisitsSingleVendorServiceBookingScreenSection[];
  pricingSummary: HomeVisitsSingleVendorServiceBookingScreenPricingSummary;
}
