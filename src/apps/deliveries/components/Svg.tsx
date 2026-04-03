import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

/**
 * 1️⃣ Import your SVG files here.
 * Make sure the file exists inside assets/svgs
 */
import NoResultsFound from "../assets/svgs/no-results-found.svg";
import EmptyCart from "../assets/svgs/empty-cart.svg";
import EmptyCart2 from "../assets/svgs/empty-cart-2.svg";

/**
 * 2️⃣ Add the SVG file name here.
 * The name must match the key used in `svgIcons` below.
 */
export type SvgName = "noResultsFound" | "emptyCart" | "emptyCart2";

interface AppSvgProps extends SvgProps {
  name: SvgName;
  width?: number;
  height?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * 3️⃣ Register all imported SVGs here.
 * Key must match the SvgName type.
 */
const svgIcons: Record<SvgName, React.FC<SvgProps>> = {
  noResultsFound: NoResultsFound,
  emptyCart: EmptyCart,
  emptyCart2: EmptyCart2,
};

const Svg: React.FC<AppSvgProps> = ({
  name,
  width = 200,
  height = 200,
  color = "#000",
  style,
  ...rest
}) => {
  const SvgComponent = svgIcons[name];

  if (!SvgComponent) return null;

  return (
    <SvgComponent
      width={width}
      height={height}
      fill={color}
      style={style}
      {...rest}
    />
  );
};

export default Svg;
