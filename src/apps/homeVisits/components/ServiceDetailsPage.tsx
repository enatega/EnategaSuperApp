import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { DiscoverySectionState } from '../../../general/components/discovery';
import ScreenHeader from '../../../general/components/ScreenHeader';
import { useTheme } from '../../../general/theme/theme';
import ServiceDetailsContent from './ServiceDetails/ServiceDetailsContent';
import ServiceDetailsSkeleton from './ServiceDetails/ServiceDetailsSkeleton';
import useServiceDetailsBookingScreen from '../singleVendor/hooks/useServiceDetailsBookingScreen';
import type { HomeVisitsSingleVendorNavigationParamList } from '../singleVendor/navigation/types';

type ServiceDetailsRouteProp = RouteProp<
  HomeVisitsSingleVendorNavigationParamList,
  'ServiceDetailsPage'
>;

export default function ServiceDetailsPage() {
  const { colors } = useTheme();
  const { t } = useTranslation('homeVisits');
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeVisitsSingleVendorNavigationParamList>>();
  const route = useRoute<ServiceDetailsRouteProp>();
  const { serviceId } = route.params;
  const query = useServiceDetailsBookingScreen(serviceId);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleBookService = useCallback(() => {
    // Booking flow will be added in a follow-up.
  }, []);

  if (query.isPending) {
    return <ServiceDetailsSkeleton />;
  }

  if (query.isError || !query.data) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScreenHeader
          title={t('details_title')}
          rightSlot={
            <Pressable
              accessibilityLabel="Close"
              accessibilityRole="button"
              onPress={handleGoBack}
              style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
            >
              <View
                style={[
                  styles.iconButton,
                  {
                    backgroundColor: colors.backgroundTertiary,
                  },
                ]}
              >
                <Ionicons name="close" size={20} color={colors.text} />
              </View>
            </Pressable>
          }
        />

        <View style={styles.errorWrap}>
          <DiscoverySectionState
            tone="error"
            title={t('single_vendor_home_section_error_title')}
            message={t('single_vendor_home_section_error_message')}
          />
        </View>
      </View>
    );
  }

  return (
    <ServiceDetailsContent
      data={query.data}
      onBack={handleGoBack}
      onBookService={handleBookService}
      onClose={handleGoBack}
    />
  );
}

const styles = StyleSheet.create({
  errorWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  screen: {
    flex: 1,
  },
});
