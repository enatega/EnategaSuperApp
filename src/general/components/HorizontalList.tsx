import React from 'react';
import { FlashList, FlashListProps } from '@shopify/flash-list';

export default function HorizontalList<T>(props: FlashListProps<T>) {
  return (
    <FlashList
      {...props}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
}
