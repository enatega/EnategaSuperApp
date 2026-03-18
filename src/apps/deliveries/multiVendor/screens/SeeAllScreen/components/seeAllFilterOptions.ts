import type {
  AddressFilterOption,
  FilterOption,
  GenericListFilterGroup,
} from '../../../../components/filters';

const PRICE_OPTIONS: FilterOption[] = [
  { id: '$', label: '$' },
  { id: '$$', label: '$$' },
  { id: '$$$', label: '$$$' },
  { id: '$$$$', label: '$$$$' },
];

type TranslateFn = (key: string) => string;

export function getSeeAllFilterOptions(t: TranslateFn): GenericListFilterGroup {
  return {
    categoryOptions: [
      { id: 'pizza', label: t('filter_category_pizza') },
      { id: 'burger', label: t('filter_category_burger') },
      { id: 'veg', label: t('filter_category_veg') },
      { id: 'non-veg', label: t('filter_category_non_veg') },
      { id: 'asian', label: t('filter_category_asian') },
      { id: 'arabic', label: t('filter_category_arabic') },
      { id: 'french', label: t('filter_category_french') },
      { id: 'chinese', label: t('filter_category_chinese') },
      { id: 'african', label: t('filter_category_african') },
      { id: 'ice-cream', label: t('filter_category_ice_cream') },
      { id: 'sushi', label: t('filter_category_sushi') },
      { id: 'fish', label: t('filter_category_fish') },
      { id: 'sandwich', label: t('filter_category_sandwich') },
      { id: 'pasta', label: t('filter_category_pasta') },
    ] satisfies FilterOption[],
    priceOptions: PRICE_OPTIONS,
    addressOptions: [
      {
        id: 'home',
        label: t('filter_address_home'),
        description: t('filter_address_home_description'),
        iconName: 'home-outline',
        iconType: 'Ionicons',
      },
      {
        id: 'office',
        label: t('filter_address_office'),
        description: t('filter_address_office_description'),
        iconName: 'office-building-outline',
        iconType: 'MaterialCommunityIcons',
      },
    ] satisfies AddressFilterOption[],
    sortOptions: [
      { id: 'recommended', label: t('filter_sort_recommended') },
      { id: 'delivery-price', label: t('filter_sort_delivery_price') },
      { id: 'rating', label: t('filter_sort_rating') },
      { id: 'delivery-time', label: t('filter_sort_delivery_time') },
      { id: 'distance', label: t('filter_sort_distance') },
    ] satisfies FilterOption[],
  };
}
