import type {
  AppointmentBookingSelection,
  AppointmentMobileServiceDetail,
  AppointmentBookingReviewResponse,
} from "../api/types";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function buildAppointmentSelectionFromDetail(
  detail: AppointmentMobileServiceDetail,
): AppointmentBookingSelection {
  const selectedOptions: NonNullable<
    AppointmentBookingSelection["selectedOptions"]
  > = [];
  const selectedOptionIds = new Set<string>();
  const pendingSections = [...(detail.customizationSections ?? [])];

  // Dependency-based groups become applicable only after their parent option
  // has been selected, so resolve defaults in dependency order.
  let madeProgress = true;
  while (pendingSections.length > 0 && madeProgress) {
    madeProgress = false;

    for (let index = pendingSections.length - 1; index >= 0; index -= 1) {
      const section = pendingSections[index];
      if (
        section.dependsOnVariationOptionId &&
        !selectedOptionIds.has(section.dependsOnVariationOptionId)
      ) {
        continue;
      }

      for (const option of section.options ?? []) {
        if (!option.defaultSelected || selectedOptionIds.has(option.optionId)) {
          continue;
        }

        selectedOptions.push({
          groupId: section.groupId,
          optionId: option.optionId,
        });
        selectedOptionIds.add(option.optionId);
      }

      pendingSections.splice(index, 1);
      madeProgress = true;
    }
  }

  return {
    serviceId: detail.serviceId,
    selectedOptions: selectedOptions.length > 0 ? selectedOptions : undefined,
  };
}

export function formatAppointmentDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatAppointmentScheduledDate(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatAppointmentTimeRange(params: {
  startAt: string;
  durationMinutes: number;
}) {
  const startDate = new Date(params.startAt);
  const endDate = new Date(
    startDate.getTime() + params.durationMinutes * 60_000,
  );

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${timeFormatter.format(startDate)} - ${timeFormatter.format(endDate)}`;
}

export function getAppointmentWorkerLabel(
  review: AppointmentBookingReviewResponse,
) {
  if (review.worker?.name?.trim()) {
    return review.worker.name.trim();
  }

  return null;
}
