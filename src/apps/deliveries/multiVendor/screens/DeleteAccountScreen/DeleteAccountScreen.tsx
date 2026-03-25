import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../../../../general/components/ScreenHeader';
import Button from '../../../../../general/components/Button';
import { useTheme } from '../../../../../general/theme/theme';
import useProfile from '../../hooks/useProfile';
import DeleteAccountStepIndicator from '../../components/deleteAccount/DeleteAccountStepIndicator';
import DeleteAccountReasonStep from '../../components/deleteAccount/DeleteAccountReasonStep';
import DeleteAccountConfirmStep from '../../components/deleteAccount/DeleteAccountConfirmStep';
import DeleteAccountEmailStep from '../../components/deleteAccount/DeleteAccountEmailStep';

const TOTAL_STEPS = 3;

type Step = 1 | 2 | 3;

export default function DeleteAccountScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useProfile();

  const [step, setStep] = useState<Step>(1);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<boolean[]>([false, false]);

  const handleToggleCheck = (index: number) => {
    setCheckedItems((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as Step);
    } else {
      navigation.goBack();
    }
  };

  const handleContinue = () => {
    if (step < TOTAL_STEPS) {
      setStep((prev) => (prev + 1) as Step);
    } else {
      handleDeleteAccount();
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('delete_account_alert_title'),
      t('delete_account_alert_message'),
      [
        { text: t('delete_account_alert_cancel'), style: 'cancel' },
        {
          text: t('delete_account_alert_confirm'),
          style: 'destructive',
          onPress: () => {
            // TODO: integrate delete account API
          },
        },
      ],
    );
  };

  const isContinueDisabled = () => {
    if (step === 1) return selectedReason === null;
    if (step === 2) return !checkedItems.every(Boolean);
    return false;
  };

  const closeButton = (
    <Pressable
      onPress={handleClose}
      accessibilityRole="button"
      accessibilityLabel={t('delete_account_close')}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <View style={[styles.closeButton, { backgroundColor: colors.backgroundTertiary }]}>
        <Ionicons name="close" size={22} color={colors.text} />
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader
        showBack={step > 1}
        onBack={handleBack}
        rightSlot={closeButton}
      />

      <DeleteAccountStepIndicator totalSteps={TOTAL_STEPS} currentStep={step} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {step === 1 && (
          <DeleteAccountReasonStep
            selectedReason={selectedReason}
            onSelectReason={setSelectedReason}
          />
        )}
        {step === 2 && (
          <DeleteAccountConfirmStep
            checkedItems={checkedItems}
            onToggle={handleToggleCheck}
          />
        )}
        {step === 3 && (
          <DeleteAccountEmailStep email={user?.email ?? ''} />
        )}
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            borderTopColor: colors.border,
            backgroundColor: colors.background,
            paddingBottom: insets.bottom + 12,
          },
        ]}
      >
        <Button
          label={step === TOTAL_STEPS ? t('delete_account_cta_delete') : t('delete_account_cta_continue')}
          onPress={handleContinue}
          disabled={isContinueDisabled()}
          variant={step === TOTAL_STEPS ? 'danger' : 'primary'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  screen: { flex: 1 },
  scrollContent: {
    paddingBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  scrollView: { flex: 1 },
});
