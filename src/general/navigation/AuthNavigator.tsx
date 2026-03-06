import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/auth/login/Login";
import EnterPhoneNumber from "../screens/auth/enterPhoneNumber/EnterPhoneNumber";
import Signup from "../screens/auth/signup/Signup";
import EnterEmail from "../screens/auth/enterEmail/EnterEmail";
import EnterPassword from "../screens/auth/enterPassword/EnterPassword";
import EnterPhoneOtp from "../screens/auth/enterPhoneOtp/EnterPhoneOtp";
import ForgetPasswordEnterEmail from "../screens/auth/forgetPasswordEnterEmail/ForgetPasswordEnterEmail";
import CreateNewPassword from "../screens/auth/createNewPassword/CreateNewPassword";
import ForgetPasswordEnterOtp from "../screens/auth/forgetPasswordEnterOtp/ForgetPasswordEnterOtp";
import EnterEmailOtp from "../screens/auth/enterEmailOtp/EnterEmailOtp";

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
        <Stack.Screen
        name="enterEmailOtp"
        component={EnterEmailOtp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="signup"
        component={Signup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="enterEmail"
        component={EnterEmail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="enterPassword"
        component={EnterPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="forgetPasswordEnterEmail"
        component={ForgetPasswordEnterEmail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="createNewPassword"
        component={CreateNewPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="forgetPasswordEnterOtp"
        component={ForgetPasswordEnterOtp}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
