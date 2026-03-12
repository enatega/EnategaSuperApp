import { StyleSheet, View } from "react-native";
import React from "react";
import Svg from "../Svg";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";
import { useTranslation } from "react-i18next";

interface EmptySearchProps {
  title?: string
  subtitle?: string
  showIcon?: boolean
}

const EmptySearch = ({ 
  title = "No results found", 
  subtitle,
  showIcon = true 
}: EmptySearchProps) => {
  const { t } = useTranslation("deliveries");
  const { colors, typography } = useTheme();
  
  return (
    <View style={styles.container}>
      {showIcon && (
        <View style={styles.iconContainer}>
          <Svg name="noResultsFound" />
        </View>
      )}
      
      <Text
        variant="title"
        weight="bold"
        style={[styles.title, { fontSize: typography.size.h5, color: colors.text }]}
      >
        {t(title)}
      </Text>
      
      {subtitle && (
        <Text
          variant="body"
          weight="regular"
          style={[styles.subtitle, { color: colors.mutedText }]}
        >
          {t(subtitle)}
        </Text>
      )}
    </View>
  );
};

export default EmptySearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 20,
  },
});
