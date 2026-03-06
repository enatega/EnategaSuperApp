import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../general/theme/theme';
import CachedAddressList from '../../components/rideOptions/CachedAddressList';
import { CachedAddress } from '../../components/rideOptions/types';
import { cachedAddresses as cachedAddressesFixture } from '../../components/rideOptions/cachedAddresses';
import RideAddressSearchHeader from './components/RideAddressSearchHeader';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Icon from '../../../../general/components/Icon';

export default function RideAddressSearchScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');

  const cachedAddresses = useMemo<CachedAddress[]>(
    () => cachedAddressesFixture,
    [],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <ScreenHeader
          title={t('ride_address_title')}
          leftSlot={(
            <Pressable
              onPress={() => navigation.goBack()}
              style={[
                styles.iconButton,
                { backgroundColor: colors.surfaceSoft, shadowColor: colors.shadowColor },
              ]}
              accessibilityRole="button"
              accessibilityLabel={t('ride_address_close')}
            >
              <Icon type="Feather" name="x" size={18} color={colors.text} />
            </Pressable>
          )}
        />
        <CachedAddressList
          data={cachedAddresses}
          ListHeaderComponent={(
            <RideAddressSearchHeader
              fromValue={fromValue}
              toValue={toValue}
              onChangeFrom={setFromValue}
              onChangeTo={setToValue}
              fromPlaceholder={t('ride_address_from_placeholder')}
              toPlaceholder={t('ride_address_to_placeholder')}
              chooseOnMapLabel={t('ride_address_choose_on_map')}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});
