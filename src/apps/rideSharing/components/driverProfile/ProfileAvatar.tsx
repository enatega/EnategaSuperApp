import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import Text from '../../../../general/components/Text';

type Props = {
  uri: string;
  name: string;
  size: number;
  onPress?: () => void;
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
export default function ProfileAvatar({ uri, name, size, onPress }: Props) {
  const [error, setError] = React.useState(false);
  const hasImage = uri?.trim().length > 0;

  const avatarNode =
    error || !hasImage ? (
      <AvatarFallback name={name} size={size} />
    ) : (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        onError={() => setError(true)}
      />
    );

  if (!onPress) {
    return avatarNode;
  }

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      {avatarNode}
    </TouchableOpacity>
  );
}
