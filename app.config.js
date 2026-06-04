const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY ?? 'DUMMY_GOOGLE_MAPS_API_KEY';
const iosUrlScheme = process.env.EXPO_PUBLIC_IOS_URL_SCHEME ?? 'com.cyliaplatform.app';
const hasValidGoogleIosUrlScheme = iosUrlScheme.startsWith('com.googleusercontent.apps');

module.exports = {
  expo: {
    name: 'Cylia',
    slug: 'cylia-customer',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.cyliaplatform.app',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSLocationWhenInUseUsageDescription:
          'Allow Cylia to access your location to show nearby stores and delivery availability.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: 'com.cyliaplatform.app',
      googleServicesFile: './google-services.json',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    updates: {
      url: 'https://u.expo.dev/52c62af4-7dc7-444e-963e-6414922435b8',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    extra: {
      eas: {
        projectId: '52c62af4-7dc7-444e-963e-6414922435b8',
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
            'Allow Cylia to access your location to show nearby stores and delivery availability.',
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
