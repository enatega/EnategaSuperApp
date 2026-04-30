import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  title: string;
  topInset: number;
  bottomInset: number;
};

function ReviewAppointmentConfirmedTransition({
  bottomInset,
  title,
  topInset,
}: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
          paddingBottom: Math.max(bottomInset, 12),
          paddingTop: Math.max(topInset, 12),
        },
      ]}
    >
      <View style={styles.content}>
        <View style={[styles.iconHalo, { backgroundColor: '#FFEFD9' }]}>
          <View style={[styles.iconCore, { backgroundColor: colors.warning }]}>
            <Icon type="Feather" name="check" size={28} color="#FAFAFA" />
          </View>
        </View>

        <Text
          weight="extraBold"
          style={{
            color: colors.text,
            fontSize: 24,
            lineHeight: 28,
            letterSpacing: -0.36,
            textAlign: 'center',
          }}
        >
          {title}
        </Text>
      </View>
    </View>
  );
}

export default memo(ReviewAppointmentConfirmedTransition);

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: 16,
  },
  iconCore: {
    alignItems: 'center',
    borderRadius: 999,
    height: 70,
    justifyContent: 'center',
    width: 70,
  },
  iconHalo: {
    alignItems: 'center',
    borderRadius: 999,
    height: 88,
    justifyContent: 'center',
    width: 88,
  },
  screen: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
