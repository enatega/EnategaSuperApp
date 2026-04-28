import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import Image from '../../../../general/components/Image';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { CustomerRideListItem } from '../../api/types';

type Props = {
  currencyLabel: string;
  item: CustomerRideListItem;
  onPress: (rideId: string) => void;
  statusLabel: string;
};

function formatHistoryDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const time = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return `${month} ${day}. ${time}`;
}

export default function RideHistoryListItem({
  currencyLabel,
  item,
  onPress,
  statusLabel,
}: Props) {
  const { colors, typography } = useTheme();
  const isCompleted = item.rideStatus === 'COMPLETED';

  return (
    <Pressable
      accessibilityLabel={`${item.rideType.name} history item`}
      accessibilityRole="button"
      onPress={() => onPress(item.rideId)}
      style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}
    >
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: colors.surfaceSoft,
          },
        ]}
      >
        {item.rideType.imageUrl ? (
          <Image
            source={{ uri: item.rideType.imageUrl }}
            resizeMode="contain"
            style={styles.iconImage}
          />
        ) : (
          <Ionicons name="car-outline" size={26} color={colors.iconMuted} />
        )}
      </View>

      <View style={styles.contentColumn}>
        <Text
          style={{
            color: colors.text,
            fontSize: typography.size.md2,
            lineHeight: typography.lineHeight.md,
          }}
          weight="medium"
        >
          {item.rideType.name}
        </Text>

        <Text
          style={{
            color: colors.mutedText,
            fontSize: typography.size.xs2,
            lineHeight: typography.lineHeight.sm,
            marginTop: 2,
          }}
          weight="medium"
        >
          {formatHistoryDate(item.createdAt)}
        </Text>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: isCompleted ? colors.successSoft : colors.dangerSoft,
            },
          ]}
        >
          <Text
            style={{
              color: isCompleted ? colors.successText : colors.dangerText,
              fontSize: typography.size.xs2,
              lineHeight: typography.lineHeight.sm,
            }}
            weight="medium"
          >
            {statusLabel}
          </Text>
        </View>
      </View>

      <View style={styles.trailingWrap}>
        <Text
          style={{
            color: colors.text,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
          }}
          weight="medium"
        >
          {currencyLabel} {Number(item.agreedPrice ?? 0).toFixed(2)}
        </Text>

        <Ionicons name="chevron-forward" size={22} color={colors.iconMuted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
  },
  containerPressed: {
    opacity: 0.7,
  },
  contentColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  iconImage: {
    height: 30,
    width: 56,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    width: 64,
  },
  trailingWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
});
