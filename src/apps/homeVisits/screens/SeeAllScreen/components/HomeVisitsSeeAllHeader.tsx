import React from 'react';
import SeeAllHeader from '../../../../../general/screens/SeeAllScreen/components/SeeAllHeader';
import HomeVisitsSearchInput from '../../../components/search/HomeVisitsSearchInput';
import type { GenericListHeaderRenderProps } from '../../../../../general/components/filterablePaginatedList';

type Props = Omit<GenericListHeaderRenderProps, 'renderSearchInput'>;

export default function HomeVisitsSeeAllHeader(props: Props) {
  return (
    <SeeAllHeader
      {...props}
      renderSearchInput={({ value, onChangeText, placeholder }) => (
        <HomeVisitsSearchInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
        />
      )}
    />
  );
}
