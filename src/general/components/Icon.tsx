import React from "react";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
  Feather,
  AntDesign,
  Entypo,
  EvilIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { StyleProp, TextStyle } from "react-native";

export type IconType =
  | "Ionicons"
  | "MaterialIcons"
  | "MaterialCommunityIcons"
  | "FontAwesome"
  | "Feather"
  | "AntDesign"
  | "Entypo"
  | "EvilIcons"
  | "SimpleLineIcons";

interface AppIconProps {
  type?: IconType;
  name: any;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

const iconLibraries: Record<IconType, any> = {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
  Feather,
  AntDesign,
  Entypo,
  EvilIcons,
  SimpleLineIcons,
};

const Icon: React.FC<AppIconProps> = ({
  type = "Ionicons",
  name,
  size = 24,
  color = "#000",
  style,
  ...rest
}) => {
  const IconComponent = iconLibraries[type];

  if (!IconComponent) return null;

  return (
    <IconComponent
      name={name}
      size={size}
      color={color}
      style={style}
      {...rest}
    />
  );
};

export default Icon;
