import React from 'react';
import { FlashList, FlashListProps } from '@shopify/flash-list';

type VerticalListComponent = <T>(
  props: FlashListProps<T> & { ref?: React.Ref<any> },
) => React.ReactElement;

const VerticalList = React.forwardRef(function VerticalListInner(
  props: FlashListProps<any>,
  ref: React.ForwardedRef<any>,
) {
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
      ref={ref}
      showsVerticalScrollIndicator={false}
    />
  );
}) as VerticalListComponent;

export default VerticalList;
