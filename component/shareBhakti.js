import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Share,
  Button,
  Image,
  ScrollView,
  Platform,
  StatusBar
} from "react-native";
import NavBar from "./navBar";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/dist/Feather";
import I18n from "react-native-i18n";
import {
  heightPercentageToDP,
  widthPercentageToDP
} from "react-native-responsive-screen";
import { apiUrl } from "./config";
import { getStatusBarHeight } from "react-native-status-bar-height";

export default class ShareBhakti extends React.Component {
  state = {
    wallet: ""
  };
  componentDidMount() {
    this.getProfileInfo();
  }
  getProfileInfo = () => {
    fetch(apiUrl + "user/profile/" + this.props.userId)
      .then(res => res.json())
      .then(resJson => {
        console.log(resJson);
        this.setState({
          wallet: resJson.referrInfo.wallet
        });
      })
      .catch(e => console.log(e));
  };
  onShare = async () => {
    const iosURL = "https://apps.apple.com/in/app/tovp/id1480708701";
    const androidURL = "https://play.google.com/store/apps/details?id=com.tovp";
    try {
      const result = await Share.share({
        message: `Use my referral code ${
          this.props.referralCode
        } during signUp to earn 300 points in your Tovp app, ${
          Platform.OS === "android" ? androidURL : iosURL
        }`
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  render() {
    return (
      <ScrollView style={{ backgroundColor: "#fff", flex: 1 }}>
        {Platform.OS === "ios" ? (
          <View
            style={{
              height: getStatusBarHeight(true),
              width: "100%",
              backgroundColor: "#42aec2"
            }}
          ></View>
        ) : null}

        <StatusBar backgroundColor="#007e92" barStyle="light-content" />
        <NavBar
          title={I18n.t("shareYourBhakti")}
          noRightBtn={true}
          color="#42aec2"
          titleColor="white"
        />
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["#0cb5fc", "#19b99a"]}
          style={{
            width: "100%",
            aspectRatio: 5 / 3,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <View
            style={{
              width: "100%",
              height: 60,
              justifyContent: "space-evenly",
              alignItems: "center",
              paddingLeft: 12,
              paddingRight: 12
            }}
          >
            <View style={{ paddingBottom: 10 }}>
              <Text
                style={{
                  color: "#56f9fb",
                  fontSize: widthPercentageToDP("3.1%"),
                  fontFamily: "Montserrat-SemiBold"
                }}
              >
                Total Points
              </Text>
            </View>
            <Text
              style={{
                color: "#fff",
                fontSize: widthPercentageToDP("8%"),
                fontFamily: "Montserrat-SemiBold"
              }}
            >
              {this.state.wallet}
            </Text>
            <View style={{ paddingTop: 12 }}>
              <Text
                style={{
                  color: "#e0ffffff",
                  fontSize: widthPercentageToDP("3%"),
                  fontFamily: "Montserrat-SemiBold",
                  textAlign: "center"
                }}
              >
                {I18n.t("share300")}
              </Text>
            </View>
          </View>
        </LinearGradient>
        <View
          style={{
            width: "100%",
            height: widthPercentageToDP("23%"),
            justifyContent: "flex-end"
          }}
        >
          <View //.......................absolute View
            style={{
              backgroundColor: "#fff",
              width: "88%",
              height: "82%",
              alignSelf: "center",
              position: "absolute",
              top: -30,
              borderRadius: 8,
              elevation: 10,
              flexDirection: "row",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.3,
              shadowRadius: 1
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image
                source={require("../src/present_1.png")}
                style={{
                  width: widthPercentageToDP("7%"),
                  height: widthPercentageToDP("7%"),
                  resizeMode: "contain"
                }}
              />
            </View>
            <View
              style={{
                flex: 5,
                justifyContent: "center",
                alignItems: "center",
                paddingRight: widthPercentageToDP("8%")
              }}
            >
              <Text
                style={{
                  fontFamily: "Montserrat-SemiBold",
                  color: "#454545",
                  fontSize: widthPercentageToDP("2.6%")
                }}
              >
                {I18n.t("shareReference")}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: "90%",
              heigth: "18%",
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center"
            }}
          >
            <Image
              source={require("../src/information.png")}
              style={{
                width: 10,
                height: 10,
                resizeMode: "contain",
                alignSelf: "center"
              }}
            />
            <Text
              style={{
                color: "#454545",
                paddingLeft: 4,
                fontFamily: "Montserrat-SemiBold",
                fontSize: widthPercentageToDP("2.9%")
              }}
            >
              Points are not transferrable to any other account or wallet
            </Text>
          </View>
        </View>

        <View //............................codeView
          style={{
            width: "100%",
            aspectRatio: 5 / 2,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              color: "#454545",
              fontFamily: "Montserrat-SemiBold",
              fontSize: widthPercentageToDP("2.9%")
            }}
          >
            YOUR REFFERAL CODE
          </Text>
          <View
            style={{
              width: widthPercentageToDP("30%"),
              height: widthPercentageToDP("13%"),
              borderStyle: "dashed",
              borderRadius: 1,
              borderWidth: 0.5,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
              backgroundColor: "#f2f8fb"
            }}
          >
            <Text
              style={{
                textTransform: "uppercase",
                fontFamily: "Montserrat-SemiBold",
                color: "#454545",
                fontSize: widthPercentageToDP("3.5%")
              }}
            >
              {this.props.referralCode}
            </Text>
          </View>
        </View>
        <View
          style={{
            width: "88%",
            height: widthPercentageToDP("25%"),
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            backgroundColor: "#f2f8fb",
            borderRadius: 10,
            padding: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 1
          }}
        >
          <Text
            style={{
              color: "#454545",
              fontFamily: "Montserrat-SemiBold",
              fontSize: widthPercentageToDP("2.6%"),
              textAlign: "left"
            }}
          >
            {I18n.t("shareMerchandise")}
          </Text>
        </View>
        <View //.............btn
          style={{
            width: "100%",
            aspectRatio: 5 / 1,
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: 25
          }}
        >
          <TouchableOpacity
            onPress={() => this.onShare()}
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              width: widthPercentageToDP("40%"),
              height: widthPercentageToDP("12%"),
              borderRadius: 6,
              backgroundColor: "#42aec2",
              elevation: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.3,
              shadowRadius: 1
            }}
          >
            <Icon
              name="share-2"
              size={widthPercentageToDP("5%")}
              color="#fff"
            />
            <Text
              style={{
                fontFamily: "Montserrat-SemiBold",
                fontSize: widthPercentageToDP("3.5%"),
                color: "#fff",
                paddingLeft: 10
              }}
            >
              SHARE
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: "100%", height: 18 }} />
      </ScrollView>
    );
  }
}
