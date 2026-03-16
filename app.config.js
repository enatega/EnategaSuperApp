const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY ?? 'DUMMY_GOOGLE_MAPS_API_KEY';
const iosUrlScheme = process.env.EXPO_PUBLIC_IOS_URL_SCHEME ?? 'com.enategasuper.app';

module.exports = {
  expo: {
    name: 'EnategaSuperApp',
    slug: 'EnategaSuperApp',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.enategasuper.app',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSLocationWhenInUseUsageDescription:
          'Allow EnategaSuperApp to access your location to show nearby stores and delivery availability.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: 'com.enategasuper.app',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      eas: {
        projectId: '4c12b75d-6b64-4ea6-a4a7-83e366964b04',
      },
    },
    plugins: [
      'expo-secure-store',
      'expo-video',
      [
        'expo-location',
        {
          locationWhenInUsePermission:
            'Allow EnategaSuperApp to access your location to show nearby stores and delivery availability.',
        },
      ],
      [
        'react-native-maps',
        {
          androidGoogleMapsApiKey: googleMapsApiKey,
          iosGoogleMapsApiKey: googleMapsApiKey,
        },
      ],
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": iosUrlScheme
        }
      ]
    ],
  },
};
