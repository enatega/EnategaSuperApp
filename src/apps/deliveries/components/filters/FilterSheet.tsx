import React from 'react';
import { useTranslation } from 'react-i18next';
import MainFilterSheet from '../../../../general/components/filters/MainFilterSheet';
import type {
  GenericListFilterData,
  GenericListFilters,
} from './types';

type Props = {
  visible: boolean;
  title: string;
  applyLabel: string;
  closeLabel: string;
  filters?: GenericListFilterData;
  draftFilters: GenericListFilters;
  isApplyDisabled?: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  onToggleCategory: (categoryId: string) => void;
  onSelectPrice: (priceId: string) => void;
  onSelectAddress: (addressId: string) => void;
  onSelectStock: (stockId: string) => void;
  onSelectSort: (sortId: string) => void;
};

export default function FilterSheet(props: Props) {
  const { t } = useTranslation('deliveries');

  return (
    <MainFilterSheet
      visible={props.visible}
      title={props.title}
      applyLabel={props.applyLabel}
      closeLabel={props.closeLabel}
      sectionTitles={{
        category: t('filter_category_title'),
        price: t('filter_price_title'),
        address: t('filter_address_title'),
        stock: t('filter_stock_title'),
        sort: t('filter_sort_title'),
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
