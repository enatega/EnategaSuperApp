import React from 'react';
import { FlashList, FlashListProps } from '@shopify/flash-list';

export default function VerticalList<T>(props: FlashListProps<T>) {
  return (
    <FlashList
      {...props}
      showsVerticalScrollIndicator={false}
    />
  );
}
