import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import { useTranslation } from 'react-i18next';
import { SearchInput } from '../../../../general/components/search';
import Icon from '../../../../general/components/Icon';

type Props = {
  searchValue: string;
  onSearchChangeText: (text: string) => void;
  searchPlaceholder?: string;
  isSearchEditable?: boolean;
  onOpenFilters: () => void;
  isFilterVisible?: boolean;
  onSubmitEditing?: () => void;
  onClear?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

export default function HomeVisitsSearchInputWithFilter({
  searchValue,
  onSearchChangeText,
  searchPlaceholder,
  isSearchEditable = true,
  onOpenFilters,
  isFilterVisible = false,
  onSubmitEditing,
  onClear,
  onFocus,
  onBlur,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('general');

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchInput
          value={searchValue}
          onChangeText={onSearchChangeText}
          placeholder={searchPlaceholder || t('search_input_placeholder')}
          editable={isSearchEditable}
          onSubmitEditing={onSubmitEditing}
          onClear={onClear}
          onFocus={onFocus}
          onBlur={onBlur}
          style={styles.searchInput}
        />
        
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInput: {
    flex: 1,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});