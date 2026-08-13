export type MainListFilters = {
  category_ids: string[];
  price_tiers: string | null;
  address_id: string | null;
  stock: string | null;
  sort_by: string | null;
  attribute_filters?: Record<string, string[]>;
};

export type MainFilterCategory = {
  ids: string[];
  key?: string;
  label: string;
  slug?: string;
  usageCount?: number;
};

export type MainFilterAddress = {
  id: string;
  label: string;
  description?: string | null;
};

export type MainFilterOption = {
  value: string;
  label: string;
};

export type MainListFilterData = {
  categories: MainFilterCategory[];
  addresses: MainFilterAddress[];
  priceTiers: MainFilterOption[];
  stock: MainFilterOption[];
  sortBy: MainFilterOption[];
  attributes?: Array<{
    id: string;
    label: string;
    options: Array<MainFilterOption & { productCount?: number }>;
  }>;
};

export type MainFilterSectionTitles = {
  category?: string;
  price?: string;
  address?: string;
  stock?: string;
  sort?: string;
};
