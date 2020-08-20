import React from "react";
//import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import {
  Router,
  Scene,
  Stack,
  Actions,
  Drawer,
} from "react-native-router-flux";
import AsyncStorage from "@react-native-community/async-storage";
import { BackHandler } from "react-native";
//import Homescreen from "./homescreen";
// import Svg, {
//   Path,
//   Defs,
//   LinearGradient,
//   Stop,
//   G,
//   Circle
// } from "react-native-svg";
import Vision from "./vision";
import Donate from "./donate/donate";
import Profile from "./profile";
import DrawerMenu from "./drawerMenu";
import SingleCoinView from "./donate/singleCoinView";
//import Paid from "./donorAccount";
import DonorAccount from "./donorAccount";
import SinglePillarView from "./donate/singlePillarView";
import Campaign from "./campaign";
import SingleCampaign from "./singleCampaign";
import SingleBrickView from "./donate/singleBrickView";
import AboutUs from "./aboutUs";
import FAQ from "./faq";
import SingleTitleView from "./donate/singleTitleView";
import SingleSquareFootView from "./donate/singleSquareFootView";
import GeneralDonation from "./donate/generalDonation";
import VictoryFlag from "./donate/victoryFlag";
import ContactUs from "./contactUs";
import ShareBhakti from "./shareBhakti";
import PayNow from "./recurringPaymentPayNow";
import { widthPercentageToDP } from "react-native-responsive-screen";
import HorizontalSwip1 from "./homescreenScreens/horizontalSwip1";
import HorizontalSwip3 from "./homescreenScreens/horizontalSwip3";
import HorizontalSwip2 from "./homescreenScreens/horizontalSwip2";
import Receipt from "./80GReceipt";
import Legal from "./legal";
import { Terms } from "./terms";
import { Privacy } from "./privacy";
import News from "./news";
import ShareBhaktiBazzar from "./shareBhaktiBazzar";
import SevaPujaList from "./sevaPujaList";
import SevaPujaSingleView from "./sevaPujaSingleView";
import NotificationList from "./notificationList";
import firebase from "react-native-firebase";
import CustomWebview from "./customWebview";

// let entered = false;
// class TabIcon extends React.Component {
//   render() {
//     var color = this.props.focused ? "#fd4968" : "grey";

//     const home = (
//       <Svg width={18.585} height={17.993}>
//         <Path
//           fill={color}
//           d="M18.352 8.779a.886.886 0 0 0-.072-1.269L9.974.243a1.035 1.035 0 0 0-1.351.016L.289 7.898a.881.881 0 0 0-.04 1.266l.209.218a.911.911 0 0 0 1.251.1l.623-.558v8.166a.906.906 0 0 0 .907.907h3.248a.906.906 0 0 0 .907-.907v-5.717h4.144v5.713a.857.857 0 0 0 .852.906h3.443a.906.906 0 0 0 .907-.907v-8.05l.384.337c.212.186.657.037.994-.334z"
//           data-name="Path 1171"
//         />
//       </Svg>
//     );

