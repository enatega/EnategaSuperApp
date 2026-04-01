import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from '../../../../../general/components/Icon';
import Text from '../../../../../general/components/Text';
import Button from '../../../../../general/components/Button';
import { useTheme } from '../../../../../general/theme/theme';

type ActionTileProps = {
  iconName: string;
  label: string;
  onPress?: () => void;
};

function ActionTile({ iconName, label, onPress }: ActionTileProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tile, { backgroundColor: colors.backgroundTertiary }]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Icon type="Feather" name={iconName} size={24} color={colors.text} />
      <Text style={[styles.tileLabel, { color: colors.text }]}>{label}</Text>
    </Pressable>
  );
}

type Props = {
  onShareRide?: () => void;
  onSupport?: () => void;
  onEmergencyContacts?: () => void;
  onCallEmergency?: () => void;
};

function SafetyActionGrid({ onShareRide, onSupport, onEmergencyContacts, onCallEmergency }: Props) {
  const { t } = useTranslation('rideSharing');
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        <ActionTile
          iconName="share-2"
          label={t('safety_action_share_ride')}
          onPress={onShareRide}
        />
        <ActionTile
          iconName="message-square"
          label={t('safety_action_support')}
          onPress={onSupport}
        />
        <ActionTile
          iconName="users"
          label={t('safety_action_emergency_contacts')}
          onPress={onEmergencyContacts}
        />
      </View>
      <Button
        label={t('safety_call_emergency')}
        variant="danger"
        icon={<Icon type="Feather" name="alert-triangle" size={18} color={colors.white} />}
        onPress={onCallEmergency}
      />
    </View>
  );
}

export default memo(SafetyActionGrid);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
  },
  tile: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'flex-start',
    gap: 8,
  },
  tileLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});
