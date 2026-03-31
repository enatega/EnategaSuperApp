import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  title: string;
  fromAddress: string;
  toAddress: string;
};

function OfferFareTripSummary({
  title,
  fromAddress,
  toAddress,
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text weight="medium" color={colors.mutedText} style={styles.title}>
        {title}
      </Text>

      <View style={styles.row}>
        <View style={[styles.dot, { borderColor: colors.success }]} />
        <Text style={styles.address}>{fromAddress}</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.dot, { borderColor: colors.danger }]} />
        <Text style={styles.address}>{toAddress}</Text>
      </View>
    </View>
  );
}

export default memo(OfferFareTripSummary);

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 14,
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 4,
  },
  address: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
});
