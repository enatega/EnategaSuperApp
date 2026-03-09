import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import RideEstimateAddressSummaryCard from './components/RideEstimateAddressSummaryCard';
import RideEstimateBottomSheet from './components/RideEstimateBottomSheet';
import RideEstimateMapLayer from './components/RideEstimateMapLayer';
import { useTheme } from '../../../../general/theme/theme';
import type {
  RideAddressSelection,
  RideTypeFare,
} from '../../api/types';
import type { RideOptionItem } from '../../components/rideOptions/types';
import useRideEstimateOptions from '../../hooks/useRideEstimateOptions';
import useRideRoutePath from '../../hooks/useRideRoutePath';
import { rideEstimateIcons } from './rideEstimateAssets';

type RouteParams = {
  rideType?: string;
  rideCategory?: RideOptionItem['id'];
  fromAddress: RideAddressSelection;
  toAddress: RideAddressSelection;
};

function resolveRideIcon(name: string) {
  if (/comfort/i.test(name)) return rideEstimateIcons.comfort;
  if (/premium/i.test(name)) return rideEstimateIcons.premiumSedan;
  if (/motorcycle|bike|wheel/i.test(name)) return rideEstimateIcons.motorcycle;
  if (/courier/i.test(name)) return rideEstimateIcons.courier;
  if (/women/i.test(name)) return rideEstimateIcons.women;
  if (/premium/i.test(name)) return rideEstimateIcons.premium;
  return rideEstimateIcons.ride;
}

function toRideOption(ride: RideTypeFare): RideOptionItem & { fare?: number; recommendedFare?: number } {
  return {
    id: (ride.ride_type_id ?? ride.name) as RideOptionItem['id'],
    title: ride.name.replace(/_/g, ' '),
    icon: resolveRideIcon(ride.name),
    seats: ride.capacity ?? (/courier/i.test(ride.name) ? undefined : 4),
    fare: ride.fare,
    recommendedFare: ride.recommendedFare,
  };
}

export default function RideEstimateScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const {
    fromAddress,
    toAddress,
    rideCategory,
  } = route.params as RouteParams;

  const quoteQuery = useRideEstimateOptions(fromAddress, toAddress);
  const routeQuery = useRideRoutePath(fromAddress, toAddress);
  const mappedOptions = useMemo(
    () => (quoteQuery.data?.rideTypeFares ?? []).map(toRideOption),
    [quoteQuery.data?.rideTypeFares],
  );
  const [selectedOptionId, setSelectedOptionId] = useState<RideOptionItem['id']>(
    rideCategory ?? (mappedOptions[0]?.id ?? 'ride'),
  );

  const options = mappedOptions.length
    ? mappedOptions
    : [
        {
          id: 'ride',
          title: t('ride_option_now_title'),
          icon: rideEstimateIcons.ride,
          seats: 4,
        },
      ];

  const resolvedSelectedOptionId = options.some((item) => item.id === selectedOptionId)
    ? selectedOptionId
    : options[0].id;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <RideEstimateMapLayer
        fromAddress={fromAddress}
        toAddress={toAddress}
        routeCoordinates={routeQuery.data ?? []}
        onBackPress={() => navigation.goBack()}
      />
      <RideEstimateAddressSummaryCard
        fromAddress={fromAddress}
        toAddress={toAddress}
      />
      <RideEstimateBottomSheet
        options={options}
        selectedOptionId={resolvedSelectedOptionId}
        onSelectOption={setSelectedOptionId}
        onConfirmRide={() => navigation.navigate('RideDetails' as never)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
