import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { showToast } from "../../../general/components/AppToast";
import { extractApiErrorMessage } from "../../../general/api/apiClient";
import Text from "../../../general/components/Text";
import { useTheme } from "../../../general/theme/theme";
import { formatPrice } from "../components/details/detailHelpers";
import AppointmentServicesHeader from "../components/services/AppointmentServicesHeader";
import AppointmentServicesFooter from "../components/services/AppointmentServicesFooter";
import AppointmentServicesSectionList from "../components/services/AppointmentServicesSectionList";
import AppointmentsFloatingCartButton from "../components/cart/AppointmentsFloatingCartButton";
import { useAppointmentServicesScreen } from "../hooks/useAppointmentServicesScreen";
import {
  isAppointmentCartStoreConflict,
  useAppointmentCartCommit,
} from "../hooks/useAppointmentCartCommit";
import AppointmentDetailTabs from "../components/details/AppointmentDetailTabs";
import { appointmentBookingService } from "../api/appointmentBookingService";
import type {
  AppointmentMobileServiceDetail,
  AppointmentServiceCustomizationSection,
} from "../api/types";
import type { AppointmentBookingFlowParamList } from "../navigation/bookingFlowTypes";

type ServicesRouteProp = RouteProp<AppointmentBookingFlowParamList, "Services">;
type NavigationProp = NativeStackNavigationProp<AppointmentBookingFlowParamList>;

function getVariantPrice(
  originalPrice: number,
  detail: AppointmentMobileServiceDetail,
) {
  const deal = detail.deal;
  if (!deal) {
    return originalPrice;
  }

  const discountedPrice =
    deal.type === "percentage"
      ? originalPrice - (originalPrice * deal.value) / 100
      : deal.type === "fixed"
        ? originalPrice - deal.value
        : originalPrice;

  return Math.max(0, Number(discountedPrice.toFixed(2)));
}

