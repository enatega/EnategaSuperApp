import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import Icon from '../../../../general/components/Icon';
import { showToast } from '../../../../general/components/AppToast';
import { useTheme } from '../../../../general/theme/theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';
import { useProfile } from '../../hooks/useProfile';
import { useUpdateRiderPhone } from '../../hooks/useUserMutations';
import { ProfileUpdateButton, CountryCodeModal } from '../../components/profile';
import { countryCodes } from '../../data/profileMockData';

export default function EditPhoneScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const navigation = useNavigation<NativeStackNavigationProp<RideSharingStackParamList>>();
  const { userProfile } = useProfile();
  const updateRiderPhoneMutation = useUpdateRiderPhone();

  const [selectedCountryCode, setSelectedCountryCode] = useState(userProfile?.countryCode ?? '');
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.phone ?? '');
  const [isCountryCodeModalVisible, setIsCountryCodeModalVisible] = useState(false);

  const handleUpdate = () => {
    const fullPhone = `${selectedCountryCode}${phoneNumber}`.replace(/\s+/g, '');

    updateRiderPhoneMutation.mutate(
      { phone: fullPhone },
      {
        onSuccess: () => {
          navigation.navigate('EditPhoneOtp', { phone: fullPhone });
        },
        onError: (error) => {
          showToast.error(t('error'), error.message || t('phone_update_request_error'));
        },
      },
    );
  };

  const isFormValid = phoneNumber.trim().length >= 7;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader />
      <ScrollView
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="title" weight="bold" color={colors.text}>
            {t('phone_screen_title')}
          </Text>
          <Text variant="body" color={colors.mutedText} style={styles.description}>
            {t('phone_screen_description')}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.field}>
            <Text
              variant="subtitle"
              weight="semiBold"
              color={colors.text}
              style={styles.label}
            >
              {t('phone_screen_subtitle')}
            </Text>
            <View style={[styles.inputContainer, { borderColor: colors.border }]}>
              <TouchableOpacity
                onPress={() => setIsCountryCodeModalVisible(true)}
                style={styles.countryCodeButton}
              >
                <Text
                  variant="body"
                  weight="semiBold"
                  color={colors.text}
                >
                  {selectedCountryCode}
                </Text>
                <Icon
                  type="Ionicons"
                  name="chevron-down"
                  size={20}
                  color={colors.mutedText}
                />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TextInput
                style={[styles.phoneInput, { color: colors.text }]}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="00 00 00 00 00"
                placeholderTextColor={colors.mutedText}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Update Button */}
      <ProfileUpdateButton
        label={t('update_button')}
        onPress={handleUpdate}
        disabled={!isFormValid || updateRiderPhoneMutation.isPending}
        isLoading={updateRiderPhoneMutation.isPending}
      />

      {/* Country Code Modal */}
      <CountryCodeModal
        visible={isCountryCodeModalVisible}
        onClose={() => setIsCountryCodeModalVisible(false)}
        onSelect={setSelectedCountryCode}
        selectedCode={selectedCountryCode}
        countryCodes={countryCodes}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 32,
    gap: 4,
  },
  description: {
    marginBottom: 24,
  },
  form: {
    gap: 20,
  },
  field: {
    gap: 8,
  },
  label: {
    marginBottom: 4,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 54,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 12,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 0,
  },
});
