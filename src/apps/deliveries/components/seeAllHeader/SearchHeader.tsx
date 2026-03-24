import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchInput from '../search/SearchInput';
import Icon from '../../../../general/components/Icon';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  searchPlaceholder: string;
  searchValue?: string;
  onSearchChangeText?: (text: string) => void;
  onSearchPress?: () => void;
  isSearchEditable?: boolean;
  backAccessibilityLabel: string;
  filterAccessibilityLabel: string;
  mapAccessibilityLabel: string;
  onOpenFilters: () => void;
  onMapPress: () => void;
  isSearchVisible: boolean;
  isFilterVisible: boolean;
  isMapVisible: boolean;
};

export default function SearchHeader({
  searchPlaceholder,
  searchValue,
  onSearchChangeText,
  onSearchPress,
  isSearchEditable = false,
  backAccessibilityLabel,
  filterAccessibilityLabel,
  mapAccessibilityLabel,
  onOpenFilters,
  onMapPress,
  isSearchVisible,
  isFilterVisible,
  isMapVisible,
}: Props) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

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
        accessibilityLabel={backAccessibilityLabel}
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
          <View style={styles.searchContainer}>
            <SearchInput
              value={searchValue ?? ''}
              onChangeText={onSearchChangeText ?? (() => {})}
              placeholder={searchPlaceholder}
            />
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={searchPlaceholder}
            onPress={onSearchPress}
            style={styles.searchContainer}
          >
            <View pointerEvents="none">
              <SearchInput
                value={searchValue ?? ''}
                onChangeText={() => {}}
                placeholder={searchPlaceholder}
              />
            </View>
          </Pressable>
        )
      ) : (
        <View style={styles.spacer} />
      )}

      {isFilterVisible ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={filterAccessibilityLabel}
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
          accessibilityLabel={mapAccessibilityLabel}
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
