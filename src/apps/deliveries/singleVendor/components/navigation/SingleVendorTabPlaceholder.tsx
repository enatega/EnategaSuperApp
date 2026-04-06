import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../../../general/components/Header';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  title: string;
  message: string;
};

export default function SingleVendorTabPlaceholder({
  message,
  title,
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 20,
        },
      ]}
    >
      <Header title={title} />

      <View style={styles.content}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={styles.title} variant="subtitle" weight="semiBold">
            {title}
          </Text>
          <Text color={colors.mutedText} style={styles.message}>
            {message}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  container: {
    flex: 1,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
  },
});
