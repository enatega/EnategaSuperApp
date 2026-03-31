import React, { memo, useEffect, useRef } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
} from 'react-native';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import {
  SCHEDULE_ROW_HEIGHT,
  SCHEDULE_VISIBLE_ROWS,
  type ScheduleWheelOption,
} from '../../../utils/rideSchedule';

type Props<TValue extends string | number> = {
  options: ScheduleWheelOption<TValue>[];
  selectedIndex: number;
  onChange: (index: number) => void;
  width: number;
  align?: 'left' | 'center' | 'right';
};

function RideScheduleWheelColumn<TValue extends string | number>({
  options,
  selectedIndex,
  onChange,
  width,
  align = 'center',
}: Props<TValue>) {
  const listRef = useRef<FlatList<ScheduleWheelOption<TValue>>>(null);
  const { colors, typography } = useTheme();

  useEffect(() => {
    listRef.current?.scrollToOffset({
      offset: selectedIndex * SCHEDULE_ROW_HEIGHT,
      animated: false,
    });
  }, [selectedIndex]);

  const handleScrollEnd = (offsetY: number) => {
    const nextIndex = Math.max(
      0,
      Math.min(options.length - 1, Math.round(offsetY / SCHEDULE_ROW_HEIGHT)),
    );

    if (nextIndex !== selectedIndex) {
      onChange(nextIndex);
      return;
    }

    listRef.current?.scrollToOffset({
      offset: nextIndex * SCHEDULE_ROW_HEIGHT,
      animated: true,
    });
  };

  const renderItem = ({ item, index }: ListRenderItemInfo<ScheduleWheelOption<TValue>>) => {
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
      data={options}
      keyExtractor={(item, index) => `${item.value}-${index}`}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      bounces={false}
      snapToInterval={SCHEDULE_ROW_HEIGHT}
      decelerationRate="fast"
      style={styles.list}
      contentContainerStyle={styles.content}
      getItemLayout={(_, index) => ({
        length: SCHEDULE_ROW_HEIGHT,
        offset: SCHEDULE_ROW_HEIGHT * index,
        index,
      })}
      onMomentumScrollEnd={(event) => handleScrollEnd(event.nativeEvent.contentOffset.y)}
      onScrollEndDrag={(event) => handleScrollEnd(event.nativeEvent.contentOffset.y)}
    />
  );
}

export default memo(RideScheduleWheelColumn) as typeof RideScheduleWheelColumn;

const styles = StyleSheet.create({
  list: {
    height: SCHEDULE_ROW_HEIGHT * SCHEDULE_VISIBLE_ROWS,
  },
  content: {
    paddingVertical: SCHEDULE_ROW_HEIGHT * 2,
  },
  row: {
    height: SCHEDULE_ROW_HEIGHT,
    justifyContent: 'center',
  },
  label: {
    paddingHorizontal: 4,
  },
});
