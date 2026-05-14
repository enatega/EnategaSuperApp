import React, { useEffect, useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import TabSwitcher from '../../../../general/components/TabSwitcher';
import ToBuildingForm from '../../components/courierDetails/ToBuildingForm';
import ToDoorForm from '../../components/courierDetails/ToDoorForm';
import Button from '../../../../general/components/Button';
import Footer from '../../../../general/components/Footer';
import { useTheme } from '../../../../general/theme/theme';
import { useCourierBookingStore } from '../../stores/useCourierBookingStore';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';
import { isCourierBookingValid } from '../../utils/courierBooking';
import { splitAddressDescription } from '../../utils/rideAddress';

const TABS = [
  { key: 'building', label: 'To building' },
  { key: 'door', label: 'To door' },
];

export default function CourierDetails() {
  const navigation = useNavigation<NativeStackNavigationProp<RideSharingStackParamList>>();
  const route = useRoute();
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const activeTab = useCourierBookingStore((state) => state.activeTab);
  const toBuilding = useCourierBookingStore((state) => state.toBuilding);
  const toDoor = useCourierBookingStore((state) => state.toDoor);
  const setActiveTab = useCourierBookingStore((state) => state.setActiveTab);
  const setToDoorField = useCourierBookingStore((state) => state.setToDoorField);
  const scrollRef = useRef<ScrollView>(null);
  const params = (route.params as RideSharingStackParamList['CourierDetails'] | undefined);
  const isFormValid = isCourierBookingValid({
    activeTab,
    toBuilding,
    toDoor,
  });

  useEffect(() => {
    if (!params?.fromAddress?.description || !params?.toAddress?.description) {
      return;
    }

    const pickupAddress = splitAddressDescription(params.fromAddress.description);
    const deliveryAddress = splitAddressDescription(params.toAddress.description);
    const nextDoorFields: Partial<typeof toDoor> = {};

    if (!toDoor.pickupStreet.trim()) {
      nextDoorFields.pickupStreet = pickupAddress.mainText;
    }
    if (!toDoor.pickupDetails.trim() && pickupAddress.secondaryText) {
      nextDoorFields.pickupDetails = pickupAddress.secondaryText;
    }
    if (!toDoor.deliveryStreet.trim()) {
      nextDoorFields.deliveryStreet = deliveryAddress.mainText;
    }
    if (!toDoor.deliveryDetails.trim() && deliveryAddress.secondaryText) {
      nextDoorFields.deliveryDetails = deliveryAddress.secondaryText;
    }

    if (Object.keys(nextDoorFields).length > 0) {
      setToDoorField(nextDoorFields);
    }
  }, [
    params?.fromAddress?.description,
    params?.toAddress?.description,
    setToDoorField,
    toDoor.deliveryDetails,
    toDoor.deliveryStreet,
    toDoor.pickupDetails,
    toDoor.pickupStreet,
  ]);

  const handleNext = () => {
    if (!isFormValid || !params?.fromAddress || !params?.toAddress) {
      return;
    }

    navigation.navigate('RideEstimate', {
      rideType: params.rideType,
      rideCategory: params.rideCategory,
      fromAddress: params.fromAddress,
      toAddress: params.toAddress,
      stops: params.stops,
      offeredFare: params.offeredFare,
      paymentMethodId: params.paymentMethodId,
      offerMode: params.offerMode,
      hourlyHours: params.hourlyHours,
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader title={t('ride_courier_details_title')} variant="close" />
      <TabSwitcher
        tabs={TABS}
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key as 'building' | 'door');
        }}
        style={styles.tabs}
      />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {activeTab === 'building'
          ? <ToBuildingForm
              onCommentsFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300)}
            />
          : <ToDoorForm
              onCommentsFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300)}
            />}
      </ScrollView>
      <Footer>
        <Button
          label={t('ride_offer_fare_next')}
          onPress={handleNext}
          variant={isFormValid ? 'primary' : 'secondary'}
          disabled={!isFormValid}
        />
      </Footer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  content: {
    padding: 16,
    gap: 16,
  },
});
