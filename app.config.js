const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY ?? 'DUMMY_GOOGLE_MAPS_API_KEY';
const iosUrlScheme = process.env.EXPO_PUBLIC_IOS_URL_SCHEME ?? 'com.shaaneiol.app';
const hasValidGoogleIosUrlScheme = iosUrlScheme.startsWith('com.googleusercontent.apps');

module.exports = {
  expo: {
    name: 'Shaaneiol',
  
    version: "1.0.5",
     slug: "shaaneiol",
    owner: "shaaneiol",
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
      bundleIdentifier: "com.shaaneiol.app",
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
      package: 'com.shaaneiol.app',
      googleServicesFile: './google-services.json',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    updates: {
      url: "https://u.expo.dev/28588087-0036-483d-9bef-b4fa08944212",
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    extra: {
      eas: {
       projectId: "28588087-0036-483d-9bef-b4fa08944212"
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
