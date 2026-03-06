import { StyleSheet, View } from "react-native";
import React from "react";
import Svg, { SvgName } from "../../Svg";
import HeadingAndDescription from "./HeadingAndDescription";

interface SvgAndTextWrapperProps {
  svgName: SvgName;
  heading: string;
  description: string;
}

const SvgAndTextWrapper: React.FC<SvgAndTextWrapperProps> = ({
  svgName,
  heading,
  description,
}) => {
  return (
    <View style={styles.container}>
      <Svg name={svgName} style={styles.svg} />
      <HeadingAndDescription heading={heading} description={description} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  svg: {
    alignSelf: "center",
  },
});

export default SvgAndTextWrapper;