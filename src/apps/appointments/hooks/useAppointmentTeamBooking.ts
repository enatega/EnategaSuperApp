import { useCallback, useMemo, useRef, useState } from "react";
import { extractApiErrorMessage } from "../../../general/api/apiClient";
import { showToast } from "../../../general/components/AppToast";
import { appointmentBookingService } from "../api/appointmentBookingService";
import type {
  AppointmentBookingAvailabilitySlot,
  AppointmentBookingSelection,
  AppointmentPublicTeamMember,
  AppointmentStoreService,
} from "../api/types";
import type { TeamMember } from "../components/details/detailTypes";
import type { MultiVendorStackParamList } from "../multiVendor/navigation/types";
import {
  buildAppointmentSelectionFromDetail,
  formatAppointmentDateKey,
} from "../utils/appointmentBooking";
import {
  useAppointmentAvailabilityMutation,
  useAppointmentReviewMutation,
} from "./useAppointmentBookingMutations";
import { useAppointmentCart } from "./useAppointmentCart";

const SLOT_UNAVAILABLE_MESSAGE =
  "No eligible professional is available for the selected slot";

type PendingSelection = {
  mode: "any" | "specific";
  workerId?: string;
};

type Params = {
  navigation: {
    navigate: (
      screen: "ReviewConfirm",
      params: MultiVendorStackParamList["ReviewConfirm"],
    ) => void;
  };
  selectedServices?: AppointmentStoreService[];
  storeId: string;
  team: AppointmentPublicTeamMember[];
  title: string;
  t: (key: string, options?: Record<string, unknown>) => string;
};

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export function useAppointmentTeamBooking({
  navigation,
  selectedServices,
  storeId,
  team,
  t,
  title,
}: Params) {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [pendingSelection, setPendingSelection] =
    useState<PendingSelection | null>(null);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [isConfirmingSlot, setIsConfirmingSlot] = useState(false);
  const [availabilityDate, setAvailabilityDate] = useState(startOfToday);
  const [availableSlots, setAvailableSlots] = useState<
    AppointmentBookingAvailabilitySlot[]
  >([]);
  const selectionsCacheRef = useRef<{
    key: string;
    selections: AppointmentBookingSelection[];
  } | null>(null);
  const { items: cartItems, selections: cartSelections } = useAppointmentCart();
  const availabilityMutation = useAppointmentAvailabilityMutation();
  const reviewMutation = useAppointmentReviewMutation();

  const services = useMemo(
    () =>
      Array.isArray(selectedServices) && selectedServices.length > 0
        ? selectedServices
        : cartItems,
    [cartItems, selectedServices],
  );
  const serviceSelectionKey = useMemo(
    () =>
      services
        .map((service) => service.id)
        .sort()
        .join(":"),
    [services],
  );
  const hasServices = services.length > 0;
  const isAvailabilityLoading =
    isLoadingAvailability || availabilityMutation.isPending;
  const isSlotConfirming = isConfirmingSlot || reviewMutation.isPending;
  const isSubmitting = isAvailabilityLoading || isSlotConfirming;

  const getSelections = useCallback(async () => {
    if (selectionsCacheRef.current?.key === serviceSelectionKey) {
      return selectionsCacheRef.current.selections;
    }

    if (
      cartSelections.length === services.length &&
      cartSelections.every((selection) =>
        services.some((service) => service.id === selection.serviceId),
      )
    ) {
      selectionsCacheRef.current = {
        key: serviceSelectionKey,
        selections: cartSelections,
      };
      return cartSelections;
    }

    const selections = await Promise.all(
      services.map(async (service) =>
        buildAppointmentSelectionFromDetail(
          await appointmentBookingService.getServiceDetail(service.id),
        ),
      ),
    );
    selectionsCacheRef.current = { key: serviceSelectionKey, selections };
    return selections;
  }, [cartSelections, serviceSelectionKey, services]);

  const loadAvailability = useCallback(
    async (selection: PendingSelection, date: Date) => {
      setIsLoadingAvailability(true);
      setAvailableSlots([]);
      setAvailabilityDate(date);

      try {
        const selections = await getSelections();
        const availability = await availabilityMutation.mutateAsync({
          storeId,
          date: formatAppointmentDateKey(date),
          selections,
          workerId: selection.workerId,
        });
        setAvailableSlots(
          Array.isArray(availability.slots) ? availability.slots : [],
        );
      } catch (error) {
        showToast.error(
          t("team_schedule_error_title"),
          extractApiErrorMessage(error) ?? t("team_schedule_error_body"),
        );
      } finally {
        setIsLoadingAvailability(false);
      }
    },
    [availabilityMutation, getSelections, storeId, t],
  );

  const openPicker = useCallback(
    (nextSelection: PendingSelection) => {
      if (!hasServices) {
        showToast.info(
          t("services_selection_info_title"),
          t("services_selection_info_body"),
        );
        return;
      }

      const initialDate = startOfToday();
      setPendingSelection(nextSelection);
      setIsPickerVisible(true);
      void loadAvailability(nextSelection, initialDate);
    },
    [hasServices, loadAvailability, t],
  );

  const handleAnyProfessionalPress = useCallback(() => {
    openPicker({ mode: "any" });
  }, [openPicker]);

  const handleMemberPress = useCallback(
    (member: TeamMember) => {
      openPicker({ mode: "specific", workerId: member.id });
    },
    [openPicker],
  );

  const handlePickerClose = useCallback(() => {
    if (isSubmitting) {
      return;
    }

    setIsPickerVisible(false);
    setPendingSelection(null);
    setAvailableSlots([]);
  }, [isSubmitting]);

  const handleAvailabilityDateChange = useCallback(
    (date: Date) => {
      if (!pendingSelection || isSubmitting) {
        return;
      }
      void loadAvailability(pendingSelection, date);
    },
    [isSubmitting, loadAvailability, pendingSelection],
  );

  const reopenPickerForSelection = useCallback(
    (nextSelection: PendingSelection) => {
      openPicker(nextSelection);
    },
    [openPicker],
  );

  const handleSlotConfirm = useCallback(
    async (slot: AppointmentBookingAvailabilitySlot) => {
      if (isSubmitting || !pendingSelection || services.length === 0) {
        return;
      }

      setIsConfirmingSlot(true);
      try {
        const selections = await getSelections();
        const review = await reviewMutation.mutateAsync({
          storeId,
          selections,
          scheduledAt: slot.startAt,
          workerMode: pendingSelection.mode,
          workerId: pendingSelection.workerId,
        });

        setIsPickerVisible(false);
        setPendingSelection(null);
        setAvailableSlots([]);

        navigation.navigate("ReviewConfirm", {
          review,
          scheduledAt: slot.startAt,
          selections,
          storeId,
          title,
          team,
          selectedServices: services,
          workerId: pendingSelection.workerId,
          workerMode: pendingSelection.mode,
        });
      } catch (error) {
        const errorMessage =
          extractApiErrorMessage(error) ?? t("team_schedule_error_body");

        if (errorMessage === SLOT_UNAVAILABLE_MESSAGE) {
          showToast.info(
            t("team_schedule_slot_taken_title"),
            t("team_schedule_slot_taken_body"),
          );
          await loadAvailability(pendingSelection, availabilityDate);
          return;
        }

        showToast.error(t("team_schedule_error_title"), errorMessage);
      } finally {
        setIsConfirmingSlot(false);
      }
    },
    [
      availabilityDate,
      getSelections,
      isSubmitting,
      loadAvailability,
      navigation,
      pendingSelection,
      reviewMutation,
      services,
      storeId,
      team,
      t,
      title,
    ],
  );

  return {
    availabilityDate,
    availableSlots,
    handleAnyProfessionalPress,
    handleAvailabilityDateChange,
    handleMemberPress,
    handlePickerClose,
    handleSlotConfirm,
    hasServices,
    isPickerVisible,
    isAvailabilityLoading,
    isSlotConfirming,
    reopenPickerForSelection,
  };
}
