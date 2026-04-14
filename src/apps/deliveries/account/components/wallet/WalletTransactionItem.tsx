import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

type TransactionIconType = 'cashback' | 'booking' | 'refund';

type Props = {
  iconType: TransactionIconType;
  title: string;
  subtitle: string;
  time: string;
};

const ICON_MAP: Record<TransactionIconType, string> = {
  cashback: 'cash-outline',
  booking: 'cart-outline',
  refund: 'cash-outline',
};

export default function WalletTransactionItem({ iconType, title, subtitle, time }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <View style={[styles.iconWrap, { borderColor: colors.border }]}>
        <Ionicons name={ICON_MAP[iconType] as any} size={20} color={colors.text} />
      </View>
      <View style={styles.content}>
        <Text weight="medium" color={colors.text} style={styles.title}>
          {title}
        </Text>
        <Text color={colors.mutedText} style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>
      <Text color={colors.mutedText} style={styles.time}>
        {time}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 18,
  },
  time: {
    fontSize: 12,
    lineHeight: 18,
  },
});