//     const vision = (
//       <Svg width={18.649} height={20.62}>
//         <G data-name="Group 8">
//           <Path
//             fill={color}
//             d="M9.325 3.172a6.179 6.179 0 0 0-6.277 6.069 7.217 7.217 0 0 0 1.529 4.412 2.6 2.6 0 0 1 .625 1.284 2.623 2.623 0 0 0 1.171 2.084c.019.466.088 1.605.088 1.605.012.323.183.986 1.3 1.356a1.876 1.876 0 0 0 .512.5.793.793 0 0 0 .443.136H9.93a.784.784 0 0 0 .443-.136 1.864 1.864 0 0 0 .512-.5c1.124-.374 1.288-1.045 1.3-1.359 0 0 .068-1.137.087-1.6a2.624 2.624 0 0 0 1.176-2.09 2.6 2.6 0 0 1 .628-1.289 7.209 7.209 0 0 0 1.522-4.403 6.179 6.179 0 0 0-6.273-6.069zm3.432 9.583a3.823 3.823 0 0 0-.9 2.177 1.178 1.178 0 0 1-.594.855H7.387a1.177 1.177 0 0 1-.594-.855 3.84 3.84 0 0 0-.906-2.185 5.681 5.681 0 0 1-1.248-3.51 4.593 4.593 0 0 1 4.686-4.479 4.591 4.591 0 0 1 4.687 4.483 5.688 5.688 0 0 1-1.255 3.514z"
//             data-name="Path 1172"
//           />
//           <Path
//             fill={color}
//             d="M9.325 1.983a.4.4 0 0 0 .4-.4V.4a.4.4 0 1 0-.794 0v1.186a.4.4 0 0 0 .394.397z"
//             data-name="Path 1173"
//           />
//           <Path
//             fill={color}
//             d="M5.112 2.822a.4.4 0 1 0 .687-.4l-.595-1.03a.4.4 0 0 0-.687.4z"
//             data-name="Path 1174"
//           />
//           <Path
//             fill={color}
//             d="M2.823 5.112l-1.03-.594a.4.4 0 0 0-.4.687l1.03.594a.4.4 0 0 0 .4-.687z"
//             data-name="Path 1175"
//           />
//           <Path
//             fill={color}
//             d="M1.983 9.325a.4.4 0 0 0-.4-.4H.397a.4.4 0 1 0 0 .793h1.189a.4.4 0 0 0 .397-.393z"
//             data-name="Path 1176"
//           />
//           <Path
//             fill={color}
//             d="M2.424 12.851l-1.031.594a.4.4 0 1 0 .4.687l1.031-.595a.4.4 0 1 0-.4-.687z"
//             data-name="Path 1177"
//           />
//           <Path
//             fill={color}
//             d="M17.257 13.446l-1.03-.595a.4.4 0 1 0-.4.687l1.03.594a.4.4 0 1 0 .4-.686z"
//             data-name="Path 1178"
//           />
//           <Path
//             fill={color}
//             d="M18.253 8.928h-1.188a.4.4 0 0 0 0 .793h1.189a.4.4 0 0 0 0-.793z"
//             data-name="Path 1179"
//           />
//           <Path
//             fill={color}
//             d="M16.027 5.851a.393.393 0 0 0 .2-.053l1.031-.594a.4.4 0 1 0-.4-.687l-1.03.594a.4.4 0 0 0 .2.74z"
//             data-name="Path 1180"
//           />
//           <Path
//             fill={color}
//             d="M12.995 2.969a.39.39 0 0 0 .2.054.4.4 0 0 0 .344-.2l.594-1.03a.4.4 0 1 0-.687-.4l-.594 1.03a.4.4 0 0 0 .143.546z"
//             data-name="Path 1181"
//           />
//           <Path
//             fill={color}
//             d="M8.793 11.72c.048.351.218.448.532.448s.484-.1.532-.448l.375-2.828a4.784 4.784 0 0 0 .047-.568v-1.4a.955.955 0 0 0-1.91 0v1.4a4.7 4.7 0 0 0 .048.568z"
//             data-name="Path 1182"
//           />
//           <Path
//             fill={color}
//             d="M9.324 12.952a.991.991 0 1 0 .991.991 1 1 0 0 0-.991-.991z"
//             data-name="Path 1183"
//           />
//         </G>
//       </Svg>
//     );

//     const donate = (
//       <Svg width={14.034} height={21}>
//         <Path
//           fill={color}
//           d="M12.383 6.461a.121.121 0 0 0-.119-.115h-10.5a.121.121 0 0 0-.118.115v2.826h10.732z"
//           data-name="Path 1184"
//         />
//         <Path
//           fill={color}
//           d="M12.153 10.828a.3.3 0 0 1-.183-.288v-.633H2.063v.633a.3.3 0 0 1-.181.287A3.067 3.067 0 0 0 0 13.675v5.94a1.378 1.378 0 0 0 1.361 1.386h11.313a1.378 1.378 0 0 0 1.36-1.386v-5.939a3.051 3.051 0 0 0-1.881-2.848z"
//           data-name="Path 1186"
//         />
//         <Path
//           fill={color}
//           d="M6.604.31V1.6a.31.31 0 0 0 .619 0V.31a.31.31 0 0 0-.619 0z"
//           data-name="Path 1187"
//         />
//         <Path
//           fill={color}
//           d="M12.584 2.441a.31.31 0 0 0-.438 0l-.931.931a.31.31 0 0 0 .438.438l.931-.931a.31.31 0 0 0 0-.438z"
//           data-name="Path 1188"
//         />
//         <Path
//           fill={color}
//           d="M1.425 2.452a.31.31 0 0 0 0 .438l.931.931a.31.31 0 1 0 .438-.438l-.931-.931a.31.31 0 0 0-.438 0z"
//           data-name="Path 1189"
//         />
//         <Path
//           fill={color}
//           d="M4.155 2.448a.31.31 0 0 0 .565-.254l-.539-1.2a.31.31 0 1 0-.565.253z"
//           data-name="Path 1190"
//         />
//         <Path
//           fill={color}
//           d="M9.8.662a.31.31 0 0 0-.4.179l-.468 1.231a.31.31 0 0 0 .579.22l.468-1.231A.31.31 0 0 0 9.8.662z"
//           data-name="Path 1191"
//         />
//       </Svg>
//     );

