import React, { useCallback, useEffect, useMemo } from "react";
import { FlatList, StatusBar, StyleSheet, View } from "react-native";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { showToast } from "../../../general/components/AppToast";
import ScreenHeader from "../../../general/components/ScreenHeader";
import { useTheme } from "../../../general/theme/theme";
import AppointmentDetailsCircleButton from "../components/details/AppointmentDetailsCircleButton";
import AppointmentTeamMemberRow from "../components/details/AppointmentTeamMemberRow";
import { buildTeamMembers } from "../components/details/detailHelpers";
import type { TeamMember } from "../components/details/detailTypes";
import AppointmentAnyProfessionalRow from "../components/team/AppointmentAnyProfessionalRow";
import AppointmentAvailabilityBottomSheet from "../components/team/AppointmentAvailabilityBottomSheet";
import { useAppointmentCart } from "../hooks/useAppointmentCart";
import { useAppointmentTeamBooking } from "../hooks/useAppointmentTeamBooking";
import type { MultiVendorStackParamList } from "../multiVendor/navigation/types";

type TeamRouteProp = RouteProp<MultiVendorStackParamList, "Team">;
type NavigationProp = NativeStackNavigationProp<MultiVendorStackParamList>;

type TeamListItem =
  | { type: "any-professional"; id: string }
  | { type: "member"; id: string; member: TeamMember };

export default function AppointmentTeamScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation("appointments");
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<TeamRouteProp>();
  const { items: cartItems } = useAppointmentCart();
  const { selectedServices, storeId, title } = route.params;
  const resolvedSelectedServices =
    selectedServices && selectedServices.length > 0
      ? selectedServices
      : cartItems;

  const teamMembers = useMemo(
    () =>
      buildTeamMembers(
        route.params?.team ?? [],
        t("details_team_role_fallback"),
      ),
    [route.params?.team, t],
  );

  const listData = useMemo<TeamListItem[]>(
    () => [
      { type: "any-professional", id: "any-professional" },
      ...teamMembers.map<TeamListItem>((member) => ({
        type: "member",
        id: member.id,
        member,
      })),
    ],
    [teamMembers],
  );

  const handleClose = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate("MultiVendorTabs");
  }, [navigation]);

  const {
    availabilityDate,
    availableSlots,
    handleAnyProfessionalPress,
    handleAvailabilityDateChange,
    handleMemberPress,
    handlePickerClose,
    handleSlotConfirm,
    isPickerVisible,
    isAvailabilityLoading,
    isSlotConfirming,
    reopenPickerForSelection,
  } = useAppointmentTeamBooking({
    navigation,
    selectedServices: resolvedSelectedServices,
    storeId,
    team: route.params.team,
    title,
    t,
  });

  useEffect(() => {
    if (!route.params.retrySelection) {
      return;
    }

    reopenPickerForSelection(route.params.retrySelection);

    showToast.info(
      t("team_schedule_slot_taken_title"),
      t("team_schedule_slot_taken_body"),
    );

    navigation.setParams({
      retrySelection: undefined,
      retryErrorMessage: undefined,
    });
  }, [navigation, reopenPickerForSelection, route.params.retrySelection, t]);

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScreenHeader
          onBack={handleClose}
          rightSlot={(
            <AppointmentDetailsCircleButton
              icon="close"
              label={t("details_close")}
              onPress={handleClose}
            />
          )}
          showBack
          title={t("team_screen_title")}
        />

        <FlatList
          contentContainerStyle={styles.content}
          data={listData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            if (item.type === "any-professional") {
              return (
                <AppointmentAnyProfessionalRow
                  buttonLabel={t("team_select")}
                  onPress={handleAnyProfessionalPress}
                  subtitle={t("team_any_professional_subtitle")}
                  title={t("team_any_professional")}
                />
              );
            }

            return (
              <AppointmentTeamMemberRow
                buttonLabel={t("team_select")}
                item={item.member}
                onSelect={() => handleMemberPress(item.member)}
              />
            );
          }}
          showsVerticalScrollIndicator={false}
        />

        <AppointmentAvailabilityBottomSheet
          availableSlots={availableSlots}
          isConfirming={isSlotConfirming}
          isLoadingSlots={isAvailabilityLoading}
          onClose={handlePickerClose}
          onConfirm={handleSlotConfirm}
          onDateChange={handleAvailabilityDateChange}
          selectedDate={availabilityDate}
          visible={isPickerVisible}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  screen: {
    flex: 1,
  },
});
