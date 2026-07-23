import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import ScreenHeader from '../../../general/components/ScreenHeader';
import Text from '../../../general/components/Text';
import { useTheme } from '../../../general/theme/theme';
import { appointmentCouponsService, type AppointmentCoupon } from '../api/couponsService';

function CouponCard({ coupon }: { coupon: AppointmentCoupon }) {
  const { colors } = useTheme();
  const value = coupon.discount_type.toLowerCase().includes('percent')
    ? `${coupon.discount_value}%`
    : `$${coupon.discount_value}`;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <Text weight="bold" color={colors.text} style={styles.name}>{coupon.name}</Text>
        <View style={[styles.code, { backgroundColor: colors.primary }]}>
          <Text weight="bold" color={colors.white}>{coupon.code}</Text>
        </View>
      </View>
      <Text weight="extraBold" color={colors.primary} style={styles.discount}>{value} off</Text>
      {coupon.description ? <Text color={colors.mutedText}>{coupon.description}</Text> : null}
      <Text color={colors.mutedText} style={styles.minimum}>Minimum booking: ${coupon.min_order_value}</Text>
    </View>
  );
}

export default function AppointmentsCouponsScreen() {
  const { colors } = useTheme();
  const query = useQuery({ queryKey: ['appointments', 'profile', 'coupons'], queryFn: appointmentCouponsService.getAvailable });
  const coupons = query.data?.data ?? [];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Coupons" />
      <FlatList
        data={coupons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CouponCard coupon={item} />}
        contentContainerStyle={styles.content}
        refreshing={query.isRefetching}
        onRefresh={() => void query.refetch()}
        ListEmptyComponent={!query.isPending ? <Text color={colors.mutedText} style={styles.empty}>{query.isError ? 'Coupons could not be loaded. Pull to retry.' : 'No active coupons are available right now.'}</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 }, content: { padding: 16, gap: 12, flexGrow: 1 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 8 },
  cardHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  name: { flex: 1, fontSize: 16 }, code: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  discount: { fontSize: 22 }, minimum: { marginTop: 4 }, empty: { marginTop: 64, textAlign: 'center' },
});
