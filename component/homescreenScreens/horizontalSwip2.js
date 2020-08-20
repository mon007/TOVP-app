import React from "react";
import {
  View,
  Text,
  StatusBar,
  ImageBackground,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
} from "react-native";
import NavBar from "../navBar";
import I18n from "react-native-i18n";
import ReadMoreModal from "../readMoreModal";
import LinearGradient from "react-native-linear-gradient";
import { getStatusBarHeight } from "react-native-status-bar-height";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
export default class HorizontalSwip2 extends React.Component {
  render() {
    return (
      <React.Fragment>
        {Platform.OS === "ios" ? (
          <View
            style={{
              height: getStatusBarHeight(true),
              width: "100%",
            }}
          >
            <LinearGradient
              colors={["#fbd789", "#fbd789"]}
              style={{
                width: "100%",
                aspectRatio: 5 / 2.5,
                justifyContent: "flex-end",
                alignItems: "flex-start",
              }}
            ></LinearGradient>
          </View>
        ) : null}

        <StatusBar backgroundColor="#007e92" barStyle="light-content" />
        <StatusBar backgroundColor="#007e92" />
        <ScrollView
          style={{ flex: 1, backgroundColor: "#fff" }}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={["#fbd789", "#f38a81"]}
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              justifyContent: "flex-end",
              alignItems: "flex-start",
            }}
          >
            <ImageBackground
              source={require("../../src/tovp_bg_10.png")}
              style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "flex-start",
              }}
              imageStyle={{ resizeMode: "cover" }}
            >
              <NavBar
                title={I18n.t("vision")}
                noRightBtn={true}
                color="rgba(0,0,0,0.01)"
                titleColor="white"
                back={true}
              />
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                  paddingBottom: 18,
                  paddingLeft: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: widthPercentageToDP("3.5%"),
                    color: "white",
                    fontFamily: "Montserrat-Bold",
                  }}
                >
                  {I18n.t("horizontalSwipe2")}
                </Text>
              </View>
            </ImageBackground>
          </LinearGradient>
          <View //............................................last text
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              padding: 10,
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h2Para1")}
            </Text>
          </View>
          <View //...........................temple2
            style={{
              width: "100%",
              aspectRatio: 5 / 2,
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <Image
              source={require("../../src/temple2.jpg")}
              style={{
                width: "98%",
                height: "100%",
                resizeMode: "cover",
                alignSelf: "center",
              }}
            />
          </View>
          <View //............................................last text
            style={{
              flex: 1,
              padding: 10,
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h2Para2")}
            </Text>
          </View>
        </ScrollView>
      </React.Fragment>
    );
  }
}