//     const profile = (
//       <Svg width={12.5} height={14.871}>
//         <G transform="translate(-20.625)">
//           <Circle
//             fill={color}
//             cx={3.448}
//             cy={3.448}
//             r={3.448}
//             data-name="Ellipse 6"
//             transform="translate(23.427)"
//           />
//           <Path
//             fill={color}
//             d="M26.875 8.621a6.25 6.25 0 0 0-6.25 6.25h12.5a6.25 6.25 0 0 0-6.25-6.25z"
//             data-name="Path 1192"
//           />
//         </G>
//       </Svg>
//     );

//     if (this.props.iconName == "home") {
//       return (
//         <View
//           style={{
//             flex: 1,
//             flexDirection: "column",
//             alignItems: "center",
//             alignSelf: "center",
//             justifyContent: "center"
//           }}
//         >
//           {home}
//         </View>
//       );
//     } else if (this.props.iconName == "vision") {
//       return (
//         <View
//           style={{
//             flex: 1,
//             flexDirection: "column",
//             alignItems: "center",
//             alignSelf: "center",
//             justifyContent: "center"
//           }}
//         >
//           {vision}
//         </View>
//       );
//     } else if (this.props.iconName == "donate") {
//       return (
//         <View
//           style={{
//             flex: 1,
//             flexDirection: "column",
//             alignItems: "center",
//             alignSelf: "center",
//             justifyContent: "center"
//           }}
//         >
//           {donate}
//         </View>
//       );
//     } else if (this.props.iconName == "profile") {
//       return (
//         <View
//           style={{
//             flex: 1,
//             flexDirection: "column",
//             alignItems: "center",
//             alignSelf: "center",
//             justifyContent: "center"
//           }}
//         >
//           {profile}
//         </View>
//       );
//     }
//   }
// }

var notificationR = 0;
export default class HomescreenRouter extends React.Component {
  state = {
    entered: 0,
  };

