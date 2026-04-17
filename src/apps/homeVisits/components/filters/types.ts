export type HomeVisitsSeeAllSortBy =
  | 'recommended'
  | 'delivery_time'
  | 'price_low_to_high'
  | 'name'
  | 'rating';

export type HomeVisitsSeeAllStock = 'all' | 'in_stock';

export type HomeVisitsSeeAllFilters = {
  stock: HomeVisitsSeeAllStock;
  priceTiers: string | null;
  sortBy: HomeVisitsSeeAllSortBy;
  categoryIds: string | null;
  subcategoryId: string | null;
  tab: string;
};

export type HomeVisitsFilterChip = {
  id: string;
  label: string;
};
