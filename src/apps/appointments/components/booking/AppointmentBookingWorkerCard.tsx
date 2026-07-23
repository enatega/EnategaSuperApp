import React from 'react';
import { StyleSheet, View } from 'react-native';
import Image from '../../../../general/components/Image';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  image?: string | null;
  title: string;
  subtitle?: string | null;
};

export default function AppointmentBookingWorkerCard({
  image,
  subtitle,
  title,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {image ? <Image source={{ uri: image }} style={styles.avatar} resizeMode="cover" /> : null}

      <View style={styles.content}>
        <Text style={{ color: colors.text, fontSize: typography.size.md }} weight="bold">
          {title}
        </Text>
        {subtitle ? (
          <Text style={{ color: colors.mutedText, fontSize: typography.size.sm }}>{subtitle}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 22,
    height: 44,
    width: 44,
  },
  card: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  content: {
    flex: 1,
    gap: 2,
  },
});
