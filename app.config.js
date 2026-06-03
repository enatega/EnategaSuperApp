const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY ?? 'DUMMY_GOOGLE_MAPS_API_KEY';
const iosUrlScheme =
  process.env.EXPO_PUBLIC_IOS_URL_SCHEME ??
  'com.googleusercontent.apps.793758148597-9c4ermu5arqidhljvl14atudb8j83sud';
const hasValidGoogleIosUrlScheme = iosUrlScheme.startsWith('com.googleusercontent.apps');

module.exports = {
  expo: {
    name: 'EatMile',
    slug: 'eatmile',
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
      bundleIdentifier: 'com.eatmile.app',
      googleServicesFile: './GoogleService-Info.plist',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSLocationWhenInUseUsageDescription:
          'Allow EatMile to access your location to show nearby stores and delivery availability.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: 'com.eatmile.app',
      googleServicesFile: './google-services.json',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    updates: {
      url: 'https://u.expo.dev/f342980e-ee6e-4b07-aa38-c29eaef3a873',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    extra: {
      eas: {
        projectId: 'f342980e-ee6e-4b07-aa38-c29eaef3a873',
      },
    },
    plugins: [
      'expo-secure-store',
      'expo-notifications',
      [
        '@stripe/stripe-react-native',
        {
          enableGooglePay: false,
        },
      ],

      'expo-video',
      [
        'expo-location',
        {
          locationWhenInUsePermission:
            'Allow EatMile to access your location to show nearby stores and delivery availability.',
        },
      ],
      [
        'react-native-maps',
        {
          androidGoogleMapsApiKey: googleMapsApiKey,
          iosGoogleMapsApiKey: googleMapsApiKey,
        },
      ],
      hasValidGoogleIosUrlScheme
        ? [
          '@react-native-google-signin/google-signin',
          {
            iosUrlScheme,
          },
        ]
        : null,
    ].filter(Boolean),
  },
};
