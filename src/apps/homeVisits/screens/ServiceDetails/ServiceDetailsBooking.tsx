import React, { useCallback, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../../../general/components/Button';
import { DiscoverySectionState } from '../../../../general/components/discovery';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import ServiceCenterServicesList from '../../components/ServiceCenterServicesList/ServiceCenterServicesList';
import ServiceDetailsSkeleton from '../../components/ServiceDetailsPage/ServiceDetailsSkeleton';
import {
  formatPrice,
  getInitialSelectionState,
  getPricingState,
  getSelectedOptions,
} from '../../components/ServiceDetailsPage/serviceDetailsSelection';
import {
  formatMinutesToDurationLabel,
  parseEstimatedDurationToMinutes,
} from '../../components/ServiceCenterServicesList/serviceDuration';
import useServiceDetailsBookingScreen from '../../singleVendor/hooks/useServiceDetailsBookingScreen';
import type { HomeVisitsSingleVendorServiceCenterListItem } from '../../singleVendor/api/types';
import type { HomeVisitsSingleVendorNavigationParamList } from '../../singleVendor/navigation/types';
import type { HomeVisitsSelectedServiceSnapshot } from '../../types/teamSchedule';

type ServiceDetailsBookingRouteProp = RouteProp<
  HomeVisitsSingleVendorNavigationParamList,
  'ServiceDetailsBooking'
>;

export default function ServiceDetailsBooking() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('homeVisits');
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeVisitsSingleVendorNavigationParamList>>();
  const route = useRoute<ServiceDetailsBookingRouteProp>();
  const { serviceId, serviceCenterId, initialSelection } = route.params;
  const query = useServiceDetailsBookingScreen(serviceId);
  const [selectedListServices, setSelectedListServices] =
    useState<HomeVisitsSingleVendorServiceCenterListItem[]>([]);
  const lockedSelectedServiceIds = useMemo(() => [serviceId], [serviceId]);
  const lockedSelectedSet = useMemo(
    () => new Set(lockedSelectedServiceIds),
    [lockedSelectedServiceIds],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleClose = useCallback(() => {
    navigation.popToTop();
  }, [navigation]);

  if (query.isPending) {
    return <ServiceDetailsSkeleton />;
  }

  if (query.isError || !query.data) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={[styles.errorWrap, { paddingTop: insets.top + 24 }]}>
          <DiscoverySectionState
            tone="error"
            title={t('single_vendor_home_section_error_title')}
            message={t('single_vendor_home_section_error_message')}
          />
        </View>
      </View>
    );
  }

  const baseSelection = getInitialSelectionState(query.data, initialSelection);
  const baseOptions = getSelectedOptions(query.data, baseSelection);
  const basePricing = getPricingState(query.data, baseOptions);

  const selectedListPrice = selectedListServices
    .filter((service) => !lockedSelectedSet.has(service.id))
    .reduce((sum, service) => sum + (service.price ?? 0), 0);
  const selectedListDurationMinutes = selectedListServices
    .filter((service) => !lockedSelectedSet.has(service.id))
    .reduce((sum, service) => {
      const fromEstimated = parseEstimatedDurationToMinutes(service.estimatedDuration);
      if (fromEstimated > 0) {
        return sum + fromEstimated;
      }

      const fallbackDuration = service.duration ?? 0;
      const normalizedUnit = service.durationUnit?.toLowerCase().trim() ?? '';
      const fallbackMinutes = normalizedUnit.includes('hour')
        ? fallbackDuration * 60
        : normalizedUnit.includes('min')
          ? fallbackDuration
          : 0;

      return sum + fallbackMinutes;
    }, 0);

  const totalPrice = basePricing.totalPrice + selectedListPrice;
  const additionalSelectedCount = selectedListServices.filter(
    (service) => !lockedSelectedSet.has(service.id),
  ).length;
  const totalServiceCount = basePricing.serviceCount + additionalSelectedCount;

  const baseDurationMinutes =
    basePricing.estimatedDurationMinutes > 0
      ? basePricing.estimatedDurationMinutes
      : (query.data.pricingSummary.estimatedDurationMinutes ?? 0);
  const totalDurationMinutes = baseDurationMinutes + selectedListDurationMinutes;
  const totalDurationLabel =
    formatMinutesToDurationLabel(totalDurationMinutes) ?? basePricing.durationLabel;
  const totalPriceLabel = formatPrice(totalPrice);
  const selectedServiceIds = useMemo(
    () => Array.from(new Set([...lockedSelectedServiceIds, ...selectedListServices.map((service) => service.id)])),
    [lockedSelectedServiceIds, selectedListServices],
  );
  const selectedServices = useMemo<HomeVisitsSelectedServiceSnapshot[]>(
    () => {
      const additionalServices = selectedListServices
        .filter((service) => !lockedSelectedSet.has(service.id))
        .map((service) => ({
          id: service.id,
          name: service.name,
          price: service.price ?? 0,
          durationLabel: service.estimatedDuration ?? null,
          isLocked: false,
        }));

      return [
        {
          id: serviceId,
          name: query.data.serviceName,
          price: basePricing.totalPrice,
          durationLabel: basePricing.durationLabel,
          isLocked: true,
        },
        ...additionalServices,
      ];
    },
    [
      basePricing.durationLabel,
      basePricing.totalPrice,
      lockedSelectedSet,
      query.data.serviceName,
      selectedListServices,
      serviceId,
    ],
  );
  const serviceCountLabel =
    totalServiceCount === 1
      ? t('service_details_service_singular')
      : t('service_details_service_plural');
  const handleBookService = useCallback(() => {
    navigation.push('TeamAndSchedule', {
      initialSelection,
      selectedServiceIds,
      selectedServices,
      serviceCenterId,
      serviceId,
      summary: {
        durationLabel: totalDurationLabel,
        durationMinutes: totalDurationMinutes,
        serviceCount: totalServiceCount,
        totalPrice,
      },
    });
  }, [
    initialSelection,
    navigation,
    selectedServiceIds,
    selectedServices,
    serviceCenterId,
    serviceId,
    totalDurationLabel,
    totalDurationMinutes,
    totalPrice,
    totalServiceCount,
  ]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top + 12,
          },
        ]}
      >
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={handleGoBack}
          style={[styles.iconButton, { backgroundColor: colors.backgroundTertiary }]}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>

        <Text
          weight="extraBold"
          style={{
            color: colors.text,
            flex: 1,
            fontSize: typography.size.lg,
            lineHeight: typography.lineHeight.md,
            textAlign: 'center',
          }}
        >
          Services
        </Text>

        <Pressable
          accessibilityLabel="Close"
          accessibilityRole="button"
          onPress={handleClose}
          style={[styles.iconButton, { backgroundColor: colors.backgroundTertiary }]}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      <ServiceCenterServicesList
        contentContainerStyle={{ paddingBottom: insets.bottom + 108 }}
        lockedSelectedServiceIds={lockedSelectedServiceIds}
        onSelectedServicesChange={setSelectedListServices}
        serviceCenterId={serviceCenterId}
      />

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: Math.max(insets.bottom, 10),
          },
        ]}
      >
        <View style={styles.footerRow}>
          <View style={styles.footerMeta}>
            {totalPriceLabel ? (
              <Text
                weight="bold"
                style={{
                  color: colors.text,
                  fontSize: typography.size.sm2,
                  lineHeight: typography.lineHeight.md,
                }}
              >
                {totalPriceLabel}
              </Text>
            ) : null}

            <View style={styles.footerMetaLine}>
              <Text
                weight="medium"
                style={{
                  color: colors.iconMuted,
                  fontSize: typography.size.xs2,
                  lineHeight: typography.lineHeight.sm,
                }}
              >
                {`${totalServiceCount} ${serviceCountLabel}`}
              </Text>

              {totalDurationLabel ? (
                <>
                  <Icon type="Entypo" name="dot-single" size={14} color={colors.iconMuted} />
                  <Text
                    weight="medium"
                    style={{
                      color: colors.iconMuted,
                      fontSize: typography.size.xs2,
                      lineHeight: typography.lineHeight.sm,
                    }}
                  >
                    {totalDurationLabel}
                  </Text>
                </>
              ) : null}
            </View>
          </View>

          <View style={styles.footerAction}>
            <Button
              label={t('service_details_book_service')}
              onPress={handleBookService}
              style={{
                backgroundColor: colors.warning,
                borderColor: colors.warning,
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  errorWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  footer: {
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    position: 'absolute',
    right: 0,
  },
  footerAction: {
    flex: 1,
  },
  footerMeta: {
    flex: 1,
    gap: 2,
  },
  footerMetaLine: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  screen: {
    flex: 1,
  },
});
