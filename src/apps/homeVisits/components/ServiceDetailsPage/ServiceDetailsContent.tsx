import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../../../general/theme/theme";
import type {
  HomeVisitsServiceDetailsBookingSelectionPayload,
  HomeVisitsServiceDetailsSelectionState,
  HomeVisitsSingleVendorServiceBookingScreenResponse,
} from "../../types/serviceDetails";
import ServiceDetailsFooter from "./ServiceDetailsFooter";
import ServiceDetailsHeroSummary from "./ServiceDetailsHeroSummary";
import ServiceDetailsOptionsSection from "./ServiceDetailsOptionsSection";
import {
  buildSelectionPayload,
  getInitialSelectionState,
  getPricingState,
  getSelectedOptions,
} from "./serviceDetailsSelection";

type Props = {
  data: HomeVisitsSingleVendorServiceBookingScreenResponse;
  isFavoritePending: boolean;
  onBack: () => void;
  onFavorite: () => void;
  onShare: () => void;
  onBookService: (
    selection: HomeVisitsServiceDetailsBookingSelectionPayload,
  ) => void;
  initialSelection?: HomeVisitsServiceDetailsSelectionState;
};

export default function ServiceDetailsContent({
  data,
  isFavoritePending,
  onBack,
  onFavorite,
  onShare,
  onBookService,
  initialSelection,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation("homeVisits");
  const insets = useSafeAreaInsets();
  const [selectionState, setSelectionState] =
    useState<HomeVisitsServiceDetailsSelectionState>(() =>
      getInitialSelectionState(data, initialSelection),
    );

  const selectedOptions = useMemo(
    () => getSelectedOptions(data, selectionState),
    [data, selectionState],
  );

  const pricingState = useMemo(
    () => getPricingState(data, selectedOptions),
    [data, selectedOptions],
  );

  const selectionPayload = useMemo(
    () => buildSelectionPayload(data, selectionState, pricingState),
    [data, pricingState, selectionState],
  );

  const totalPrice = pricingState.totalPriceLabel;
  const durationLabel = pricingState.durationLabel;
  const serviceCountLabel =
    pricingState.serviceCount === 1
      ? t("service_details_service_singular")
      : t("service_details_service_plural");

  const handleServiceTypePress = useCallback((optionId: string) => {
    setSelectionState((previous) => ({
      ...previous,
      selectedServiceTypeId: optionId,
    }));
  }, []);

  const handleAdditionalServicePress = useCallback(
    (groupId: string, optionId: string) => {
      setSelectionState((previous) => {
        const current = previous.selectedAdditionalByGroup[groupId] ?? [];
        const exists = current.includes(optionId);
        const next = exists
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];

        return {
          ...previous,
          selectedAdditionalByGroup: {
            ...previous.selectedAdditionalByGroup,
            [groupId]: next,
          },
        };
      });
    },
    [],
  );

  const handleBookServicePress = useCallback(() => {
    onBookService(selectionPayload);
  }, [onBookService, selectionPayload]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: insets.bottom + 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ServiceDetailsHeroSummary
          data={data}
          basePrice={totalPrice}
          durationLabel={durationLabel}
          isFavorite={data.isFavorite}
          isFavoritePending={isFavoritePending}
          onBack={onBack}
          onFavorite={onFavorite}
          onShare={onShare}
        />

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {data.serviceTypeSections.map((section) => {
          const selectedOptionId = section.options.some(
            (option) =>
              option.optionId === selectionState.selectedServiceTypeId,
          )
            ? selectionState.selectedServiceTypeId
            : null;

          return (
            <ServiceDetailsOptionsSection
              key={section.groupId}
              section={section}
              titleFallback={t("service_details_service_type_fallback")}
              variant="radio"
              selectedOptionIds={selectedOptionId ? [selectedOptionId] : []}
              onOptionPress={handleServiceTypePress}
            />
          );
        })}

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {data.additionalServiceSections.map((section) => (
          <ServiceDetailsOptionsSection
            key={section.groupId}
            section={section}
            titleFallback={t("service_details_additional_services_fallback")}
            variant="checkbox"
            selectedOptionIds={
              selectionState.selectedAdditionalByGroup[section.groupId] ?? []
            }
            onOptionPress={(optionId) =>
              handleAdditionalServicePress(section.groupId, optionId)
            }
          />
        ))}
      </ScrollView>

      <ServiceDetailsFooter
        durationLabel={durationLabel}
        onBookService={handleBookServicePress}
        serviceCount={pricingState.serviceCount}
        serviceCountLabel={serviceCountLabel}
        totalPrice={totalPrice}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
});
