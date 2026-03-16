import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';

type Props = {
  description: string;
  onPress: () => void;
  isRecent?: boolean;
};

function AddressSuggestionItem({ description, onPress, isRecent = false }: Props) {
  const { colors } = useTheme();

  const parts = description.split(',');
  const mainText = parts[0]?.trim() ?? description;
  const secondaryText = parts.slice(1).join(',').trim() || undefined;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={description}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: pressed ? colors.backgroundTertiary : 'transparent' },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: colors.backgroundTertiary }]}>
        <Icon
          type="Ionicons"
          name={isRecent ? 'time-outline' : 'location-outline'}
          size={18}
          color={colors.iconMuted}
        />
      </View>
      <View style={styles.textWrap}>
        <Text weight="medium" numberOfLines={1} style={styles.mainText}>
          {mainText}
        </Text>
        {secondaryText ? (
          <Text variant="caption" color={colors.mutedText} numberOfLines={1}>
            {secondaryText}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export default memo(AddressSuggestionItem);

const styles = StyleSheet.create({
  iconCircle: {
    alignItems: 'center',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  mainText: {
    fontSize: 14,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
});
