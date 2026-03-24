import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import TabSwitcher from '../../../../general/components/TabSwitcher';
import ToBuildingForm from '../../components/courierDetails/ToBuildingForm';
import ToDoorForm from '../../components/courierDetails/ToDoorForm';
import Button from '../../../../general/components/Button';
import Footer from '../../../../general/components/Footer';
import { useTheme } from '../../../../general/theme/theme';
import { useCourierBookingStore } from '../../stores/useCourierBookingStore';
const TABS = [
  { key: 'building', label: 'To building' },
  { key: 'door', label: 'To door' },
];

export default function CourierDetails() {
  const { colors } = useTheme();
  const { activeTab, setActiveTab } = useCourierBookingStore();
  const [isFormValid, setIsFormValid] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader title="Add Courier Details" variant="close" />
      <TabSwitcher
        tabs={TABS}
        activeKey={activeTab}
        onChange={(key) => { setActiveTab(key as 'building' | 'door'); setIsFormValid(false); }}
        style={styles.tabs}
      />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {activeTab === 'building'
          ? <ToBuildingForm
              onCommentsFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300)}
              onValidChange={setIsFormValid}
            />
          : <ToDoorForm
              onCommentsFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300)}
              onValidChange={setIsFormValid}
            />}
      </ScrollView>
      <Footer>
        <Button
          label="Next"
          onPress={() => {}}
          variant={isFormValid ? 'primary' : 'secondary'}
          disabled={!isFormValid}
        />
      </Footer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  content: {
    padding: 16,
    gap: 16,
  },
});
