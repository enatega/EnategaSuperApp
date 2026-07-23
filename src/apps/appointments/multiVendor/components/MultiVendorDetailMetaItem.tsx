import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
};

export default function MultiVendorDetailMetaItem({
  icon,
  label,
  value,
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.metaItem}>
      <View style={[styles.metaIconWrap, { backgroundColor: colors.blue50 }]}>
        <MaterialCommunityIcons color={colors.primary} name={icon} size={16} />
      </View>
      <View style={styles.metaCopy}>
        <Text color={colors.mutedText} style={styles.metaLabel}>
          {label}
        </Text>
        <Text weight="semiBold" style={styles.metaValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  metaCopy: {
    flex: 1,
    gap: 2,
  },
  metaIconWrap: {
    alignItems: 'center',
    borderRadius: 12,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  metaLabel: {
    fontSize: 12,
    lineHeight: 16,
  },
  metaValue: {
    fontSize: 14,
    lineHeight: 18,
  },
});
