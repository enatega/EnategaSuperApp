import type {
  GenericFilterChip,
  GenericListFilterData,
  GenericListFilters,
} from './types';

export const EMPTY_FILTERS: GenericListFilters = {
  category_ids: [],
  price_tiers: null,
  address_id: null,
  stock: null,
  sort_by: null,
};

export function buildQueryFilterPayload(filters: GenericListFilters) {
  return {
    category_ids: filters.category_ids,
    price_tiers: filters.price_tiers,
    address_id: filters.address_id,
    stock: filters.stock,
    sort_by: filters.sort_by,
  };
}

export function createGenericListFilters(
  initialFilters?: Partial<GenericListFilters>,
): GenericListFilters {
  return {
    category_ids: initialFilters?.category_ids ?? EMPTY_FILTERS.category_ids,
    price_tiers: initialFilters?.price_tiers ?? EMPTY_FILTERS.price_tiers,
    address_id: initialFilters?.address_id ?? EMPTY_FILTERS.address_id,
    stock: initialFilters?.stock ?? EMPTY_FILTERS.stock,
    sort_by: initialFilters?.sort_by ?? EMPTY_FILTERS.sort_by,
  };
}

function decodeFilterLabel(label: string) {
  return label.replaceAll('&amp;', '&');
}

function findCategoryLabel(filters: GenericListFilterData | undefined, id: string) {
  return (
    filters?.categories.find((category) => category.ids.includes(id))?.label ?? null
  );
}

function findAddressLabel(filters: GenericListFilterData | undefined, id: string | null) {
  if (!filters || !id) return null;
  return filters.addresses.find((address) => address.id === id)?.label ?? null;
}

function findPriceTierLabel(filters: GenericListFilterData | undefined, value: string | null) {
  if (!filters || !value) return null;
  return filters.priceTiers.find((priceTier) => priceTier.value === value)?.label ?? null;
}

function findStockLabel(filters: GenericListFilterData | undefined, value: string | null) {
  if (!filters || !value) return null;
  return filters.stock.find((stockOption) => stockOption.value === value)?.label ?? null;
}

function findSortByLabel(filters: GenericListFilterData | undefined, value: string | null) {
  if (!filters || !value) return null;
  return filters.sortBy.find((sortOption) => sortOption.value === value)?.label ?? null;
}

export function buildFilterChips(
  filters: GenericListFilters,
  filterData?: GenericListFilterData,
): GenericFilterChip[] {
  const chips: GenericFilterChip[] = [];

  filters.category_ids.forEach((categoryId) => {
    const label = findCategoryLabel(filterData, categoryId);

    if (label) {
      chips.push({
        id: `category:${categoryId}`,
        label: decodeFilterLabel(label),
      });
    }
  });

  const priceLabel = findPriceTierLabel(filterData, filters.price_tiers);
  if (priceLabel) {
    chips.push({
      id: `price:${filters.price_tiers}`,
      label: decodeFilterLabel(priceLabel),
    });
  }

  const addressLabel = findAddressLabel(filterData, filters.address_id);
  if (addressLabel) {
    chips.push({
      id: `address:${filters.address_id}`,
      label: decodeFilterLabel(addressLabel),
    });
  }

  const stockLabel = findStockLabel(filterData, filters.stock);
  if (stockLabel) {
    chips.push({
      id: `stock:${filters.stock}`,
      label: decodeFilterLabel(stockLabel),
    });
  }

  const sortLabel = findSortByLabel(filterData, filters.sort_by);
  if (sortLabel) {
    chips.push({
      id: `sort:${filters.sort_by}`,
      label: decodeFilterLabel(sortLabel),
    });
  }

  return chips;
}

export function removeChipFromFilters(
  filters: GenericListFilters,
  chipId: string,
): GenericListFilters {
  const [group, value] = chipId.split(':');

  if (group === 'category') {
    return {
      ...filters,
      category_ids: filters.category_ids.filter((categoryId) => categoryId !== value),
    };
  }

  if (group === 'price') {
    return {
      ...filters,
      price_tiers: null,
    };
  }

  if (group === 'address') {
    return {
      ...filters,
      address_id: null,
    };
  }

  if (group === 'stock') {
    return {
      ...filters,
      stock: null,
    };
  }

  if (group === 'sort') {
    return {
      ...filters,
      sort_by: null,
    };
  }

  return filters;
}

export function hasActiveFilters(filters: GenericListFilters) {
  return (
    filters.category_ids.length > 0 ||
    Boolean(filters.price_tiers) ||
    Boolean(filters.address_id) ||
    Boolean(filters.stock) ||
    Boolean(filters.sort_by)
  );
}
