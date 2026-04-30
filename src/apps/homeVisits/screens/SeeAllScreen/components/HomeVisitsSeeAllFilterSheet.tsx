import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import MainFilterSheet from '../../../../../general/components/filters/MainFilterSheet';
import type {
  MainListFilterData,
  MainListFilters,
} from '../../../../../general/components/filters';
import type {
  HomeVisitsSeeAllFilters,
  HomeVisitsSeeAllSortBy,
  HomeVisitsSeeAllStock,
} from '../../../components/filters/types';

type Props = {
  visible: boolean;
  filters: HomeVisitsSeeAllFilters;
  isApplyDisabled?: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  onSelectStock: (value: HomeVisitsSeeAllStock) => void;
  onSelectPriceTiers: (value: string | null) => void;
  onSelectSortBy: (value: HomeVisitsSeeAllSortBy) => void;
};

const ANY_PRICE_VALUE = '__any_price__';

export default function HomeVisitsSeeAllFilterSheet({
  visible,
  filters,
  isApplyDisabled,
  onClose,
  onApply,
  onClear,
  onSelectStock,
  onSelectPriceTiers,
  onSelectSortBy,
}: Props) {
  const { t } = useTranslation('general');
  const { t: tHomeVisits } = useTranslation('homeVisits');

  const filterData = useMemo<MainListFilterData>(
    () => ({
      categories: [],
      addresses: [],
      priceTiers: [
        { value: ANY_PRICE_VALUE, label: tHomeVisits('home_visits_filter_any_price') },
        { value: '$', label: '$' },
        { value: '$$', label: '$$' },
        { value: '$$$', label: '$$$' },
      ],
      stock: [
        {
          value: 'all',
          label: tHomeVisits('home_visits_filter_stock_all'),
        },
        {
          value: 'in_stock',
          label: tHomeVisits('home_visits_filter_stock_in_stock'),
        },
      ],
      sortBy: [
        {
          value: 'recommended',
          label: tHomeVisits('home_visits_filter_sort_recommended'),
        },
        {
          value: 'delivery_time',
          label: tHomeVisits('home_visits_filter_sort_delivery_time'),
        },
        {
          value: 'price_low_to_high',
          label: tHomeVisits('home_visits_filter_sort_price_low_to_high'),
        },
        {
          value: 'name',
          label: tHomeVisits('home_visits_filter_sort_name'),
        },
        {
          value: 'rating',
          label: tHomeVisits('home_visits_filter_sort_rating'),
        },
      ],
    }),
    [tHomeVisits],
  );

  const draftFilters = useMemo<MainListFilters>(
    () => ({
      category_ids: [],
      address_id: null,
      price_tiers: filters.priceTiers ?? ANY_PRICE_VALUE,
      stock: filters.stock,
      sort_by: filters.sortBy,
    }),
    [filters.priceTiers, filters.sortBy, filters.stock],
  );

  return (
    <MainFilterSheet
      visible={visible}
      title={t('filter_title')}
      applyLabel={t('filter_apply_results')}
      closeLabel={t('filter_close_label')}
      sectionTitles={{
        stock: tHomeVisits('home_visits_filter_stock_title'),
        price: tHomeVisits('home_visits_filter_price_tiers'),
        sort: tHomeVisits('home_visits_filter_sort_by'),
      }}
      filters={filterData}
      draftFilters={draftFilters}
      isApplyDisabled={isApplyDisabled}
      onClose={onClose}
      onApply={onApply}
      onClear={onClear}
      onToggleCategory={() => {}}
      onSelectAddress={() => {}}
      onSelectPrice={(value) =>
        onSelectPriceTiers(value === ANY_PRICE_VALUE ? null : value)
      }
      onSelectStock={(value) => onSelectStock(value as HomeVisitsSeeAllStock)}
      onSelectSort={(value) => onSelectSortBy(value as HomeVisitsSeeAllSortBy)}
    />
  );
}