export default function AppointmentServicesScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation("appointments");
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ServicesRouteProp>();
  const [serviceDetailsById, setServiceDetailsById] = useState<
    Record<string, AppointmentMobileServiceDetail>
  >({});
  const requestedServiceDetailIdsRef = useRef(new Set<string>());
  const isMountedRef = useRef(true);
  const { initialCategoryId, initialServiceId, initialSubcategoryId, storeId } =
    route.params;
  const {
    availableCategories,
    filteredServices,
    handleServicePress,
    hasSelection,
    selectedCategoryId,
    selectedServiceIds,
    selectedServices,
    selections,
    selectedSubcategoryId,
    setSelectedCategoryId,
    setSelectedSubcategoryId,
    setServiceSelection,
    servicesQuery,
    storeQuery,
    originalTotalPrice,
    totalDurationLabel,
    totalPrice,
    visibleSubcategories,
  } = useAppointmentServicesScreen({
    initialCategoryId,
    initialServiceId,
    initialSubcategoryId,
    storeId,
    title: route.params.title,
  });
  const safeCategories = Array.isArray(availableCategories)
    ? availableCategories
    : [];
  const safeServices = Array.isArray(filteredServices) ? filteredServices : [];
  const safeSubcategories = Array.isArray(visibleSubcategories)
    ? visibleSubcategories
    : [];
  const totalPriceLabel = formatPrice(totalPrice) ?? "$0";
  const originalTotalPriceLabel =
    originalTotalPrice > totalPrice ? formatPrice(originalTotalPrice) : null;
  const { commitCart, isCommittingCart, restorePersistedCart } =
    useAppointmentCartCommit({
      selectedServices,
      storeId,
    });
  const countLabel =
    selectedServices.length === 1
      ? t("services_selected_count_one", { count: selectedServices.length })
      : t("services_selected_count_other", { count: selectedServices.length });
  const isVariantConfigurationPending = selectedServiceIds.some(
    (serviceId) => !serviceDetailsById[serviceId],
  );
  const hasUnselectedVariant = selectedServiceIds.some((serviceId) => {
    const detail = serviceDetailsById[serviceId];
    const variants =
      detail?.customizationSections.filter(
        (section) =>
          section.type?.toLowerCase() === "variation" &&
          section.options.length > 0,
      ) ?? [];

    if (variants.length === 0) {
      return false;
    }

    return !selections
      .find((selection) => selection.serviceId === serviceId)
      ?.selectedOptions?.some((selectedOption) =>
        variants.some(
          (variant) =>
            variant.groupId === selectedOption.groupId &&
            variant.options.some(
              (option) => option.optionId === selectedOption.optionId,
            ),
        ),
      );
  });
  const isSelectionReady =
    hasSelection &&
    !isVariantConfigurationPending &&
    !hasUnselectedVariant;

  const handleVariantPress = useCallback(
    (
      service: (typeof selectedServices)[number],
      variant: AppointmentServiceCustomizationSection,
    ) => {
      const detail = serviceDetailsById[service.id];
      const option = variant.options[0];
      if (!detail || !option) {
        return;
      }

      const variationGroupIds = new Set(
        detail.customizationSections
          .filter((section) => section.type?.toLowerCase() === "variation")
          .map((section) => section.groupId),
      );
      const existingSelection = selections.find(
        (selection) => selection.serviceId === service.id,
      );
      const retainedOptions =
        existingSelection?.selectedOptions?.filter(
          (selectedOption) =>
            !selectedOption.groupId ||
            !variationGroupIds.has(selectedOption.groupId),
        ) ?? [];
      const price = getVariantPrice(option.price, detail);

      setServiceSelection(
        {
          serviceId: service.id,
          selectedOptions: [
            ...retainedOptions,
            {
              groupId: variant.groupId,
              optionId: option.optionId,
            },
          ],
        },
        {
          deal: detail.deal,
          discountedPrice: price < option.price ? price : null,
          estimatedDurationMinutes:
            typeof variant.durationMinutes === "number" &&
            variant.durationMinutes > 0
              ? variant.durationMinutes
              : service.estimatedDurationMinutes,
          imageUrl: variant.imageUrl ?? detail.imageUrl,
          originalPrice: option.price,
          price,
        },
      );
    },
    [selections, serviceDetailsById, setServiceSelection],
  );

  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );

  useEffect(() => {
    const missingServiceIds = selectedServiceIds.filter(
      (serviceId) => !requestedServiceDetailIdsRef.current.has(serviceId),
    );
    if (missingServiceIds.length === 0) {
      return;
    }

    missingServiceIds.forEach((serviceId) => {
      requestedServiceDetailIdsRef.current.add(serviceId);
    });
    void Promise.allSettled(
      missingServiceIds.map(async (serviceId) => ({
        serviceId,
        detail: await appointmentBookingService.getServiceDetail(serviceId),
      })),
    ).then((results) => {
      if (!isMountedRef.current) {
        return;
      }

      setServiceDetailsById((current) => {
        const next = { ...current };
        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            next[result.value.serviceId] = result.value.detail;
          } else {
            requestedServiceDetailIdsRef.current.delete(
              missingServiceIds[index],
            );
          }
        });
        return next;
      });
    });
  }, [selectedServiceIds]);

  const handleRightPress = () => {
    if (isSelectionReady) {
      navigation.navigate("AppointmentCart", {
        storeId,
        title: route.params.title,
      });
      return;
    }

    showToast.info(
      t("services_selection_info_title"),
      t("services_selection_info_body"),
    );
  };

  const navigateToTeam = () => {
    navigation.navigate("Team", {
      storeId,
      title: route.params.title,
      selectedServices,
      team: storeQuery.data?.team ?? [],
    });
  };

  const commitAndContinue = async (replaceExistingStore: boolean) => {
    try {
      await commitCart(replaceExistingStore);
      navigateToTeam();
    } catch (error) {
      if (!replaceExistingStore && isAppointmentCartStoreConflict(error)) {
        Alert.alert(
          t("cart_store_conflict_title"),
          t("cart_store_conflict_body", { store: route.params.title }),
          [
            {
              style: "cancel",
              text: t("cart_store_conflict_keep"),
              onPress: () => {
                void (async () => {
                  const existingCart = await restorePersistedCart();

                  if (existingCart?.storeId) {
                    navigation.navigate("AppointmentCart", {
                      storeId: existingCart.storeId,
                      title: "",
                    });
                  }
                })();
              },
            },
            {
              style: "destructive",
              text: t("cart_store_conflict_replace"),
              onPress: () => {
                void commitAndContinue(true);
              },
            },
          ],
        );
        return;
      }

      showToast.error(
        t("cart_save_error_title"),
        extractApiErrorMessage(error) ?? t("cart_save_error_body"),
      );
    }
  };

  const handleContinue = () => {
    if (!isSelectionReady) {
      showToast.info(
        t("services_selection_info_title"),
        t("services_selection_info_body"),
      );
      return;
    }

    void commitAndContinue(false);
  };

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <AppointmentServicesHeader
        onBackPress={() => navigation.goBack()}
        onRightPress={handleRightPress}
        rightIcon={hasSelection ? "cart-outline" : "information-circle-outline"}
        rightLabel={
          hasSelection ? t("cart_title") : t("services_selection_info_title")
        }
        title={t("services_screen_title")}
      />

      <View style={styles.content}>
        <AppointmentDetailTabs
          activeCategoryId={selectedCategoryId}
          categories={safeCategories}
          disabled={false}
          onSelect={(value) => {
            setSelectedCategoryId(value);
            setSelectedSubcategoryId(null);
          }}
          titleAll={t("details_tab_all")}
        />

        {selectedCategoryId && safeSubcategories.length > 0 ? (
          <AppointmentDetailTabs
            activeCategoryId={selectedSubcategoryId}
            categories={safeSubcategories}
            disabled={false}
            onSelect={setSelectedSubcategoryId}
            titleAll={t("details_tab_all")}
          />
        ) : null}

        {storeQuery.error && !storeQuery.data ? (
          <View style={styles.emptyState}>
            <Text style={{ color: colors.mutedText }}>
              {t("details_load_error")}
            </Text>
          </View>
        ) : (
          <AppointmentServicesSectionList
            emptyLabel={t("details_services_empty")}
            isLoading={servicesQuery.isPending && !servicesQuery.isFetched}
            onServicePress={handleServicePress}
            onVariantPress={handleVariantPress}
            selections={selections}
            selectedServiceIds={selectedServiceIds}
            selectedServices={selectedServices}
            serviceDetailsById={serviceDetailsById}
            services={safeServices}
          />
        )}

        <AppointmentsFloatingCartButton
          onPress={handleRightPress}
          style={styles.cartButton}
        />
      </View>

      <AppointmentServicesFooter
        countLabel={countLabel}
        disabled={!isSelectionReady || isCommittingCart}
        durationLabel={totalDurationLabel}
        insets={insets}
        onContinue={handleContinue}
        isLoading={isCommittingCart || isVariantConfigurationPending}
        originalTotalPriceLabel={originalTotalPriceLabel}
        totalPriceLabel={totalPriceLabel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cartButton: {
    bottom: 22,
    position: "absolute",
    right: 16,
  },
  emptyState: {
    paddingTop: 24,
  },
  screen: {
    flex: 1,
  },
});
