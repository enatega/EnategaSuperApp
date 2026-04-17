import React from 'react';
import { FlashList, FlashListProps } from '@shopify/flash-list';

export default function VerticalList<T>(props: FlashListProps<T>) {
  const {
    keyboardDismissMode = 'on-drag',
    keyboardShouldPersistTaps = 'handled',
    ...restProps
  } = props;

  return (
    <FlashList
      {...restProps}
      keyboardDismissMode={keyboardDismissMode}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      showsVerticalScrollIndicator={false}
    />
  );
}
