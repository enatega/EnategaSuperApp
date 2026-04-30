import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "../Icon";
import Text from "../Text";
import { typography } from "../../theme/typography";
import AddressSelectionBottomSheet from "../address/AddressSelectionBottomSheet";
import SearchInput from "./SearchInput";
import RecentSearches from "./RecentSearches";
import SearchSuggestions from "./SearchSuggestions";
import SearchSuggestionsSkeleton from "./SearchSuggestionsSkeleton";
import type { GenericSearchMainContainerProps } from "./types";
import { useTranslation } from "react-i18next";

export default function SearchMainContainer({
  colors,
  inputRef,
  searchQuery,
  recommendations,
  recentSearches,
  selectedAddressLabel,
  isLoadingRecommendations,
  deletingRecentSearchId,
  isDeletingRecentSearch,
  isClearingRecentSearches,
  showIdleState,
  showRecentSearches,
  handleChangeText,
  handleFocus,
  handleBlur,
  handleClear,
  dismissKeyboard,
  handleSubmitEditing,
  handleSuggestionPress,
  handleRecentSearchPress,
  onDeleteRecentSearch,
  onClearRecentSearches,
  addressSheet,
  children,
}: GenericSearchMainContainerProps) {
  const { t } = useTranslation("general");
  return (
    <>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <SafeAreaView
          style={[styles.safeArea, { backgroundColor: colors.background }]}
        >
          <KeyboardAvoidingView
            style={styles.content}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <SearchInput
              ref={inputRef}
              value={searchQuery}
              onChangeText={handleChangeText}
              placeholder={t("generic_list_search_placeholder")}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onClear={handleClear}
              onSubmitEditing={handleSubmitEditing}
            />

            <ScrollView
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode={
                Platform.OS === "ios" ? "interactive" : "on-drag"
              }
              onScrollBeginDrag={dismissKeyboard}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {showRecentSearches ? (
                <RecentSearches
                  items={recentSearches}
                  onItemPress={handleRecentSearchPress}
                  onDeletePress={onDeleteRecentSearch}
                  onDeleteAllPress={onClearRecentSearches}
                  deletingRecentSearchId={deletingRecentSearchId}
                  isDeletingRecentSearch={isDeletingRecentSearch}
                  isClearingRecentSearches={isClearingRecentSearches}
                />
              ) : null}

              {showIdleState ? (
                <View style={styles.idleState}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t("multi_vendor_address_label")}
                    onPress={addressSheet.onOpen}
                    style={styles.addressButton}
                  >
                    <Text
                      color={colors.mutedText}
                      variant="caption"
                      style={styles.addressPrefix}
                    >
                      {t("searching_near")}
                    </Text>
                    <Text
                      numberOfLines={1}
                      weight="medium"
                      style={styles.addressValue}
                    >
                      {selectedAddressLabel ?? t("multi_vendor_address_label")}
                    </Text>
                    <Icon
                      type="Ionicons"
                      name="chevron-down"
                      size={16}
                      color={colors.text}
                    />
                  </Pressable>

                  {isLoadingRecommendations ? (
                    <SearchSuggestionsSkeleton />
                  ) : (
                    <SearchSuggestions
                      recommendations={recommendations}
                      onSuggestionPress={handleSuggestionPress}
                    />
                  )}
                </View>
              ) : null}

              {children}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>

      <AddressSelectionBottomSheet
        addresses={addressSheet?.addresses}
        isLoading={addressSheet?.isLoading}
        isVisible={addressSheet?.isVisible}
        onAddAddress={addressSheet?.onAddAddress}
        onClose={addressSheet?.onClose}
        onSelectAddress={addressSheet?.onSelectAddress}
        onUseCurrentLocation={addressSheet?.onUseCurrentLocation}
        selectingAddressId={addressSheet?.selectingAddressId}
        selectedAddressId={addressSheet?.selectedAddressId}
      />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 12,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  idleState: {
    gap: 12,
  },
  addressButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 8,
    paddingBottom: 4,
  },
  addressPrefix: {
    fontSize: typography.size.xs2,
    lineHeight: typography.lineHeight.sm,
  },
  addressValue: {
    flex: 1,
    fontSize: typography.size.xs2,
    lineHeight: typography.lineHeight.sm,
  },
});
