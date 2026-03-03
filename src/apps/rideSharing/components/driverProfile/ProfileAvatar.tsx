import React from 'react';
import { Image, View } from 'react-native';
import Text from '../../../../general/components/Text';

type Props = {
  uri: string;
  name: string;
  size: number;
};

function AvatarFallback({ name, size }: { name: string; size: number }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#E8E7FF',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        weight="semiBold"
        color="#2346E8"
        style={{
          fontSize: size * 0.38,
          lineHeight: size * 0.45,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}

/**
 * Loads an avatar image from `uri`.
 * Falls back to initials on load error (handles HEIC / broken URLs gracefully).
 */
export default function ProfileAvatar({ uri, name, size }: Props) {
  const [error, setError] = React.useState(false);

  if (error) {
    return <AvatarFallback name={name} size={size} />;
  }

  return (
    <Image
      source={{ uri }}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      onError={() => setError(true)}
    />
  );
}
