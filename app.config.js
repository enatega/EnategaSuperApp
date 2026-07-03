const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY ?? 'DUMMY_GOOGLE_MAPS_API_KEY';
const iosClientId = process.env.EXPO_PUBLIC_IOS_CLIENT_ID ?? '';
const googleIosUrlScheme = iosClientId.endsWith('.apps.googleusercontent.com')
  ? `com.googleusercontent.apps.${iosClientId.replace('.apps.googleusercontent.com', '')}`
  : process.env.EXPO_PUBLIC_IOS_URL_SCHEME;
const hasValidGoogleIosUrlScheme = googleIosUrlScheme?.startsWith('com.googleusercontent.apps');

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
      usesAppleSignIn: true,
      config: {
        googleMapsApiKey,
      },
      infoPlist: {
        CFBundleAllowMixedLocalizations: true,
        ITSAppUsesNonExemptEncryption: false,
        NSLocationWhenInUseUsageDescription:
          'Allow EnategaSuperApp to access your location to show nearby stores and delivery availability.',
        NSCameraUsageDescription:
          'Allow EnategaSuperApp to use your camera so you can take a profile photo and attach photos in support or chat messages.',
        NSPhotoLibraryUsageDescription:
          'Allow EnategaSuperApp to access your photo library so you can choose a profile photo and attach existing photos in support or chat messages.',
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
       googleServicesFile: './google-services.json',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    updates: {
      url: 'https://u.expo.dev/4c12b75d-6b64-4ea6-a4a7-83e366964b04',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    extra: {
      eas: {
        projectId: '4c12b75d-6b64-4ea6-a4a7-83e366964b04',
      },
    },
    plugins: [
      [
        'expo-build-properties',
        {
          ios: {
            extraPods: [
              {
                name: 'GoogleUtilities',
                modular_headers: true,
              },
              {
                name: 'RecaptchaInterop',
                modular_headers: true,
              },
            ],
          },
        },
      ],
      'expo-secure-store',
      'expo-notifications',
      'expo-apple-authentication',
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
      hasValidGoogleIosUrlScheme
        ? [
          '@react-native-google-signin/google-signin',
          {
            iosUrlScheme: googleIosUrlScheme,
          },
        ]
        : null,
    ].filter(Boolean),
  },
};
