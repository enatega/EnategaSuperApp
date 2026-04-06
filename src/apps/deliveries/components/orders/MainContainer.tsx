import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import TabSwitcher from "../../../../general/components/TabSwitcher";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../../general/theme/theme";
import ScheduleDeliveriesSection from "./ScheduleDeliveriesSection";
import { useTranslation } from "react-i18next";
import OrderHistorySection from "./OrderHistorySection";
import ActiveOrdersSection from "./ActiveOrdersSection";

const MainOrdersContainer = () => {
  const { t } = useTranslation("deliveries");
  const TABS = [
    { key: "activeOrders", label: t("orders_tab_active") },
    { key: "orderHistory", label: t("orders_history_past_heading") },
    { key: "scheduleDeliveries", label: t("orders_tab_scheduled") },
  ];
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState("activeOrders");

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <TabSwitcher
          tabs={TABS}
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(() => key);
          }}
          style={styles.tabs}
        />
        {activeTab === "activeOrders" ? (
          <ActiveOrdersSection />
        ) : activeTab === "orderHistory" ? (
          <OrderHistorySection />
        ) : (
          <ScheduleDeliveriesSection />
        )}
      </View>
    </SafeAreaView>
  );
};

export default MainOrdersContainer;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginHorizontal: 16,
  },
  tabs: {
    marginBottom: 8,
  },
});
