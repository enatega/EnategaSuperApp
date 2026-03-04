import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/auth/login/Login";
import EnterPhoneNumber from "../screens/auth/enterPhoneNumber/EnterPhoneNumber";
import EnterPhoneOtp from "../screens/auth/enterPhoneOtp/EnterPhoneOtp";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="enterPhoneNumber"
        component={EnterPhoneNumber}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="enterPhoneOtp"
        component={EnterPhoneOtp}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
