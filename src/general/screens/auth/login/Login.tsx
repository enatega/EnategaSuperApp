import React from "react";
import { View } from "react-native";
import useStyles from "./styles";
import { useTheme } from "../../../theme/theme";
import SvgAndTextWrapper from "../../../components/auth/general/SvgAndTextWrapper";
import ButtonsWrapper from "../../../components/auth/login/ButtonsWrapper";
import Footer from "../../../components/Footer";
import LoginFooterContent from "../../../components/auth/login/LoginFooterContent";
import ScreenHeader from "../../../components/ScreenHeader";

const Login = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <View style={[styles.container]}>
      <ScreenHeader />

      <View style={styles.centerContent}>
          <SvgAndTextWrapper
            svgName="login"
            heading="login_to_continue"
            description="login_to_continue_desc"
          />
          <ButtonsWrapper />
      </View>

      <Footer>
        <LoginFooterContent />
      </Footer>
    </View>
  );
};

export default Login;
