import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { formatPrice } from '../ServiceDetailsPage/serviceDetailsSelection';
import type { HomeVisitsSelectedServiceSnapshot } from '../../types/teamSchedule';
import ReviewSectionCard from './ReviewSectionCard';

type Props = {
  title: string;
  serviceCountLabel: string;
  services: HomeVisitsSelectedServiceSnapshot[];
};

function ReviewSelectedServicesSection({
  serviceCountLabel,
  services,
  title,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <ReviewSectionCard>
      <Text
        weight="bold"
        style={{
          color: colors.text,
          fontSize: typography.size.sm2,
          lineHeight: typography.lineHeight.md,
        }}
      >
        {title}
      </Text>

      <Text
        weight="medium"
        style={{
          color: colors.iconMuted,
          fontSize: typography.size.xs2,
          lineHeight: typography.lineHeight.sm,
        }}
      >
        {serviceCountLabel}
      </Text>

      <View style={[styles.list, { borderTopColor: colors.border }]}>
        {services.map((service) => (
          <View
            key={service.id}
            style={[
              styles.row,
              {
                borderBottomColor: colors.border,
              },
            ]}
          >
            <View style={styles.serviceMeta}>
              <Text
                weight="medium"
                style={{
                  color: colors.text,
                  fontSize: typography.size.sm2,
                  lineHeight: typography.lineHeight.md,
                }}
              >
                {service.name}
              </Text>
              {service.durationLabel ? (
                <Text
                  weight="regular"
                  style={{
                    color: colors.iconMuted,
                    fontSize: typography.size.xs2,
                    lineHeight: typography.lineHeight.sm,
                  }}
                >
                  {service.durationLabel}
                </Text>
              ) : null}
            </View>

            <Text
              weight="bold"
              style={{
                color: colors.text,
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              {formatPrice(service.price) ?? '$0'}
            </Text>
          </View>
        ))}
      </View>
    </ReviewSectionCard>
  );
}

export default memo(ReviewSelectedServicesSection);

const styles = StyleSheet.create({
  list: {
    borderTopWidth: 1,
    marginTop: 4,
  },
  row: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
  },
  serviceMeta: {
    flex: 1,
    gap: 2,
  },
});
