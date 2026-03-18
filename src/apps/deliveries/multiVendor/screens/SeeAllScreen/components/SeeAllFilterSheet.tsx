import React from 'react';
import { useTranslation } from 'react-i18next';
import FilterSheet from '../../../../components/filters/FilterSheet';
import type { GenericListFilterSheetRenderProps } from '../../../../components/filters';
import { getSeeAllFilterOptions } from './seeAllFilterOptions';

export default function SeeAllFilterSheet(props: GenericListFilterSheetRenderProps) {
  const { t } = useTranslation('deliveries');

  return (
    <FilterSheet
      visible={props.visible}
      title={t('filter_title')}
      applyLabel={t('filter_apply_results')}
      closeLabel={t('filter_close_label')}
      resultCount={props.resultCount}
      filters={getSeeAllFilterOptions(t)}
      draftFilters={props.draftFilters}
      isApplyDisabled={props.isApplyDisabled}
      onClose={props.onClose}
      onApply={props.onApply}
      onClear={props.onClear}
      onToggleCategory={props.onToggleCategory}
      onSelectPrice={props.onSelectPrice}
      onSelectAddress={props.onSelectAddress}
      onSelectSort={props.onSelectSort}
      clearAllLabel={props.clearAllLabel}
    />
  );
}
