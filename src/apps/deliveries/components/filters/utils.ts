import type {
  AddressFilterOption,
  FilterOption,
  GenericFilterChip,
  GenericListFilterGroup,
  GenericListFilters,
} from './types';

export const EMPTY_FILTERS: GenericListFilters = {
  categoryIds: [],
  priceId: null,
  addressId: null,
  sortId: null,
};

export function buildQueryFilterPayload(filters: GenericListFilters) {
  return {
    categoryIds: filters.categoryIds,
    priceId: filters.priceId,
    addressId: filters.addressId,
    sortId: filters.sortId,
  };
}

export function createGenericListFilters(
  initialFilters?: Partial<GenericListFilters>,
): GenericListFilters {
  return {
    categoryIds: initialFilters?.categoryIds ?? EMPTY_FILTERS.categoryIds,
    priceId: initialFilters?.priceId ?? EMPTY_FILTERS.priceId,
    addressId: initialFilters?.addressId ?? EMPTY_FILTERS.addressId,
    sortId: initialFilters?.sortId ?? EMPTY_FILTERS.sortId,
  };
}

function findOptionLabel(options: FilterOption[] | undefined, id: string | null) {
  if (!options || !id) return null;
  return options.find((option) => option.id === id)?.label ?? null;
}

function findAddressLabel(options: AddressFilterOption[] | undefined, id: string | null) {
  if (!options || !id) return null;
  return options.find((option) => option.id === id)?.label ?? null;
}

export function buildFilterChips(
  filters: GenericListFilters,
  options?: GenericListFilterGroup,
): GenericFilterChip[] {
  const chips: GenericFilterChip[] = [];

  filters.categoryIds.forEach((categoryId) => {
    const label = findOptionLabel(options?.categoryOptions, categoryId);

    if (label) {
      chips.push({
        id: `category:${categoryId}`,
        label,
      });
    }
  });

  const priceLabel = findOptionLabel(options?.priceOptions, filters.priceId);
  if (priceLabel) {
    chips.push({
      id: `price:${filters.priceId}`,
      label: priceLabel,
    });
  }

  const addressLabel = findAddressLabel(options?.addressOptions, filters.addressId);
  if (addressLabel) {
    chips.push({
      id: `address:${filters.addressId}`,
      label: addressLabel,
    });
  }

  const sortLabel = findOptionLabel(options?.sortOptions, filters.sortId);
  if (sortLabel) {
    chips.push({
      id: `sort:${filters.sortId}`,
      label: sortLabel,
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
      categoryIds: filters.categoryIds.filter((categoryId) => categoryId !== value),
    };
  }

  if (group === 'price') {
    return {
      ...filters,
      priceId: null,
    };
  }

  if (group === 'address') {
    return {
      ...filters,
      addressId: null,
    };
  }

  if (group === 'sort') {
    return {
      ...filters,
      sortId: null,
    };
  }

  return filters;
}

export function hasActiveFilters(filters: GenericListFilters) {
  return (
    filters.categoryIds.length > 0 ||
    Boolean(filters.priceId) ||
    Boolean(filters.addressId) ||
    Boolean(filters.sortId)
  );
}
