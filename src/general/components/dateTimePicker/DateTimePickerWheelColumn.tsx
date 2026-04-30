import React, { memo, useEffect, useRef } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
} from 'react-native';
import Text from '../Text';
import { useTheme } from '../../theme/theme';
import {
  DATE_TIME_PICKER_ROW_HEIGHT,
  DATE_TIME_PICKER_VISIBLE_ROWS,
  type DateTimePickerOption,
} from '../../utils/dateTimePicker';

type Props<TValue extends string | number> = {
  options: DateTimePickerOption<TValue>[];
  selectedIndex: number;
  onChange: (index: number) => void;
  width: number;
  align?: 'left' | 'center' | 'right';
};

function DateTimePickerWheelColumn<TValue extends string | number>({
  align = 'center',
  onChange,
  options,
  selectedIndex,
  width,
}: Props<TValue>) {
  const listRef = useRef<FlatList<DateTimePickerOption<TValue>>>(null);
  const { colors, typography } = useTheme();

  useEffect(() => {
    listRef.current?.scrollToOffset({
      offset: selectedIndex * DATE_TIME_PICKER_ROW_HEIGHT,
      animated: false,
    });
  }, [selectedIndex]);

  const handleScrollEnd = (offsetY: number) => {
    const nextIndex = Math.max(
      0,
      Math.min(options.length - 1, Math.round(offsetY / DATE_TIME_PICKER_ROW_HEIGHT)),
    );

    if (nextIndex !== selectedIndex) {
      onChange(nextIndex);
      return;
    }

    listRef.current?.scrollToOffset({
      offset: nextIndex * DATE_TIME_PICKER_ROW_HEIGHT,
      animated: true,
    });
  };

  const renderItem = ({ item, index }: ListRenderItemInfo<DateTimePickerOption<TValue>>) => {
    const isSelected = index === selectedIndex;

    return (
      <Pressable
        onPress={() => onChange(index)}
        style={[styles.row, { width }]}
      >
        <Text
          weight={isSelected ? 'medium' : 'regular'}
          color={isSelected ? colors.text : colors.mutedText}
          style={[
            styles.label,
            {
              width,
              textAlign: align,
              fontSize: typography.size.lg,
              lineHeight: typography.lineHeight.lg2,
            },
          ]}
        >
          {item.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <FlatList
      ref={listRef}
      bounces={false}
      contentContainerStyle={styles.content}
      data={options}
      decelerationRate="fast"
      getItemLayout={(_, index) => ({
        length: DATE_TIME_PICKER_ROW_HEIGHT,
        offset: DATE_TIME_PICKER_ROW_HEIGHT * index,
        index,
      })}
      keyExtractor={(item, index) => `${item.value}-${index}`}
      onMomentumScrollEnd={(event) => handleScrollEnd(event.nativeEvent.contentOffset.y)}
      onScrollEndDrag={(event) => handleScrollEnd(event.nativeEvent.contentOffset.y)}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      snapToInterval={DATE_TIME_PICKER_ROW_HEIGHT}
      style={styles.list}
    />
  );
}

export default memo(DateTimePickerWheelColumn) as typeof DateTimePickerWheelColumn;

const styles = StyleSheet.create({
  content: {
    paddingVertical: DATE_TIME_PICKER_ROW_HEIGHT * 2,
  },
  label: {
    paddingHorizontal: 4,
  },
  list: {
    height: DATE_TIME_PICKER_ROW_HEIGHT * DATE_TIME_PICKER_VISIBLE_ROWS,
  },
  row: {
    height: DATE_TIME_PICKER_ROW_HEIGHT,
    justifyContent: 'center',
  },
});
