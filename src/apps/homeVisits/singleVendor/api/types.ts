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
