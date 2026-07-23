import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../general/components/Header';
import Text from '../../../general/components/Text';
import { useTheme } from '../../../general/theme/theme';
import { useTranslation } from 'react-i18next';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppointmentsFloatingCartButton from '../components/cart/AppointmentsFloatingCartButton';
import { useAppointmentCart } from '../hooks/useAppointmentCart';
import type { AppointmentsStackParamList } from '../navigation/types';

export default function AppointmentsHomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('appointments');
  const navigation = useNavigation<NativeStackNavigationProp<AppointmentsStackParamList>>();
  const { storeId, storeTitle } = useAppointmentCart();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Header title={t('header_title')} subtitle={t('header_subtitle')} />
        <View style={styles.content}>
          <Text>{t('home_body')}</Text>
        </View>
      </SafeAreaView>

      <AppointmentsFloatingCartButton
        onPress={() => {
          if (!storeId) {
            return;
          }

          navigation.navigate('MultiVendor', {
            screen: 'AppointmentCart',
            params: {
              storeId,
              title: storeTitle ?? '',
            },
          });
        }}
        style={styles.cartButton}
      />
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cartButton: {
    bottom: 24,
    elevation: 12,
    position: 'absolute',
    right: 20,
    zIndex: 30,
  },
});
