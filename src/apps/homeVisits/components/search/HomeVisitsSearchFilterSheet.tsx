import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import MainFilterSheet from "../../../../general/components/filters/MainFilterSheet";
import type {
  MainListFilterData,
  MainListFilters,
} from "../../../../general/components/filters";
import type { SearchFilters } from "../../../../general/components/search/types";

type Props = {
  visible: boolean;
  filters: SearchFilters;
  isApplyDisabled?: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  onSelectSortBy: (value: SearchFilters["sortBy"]) => void;
  onSelectRatings: (value: number | null) => void;
  onSelectAvailability: (value: SearchFilters["availability"]) => void;
};

export default function HomeVisitsSearchFilterSheet({
  visible,
  filters,
  isApplyDisabled,
  onClose,
  onApply,
  onClear,
  onSelectSortBy,
  onSelectRatings,
  onSelectAvailability,
}: Props) {
  const { t } = useTranslation("general");
  const { t: tHomeVisits } = useTranslation("homeVisits");

  const filterData = useMemo<MainListFilterData>(
    () => ({
      categories: [],
      addresses: [],
      priceTiers: [
        { value: "standard", label: t("search_filter_availability_standard") },
        {
          value: "emergency",
          label: t("search_filter_availability_emergency"),
        },
      ],
      stock: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
      ],
      sortBy: [
        { value: "best_match", label: t("search_filter_sort_best_match") },
        { value: "top_rated", label: t("search_filter_sort_top_rated") },
        { value: "nearest", label: t("search_filter_sort_nearest") },
      ],
    }),
    [t],
  );

  const draftFilters = useMemo<MainListFilters>(
    () => ({
      category_ids: [],
      address_id: null,
      price_tiers: filters.availability,
      stock: filters.ratings?.toString() || null,
      sort_by: filters.sortBy,
    }),
    [filters.availability, filters.ratings, filters.sortBy],
  );

  return (
    <MainFilterSheet
      visible={visible}
      title={t("search_filter_title")}
      applyLabel={t("filter_apply_results")}
      closeLabel={t("filter_close_label")}
      sectionTitles={{
        sort: t("search_filter_sort_by"),
        stock: t("search_filter_ratings"),
        price: t("search_filter_availability"),
      }}
      filters={filterData}
      draftFilters={draftFilters}
      isApplyDisabled={isApplyDisabled}
      isStockVisible={true}
      onClose={onClose}
      onApply={onApply}
      onClear={onClear}
      onToggleCategory={() => {}}
      onSelectAddress={() => {}}
      onSelectPrice={(value) =>
        onSelectAvailability(value as SearchFilters["availability"])
      }
      onSelectStock={(value) =>
        onSelectRatings(value ? parseInt(value, 10) : null)
      }
      onSelectSort={(value) => onSelectSortBy(value as SearchFilters["sortBy"])}
    />
  );
}
