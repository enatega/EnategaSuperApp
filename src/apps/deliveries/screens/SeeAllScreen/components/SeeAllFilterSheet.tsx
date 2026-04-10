import React from 'react';
import { useTranslation } from 'react-i18next';
import FilterSheet from '../../../components/filters/FilterSheet';
import type {
  GenericListFilterData,
  GenericListFilterSheetRenderProps,
} from '../../../components/filters';

type Props = GenericListFilterSheetRenderProps & {
  filters?: GenericListFilterData;
};

export default function SeeAllFilterSheet(props: Props) {
  const { t } = useTranslation('deliveries');

  return (
    <FilterSheet
      visible={props.visible}
      title={t('filter_title')}
      applyLabel={t('filter_apply_results')}
      closeLabel={t('filter_close_label')}
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
