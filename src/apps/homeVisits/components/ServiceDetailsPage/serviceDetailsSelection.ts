import type {
  HomeVisitsServiceDetailsBookingSelectionPayload,
  HomeVisitsServiceDetailsSelectionState,
  HomeVisitsSingleVendorServiceBookingScreenOption,
  HomeVisitsSingleVendorServiceBookingScreenResponse,
} from '../../types/serviceDetails';

export type ServiceDetailsPricingState = {
  durationLabel: string | null;
  estimatedDurationMinutes: number;
  serviceCount: number;
  totalPrice: number;
  totalPriceLabel: string | null;
};

export function formatPrice(value: number | null | undefined) {
  if (value == null) {
    return null;
  }

  return `$${value.toLocaleString()}`;
}

function toMinutes(duration: number | null, durationUnit: string | null) {
  if (duration == null || duration < 0) {
    return 0;
  }

  const normalizedUnit = durationUnit?.toLowerCase().trim() ?? '';
  if (normalizedUnit.includes('hour')) {
    return duration * 60;
  }

  if (normalizedUnit.includes('min')) {
    return duration;
  }

  return 0;
}

function formatDurationLabel(totalMinutes: number | null) {
  if (totalMinutes == null || totalMinutes <= 0) {
    return null;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  if (minutes === 0) {
    return `${hours} ${hours === 1 ? 'hr' : 'hrs'}`;
  }

  return `${hours} ${hours === 1 ? 'hr' : 'hrs'} ${minutes} min`;
}

function getDefaultServiceTypeId(
  sections: HomeVisitsSingleVendorServiceBookingScreenResponse['serviceTypeSections'],
) {
  for (const section of sections) {
    const defaultOption = section.options.find((option) => option.isDefaultSelected);
    if (defaultOption) {
      return defaultOption.optionId;
    }
  }

  for (const section of sections) {
    if (section.required && section.options.length > 0) {
      return section.options[0].optionId;
    }
  }

  return null;
}

function getDefaultAdditionalByGroup(
  sections: HomeVisitsSingleVendorServiceBookingScreenResponse['additionalServiceSections'],
) {
  return Object.fromEntries(
    sections.map((section) => [
      section.groupId,
      section.options
        .filter((option) => option.isDefaultSelected)
        .map((option) => option.optionId),
    ]),
  );
}

function sanitizeSelectionState(
  data: HomeVisitsSingleVendorServiceBookingScreenResponse,
  state: HomeVisitsServiceDetailsSelectionState,
): HomeVisitsServiceDetailsSelectionState {
  const validServiceTypeOptionIds = new Set(
    data.serviceTypeSections.flatMap((section) =>
      section.options.map((option) => option.optionId),
    ),
  );

  const selectedServiceTypeId =
    state.selectedServiceTypeId && validServiceTypeOptionIds.has(state.selectedServiceTypeId)
      ? state.selectedServiceTypeId
      : getDefaultServiceTypeId(data.serviceTypeSections);

  const selectedAdditionalByGroup: Record<string, string[]> = Object.fromEntries(
    data.additionalServiceSections.map((section) => {
      const validOptionIds = new Set(section.options.map((option) => option.optionId));
      const selectedIds = (state.selectedAdditionalByGroup[section.groupId] ?? []).filter((id) =>
        validOptionIds.has(id),
      );

      return [section.groupId, selectedIds];
    }),
  );

  return {
    selectedServiceTypeId,
    selectedAdditionalByGroup,
  };
}

export function getInitialSelectionState(
  data: HomeVisitsSingleVendorServiceBookingScreenResponse,
  initialSelection?: HomeVisitsServiceDetailsSelectionState,
): HomeVisitsServiceDetailsSelectionState {
  const defaults: HomeVisitsServiceDetailsSelectionState = {
    selectedServiceTypeId: getDefaultServiceTypeId(data.serviceTypeSections),
    selectedAdditionalByGroup: getDefaultAdditionalByGroup(data.additionalServiceSections),
  };

  if (!initialSelection) {
    return defaults;
  }

  return sanitizeSelectionState(data, initialSelection);
}

export function getSelectedOptions(
  data: HomeVisitsSingleVendorServiceBookingScreenResponse,
  selectionState: HomeVisitsServiceDetailsSelectionState,
) {
  const selectedServiceTypeOptions = data.serviceTypeSections.flatMap((section) => {
    const selectedOption = section.options.find(
      (option) => option.optionId === selectionState.selectedServiceTypeId,
    );
    return selectedOption ? [selectedOption] : [];
  });

  const selectedAdditionalOptions = data.additionalServiceSections.flatMap((section) => {
    const selectedOptionIds = new Set(
      selectionState.selectedAdditionalByGroup[section.groupId] ?? [],
    );

    return section.options.filter((option) => selectedOptionIds.has(option.optionId));
  });

  return [...selectedServiceTypeOptions, ...selectedAdditionalOptions];
}

export function getPricingState(
  data: HomeVisitsSingleVendorServiceBookingScreenResponse,
  selectedOptions: HomeVisitsSingleVendorServiceBookingScreenOption[],
): ServiceDetailsPricingState {
  const serviceTypeOptionsById = new Map(
    data.serviceTypeSections.flatMap((section) =>
      section.options.map((option) => [option.optionId, option] as const),
    ),
  );

  const selectedServiceTypeOption = selectedOptions.find((option) =>
    serviceTypeOptionsById.has(option.optionId),
  );

  const basePrice =
    selectedServiceTypeOption == null || selectedServiceTypeOption.isDefaultSelected
      ? data.basePrice
      : selectedServiceTypeOption.price;

  const additionalOptionsPrice = selectedOptions.reduce((sum, option) => {
    if (serviceTypeOptionsById.has(option.optionId)) {
      return sum;
    }

    return sum + option.price;
  }, 0);

  const totalPrice = basePrice + additionalOptionsPrice;
  const estimatedDurationMinutes = selectedOptions.reduce(
    (sum, option) => sum + toMinutes(option.duration, option.durationUnit),
    0,
  );
  const selectedServiceTypeCount = selectedOptions.some((option) =>
    serviceTypeOptionsById.has(option.optionId),
  )
    ? 1
    : 0;
  const selectedAdditionalCount = selectedOptions.filter(
    (option) => !serviceTypeOptionsById.has(option.optionId),
  ).length;
  const serviceCount = Math.max(1, selectedServiceTypeCount) + selectedAdditionalCount;

  return {
    serviceCount,
    totalPrice,
    totalPriceLabel: formatPrice(totalPrice),
    estimatedDurationMinutes,
    durationLabel:
      formatDurationLabel(estimatedDurationMinutes) ?? data.pricingSummary.estimatedDurationLabel,
  };
}

export function buildSelectionPayload(
  data: HomeVisitsSingleVendorServiceBookingScreenResponse,
  selectionState: HomeVisitsServiceDetailsSelectionState,
  pricingState: ServiceDetailsPricingState,
): HomeVisitsServiceDetailsBookingSelectionPayload {
  return {
    serviceId: data.serviceId,
    selectionState,
    summary: {
      totalPrice: pricingState.totalPrice,
      serviceCount: pricingState.serviceCount,
      estimatedDurationMinutes: pricingState.estimatedDurationMinutes,
      estimatedDurationLabel: pricingState.durationLabel,
    },
  };
}
