import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import Text from '../../../../general/components/Text';
import Icon from '../../../../general/components/Icon';
import { RecentLocation } from './types';

type Props = {
  item: RecentLocation;
};

function RecentLocationRow({ item }: Props) {
  const { colors, typography } = useTheme();

  return (
    <Pressable style={styles.locationRow}>
      <Icon type="Feather" name="map-pin" size={16} color={colors.text} />
      <View>
        <Text weight="medium" style={{ fontSize: typography.size.sm2 }}>
          {item.title}
        </Text>
        <Text style={{ fontSize: typography.size.xxs, color: colors.mutedText }}>
          {item.subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

export default memo(RecentLocationRow);

const styles = StyleSheet.create({
  locationRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
});
