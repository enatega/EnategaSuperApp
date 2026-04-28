import React from 'react';
import { StyleSheet, View } from 'react-native';
import Image from '../../../../general/components/Image';

const noConversationImage = require('../../assets/images/no-conversation-3.png');

export default function NotificationsEmptyIllustration() {
  return (
    <View style={styles.container}>
      <Image source={noConversationImage} style={styles.image} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});
