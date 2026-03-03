import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../../../../general/components/Header';
import Text from '../../../../general/components/Text';
import Button from '../../../../general/components/Button';
import { useTheme } from '../../../../general/theme/theme';
import { useTranslation } from 'react-i18next';

type RideSharingStackParamList = {
  RideSharingHome: undefined;
  RideDetails: undefined;
  DriverProfile: undefined;
};

type NavigationProp = NativeStackNavigationProp<RideSharingStackParamList, 'RideSharingHome'>;

export default function RideSharingHomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('header_title')} subtitle={t('header_subtitle')} />
      <Text>{t('home_body')}</Text>
      <Button
        label={t('driver_profile_button')}
        onPress={() => navigation.navigate('DriverProfile')}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  button: {
    marginTop: 8,
  },
});

