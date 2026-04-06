// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import MultiVendorHomeScreen from '../screens/HomeScreen';
// import MultiVendorDeliveryDetails from '../screens/DeliveryDetails';
// import { useTranslation } from 'react-i18next';
// import MultiVendorBottomTabNavigator from './MultiVendorBottomTabNavigator';
// import MyProfileScreen from '../screens/MyProfileScreen/MyProfileScreen';
// import EditProfileScreen from '../screens/EditProfileScreen/EditProfileScreen';
// import AddressSearchScreen from '../../screens/addresses/AddressSearchScreen';
// import AddressChooseOnMapScreen from '../../screens/addresses/AddressChooseOnMapScreen';
// import AddressDetailScreen from '../../screens/addresses/AddressDetailScreen';
// import FavouritesScreen from '../screens/FavouritesScreen/FavouritesScreen';
// import RateOrderScreen from '../../screens/RateOrderScreen/RateOrderScreen';
// import SupportScreen from '../../screens/SupportScreen/SupportScreen';
// import SupportChatScreen from '../../screens/SupportChatScreen/SupportChatScreen';
// import SupportConversationsScreen from '../../screens/SupportConversationsScreen/SupportConversationsScreen';
// import SupportContactFormScreen from '../../screens/SupportContactFormScreen/SupportContactFormScreen';
// import SupportFaqScreen from '../../screens/SupportFaqScreen/SupportFaqScreen';
// import SupportFaqArticleScreen from '../../screens/SupportFaqArticleScreen/SupportFaqArticleScreen';

// const Stack = createNativeStackNavigator();

// export default function MultiVendorNavigator() {
//   const { t } = useTranslation('deliveries');
//   return (
//     <Stack.Navigator>
//       {/* <Stack.Screen
//         name="MultiVendorHome"
//         component={MultiVendorHomeScreen}
//         options={{ title: t('multi_vendor_title') }}
//       />
//       <Stack.Screen
//         name="MultiVendorDetails"
//         component={MultiVendorDeliveryDetails}
//         options={{ title: t('details_title') }}
//       /> */}
//       <Stack.Screen
//         name="MultiVendorTabs"
//         component={MultiVendorBottomTabNavigator}
//         options={{ title: t('multi_vendor_tab_search'), headerShown: false }}
//       />
//       <Stack.Screen
//         name="MyProfile"
//         component={MyProfileScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="EditProfile"
//         component={EditProfileScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="AddressSearch"
//         component={AddressSearchScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="AddressChooseOnMap"
//         component={AddressChooseOnMapScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="AddressDetail"
//         component={AddressDetailScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="Favourites"
//         component={FavouritesScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="RateOrder"
//         component={RateOrderScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="Support"
//         component={SupportScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="SupportChat"
//         component={SupportChatScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="SupportFaq"
//         component={SupportFaqScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="SupportConversations"
//         component={SupportConversationsScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="SupportContactForm"
//         component={SupportContactFormScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="SupportFaqArticle"
//         component={SupportFaqArticleScreen}
//         options={{ headerShown: false }}
//       />
//     </Stack.Navigator>
//   );
// }





import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MultiVendorHomeScreen from '../screens/HomeScreen';
import MultiVendorDeliveryDetails from '../screens/DeliveryDetails';
import { useTranslation } from 'react-i18next';
import MultiVendorBottomTabNavigator from './MultiVendorBottomTabNavigator';
import MyProfileScreen from '../screens/MyProfileScreen/MyProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen/EditProfileScreen';
import AddressSearchScreen from '../../screens/addresses/AddressSearchScreen';
import AddressChooseOnMapScreen from '../../screens/addresses/AddressChooseOnMapScreen';
import AddressDetailScreen from '../../screens/addresses/AddressDetailScreen';
import FavouritesScreen from '../screens/FavouritesScreen/FavouritesScreen';
import RateOrderScreen from '../../screens/RateOrderScreen/RateOrderScreen';
import StoreDetailsScreen from '../screens/StoreDetailsScreen/StoreDetailsScreen';
import SeeAllScreen from '../screens/SeeAllScreen/SeeAllScreen';
import type { MultiVendorStackParamList } from './types';
import SeeAllMapView from '../screens/SeeAllScreen/components/SeeAllMapView';
import SettingsScreen from '../screens/SettingsScreen/SettingsScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen/NotificationSettingsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen/TermsOfServiceScreen';
import TermsOfUseScreen from '../screens/TermsOfUseScreen/TermsOfUseScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen/ChangePasswordScreen';
import DeleteAccountScreen from '../screens/DeleteAccountScreen/DeleteAccountScreen';
import ColorModeScreen from '../screens/ColorModeScreen/ColorModeScreen';
import LanguageScreen from '../screens/LanguageScreen/LanguageScreen';
import ProductInfo from '../../screens/ProductInfo/ProductInfo';
import SupportScreen from '../../screens/SupportScreen/SupportScreen';
import SupportChatScreen from '../../screens/SupportChatScreen/SupportChatScreen';
import SupportConversationsScreen from '../../screens/SupportConversationsScreen/SupportConversationsScreen';
import SupportContactFormScreen from '../../screens/SupportContactFormScreen/SupportContactFormScreen';
import SupportFaqScreen from '../../screens/SupportFaqScreen/SupportFaqScreen';
import SupportFaqArticleScreen from '../../screens/SupportFaqArticleScreen/SupportFaqArticleScreen';
import SupportTicketDetailScreen from '../../screens/SupportTicketDetailScreen';
import SupportTicketsScreen from '../../screens/SupportTicketsScreen/SupportTicketsScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen/OrderDetailsScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen/OrderTrackingScreen';

const Stack = createNativeStackNavigator<MultiVendorStackParamList>();

export default function MultiVendorNavigator() {
  const { t } = useTranslation('deliveries');
  return (
    <Stack.Navigator>
      {/* <Stack.Screen
        name="MultiVendorHome"
        component={MultiVendorHomeScreen}
        options={{ title: t('multi_vendor_title') }}
      />
      <Stack.Screen
        name="MultiVendorDetails"
        component={MultiVendorDeliveryDetails}
        options={{ title: t('details_title') }}
      /> */}
      <Stack.Screen
        name="MultiVendorTabs"
        component={MultiVendorBottomTabNavigator}
        options={{ title: t('multi_vendor_tab_search'), headerShown: false }}
      />
      <Stack.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddressSearch"
        component={AddressSearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddressChooseOnMap"
        component={AddressChooseOnMapScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddressDetail"
        component={AddressDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RateOrder"
        component={RateOrderScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StoreDetails"
        component={StoreDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SeeAllScreen"
        component={SeeAllScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SeeAllMapView"
        component={SeeAllMapView}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TermsOfService"
        component={TermsOfServiceScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TermsOfUse"
        component={TermsOfUseScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ColorMode"
        component={ColorModeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductInfo"
        component={ProductInfo}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Support"
        component={SupportScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SupportChat"
        component={SupportChatScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SupportFaq"
        component={SupportFaqScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SupportConversations"
        component={SupportConversationsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SupportContactForm"
        component={SupportContactFormScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SupportFaqArticle"
        component={SupportFaqArticleScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SupportTickets"
        component={SupportTicketsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SupportTicketDetail"
        component={SupportTicketDetailScreen}
        name="OrderDetailsScreen"
        component={OrderDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderTrackingScreen"
        component={OrderTrackingScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
