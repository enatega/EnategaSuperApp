import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import Text from '../../../../general/components/Text';

type Props = {
  tags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
};

export default function RatingTagList({ tags, selected, onToggle }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      {tags.map((tag) => {
        const isSelected = selected.includes(tag);
        return (
          <Pressable
            key={tag}
            onPress={() => onToggle(tag)}
            accessibilityRole="button"
            accessibilityLabel={tag}
            style={[
              styles.tag,
              {
                borderColor: isSelected ? colors.primary : colors.border,
                backgroundColor: isSelected ? colors.primary : colors.surface,
              },
            ]}
          >
            <Text
              variant="caption"
              weight="medium"
              color={isSelected ? colors.white : colors.text}
            >
              {tag}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
});
