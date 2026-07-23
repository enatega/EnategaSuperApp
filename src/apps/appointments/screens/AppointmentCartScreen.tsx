import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { extractApiErrorMessage } from "../../../general/api/apiClient";
import { showToast } from "../../../general/components/AppToast";
import Icon from "../../../general/components/Icon";
import Text from "../../../general/components/Text";
import { useTheme } from "../../../general/theme/theme";
import {
  formatPrice,
  getServiceMeta,
} from "../components/details/detailHelpers";
import AppointmentServicesFooter from "../components/services/AppointmentServicesFooter";
import AppointmentServicesHeader from "../components/services/AppointmentServicesHeader";
import AppointmentServicePrice from "../components/services/AppointmentServicePrice";
import { useAppointmentCart } from "../hooks/useAppointmentCart";
import {
  useClearAppointmentCartMutation,
  useRemoveAppointmentCartItemMutation,
} from "../hooks/useAppointmentCartQueries";
import { useAppointmentStoreView } from "../hooks/useDiscoveryQueries";
import type { MultiVendorStackParamList } from "../multiVendor/navigation/types";

type CartRouteProp = RouteProp<MultiVendorStackParamList, "AppointmentCart">;
type NavigationProp = NativeStackNavigationProp<MultiVendorStackParamList>;

export default function AppointmentCartScreen() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation("appointments");
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CartRouteProp>();
  const {
    cart,
    clearCart: clearLocalCart,
    hasSelection,
    hydrateCart,
    items,
    originalTotalPrice,
    removeService,
    reviewDraft,
    storeId,
    storeTitle,
    totalDurationLabel,
    totalPrice,
  } = useAppointmentCart();
  const clearCartMutation = useClearAppointmentCartMutation();
  const removeItemMutation = useRemoveAppointmentCartItemMutation();
  const resolvedStoreId = route.params.storeId || storeId || "";
  const storeQuery = useAppointmentStoreView(resolvedStoreId, {
    enabled: Boolean(resolvedStoreId),
  });
  const resolvedTitle =
    route.params.title ||
    storeTitle ||
    storeQuery.data?.name ||
    t("cart_title");

  const countLabel =
    items.length === 1
      ? t("services_selected_count_one", { count: items.length })
      : t("services_selected_count_other", { count: items.length });
  const totalPriceLabel = formatPrice(totalPrice) ?? "$0";
  const originalTotalPriceLabel =
    originalTotalPrice > totalPrice ? formatPrice(originalTotalPrice) : null;

  const handleContinue = () => {
    if (!resolvedStoreId || items.length === 0) {
      return;
    }

    if (reviewDraft && reviewDraft.storeId === resolvedStoreId) {
      navigation.navigate("ReviewConfirm", reviewDraft);
      return;
    }

    navigation.navigate("Team", {
      storeId: resolvedStoreId,
      title: resolvedTitle,
      selectedServices: items,
      team: storeQuery.data?.team ?? [],
    });
  };

  const handleSelectService = () => {
    navigation.navigate("MultiVendorTabs", {
      screen: "MultiVendorTabHome",
    });
  };

  const handleClearCart = async () => {
    if (!cart?.bucketId || cart.storeId !== resolvedStoreId) {
      clearLocalCart();
      return;
    }

    try {
      hydrateCart(await clearCartMutation.mutateAsync());
    } catch (error) {
      showToast.error(
        t("cart_save_error_title"),
        extractApiErrorMessage(error) ?? t("cart_save_error_body"),
      );
    }
  };

  const handleRemoveService = async (serviceId: string) => {
    const serverItem = cart?.items.find(
      (item) =>
        item.productId === serviceId && item.storeId === resolvedStoreId,
    );

    if (!serverItem) {
      removeService(serviceId);
      return;
    }

    try {
      hydrateCart(await removeItemMutation.mutateAsync(serverItem.id));
    } catch (error) {
      showToast.error(
        t("cart_save_error_title"),
        extractApiErrorMessage(error) ?? t("cart_save_error_body"),
      );
    }
  };

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <AppointmentServicesHeader
        insets={insets}
        onBackPress={() => navigation.goBack()}
        onRightPress={hasSelection ? () => void handleClearCart() : undefined}
        rightIcon={hasSelection ? "trash-outline" : undefined}
        rightLabel={hasSelection ? t("cart_clear_action") : undefined}
        title={t("cart_title")}
      />

      {hasSelection ? (
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: 132 + Math.max(insets.bottom, 12) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.storeSection}>
            <Text
              style={{ color: colors.text, fontSize: typography.size.lg }}
              weight="extraBold"
            >
              {resolvedTitle}
            </Text>
            {storeQuery.data?.address ? (
              <Text
                style={{
                  color: colors.mutedText,
                  fontSize: typography.size.sm2,
                }}
              >
                {storeQuery.data.address}
              </Text>
            ) : null}
          </View>

          <View style={styles.itemsSection}>
            {items.map((item) => (
              <View
                key={item.id}
                style={[styles.itemRow, { borderBottomColor: colors.border }]}
              >
                <View style={styles.itemCopy}>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: typography.size.md2,
                      lineHeight: typography.lineHeight.md2,
                    }}
                    weight="semiBold"
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      color: colors.mutedText,
                      fontSize: typography.size.sm2,
                    }}
                  >
                    {getServiceMeta(item)}
                  </Text>
                </View>

                <View style={styles.itemActions}>
                  <AppointmentServicePrice
                    dealName={item.deal?.name}
                    originalPrice={item.originalPrice}
                    price={item.price}
                    size={typography.size.md2}
                  />
                  <Pressable
                    accessibilityRole="button"
                    disabled={removeItemMutation.isPending}
                    onPress={() => void handleRemoveService(item.id)}
                    style={[
                      styles.removeButton,
                      { backgroundColor: colors.surfaceSoft },
                    ]}
                  >
                    <Icon
                      color={colors.danger}
                      name="trash-outline"
                      size={18}
                    />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Icon color={colors.mutedText} name="cart-outline" size={44} />
          <Text
            style={{ color: colors.text, fontSize: typography.size.lg }}
            weight="extraBold"
          >
            {t("cart_empty_title")}
          </Text>
          <Text
            style={[
              styles.emptyBody,
              { color: colors.mutedText, fontSize: typography.size.sm2 },
            ]}
          >
            {t("cart_empty_body")}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={handleSelectService}
            style={[styles.emptyButton, { backgroundColor: colors.primary }]}
          >
            <Text
              style={{ color: colors.white, fontSize: typography.size.md2 }}
              weight="semiBold"
            >
              {t("cart_empty_action")}
            </Text>
          </Pressable>
        </View>
      )}

      {hasSelection ? (
        <AppointmentServicesFooter
          countLabel={countLabel}
          disabled={!hasSelection}
          durationLabel={totalDurationLabel}
          insets={insets}
          onContinue={handleContinue}
          originalTotalPriceLabel={originalTotalPriceLabel}
          totalPriceLabel={totalPriceLabel}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  emptyBody: {
    maxWidth: 280,
    textAlign: "center",
  },
  emptyButton: {
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  emptyState: {
    alignItems: "center",
    flex: 1,
    gap: 14,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  itemActions: {
    alignItems: "flex-end",
    gap: 12,
  },
  itemCopy: {
    flex: 1,
    gap: 6,
    paddingRight: 12,
  },
  itemRow: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingVertical: 18,
  },
  itemsSection: {
    flex: 1,
  },
  removeButton: {
    alignItems: "center",
    borderRadius: 12,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  screen: {
    flex: 1,
  },
  storeSection: {
    gap: 6,
  },
});
