import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../../general/theme/theme';
import Icon from '../../../../../general/components/Icon';
import Text from '../../../../../general/components/Text';

type Props = {
  title: string;
  description: string;
};

function RideAddressEmptyState({ title, description }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: colors.blue50 }]}>
        <Icon type="Feather" name="map-pin" size={18} color={colors.blue800} />
      </View>
      <Text weight="semiBold" style={styles.title}>
        {title}
      </Text>
      <Text style={[styles.description, { color: colors.mutedText }]}>
        {description}
      </Text>
    </View>
  );
}

export default memo(RideAddressEmptyState);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
  },
  description: {
    textAlign: 'center',
  },
});
