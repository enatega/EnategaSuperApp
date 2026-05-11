export type RideForYouRestaurant = {
  storeId: string;
  name: string;
  coverImage?: string | null;
  logo?: string | null;
  shopTypeName?: string | null;
  averageRating?: number | null;
  reviewCount?: number | null;
  baseFee?: number | null;
  deliveryTime?: number | string | null;
  distanceKm?: number | null;
};

