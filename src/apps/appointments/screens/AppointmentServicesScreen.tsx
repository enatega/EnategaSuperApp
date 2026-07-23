import React from "react";
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
import AppointmentDetailTabs from "../multiVendor/components/AppointmentDetailTabs";
import type { MultiVendorStackParamList } from "../multiVendor/navigation/types";

type ServicesRouteProp = RouteProp<MultiVendorStackParamList, "Services">;
type NavigationProp = NativeStackNavigationProp<MultiVendorStackParamList>;

export default function AppointmentServicesScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation("appointments");
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ServicesRouteProp>();
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
    selectedSubcategoryId,
    setSelectedCategoryId,
    setSelectedSubcategoryId,
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

  const handleRightPress = () => {
    if (hasSelection) {
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
    if (!hasSelection) {
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
        insets={insets}
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
            selectedServiceIds={selectedServiceIds}
            services={safeServices}
          />
        )}

        <AppointmentsFloatingCartButton style={styles.cartButton} />
      </View>

      <AppointmentServicesFooter
        countLabel={countLabel}
        disabled={!hasSelection || isCommittingCart}
        durationLabel={totalDurationLabel}
        insets={insets}
        onContinue={handleContinue}
        isLoading={isCommittingCart}
        originalTotalPriceLabel={originalTotalPriceLabel}
        totalPriceLabel={totalPriceLabel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  cartButton: {
    bottom: 22,
    position: "absolute",
    right: 24,
  },
  emptyState: {
    paddingTop: 24,
  },
  screen: {
    flex: 1,
  },
});
