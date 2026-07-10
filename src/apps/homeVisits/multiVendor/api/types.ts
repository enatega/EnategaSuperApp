import type { DiscoveryCategoryItem } from '../../../../general/components/discovery';
import type {
  HomeVisitsSingleVendorNearbyService,
  PaginatedHomeVisitsResponse,
} from '../../singleVendor/api/types';

export type HomeVisitsMultiVendorMainService = DiscoveryCategoryItem;

export interface HomeVisitsMultiVendorMainServicesParams {
  offset?: number;
  limit?: number;
  search?: string;
}

export type HomeVisitsMultiVendorMainServicesApiResponse =
  PaginatedHomeVisitsResponse<HomeVisitsMultiVendorMainService>;

export interface HomeVisitsMultiVendorMainServiceCategoriesParams {
  mainServiceId: string;
  offset?: number;
  limit?: number;
  search?: string;
}

export type HomeVisitsMultiVendorMainServiceCategoriesApiResponse =
  PaginatedHomeVisitsResponse<DiscoveryCategoryItem>;

export interface HomeVisitsMultiVendorProvider {
  id: string;
  serviceCenterId: string;
  name: string;
  imageUrl?: string | null;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  address?: string | null;
  categoryName?: string | null;
  averageRating?: number | null;
  reviewCount?: number | null;
  distanceLabel?: string | null;
  availabilityLabel?: string | null;
  isClosed?: boolean | string | number | null;
  isFavorite?: boolean | string | number | null;
  startingPrice?: number | null;
  featuredServiceId?: string | null;
}

export interface HomeVisitsMultiVendorProvidersParams {
  offset?: number;
  limit?: number;
  search?: string;
  mainServiceId?: string;
  latitude?: number;
  longitude?: number;
}

export type HomeVisitsMultiVendorProvidersApiResponse =
  PaginatedHomeVisitsResponse<HomeVisitsMultiVendorProvider>;

export interface HomeVisitsFavoriteServiceCenter {
  serviceCenterId: string;
  vendorId?: string | null;
  name: string;
  logo?: string | null;
  coverImage?: string | null;
  address?: string | null;
  shopTypeId?: string | null;
  shopTypeName?: string | null;
  averageRating?: number | null;
  reviewCount?: number | null;
  deliveryTime?: string | null;
  minimumOrder?: number | null;
  baseFee?: number | null;
  distanceKm?: number | null;
  isClosed?: boolean | string | number | null;
  isFavorite?: boolean | string | number | null;
}

export interface HomeVisitsFavoriteServiceCentersParams {
  offset?: number;
  limit?: number;
}

export type HomeVisitsFavoriteServiceCentersApiResponse =
  PaginatedHomeVisitsResponse<HomeVisitsFavoriteServiceCenter>;

export type HomeVisitsMultiVendorNearbyService =
  HomeVisitsSingleVendorNearbyService;

export interface HomeVisitsMultiVendorNearbyServicesParams {
  offset?: number;
  limit?: number;
  search?: string;
  mainServiceId?: string;
  providerId?: string;
  latitude?: number;
  longitude?: number;
  stock?: string;
  category_ids?: string;
  subcategory_id?: string;
  price_tiers?: string;
  sort_by?: string;
}

export type HomeVisitsMultiVendorNearbyServicesApiResponse =
  PaginatedHomeVisitsResponse<HomeVisitsMultiVendorNearbyService>;

export type HomeVisitsMultiVendorDeal = HomeVisitsMultiVendorNearbyService;

export type HomeVisitsMultiVendorDealsParams =
  HomeVisitsMultiVendorNearbyServicesParams;

export type HomeVisitsMultiVendorDealsApiResponse =
  PaginatedHomeVisitsResponse<HomeVisitsMultiVendorDeal>;

export interface HomeVisitsToggleFavoriteServiceCenterResponse {
  message: string;
  isFavorite: boolean;
}
