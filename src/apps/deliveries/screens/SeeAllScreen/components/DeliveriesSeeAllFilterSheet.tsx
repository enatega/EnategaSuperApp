import React from 'react';
import { useTranslation } from 'react-i18next';
import MainFilterSheet from '../../../../../general/components/filters/MainFilterSheet';
import type {
  GenericListFilterData,
  GenericListFilterSheetRenderProps,
} from '../../../components/filters';

type Props = GenericListFilterSheetRenderProps & {
  filters?: GenericListFilterData;
};

export default function DeliveriesSeeAllFilterSheet(props: Props) {
  const { t } = useTranslation('general');
  const { t: tDeliveries } = useTranslation('deliveries');

  return (
    <MainFilterSheet
      visible={props.visible}
      title={t('filter_title')}
      applyLabel={t('filter_apply_results')}
      closeLabel={t('filter_close_label')}
      sectionTitles={{
        category: tDeliveries('filter_category_title'),
        price: tDeliveries('filter_price_title'),
        address: tDeliveries('filter_address_title'),
        stock: tDeliveries('filter_stock_title'),
        sort: tDeliveries('filter_sort_title'),
      }}
      isStockVisible={false}
      filters={props.filters}
      draftFilters={props.draftFilters}
      isApplyDisabled={props.isApplyDisabled}
      onClose={props.onClose}
      onApply={props.onApply}
      onClear={props.onClear}
      onToggleCategory={props.onToggleCategory}
      onSelectPrice={props.onSelectPrice}
      onSelectAddress={props.onSelectAddress}
      onSelectStock={props.onSelectStock}
      onSelectSort={props.onSelectSort}
    />
  );
}
