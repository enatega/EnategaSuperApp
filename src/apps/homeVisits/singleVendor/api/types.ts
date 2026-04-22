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
  search?: string;
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
  isFavorite?: boolean | null;
}

export interface HomeVisitsSingleVendorCategoryServicesParams {
  categoryId: string;
  offset?: number;
  limit?: number;
  search?: string;
  latitude?: number;
  longitude?: number;
  stock?: string;
  category_ids?: string;
  subcategory_id?: string;
  price_tiers?: string;
  sort_by?: string;
}

export interface HomeVisitsSingleVendorServiceCenterServicesParams {
  serviceCenterId: string;
  offset?: number;
  limit?: number;
}

export interface HomeVisitsSingleVendorBookingAvailabilityParams {
  serviceCenterId: string;
  date: string;
  teamSize?: number;
}

export interface HomeVisitsSingleVendorBookingAvailabilitySlot {
  open: string;
  close: string;
  availableWorkers: number;
  meetsTeamSize: boolean;
}

export interface HomeVisitsSingleVendorBookingAvailabilityWorker {
  workerId: string;
  name: string;
  profession: string | null;
  minimumWorkingHours: number | null;
  slots: Array<{
    open: string;
    close: string;
  }>;
}

export interface HomeVisitsSingleVendorBookingAvailabilityResponse {
  serviceCenterId: string;
  date: string;
  day: string;
  scheduleAllowed: boolean;
  serviceCenterAvailable: boolean;
  teamSize: number | null;
  slots: HomeVisitsSingleVendorBookingAvailabilitySlot[];
  workers: HomeVisitsSingleVendorBookingAvailabilityWorker[];
}

export interface HomeVisitsSingleVendorServiceCenterListCategory {
  id: string;
  name: string;
}

export interface HomeVisitsSingleVendorServiceCenterListSubcategory {
  id: string;
  name: string;
}

export interface HomeVisitsSingleVendorServiceCenterListItem {
  id: string;
  name: string;
  shortDescription?: string | null;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  categoryId: string;
  subcategoryId?: string | null;
  estimatedDuration?: string | null;
  category: HomeVisitsSingleVendorServiceCenterListCategory;
  subcategory?: HomeVisitsSingleVendorServiceCenterListSubcategory | null;
  duration?: number | null;
  durationUnit?: string | null;
}

export type HomeVisitsSingleVendorCategoriesApiResponse =
  PaginatedHomeVisitsResponse<HomeVisitsSingleVendorCategory>;

export type HomeVisitsSingleVendorCategoryServicesApiResponse =
  PaginatedHomeVisitsResponse<HomeVisitsSingleVendorCategoryService>;

export type HomeVisitsSingleVendorServiceCenterServicesApiResponse =
  PaginatedHomeVisitsResponse<HomeVisitsSingleVendorServiceCenterListItem>;

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
  isFavorite?: boolean | null;
}

export interface HomeVisitsSingleVendorNearbyServicesParams {
  offset?: number;
  limit?: number;
  latitude: number;
  longitude: number;
  search?: string;
  stock?: string;
  category_ids?: string;
  subcategory_id?: string;
  price_tiers?: string;
  sort_by?: string;
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
  isFavorite?: boolean | null;
}

export interface HomeVisitsSingleVendorMostPopularServicesParams {
  offset?: number;
  limit?: number;
  search?: string;
  latitude?: number;
  longitude?: number;
  stock?: string;
  category_ids?: string;
  subcategory_id?: string;
  price_tiers?: string;
  sort_by?: string;
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
  isFavorite?: boolean | null;
}

export interface HomeVisitsSingleVendorDealsParams {
  offset?: number;
  limit?: number;
  search?: string;
  tab?: string;
  category_ids?: string;
  subcategory_id?: string;
  price_tiers?: string;
  latitude?: number;
  longitude?: number;
  sort_by?: string;
}

export type HomeVisitsSingleVendorDealsApiResponse =
  PaginatedHomeVisitsResponse<HomeVisitsSingleVendorDeal>;

