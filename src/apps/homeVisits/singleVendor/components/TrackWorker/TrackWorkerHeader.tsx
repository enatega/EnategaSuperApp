import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  title: string;
  topInset: number;
  onClose: () => void;
};

export default function TrackWorkerHeader({ title, topInset, onClose }: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.wrapper, { paddingTop: topInset + 4 }]}>
      <View style={styles.headerRow}>
        <View style={styles.sideSpacer} />

        <Text
          style={{
            color: colors.text,
            flex: 1,
            fontSize: typography.size.lg,
            lineHeight: typography.lineHeight.lg,
            textAlign: 'center',
          }}
          weight="semiBold"
        >
          {title}
        </Text>

        <Pressable
          onPress={onClose}
          style={[styles.closeButton, { backgroundColor: colors.backgroundTertiary }]}
        >
          <MaterialCommunityIcons color={colors.text} name="close" size={22} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 44,
    paddingHorizontal: 16,
  },
  sideSpacer: {
    width: 40,
  },
  wrapper: {
    justifyContent: 'center',
  },
});
