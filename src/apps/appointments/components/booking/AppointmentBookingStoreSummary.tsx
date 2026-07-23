import React from 'react';
import { StyleSheet, View } from 'react-native';
import Image from '../../../../general/components/Image';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  address?: string | null;
  image?: string | null;
  reviewLabel: string;
  title: string;
};

export default function AppointmentBookingStoreSummary({
  address,
  image,
  reviewLabel,
  title,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.row}>
      {image ? <Image source={{ uri: image }} style={styles.image} resizeMode="cover" /> : null}

      <View style={styles.content}>
        <Text style={{ color: colors.text, fontSize: typography.size.md2 }} weight="extraBold">
          {title}
        </Text>

        <View style={styles.ratingRow}>
          <Icon color={colors.warning} name="star" size={18} />
          <Text style={{ color: colors.mutedText, fontSize: typography.size.md2 }}>
            {reviewLabel}
          </Text>
        </View>

        {address ? (
          <Text style={{ color: colors.mutedText, fontSize: typography.size.md2 }}>
            {address}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 6,
  },
  image: {
    borderRadius: 16,
    height: 78,
    width: 78,
  },
  ratingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
});
