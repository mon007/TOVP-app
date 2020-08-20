import React from "react";
import { BackHandler } from "react-native";
import {
  Router,
  Scene,
  Stack,
  Actions,
  ActionConst,
} from "react-native-router-flux";
import ChooseLanguage from "./logRelated/chooseLanguage";
import ChooseLog from "./logRelated/chooseLog";
import LogIn from "./logRelated/logIn";
import SignUp from "./logRelated/signUp";
import VerifyEmail from "./logRelated/verifyEmail";
import Congratulation from "./logRelated/congratulation";
import VerifyPhone from "./logRelated/verifyPhone";
import ResetPasswordPhone from "./logRelated/resetPasswordPhone";
import ResetPasswordVerification from "./logRelated/resetPasswordVerification";
import ResetPasswordReset from "./logRelated/resetPasswordReset";
import ReferralSignUp from "./logRelated/referralSignUp";

export default class LogRouter extends React.Component {
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }
  onBackPress = () => {
    if (
      Actions.currentScene == "chooseLog" ||
      Actions.currentScene == "chooseLanguage"
    ) {
      BackHandler.exitApp();
    } else if (Actions.currentScene == "verifyEmail") {
      return false;
    }
  };
  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene
            key="chooseLanguage"
            title="chooseLanguage"
            component={ChooseLanguage}
            hideNavBar
          />
          <Scene
            key="chooseLog"
            title="chooseLog"
            component={ChooseLog}
            hideNavBar
          />
          <Scene key="logIn" title="logIn" component={LogIn} hideNavBar />
          <Scene key="signUp" title="signUp" component={SignUp} hideNavBar />
          <Scene
            key="verifyEmail"
            title="verifyEmail"
            component={VerifyEmail}
            hideNavBar
          />
          <Scene
            key="verifyPhone"
            title="verifyPhone"
            component={VerifyPhone}
            hideNavBar
          />
          <Scene
            key="congratulation"
            title="congratulation"
            component={Congratulation}
            hideNavBar
          />
          <Scene
            key="resetPasswordPhone"
            title="resetPasswordPhone"
            component={ResetPasswordPhone}
            hideNavBar
          />
          <Scene
            key="resetPasswordVerification"
            title="resetPasswordVerification"
            component={ResetPasswordVerification}
            hideNavBar
          />
          <Scene
            key="resetPasswordReset"
            title="resetPasswordReset"
            component={ResetPasswordReset}
            hideNavBar
          />
          <Scene
            key="referralSignUp"
            title="referralSignUp"
            component={ReferralSignUp}
            hideNavBar
          />
        </Scene>
      </Router>
    );
  }
}
