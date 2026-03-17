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
import Text from "../../../../../general/components/Text";
import SearchInput from "../../../components/search/SearchInput";
import SearchSuggestionsSkeleton from "../../../components/search/SearchSuggestionsSkeleton";
import SearchSuggestions from "../../../components/search/SearchSuggestions";
import RecentSearches from "../../../components/search/RecentSearches";
import Icon from "../../../../../general/components/Icon";
import { typography } from "../../../../../general/theme/typography";
import useMainSearchFlow from "./useMainSearchFlow";
import SearchResults from "./SearchResults";

export default function MainSearch() {
  const {
    colors,
    t,
    inputRef,
    searchQuery,
    recommendations,
    recentSearches,
    products,
    stores,
    shouldSearchStores,
    isSearchActive,
    isLoadingRecommendations,
    isSearchLoading,
    isFetchingMoreProducts,
    isFetchingMoreStores,
    deletingRecentSearchId,
    isDeletingRecentSearch,
    isClearingRecentSearches,
    showIdleState,
    showRecentSearches,
    hasNoResults,
    handleChangeText,
    handleFocus,
    handleBlur,
    handleClear,
    dismissKeyboard,
    handleSubmitEditing,
    handleSuggestionPress,
    handleRecentSearchPress,
    handleLoadMoreProducts,
    handleLoadMoreStores,
    onDeleteRecentSearch,
    onClearRecentSearches,
    onAddressPress,
  } = useMainSearchFlow();

  return (
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
            placeholder={t("search_input_placeholder")}
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
            {showRecentSearches && (
              <RecentSearches
                items={recentSearches}
                onItemPress={handleRecentSearchPress}
                onDeletePress={onDeleteRecentSearch}
                onDeleteAllPress={() => onClearRecentSearches()}
                deletingRecentSearchId={deletingRecentSearchId}
                isDeletingRecentSearch={isDeletingRecentSearch}
                isClearingRecentSearches={isClearingRecentSearches}
              />
            )}

            {showIdleState && (
              <View style={styles.idleState}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t("multi_vendor_address_label")}
                  onPress={onAddressPress}
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
                    {t("multi_vendor_address_label")}
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
            )}
            <SearchResults
              isSearchActive={isSearchActive}
              shouldSearchStores={shouldSearchStores}
              isSearchLoading={isSearchLoading}
              hasNoResults={hasNoResults}
              products={products}
              stores={stores}
              isFetchingMoreProducts={isFetchingMoreProducts}
              isFetchingMoreStores={isFetchingMoreStores}
              onLoadMoreProducts={handleLoadMoreProducts}
              onLoadMoreStores={handleLoadMoreStores}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
