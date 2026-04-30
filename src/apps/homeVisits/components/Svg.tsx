import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { SvgProps } from 'react-native-svg';
import NoResultsFound from '../../../general/assets/svgs/no-results-found.svg';

export type HomeVisitsSvgName = 'noResultsFound';

type Props = SvgProps & {
  name: HomeVisitsSvgName;
  width?: number;
  height?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

const svgIcons: Record<HomeVisitsSvgName, React.FC<SvgProps>> = {
  noResultsFound: NoResultsFound,
};

export default function Svg({
  name,
  width = 200,
  height = 200,
  color = '#000',
  style,
  ...rest
}: Props) {
  const SvgComponent = svgIcons[name];

  if (!SvgComponent) {
    return null;
  }

  return (
    <SvgComponent
      width={width}
      height={height}
      fill={color}
      style={style}
      {...rest}
    />
  );
}
