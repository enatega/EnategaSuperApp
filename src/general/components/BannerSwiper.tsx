import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { useTheme } from '../theme/theme';

type Props<T> = {
  data: T[];
  renderItem: ({ item, index }: { item: T; index: number }) => React.ReactElement;
  style?: StyleProp<ViewStyle>;
  onIndexChange?: (index: number) => void;
  showPagination?: boolean;
};

export default function BannerSwiper<T>({
  data,
  renderItem,
  style,
  onIndexChange,
  showPagination = false,
}: Props<T>) {
  const { colors } = useTheme();

  return (
    <SwiperFlatList
      data={data}
      renderItem={renderItem}
      showPagination={showPagination}
      paginationDefaultColor={colors.border}
      paginationActiveColor={colors.mutedText}
      paginationStyle={{ marginTop: 8 }}
      style={style}
      onChangeIndex={({ index }) => onIndexChange?.(index)}
    />
  );
}
