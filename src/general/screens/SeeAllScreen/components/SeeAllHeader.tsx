import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../../../components/Icon';
import { useTheme } from '../../../theme/theme';
import type { GenericListHeaderRenderProps } from '../../../components/filterablePaginatedList';

export default function SeeAllHeader({
  searchPlaceholder,
  searchValue,
  onSearchChangeText,
  onSearchPress,
  isSearchEditable,
  onOpenFilters,
  onMapPress,
  isSearchVisible,
  isFilterVisible,
  isMapVisible,
  renderSearchInput,
}: GenericListHeaderRenderProps) {
  const { t } = useTranslation('general');
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const searchInput = renderSearchInput({
    value: searchValue,
    onChangeText: onSearchChangeText,
    placeholder: searchPlaceholder,
    editable: isSearchEditable,
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 8,
        },
      ]}
    >
      <Pressable
        accessibilityLabel={t('see_all_back_label')}
        accessibilityRole="button"
        onPress={() => navigation.goBack()}
        style={({ pressed }) => [
          styles.iconButton,
          {
            backgroundColor: colors.backgroundTertiary,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Icon type="Ionicons" name="arrow-back" size={22} color={colors.text} />
      </Pressable>

      {isSearchVisible ? (
        isSearchEditable ? (
          <View style={styles.searchContainer}>{searchInput}</View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={searchPlaceholder}
            onPress={onSearchPress}
            style={styles.searchContainer}
          >
            <View pointerEvents="none">{searchInput}</View>
          </Pressable>
        )
      ) : (
        <View style={styles.spacer} />
      )}

      {isFilterVisible ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('see_all_open_filters_label')}
          onPress={onOpenFilters}
          style={({ pressed }) => [
            styles.iconButton,
            {
              backgroundColor: colors.backgroundTertiary,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Icon type="Feather" name="sliders" size={20} color={colors.text} />
        </Pressable>
      ) : null}

      {isMapVisible ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('see_all_map_view_label')}
          onPress={onMapPress}
          style={({ pressed }) => [
            styles.iconButton,
            {
              backgroundColor: colors.backgroundTertiary,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Icon type="Feather" name="map" size={20} color={colors.text} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  searchContainer: {
    flex: 1,
  },
  spacer: {
    flex: 1,
  },
});
