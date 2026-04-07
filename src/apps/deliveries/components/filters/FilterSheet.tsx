import React from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SwipeableBottomSheet from "../../../../general/components/SwipeableBottomSheet";
import BottomSheetHandle from "../../../../general/components/BottomSheetHandle";
import Button from "../../../../general/components/Button";
import Icon from "../../../../general/components/Icon";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";
import type {
  GenericListFilterData,
  GenericListFilters,
} from "./types";
import FilterAddressOptionRow from "./FilterAddressOptionRow";
import FilterOptionChip from "./FilterOptionChip";

type Props = {
  visible: boolean;
  title: string;
  applyLabel: string;
  closeLabel: string;
  filters?: GenericListFilterData;
  draftFilters: GenericListFilters;
  isApplyDisabled?: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  onToggleCategory: (categoryId: string) => void;
  onSelectPrice: (priceId: string) => void;
  onSelectAddress: (addressId: string) => void;
  onSelectStock: (stockId: string) => void;
  onSelectSort: (sortId: string) => void;
};

const SHEET_HEIGHT = Math.min(Dimensions.get("window").height * 0.78, 760);

export default function FilterSheet({
  visible,
  title,
  applyLabel,
  closeLabel,
  filters,
  draftFilters,
  isApplyDisabled = false,
  onClose,
  onApply,
  onClear,
  onToggleCategory,
  onSelectPrice,
  onSelectAddress,
  onSelectStock,
  onSelectSort,
}: Props) {
  const { t } = useTranslation("deliveries");
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();

  if (!visible) {
    return null;
  }
  const decodeFilterLabel = (label: string) => label?.replaceAll("&amp;", "&");

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        <Pressable
          style={[styles.backdrop, { backgroundColor: colors.overlayDark20 }]}
          onPress={onClose}
        />

        <SwipeableBottomSheet
          expandedHeight={SHEET_HEIGHT + insets.bottom}
          collapsedHeight={0}
          initialState="expanded"
          modal
          onCollapsed={onClose}
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              shadowColor: colors.shadowColor,
            },
          ]}
          handle={<BottomSheetHandle color={colors.border} />}
        >
          <View style={styles.header}>
            <View style={styles.headerSpacer} />
            <Text
              weight="bold"
              style={{
                fontSize: typography.size.xl2,
                lineHeight: typography.lineHeight.xl2,
              }}
            >
              {title}
            </Text>
            <Pressable
              accessibilityLabel={closeLabel}
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                {
                  backgroundColor: colors.backgroundTertiary,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Icon type="Entypo" name="cross" size={20} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 16 },
            ]}
          >
            {filters?.categories?.length ? (
              <View style={styles.section}>
                <Text variant="subtitle" weight="bold">
                  {t("filter_category_title")}
                </Text>
                <View style={styles.chipWrap}>
                  {filters.categories.map((category) => {
                    const categoryId = category.ids[0];

                    if (!categoryId) {
                      return null;
                    }

                    return (
                      <FilterOptionChip
                        key={categoryId}
                        label={decodeFilterLabel(category.label)}
                        isSelected={draftFilters.category_ids.includes(categoryId)}
                        onPress={() => onToggleCategory(categoryId)}
                      />
                    );
                  })}
                </View>
              </View>
            ) : null}

            {filters?.priceTiers?.length ? (
              <View style={styles.section}>
                <Text variant="subtitle" weight="bold">
                  {t("filter_price_title")}
                </Text>
                <FlatList
                  data={filters.priceTiers}
                  horizontal
                  keyExtractor={(item) => item.value}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.flatListContent}
                  renderItem={({ item: option }) => (
                    <FilterOptionChip
                      label={decodeFilterLabel(option.label)}
                      isSelected={draftFilters.price_tiers === option.value}
                      onPress={() => onSelectPrice(option.value)}
                    />
                  )}
                />
              </View>
            ) : null}

            {filters?.addresses?.length ? (
              <View style={styles.section}>
                <Text variant="subtitle" weight="bold">
                  {t("filter_address_title")}
                </Text>
                <View style={styles.addressList}>
                  {filters.addresses.map((option) => (
                    <FilterAddressOptionRow
                      key={option.id}
                      label={decodeFilterLabel(option.label)}
                      description={option.description ?? undefined}
                      isSelected={draftFilters.address_id === option.id}
                      onPress={() => onSelectAddress(option.id)}
                    />
                  ))}
                </View>
              </View>
            ) : null}

            {/* Todo: can ass stock filters in future. */}
            {/* {filters?.stock?.length ? (
              <View style={styles.section}>
                <Text variant="subtitle" weight="bold">
                  {t("filter_stock_title")}
                </Text>
                <FlatList
                  data={filters.stock}
                  horizontal
                  keyExtractor={(item) => item.value}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.flatListContent}
                  renderItem={({ item: option }) => (
                    <FilterOptionChip
                      label={decodeFilterLabel(option.label)}
                      isSelected={draftFilters.stock === option.value}
                      onPress={() => onSelectStock(option.value)}
                    />
                  )}
                />
              </View>
            ) : null} */}

            {filters?.sortBy?.length ? (
              <View style={styles.section}>
                <Text variant="subtitle" weight="bold">
                  {t("filter_sort_title")}
                </Text>
                <FlatList
                  data={filters.sortBy}
                  horizontal
                  keyExtractor={(item) => item.value}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.flatListContent}
                  renderItem={({ item: option }) => (
                    <FilterOptionChip
                      label={decodeFilterLabel(option.label)}
                      isSelected={draftFilters.sort_by === option.value}
                      onPress={() => onSelectSort(option.value)}
                    />
                  )}
                />
              </View>
            ) : null}

            <View style={styles.actions}>
              <Button
                label={applyLabel}
                onPress={onApply}
                disabled={isApplyDisabled}
                style={styles.applyButton}
              />
            </View>
          </ScrollView>
        </SwipeableBottomSheet>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 16,
    marginTop: 8,
  },
  addressList: {
    gap: 16,
  },
  applyButton: {
    minHeight: 44,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  flatListContent: {
    gap: 8,
  },
  closeButton: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  handle: {
    borderRadius: 999,
    height: 4,
    width: 40,
  },
  handleContainer: {
    alignItems: "center",
    paddingBottom: 12,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerSpacer: {
    width: 40,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  scrollContent: {
    gap: 24,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  section: {
    gap: 12,
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    elevation: 10,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
  },
});
