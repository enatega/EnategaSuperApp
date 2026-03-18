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
import Button from "../../../../general/components/Button";
import Icon from "../../../../general/components/Icon";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";
import type {
  GenericListFilterGroup,
  GenericListFilters,
} from "./types";
import FilterAddressOptionRow from "./FilterAddressOptionRow";
import FilterOptionChip from "./FilterOptionChip";

type Props = {
  visible: boolean;
  title: string;
  applyLabel: string;
  closeLabel: string;
  resultCount?: number;
  filters?: GenericListFilterGroup;
  draftFilters: GenericListFilters;
  isApplyDisabled?: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  onToggleCategory: (categoryId: string) => void;
  onSelectPrice: (priceId: string) => void;
  onSelectAddress: (addressId: string) => void;
  onSelectSort: (sortId: string) => void;
  clearAllLabel: string;
};

const SHEET_HEIGHT = Math.min(Dimensions.get("window").height * 0.78, 760);

export default function FilterSheet({
  visible,
  title,
  applyLabel,
  closeLabel,
  resultCount,
  filters,
  draftFilters,
  isApplyDisabled = false,
  onClose,
  onApply,
  onClear,
  onToggleCategory,
  onSelectPrice,
  onSelectAddress,
  onSelectSort,
  clearAllLabel,
}: Props) {
  const { t } = useTranslation("deliveries");
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();

  if (!visible) {
    return null;
  }

  const resolvedApplyLabel =
    typeof resultCount === "number"
      ? `${applyLabel} (${resultCount})`
      : applyLabel;

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
          handle={
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
          }
          handleContainerStyle={styles.handleContainer}
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
            {filters?.categoryOptions?.length ? (
              <View style={styles.section}>
                <Text variant="subtitle" weight="bold">
                  {t("filter_category_title")}
                </Text>
                <View style={styles.chipWrap}>
                  {filters.categoryOptions.map((option) => (
                    <FilterOptionChip
                      key={option.id}
                      label={option.label}
                      isSelected={draftFilters.categoryIds.includes(option.id)}
                      onPress={() => onToggleCategory(option.id)}
                    />
                  ))}
                </View>
              </View>
            ) : null}

            {filters?.priceOptions?.length ? (
              <View style={styles.section}>
                <Text variant="subtitle" weight="bold">
                  {t("filter_price_title")}
                </Text>
                <FlatList
                  data={filters.priceOptions}
                  horizontal
                  keyExtractor={(item) => item.id}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.flatListContent}
                  renderItem={({ item: option }) => (
                    <FilterOptionChip
                      label={option.label}
                      isSelected={draftFilters.priceId === option.id}
                      onPress={() => onSelectPrice(option.id)}
                    />
                  )}
                />
              </View>
            ) : null}

            {filters?.addressOptions?.length ? (
              <View style={styles.section}>
                <Text variant="subtitle" weight="bold">
                  {t("filter_address_title")}
                </Text>
                <View style={styles.addressList}>
                  {filters.addressOptions.map((option) => (
                    <FilterAddressOptionRow
                      key={option.id}
                      label={option.label}
                      description={option.description}
                      iconName={option.iconName}
                      iconType={option.iconType}
                      isSelected={draftFilters.addressId === option.id}
                      onPress={() => onSelectAddress(option.id)}
                    />
                  ))}
                </View>
              </View>
            ) : null}

            {filters?.sortOptions?.length ? (
              <View style={styles.section}>
                <Text variant="subtitle" weight="bold">
                  {t("filter_sort_title")}
                </Text>
                <FlatList
                  data={filters.sortOptions}
                  horizontal
                  keyExtractor={(item) => item.id}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.flatListContent}
                  renderItem={({ item: option }) => (
                    <FilterOptionChip
                      label={option.label}
                      isSelected={draftFilters.sortId === option.id}
                      onPress={() => onSelectSort(option.id)}
                    />
                  )}
                />
              </View>
            ) : null}

            <View style={styles.actions}>
              <Button
                label={resolvedApplyLabel}
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