  async componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    await AsyncStorage.setItem("userId1", this.props.userId);
    await AsyncStorage.setItem("email", this.props.email);
    await AsyncStorage.setItem("country", this.props.country);
    await AsyncStorage.setItem("appLanguage", this.props.appLanguage);
    await AsyncStorage.setItem("referralCode", this.props.referralCode);
    await AsyncStorage.setItem("countryId", this.props.countryId);

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      console.log("getInitialNotification:");
      if (notificationR === 0) {
        Actions.replace("notificationList");
        notificationR++;
      }
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    if (Actions.currentScene == "vision") {
      BackHandler.exitApp();
    } else if (
      Actions.currentScene == "aboutUs" ||
      Actions.currentScene == "donate" ||
      Actions.currentScene == "faq" ||
      Actions.currentScene == "contactUs" ||
      Actions.currentScene == "profile" ||
      Actions.currentScene == "campaign" ||
      Actions.currentScene == "shareBhakti" ||
      Actions.currentScene == "legal" ||
      Actions.currentScene == "news" ||
      Actions.currentScene == "customWebview" ||
      Actions.currentScene == "shareBhaktiBazzar" ||
      Actions.currentScene == "notificationList"
    ) {
      Actions.replace("vision");
    }
  };

  render() {
    //console.log(this.props.userId);
    return (
      <Router>
        <Scene
          key="drawerMenu"
          hideNavBar
          drawer={true}
          drawerPosition="left"
          drawerWidth={widthPercentageToDP("65%")}
          contentComponent={() => (
            <DrawerMenu userId={this.props.userId} logOut={this.props.logOut} />
          )}
        >
          <Scene key="root">
            {/* <Scene
              key="homeScreenRoot"
              title="homeScreenRoot"
              tabs
              hideNavBar
              tabBarPosition="bottom"
              activeTintColor="#fd4968"
              inactiveTintColor="grey"
            > */}
            {/* <Scene
                key="home"
                title="Home"
                component={() => <Homescreen />}
                hideNavBar
                icon={TabIcon}
                iconName="home"
              /> */}
            <Scene
              key="vision"
              title="Vision"
              component={() => (
                <Vision userId={this.props.userId} /> //unread={this.props.unread} />
              )}
              initial={true} //..........modify
              hideNavBar
              // icon={TabIcon}
              // iconName="vision"
            />
            <Scene
              key="donate"
              title="Donate"
              component={() => (
                <Donate
                  userId={this.props.userId}
                  email={this.props.email}
                  country={this.props.country}
                  paymentController={this.props.paymentController}
                  flagPaymentController={this.props.flagPaymentController}
                  autoCaptureRazorPay={this.props.autoCaptureRazorPay}
                />
              )}
              hideNavBar
              // icon={TabIcon}
              // iconName="donate"
            />
            <Scene
              key="profile"
              path="TOVP://TOVP/PROFILE"
              title="Profile"
              component={() => (
                <Profile
                  userId={this.props.userId}
                  email={this.props.email}
                  country={this.props.country}
                  countryId={this.props.countryId}
                />
              )}
              hideNavBar
              // icon={TabIcon}
              // iconName="profile"
            />
            <Scene
              key="notificationList"
              //path="TOVP://TOVP/PROFILE"
              title="Notification"
              component={NotificationList}
              hideNavBar
              //icon={TabIcon}
              //iconName="profile"
            />
            <Scene
              key="singleCoinView"
              title="singleCoinView"
              component={SingleCoinView}
              path="TOVP://TOVP/COIN"
              hideNavBar
            />
            <Scene
              key="singleBrickView"
              title="singleBrickView"
              component={SingleBrickView}
              path="TOVP://TOVP/BRICK"
              hideNavBar
            />
            <Scene
              key="singleSquareFootView"
              title="singleSquareFootView"
              component={SingleSquareFootView}
              path="TOVP://TOVP/SQUARE"
              hideNavBar
            />
            <Scene
              key="victoryFlag"
              title="victoryFlag"
              component={VictoryFlag}
              path="TOVP://TOVP/FLAG"
              hideNavBar
            />
            <Scene
              key="generalDonation"
              title="generalDonation"
              component={GeneralDonation}
              path="TOVP://TOVP/GENERAL"
              hideNavBar
            />
            <Scene
              key="donorAccount"
              title="donorAccount"
              component={() => (
                <DonorAccount
                  userId={this.props.userId}
                  country={this.props.country}
                  recurringPaymentController={
                    this.props.recurringPaymentController
                  }
                  autoCaptureRazorPay={this.props.autoCaptureRazorPay}
                />
              )}
              hideNavBar
            />
            <Scene
              key="singlePillarView"
              title="singlePillarView"
              component={SinglePillarView}
              hideNavBar
            />
            <Scene
              key="campaign"
              title="campaign"
              component={() => (
                <Campaign
                  userId={this.props.userId}
                  email={this.props.email}
                  country={this.props.country}
                  paymentController={this.props.paymentController}
                  flagPaymentController={this.props.flagPaymentController}
                  autoCaptureRazorPay={this.props.autoCaptureRazorPay}
                />
              )}
              hideNavBar
            />
            <Scene
              key="singleCampaign"
              title="singleCampaign"
              component={SingleCampaign}
              hideNavBar
            />
            <Scene
              key="singleTitleView"
              title="singleTitleView"
              component={SingleTitleView}
              hideNavBar
            />
            <Scene
              key="aboutUs"
              title="aboutUs"
              component={AboutUs}
              hideNavBar
            />
            <Scene
              key="contactUs"
              title="contactUs"
              component={ContactUs}
              hideNavBar
            />
            <Scene
              key="shareBhakti"
              title="shareBhakti"
              component={() => (
                <ShareBhakti
                  referralCode={this.props.referralCode}
                  userId={this.props.userId}
                />
              )}
              hideNavBar
            />
            <Scene
              key="shareBhaktiBazzar"
              title="shareBhaktiBazzar"
              component={() => (
                <ShareBhaktiBazzar
                  referralCode={this.props.referralCode}
                  userId={this.props.userId}
                />
              )}
              hideNavBar
            />
            <Scene key="payNow" title="payNow" component={PayNow} hideNavBar />
            <Scene key="faq" title="faq" component={FAQ} hideNavBar />
            <Scene
              key="horizontalSwip1"
              title="horizontalSwip1"
              component={HorizontalSwip1}
              hideNavBar
            />
            <Scene
              key="horizontalSwip2"
              title="horizontalSwip2"
              component={HorizontalSwip2}
              hideNavBar
            />
            <Scene
              key="horizontalSwip3"
              title="horizontalSwip3"
              component={HorizontalSwip3}
              hideNavBar
            />
            <Scene
              key="receipt"
              title="receipt"
              component={Receipt}
              hideNavBar
            />
            <Scene
              key="sevaPujaList"
              title="sevaPujaList"
              component={SevaPujaList}
              hideNavBar
            />
            <Scene
              key="sevaPujaSingleView"
              title="sevaPujaSingleView"
              component={SevaPujaSingleView}
              hideNavBar
            />
            <Scene key="news" title="news" component={News} hideNavBar />
            <Scene
              key="customWebview"
              title="customWebview"
              component={CustomWebview}
              hideNavBar
            />
            <Scene key="legal" title="legal" component={Legal} hideNavBar />
            <Scene key="terms" title="terms" component={Terms} hideNavBar />
            <Scene
              key="privacy"
              title="privacy"
              component={Privacy}
              hideNavBar
            />
          </Scene>
        </Scene>
      </Router>
    );
  }
}
