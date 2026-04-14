import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Header from "../../../general/components/Header";
import Text from "../../../general/components/Text";
import { useTheme } from "../../../general/theme/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  body: string;
  subtitle?: string;
  title: string;
};

export default function ModePlaceholderScreen({
  body,
  subtitle,
  title,
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      <Header subtitle={subtitle} title={title} />
      <Text>{body}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingBottom: 28,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
