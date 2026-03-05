import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  TextInput,
  Dimensions,
  Text as RNText,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../../../../general/components/Text';
import Icon from '../../../../general/components/Icon';
import { useTheme } from '../../../../general/theme/theme';
import { useTranslation } from 'react-i18next';

const SCREEN_HEIGHT = Dimensions.get('window').height;
// FlatList height = 80% of screen minus fixed chrome (handle + title + search bar)
const LIST_HEIGHT = SCREEN_HEIGHT * 0.8 - 140;

type CountryCode = {
  code: string;
  label: string;
  flag: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (code: string) => void;
  selectedCode: string;
  countryCodes: CountryCode[];
};

export default function CountryCodeModal({
  visible,
  onClose,
  onSelect,
  selectedCode,
  countryCodes,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countryCodes;
    return countryCodes.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.code.includes(q),
    );
  }, [query, countryCodes]);

  const handleSelect = (code: string) => {
    onSelect(code);
    setQuery('');
    onClose();
  };

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      {/* Dimmed overlay — tap to close */}
      <Pressable style={styles.overlay} onPress={handleClose} />

      {/* Bottom sheet — sits at bottom, does NOT close on tap */}
      <View
        style={[
          styles.sheet,
          {
            backgroundColor: colors.surface,
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}
      >
        {/* Drag handle */}
        <View style={styles.handleRow}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
        </View>

        {/* Title */}
        <Text
          variant="title"
          weight="semiBold"
          color={colors.text}
          style={styles.title}
        >
          {t('label_country_code')}
        </Text>

        {/* Search bar */}
        <View
          style={[
            styles.searchBox,
            { backgroundColor: colors.cardSoft, borderColor: colors.border },
          ]}
        >
          <Icon type="Ionicons" name="search-outline" size={18} color={colors.mutedText} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search country or dial code…"
            placeholderTextColor={colors.mutedText}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
        </View>

        {/* Country list — explicit height so FlatList renders */}
        <FlatList
          data={filtered}
          keyExtractor={(item, index) => `${item.code}-${item.label}-${index}`}
          style={{ height: LIST_HEIGHT }}
          initialNumToRender={20}
          maxToRenderPerBatch={30}
          windowSize={10}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text variant="body" color={colors.mutedText} style={styles.emptyText}>
              No results for "{query}"
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelect(item.code)}
              style={[
                styles.item,
                {
                  backgroundColor:
                    selectedCode === item.code ? colors.cardSoft : 'transparent',
                },
              ]}
            >
              <View style={styles.itemLabel}>
                <RNText style={styles.flagText}>{item.flag}</RNText>
                <Text variant="body" color={colors.text}>
                  {item.label}
                </Text>
              </View>
              <View style={styles.itemRight}>
                <Text variant="body" weight="semiBold" color={colors.text}>
                  {item.code}
                </Text>
                {selectedCode === item.code ? (
                  <Icon
                    type="Ionicons"
                    name="checkmark"
                    size={18}
                    color={colors.primary}
                  />
                ) : null}
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  handleRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  itemLabel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  flagText: {
    fontSize: 18,
    marginRight: 12,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
  },
});
