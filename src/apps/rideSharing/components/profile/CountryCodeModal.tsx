import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../../../../general/components/Text';
import Icon from '../../../../general/components/Icon';
import { useTheme } from '../../../../general/theme/theme';
import { useTranslation } from 'react-i18next';

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

  const handleSelect = (code: string) => {
    onSelect(code);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={onClose}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.surface,
                paddingBottom: Math.max(insets.bottom, 20),
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <View style={[styles.modalIndicator, { backgroundColor: colors.border }]} />
            </View>

            <Text
              variant="title"
              weight="semiBold"
              color={colors.text}
              style={styles.modalTitle}
            >
              {t('label_country_code')}
            </Text>

            <ScrollView style={styles.countryCodeList}>
              {countryCodes.map((country) => (
                <TouchableOpacity
                  key={country.code}
                  onPress={() => handleSelect(country.code)}
                  style={[
                    styles.countryCodeItem,
                    {
                      backgroundColor: selectedCode === country.code ? colors.cardSoft : 'transparent',
                    },
                  ]}
                >
                  <Text variant="body" color={colors.text}>
                    {country.flag} {country.label}
                  </Text>
                  <Text variant="body" weight="semiBold" color={colors.text}>
                    {country.code}
                  </Text>
                  {selectedCode === country.code ? (
                    <Icon
                      type="Ionicons"
                      name="checkmark"
                      size={20}
                      color={colors.primary}
                    />
                  ) : null}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  countryCodeList: {
    maxHeight: 300,
  },
  countryCodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
});
