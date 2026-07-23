import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import type { AppointmentStoreService } from "../api/types";
import { formatDurationMinutes } from "../components/details/detailHelpers";
import { useAppointmentCart } from "./useAppointmentCart";
import {
  useAppointmentStoreView,
  useFlattenedAppointmentStoreServices,
} from "./useDiscoveryQueries";

type Params = {
  initialCategoryId?: string | null;
  initialServiceId?: string | null;
  initialSubcategoryId?: string | null;
  storeId: string;
  title: string;
};

export function useAppointmentServicesScreen({
  initialCategoryId,
  initialServiceId,
  initialSubcategoryId,
  storeId,
  title,
}: Params) {
  const hasInitializedSelectionRef = useRef(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialCategoryId ?? null,
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    string | null
  >(initialSubcategoryId ?? null);
  const { clearCart, hasService, items, setStoreContext, toggleService } =
    useAppointmentCart();
  const storeQuery = useAppointmentStoreView(storeId, {
    enabled: Boolean(storeId),
  });
  const servicesQuery = useFlattenedAppointmentStoreServices(
    {
      storeId,
      limit: 100,
    },
    { enabled: Boolean(storeId) },
  );

  const allServices = servicesQuery.data ?? [];

  useFocusEffect(
    useCallback(() => {
      if (!storeId) {
        return;
      }

      setStoreContext({
        storeId,
        title,
      });
    }, [setStoreContext, storeId, title]),
  );

  const availableCategories = useMemo(() => {
    const categories = storeQuery.data?.categories ?? [];

    return categories.filter((category) =>
      allServices.some(
        (service) =>
          service.categoryId === category.id ||
          service.category?.id === category.id,
      ),
    );
  }, [allServices, storeQuery.data?.categories]);

  useEffect(() => {
    if (selectedCategoryId !== null) {
      return;
    }

    if (!initialCategoryId) {
      return;
    }

    const initialMatch = availableCategories.find(
      (category) => category.id === initialCategoryId,
    );
    if (initialMatch) {
      setSelectedCategoryId(initialMatch.id);
    }
  }, [availableCategories, initialCategoryId, selectedCategoryId]);

  useEffect(() => {
    if (!selectedCategoryId) {
      if (selectedSubcategoryId !== null) {
        setSelectedSubcategoryId(null);
      }
      return;
    }

    const stillExists = allServices.some(
      (service) =>
        (service.categoryId === selectedCategoryId ||
          service.category?.id === selectedCategoryId) &&
        (service.subcategoryId === selectedSubcategoryId ||
          service.subcategory?.id === selectedSubcategoryId),
    );

    if (!stillExists && selectedSubcategoryId !== null) {
      setSelectedSubcategoryId(null);
    }
  }, [allServices, selectedCategoryId, selectedSubcategoryId]);

  useEffect(() => {
    if (hasInitializedSelectionRef.current) {
      return;
    }

    if (!initialServiceId || allServices.length === 0) {
      return;
    }

    if (!allServices.some((service) => service.id === initialServiceId)) {
      hasInitializedSelectionRef.current = true;
      return;
    }

    const initialService = allServices.find(
      (service) => service.id === initialServiceId,
    );
    if (initialService && !hasService(initialService.id)) {
      toggleService(initialService);
    }
    hasInitializedSelectionRef.current = true;
  }, [allServices, hasService, initialServiceId, toggleService]);

  const visibleSubcategories = useMemo(() => {
    if (!selectedCategoryId) {
      return [];
    }

    return (
      storeQuery.data?.subcategories?.filter((subcategory) =>
        allServices.some(
          (service) =>
            (service.categoryId === selectedCategoryId ||
              service.category?.id === selectedCategoryId) &&
            (service.subcategoryId === subcategory.id ||
              service.subcategory?.id === subcategory.id),
        ),
      ) ?? []
    );
  }, [allServices, selectedCategoryId, storeQuery.data?.subcategories]);

  const filteredServices = useMemo(() => {
    const categoryServices = selectedCategoryId
      ? allServices.filter(
          (service) =>
            service.categoryId === selectedCategoryId ||
            service.category?.id === selectedCategoryId,
        )
      : allServices;

    const visibleServices = selectedSubcategoryId
      ? categoryServices.filter(
          (service) =>
            service.subcategoryId === selectedSubcategoryId ||
            service.subcategory?.id === selectedSubcategoryId,
        )
      : categoryServices;

    if (
      !initialServiceId ||
      !visibleServices.some((service) => service.id === initialServiceId)
    ) {
      return visibleServices;
    }

    return [...visibleServices].sort((left, right) =>
      left.id === initialServiceId ? -1 : right.id === initialServiceId ? 1 : 0,
    );
  }, [
    allServices,
    initialServiceId,
    selectedCategoryId,
    selectedSubcategoryId,
  ]);

  const selectedServices = useMemo(() => items, [items]);

  const totalPrice = useMemo(
    () =>
      selectedServices.reduce(
        (sum, service) =>
          sum + (typeof service.price === "number" ? service.price : 0),
        0,
      ),
    [selectedServices],
  );
  const originalTotalPrice = useMemo(
    () =>
      selectedServices.reduce(
        (sum, service) =>
          sum +
          (typeof service.originalPrice === "number"
            ? service.originalPrice
            : typeof service.price === "number"
              ? service.price
              : 0),
        0,
      ),
    [selectedServices],
  );

  const totalDurationMinutes = useMemo(
    () =>
      selectedServices.reduce(
        (sum, service) =>
          sum +
          (typeof service.estimatedDurationMinutes === "number"
            ? service.estimatedDurationMinutes
            : 0),
        0,
      ),
    [selectedServices],
  );

  const totalDurationLabel = useMemo(
    () => formatDurationMinutes(totalDurationMinutes),
    [totalDurationMinutes],
  );

  const handleServicePress = useCallback(
    (service: AppointmentStoreService) => {
      toggleService(service);
    },
    [toggleService],
  );

  const clearSelection = useCallback(() => {
    clearCart();
    setStoreContext({
      storeId,
      title,
    });
  }, [clearCart, setStoreContext, storeId, title]);

  const selectedServiceIds = useMemo(
    () => selectedServices.map((service) => service.id),
    [selectedServices],
  );

  return {
    availableCategories,
    clearSelection,
    filteredServices,
    handleServicePress,
    hasSelection: selectedServices.length > 0,
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
  };
}
