import React from 'react';
import { useTranslation } from 'react-i18next';
import { DiscoveryCategorySection } from '../../../components/discovery';
import useChainMenuCategories from '../../hooks/useChainMenuCategories';

type Props = {
  isTemplatePending?: boolean;
  menuTemplateId?: string | null;
};

export default function ChainCategorySection({
  isTemplatePending = false,
  menuTemplateId,
}: Props) {
  const { t } = useTranslation('deliveries');
  const { data = [], isPending } = useChainMenuCategories({
    menuTemplateId,
  });

  return (
    <DiscoveryCategorySection
      items={data}
      isPending={isPending || isTemplatePending}
      title={t('chain_categories_title')}
    />
  );
}
