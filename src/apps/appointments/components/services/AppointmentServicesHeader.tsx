import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import AppointmentDetailsCircleButton from '../details/AppointmentDetailsCircleButton';

type Props = {
  insets: EdgeInsets;
  onBackPress: () => void;
  onRightPress?: () => void;
  rightIcon?: string;
  rightLabel?: string;
  title: string;
};

export default function AppointmentServicesHeader({
  insets,
  onBackPress,
  onRightPress,
  rightIcon,
  rightLabel,
  title,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('appointments');

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
        },
      ]}
    >
      <View style={styles.actionsRow}>
        <AppointmentDetailsCircleButton
          icon="chevron-back"
          label={t('details_action_back')}
          onPress={onBackPress}
        />
        <Text
          style={{
            color: colors.text,
            fontSize: typography.size.lg,
            lineHeight: typography.lineHeight.lg,
          }}
          weight="extraBold"
        >
          {title}
        </Text>
        {onRightPress && rightIcon && rightLabel ? (
          <AppointmentDetailsCircleButton
            icon={rightIcon}
            label={rightLabel}
            onPress={onRightPress}
          />
        ) : (
          <View style={styles.actionPlaceholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionPlaceholder: {
    height: 42,
    width: 42,
  },
  actionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
});
