import React from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SwipeableBottomSheet from '../SwipeableBottomSheet';
import BottomSheetHandle from '../BottomSheetHandle';
import Button from '../Button';
import Icon from '../Icon';
import Text from '../Text';
import { useTheme } from '../../theme/theme';
import type { MainFilterSectionTitles, MainListFilterData, MainListFilters } from './types';
import MainFilterAddressOptionRow from './MainFilterAddressOptionRow';
import MainFilterOptionChip from './MainFilterOptionChip';

type Props = {
  visible: boolean;
  title: string;
  applyLabel: string;
  closeLabel: string;
  filters?: MainListFilterData;
  draftFilters: MainListFilters;
  sectionTitles?: MainFilterSectionTitles;
  isApplyDisabled?: boolean;
  isStockVisible?: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  onToggleCategory: (categoryId: string) => void;
  onSelectPrice: (priceId: string) => void;
  onSelectAddress: (addressId: string) => void;
  onSelectStock: (stockId: string) => void;
  onSelectSort: (sortId: string) => void;
};

const SHEET_HEIGHT = Math.min(Dimensions.get('window').height * 0.78, 760);

function decodeFilterLabel(label: string) {
  return label?.replaceAll('&amp;', '&');
}

export default function MainFilterSheet({
  visible,
  title,
  applyLabel,
  closeLabel,
  filters,
  draftFilters,
  sectionTitles,
  isApplyDisabled = false,
  isStockVisible = true,
  onClose,
  onApply,
  onClear,
  onToggleCategory,
  onSelectPrice,
  onSelectAddress,
  onSelectStock,
  onSelectSort,
}: Props) {
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();
  void onClear;

  if (!visible) {
    return null;
  }

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
              hitSlop={12}
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
                  {sectionTitles?.category}
                </Text>
                <View style={styles.chipWrap}>
                  {filters.categories.map((category) => {
                    const categoryId = category.ids[0];

                    if (!categoryId) {
                      return null;
                    }

                    return (
                      <MainFilterOptionChip
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
                  {sectionTitles?.price}
                </Text>
                <FlatList
                  data={filters.priceTiers}
                  horizontal
                  keyExtractor={(item) => item.value}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.flatListContent}
                  renderItem={({ item: option }) => (
                    <MainFilterOptionChip
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
                  {sectionTitles?.address}
                </Text>
                <View style={styles.addressList}>
                  {filters.addresses.map((option) => (
                    <MainFilterAddressOptionRow
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

            {/* Todo17: can add stock filter after backend handling */}
            {/* {isStockVisible && filters?.stock?.length ? (
              <View style={styles.section}>
                <Text variant="subtitle" weight="bold">
                  {sectionTitles?.stock}
                </Text>
                <FlatList
                  data={filters.stock}
                  horizontal
                  keyExtractor={(item) => item.value}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.flatListContent}
                  renderItem={({ item: option }) => (
                    <MainFilterOptionChip
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
                  {sectionTitles?.sort}
                </Text>
                <FlatList
                  data={filters.sortBy}
                  horizontal
                  keyExtractor={(item) => item.value}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.flatListContent}
                  renderItem={({ item: option }) => (
                    <MainFilterOptionChip
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
    marginTop: 20,
  },
  addressList: {
    gap: 18,
  },
  applyButton: {
    width: '100%',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: 999,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  flatListContent: {
    gap: 8,
    paddingRight: 4,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerSpacer: {
    width: 32,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  section: {
    gap: 12,
    marginBottom: 20,
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
});
