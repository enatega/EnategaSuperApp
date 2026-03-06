import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import Text from '../../../../general/components/Text';
import Icon from '../../../../general/components/Icon';
import { CachedAddress } from './types';

type Props = {
  item: CachedAddress;
  onPress?: (item: CachedAddress) => void;
};

function CachedAddressRow({ item, onPress }: Props) {
  const { colors, typography } = useTheme();
  const title = item.structuredFormatting.mainText;
  const subtitle = item.structuredFormatting.secondaryText ?? item.description;

  return (
    <Pressable style={styles.locationRow} onPress={() => onPress?.(item)}>
      <Icon type="Feather" name="map-pin" size={16} color={colors.text} />
      <View>
        <Text weight="medium" style={{ fontSize: typography.size.sm2, color: colors.text }}>
          {title}
        </Text>
        <Text style={{ fontSize: typography.size.xxs, color: colors.mutedText }}>
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

export default memo(CachedAddressRow);

const styles = StyleSheet.create({
  locationRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
});
