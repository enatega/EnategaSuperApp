import React, { memo } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import Text from '../../../../general/components/Text';
import Icon from '../../../../general/components/Icon';
import { CachedAddress } from './types';

type Props = {
  item: CachedAddress;
  onPress?: (item: CachedAddress) => void;
  containerStyle?: StyleProp<ViewStyle>;
};

function CachedAddressRow({ item, onPress, containerStyle }: Props) {
  const { colors, typography } = useTheme();
  const title = item.structuredFormatting.mainText;
  const subtitle = item.structuredFormatting.secondaryText ?? item.description;

  return (
    <Pressable
      style={[
        styles.locationRow,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadowColor,
        },
        containerStyle,
      ]}
      onPress={() => onPress?.(item)}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.surfaceSoft }]}>
        <Icon type="Feather" name="map-pin" size={15} color={colors.primary} />
      </View>
      <View style={styles.textWrap}>
        <Text numberOfLines={1} weight="semiBold" style={{ fontSize: typography.size.sm2, color: colors.text }}>
          {title}
        </Text>
        <Text numberOfLines={1} style={{ fontSize: typography.size.xxs, color: colors.mutedText }}>
          {subtitle}
        </Text>
      </View>
      <Icon type="Feather" name="chevron-right" size={15} color={colors.iconMuted} />
    </Pressable>
  );
}

export default memo(CachedAddressRow);

const styles = StyleSheet.create({
  locationRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
});
