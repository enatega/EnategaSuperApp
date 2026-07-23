import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import SupportChatFooter from '../../../../general/components/support/SupportChatFooter';
import SupportFaqListItem from '../../../../general/components/support/SupportFaqListItem';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { AppointmentsStackParamList } from '../../navigation/types';

const FAQS = [
  { label: 'Managing your appointment', description: 'Rescheduling, cancellation windows and booking status' },
  { label: 'Payments and refunds', description: 'Payment methods, wallet charges and refunds' },
  { label: 'Finding a professional', description: 'Availability, service duration and selecting a team member' },
  { label: 'Coupons and promotions', description: 'Using an eligible General Booking coupon' },
  { label: 'Account and notifications', description: 'Profile details and appointment updates' },
];

export default function AppointmentsSupportFaqScreen() {
  const { colors, typography } = useTheme();
  const navigation = useNavigation<NavigationProp<AppointmentsStackParamList>>();
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title="" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text color={colors.text} weight="extraBold" style={[styles.title, { fontSize: typography.size.h5, lineHeight: 38 }]}>Frequently asked questions</Text>
        <View style={styles.list}>{FAQS.map((item) => <SupportFaqListItem key={item.label} label={item.label} description={item.description} />)}</View>
      </ScrollView>
      <SupportChatFooter ctaLabel="Chat with us" onPress={() => navigation.navigate('SupportChat')} />
    </View>
  );
}

const styles = StyleSheet.create({ content: { flex: 1, paddingHorizontal: 16, paddingTop: 10 }, list: { paddingBottom: 16 }, screen: { flex: 1 }, scroll: { flex: 1 }, title: { marginBottom: 18, maxWidth: 340 } });
