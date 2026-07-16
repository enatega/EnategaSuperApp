import type { DiscoveryCategoryItem } from '../../../../general/components/discovery';
import type {
  HomeVisitsMultiVendorNearbyService,
  HomeVisitsMultiVendorNearbyServicesParams,
} from '../../multiVendor/api/types';
import type { PaginatedHomeVisitsResponse } from '../../singleVendor/api/types';

export type ChainMenuTemplate = {
  id: string;
  name: string;
};

export type ChainMenuCategory = DiscoveryCategoryItem;

export type ChainMenuTemplatesParams = {
  offset?: number;
  limit?: number;
};

export type ChainMenuCategoriesParams = {
  menuTemplateId: string;
  offset?: number;
  limit?: number;
};

export type ChainMenuCategoryServicesParams =
  HomeVisitsMultiVendorNearbyServicesParams & {
    menuTemplateId: string;
    categoryId: string;
  };

export type ChainMenuDealsParams =
  HomeVisitsMultiVendorNearbyServicesParams & {
    menuTemplateId: string;
    tab?: string;
  };

export type ChainMenuTemplatesApiResponse =
  PaginatedHomeVisitsResponse<ChainMenuTemplate>;

export type ChainMenuCategoriesApiResponse =
  PaginatedHomeVisitsResponse<ChainMenuCategory>;

export type ChainMenuCategoryServicesApiResponse =
  PaginatedHomeVisitsResponse<HomeVisitsMultiVendorNearbyService>;

export type ChainMenuDealsApiResponse =
  PaginatedHomeVisitsResponse<HomeVisitsMultiVendorNearbyService>;
