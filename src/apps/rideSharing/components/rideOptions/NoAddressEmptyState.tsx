import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

const noLocationIllustration = require('../../assets/images/no-location.png');

export default function NoAddressEmptyState() {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');

  return (
    <View style={styles.container}>
      <Image source={noLocationIllustration} style={styles.illustration} resizeMode="contain" />
      <Text style={[styles.message, { color: colors.text }]}>
        {t('ride_options_empty_destination')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  illustration: {
    height: 120,
    width: 120,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
    textAlign: 'center',
  },
});