export interface HomeVisitsServiceReview {
  id?: string;
  _id?: string;
  rating?: number | null;
  review?: string | null;
  comment?: string | null;
  text?: string | null;
  description?: string | null;
  createdAt?: string | null;
  created_at?: string | null;
  serviceName?: string | null;
  serviceTitle?: string | null;
  service?: {
    name?: string | null;
    title?: string | null;
  } | null;
  user?: {
    id?: string;
    fullName?: string | null;
    full_name?: string | null;
    name?: string | null;
    image?: string | null;
    profile?: string | null;
    avatar?: string | null;
  } | null;
}

export interface HomeVisitsServiceReviewsParams {
  serviceId: string;
  offset?: number;
  limit?: number;
}

export interface HomeVisitsServiceReviewsApiResponse {
  reviews: HomeVisitsServiceReview[];
  total: number;
  averageRating: number;
  reviewCount: number;
}

export interface HomeVisitsToggleFavoriteServiceResponse {
  message: string;
  isFavorite: boolean;
}

export interface HomeVisitsSingleVendorFavoriteServicesParams {
  offset?: number;
  limit?: number;
}

export type HomeVisitsSingleVendorFavoriteServicesApiResponse =
  PaginatedHomeVisitsResponse<HomeVisitsSingleVendorCategoryService>;

export type HomeVisitsSingleVendorBookingsTab = 'ongoing' | 'past';

export interface HomeVisitsSingleVendorBookingsParams {
  offset?: number;
  limit?: number;
  tab: HomeVisitsSingleVendorBookingsTab;
}

export interface HomeVisitsSingleVendorBookingItem {
  orderId: string;
  title: string;
  durationLabel?: string | null;
  itemCount: number;
  totalAmount?: number | null;
  status?: string | null;
  jobStatus?: string | null;
  paymentStatus?: string | null;
  orderedAt?: string | null;
  scheduledAt?: string | null;
  image?: string | null;
  statusLabel?: string | null;
  canViewDetails?: boolean;
  canBookAgain?: boolean;
}

export type HomeVisitsSingleVendorBookingsApiResponse =
  PaginatedHomeVisitsResponse<HomeVisitsSingleVendorBookingItem>;

export interface HomeVisitsSingleVendorBookingServiceItem {
  productId?: string;
  name?: string | null;
  description?: string | null;
  image?: string | null;
  durationLabel?: string | null;
  quantity?: number | null;
  unitPrice?: number | null;
  totalPrice?: number | null;
}

export interface HomeVisitsSingleVendorBookingStore {
  id?: string;
  name?: string | null;
  address?: string | null;
  image?: string | null;
}

export interface HomeVisitsSingleVendorBookingSummary {
  subtotal?: number | null;
  discountAmount?: number | null;
  taxAmount?: number | null;
  deliveryFee?: number | null;
  packingCharges?: number | null;
  riderTip?: number | null;
  totalAmount?: number | null;
  couponCode?: string | null;
}

export interface HomeVisitsSingleVendorAssignedWorker {
  id?: string;
  name?: string | null;
  phone?: string | null;
  profile?: string | null;
}

export interface HomeVisitsSingleVendorBookingCategoryImage {
  categoryId?: string;
  categoryName?: string | null;
  imageUrl?: string | null;
}

export interface HomeVisitsSingleVendorBookingDetails {
  orderId: string;
  title?: string | null;
  itemCount?: number | null;
  status?: string | null;
  jobStatus?: string | null;
  statusMessage?: string | null;
  durationLabel?: string | null;
  statusLabel?: string | null;
  paymentStatus?: string | null;
  bookingType?: string | null;
  contractDays?: number | null;
  teamSize?: number | null;
  totalAmount?: number | null;
  paymentMethod?: string | null;
  orderedAt?: string | null;
  scheduledAt?: string | null;
  image?: string | null;
  categoryImages?: HomeVisitsSingleVendorBookingCategoryImage[] | null;
  store?: HomeVisitsSingleVendorBookingStore | null;
  services?: HomeVisitsSingleVendorBookingServiceItem[] | null;
  summary?: HomeVisitsSingleVendorBookingSummary | null;
  addressLabel?: string | null;
  address?: string | null;
  customerNote?: string | null;
  cancellationPolicy?: string | null;
  assignedWorker?: HomeVisitsSingleVendorAssignedWorker | null;
  [key: string]: unknown;
}
